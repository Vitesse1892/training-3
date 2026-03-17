import { test as base, expect } from '@playwright/test';
import { apiFixture } from '../../fixtures/api-fixture.js';
import * as assertions from '../utils/assertions';
import * as apiHelpers from '../utils/apiHelpers';

const test = base.extend(apiFixture);

test.describe('Sessions API – CRUD & validation', () => {

  let payloads = [];
  let responses = [];

  test.beforeEach(async ({ api }) => {
    const result = await apiHelpers.createMultipleSessions(api, 1);
    payloads = result.payloads;
    responses = result.responses;
    
    console.log('Request bodies:', payloads);
    console.log('Response bodies:', responses);
  });

  test('GET /sessions returns array', async ({ api }) => {
    const res = await api.get('/api/sessions');
    assertions.expectOk(res);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /sessions items contain required fields', async ({ api }) => {
    const res = await api.get('/api/sessions');
    assertions.expectOk(res);

    const list = await res.json();
    for (const item of list) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('status');
      expect(item).toHaveProperty('duration');
    }
  });

  test('GET /sessions/:id returns correct schema', async ({ api }) => {
    const res = await api.get('/api/sessions/1');
    assertions.expectOk(res);

    const body = await res.json();

    expect(typeof body.id).toBe('number');
    expect(typeof body.title).toBe('string');
    expect(typeof body.description).toBe('string');
    expect(typeof body.status).toBe('string');
    expect(typeof body.duration).toBe('number');

    // geen extra velden
    const allowed = ['id','title','description','status','duration'];
    expect(Object.keys(body).sort()).toEqual(allowed.sort());
  });




  

  test.describe('GET /sessions/:id – invalid cases', () => {

    const testCases = [
      // Geldige maar niet-bestaande ids → 404
      { id: '999999', expected: 404, error: 'Training session not found', description: 'non-existing id' },
      { id: '-1', expected: 404, error: 'Training session not found', description: 'negative id' },
      { id: '0', expected: 404, error: 'Training session not found', description: 'zero id' },
      { id: '3.5', expected: 404, error: 'Training session not found', description: 'float id 1' },
      { id: '3,5', expected: 404, error: 'Training session not found', description: 'float id 2' },
      { id: '99999999999999999999', expected: 404, error: 'Training session not found', description: 'very large integer' },
      { id: '𝟙', expected: 404, error: 'Training session not found', description: 'unicode integer' },
      
          // Ongeldige id → 400 (router kan het niet parsen) of 404 (router kan het parsen maar vindt niks)
      { id: 'abc', expected: 404, error: 'Training session not found', description: 'invalid id type' },
      { id: 'NaN', expected: 404, error: 'Training session not found', description: 'Not a Number' },
      { id: '%FF', expected: 400, error: 'URIError: Failed to decode param', description: 'invalid UTF‑8' },
      { id: '%C3%28', expected: 400, error: 'URIError: Failed to decode param', description: 'broken UTF‑8 sequence' },
      { id: '%00', expected: 404, error: 'Training session not found', description: 'Null byte' },

      // Inputs die NIET naar /sessions/:id gaan maar naar /sessions → 200
      { id: '', expected: 200, description: 'empty string resolves to list endpoint' },
      { id: ' ', expected: 200, description: 'whitespace resolves to list endpoint' },
      
      // Overige rare inputs → meestal 404
      { id: 'null', expected: 404, error: 'Training session not found', description: 'literal null' },
      { id: '""', expected: 404, error: 'Training session not found', description: 'quoted empty string resolves to list endpoint' },
      { id: '¡²³¤€¼½¾‘’', expected: 404, error: 'Training session not found', description: 'special characters' },
      { id: '{ "id": 1 }', expected: 404, error: 'Training session not found', description: 'JSON input 1' },
      { id: '{"id":4}', expected: 404, error: 'Training session not found', description: 'JSON input 2' },
      { id: '1 OR 1=1', expected: 404, error: 'Training session not found', description: 'SQL injection attempt' },
      { id: '😀', expected: 404, error: 'Training session not found', description: 'emoji' },
      { id: '<script>alert(1)</script>', expected: 404, error: 'Cannot GET /api/sessions/%3Cscript%3Ealert(1)%3C/script%3E', description: 'XSS attempt' },

      // Paden die bestaan maar niet onder /sessions/:id vallen → 404
      { id: 'add', expected: 404, error: 'Training session not found', description: 'existing route but not an id' },
      { id: 'edit', expected: 404, error: 'Training session not found', description: 'existing route but not an id' },
      { id: 'edit/4', expected: 404, error: 'Cannot GET /api/sessions/edit/4', description: 'nested route' },

    ];
  
    for (const c of testCases) {
    test(`id "${c.id}" → ${c.expected} (${c.description})`, async ({ api }) => {
      const res = await api.get(`/api/sessions/${c.id}`);

      // Statuscode assertions via jouw utils
      if (c.expected === 404) {
        assertions.expectNotFound(res);
      } else if (c.expected === 400) {
        assertions.expectBadRequest(res);
      } else if (c.expected === 200) {
        assertions.expectOk(res);
      } else {
        throw new Error(`Unexpected expected status: ${c.expected}`);
      }

      // Error body check (alleen bij 400/404)
      if (c.expected === 400 || c.expected === 404) {
        let body;
        try {
          body = await res.json();
        } catch {
          const text = await res.text();
          body = { error: text }; //Indien Express framework een HTML foutpagina teruggeeft, vangen we dat op en zetten we de tekst in een error property zodat we toch kunnen testen
        }
       
        expect(body).toHaveProperty('error');

        if (c.error) {
          expect(body.error).toContain(c.error);
        }
      }
    });
  }

  });
});
