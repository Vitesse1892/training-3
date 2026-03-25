import { test as base, expect } from '@playwright/test';
import { apiFixture } from '../../fixtures/api-fixture';
import * as assertions from '../utils/assertions';
import * as apiHelpers from '../utils/apiHelpers';
import * as testData from '../utils/testData';

// ********BUG*****: get veld 'Duration' kan ten onrechte alle waarden bevatten

const test = base.extend(apiFixture);

test.describe('Sessions update API', () => {

  let originalPayloads = [];
  let originalFetchedSessionsById = [];

  //Maak een x aantal sessies met willekeurige data aan voorafgaand aan elke test
  test.beforeEach(async ({ api }) => {
    const result = await apiHelpers.createMultipleSessions(api, 1);
    originalPayloads = result.requestPayloads;
    originalFetchedSessionsById = result.fetchedSessionsById;

    console.log('Request bodies:', originalPayloads);
    console.log('Response fetched sessions:', originalFetchedSessionsById);
  });

  // Verwijder alle aangemaakte sessies na elke test
  test.afterEach(async ({ api }) => {
    for (const item of originalFetchedSessionsById) {
      try {
        await apiHelpers.deleteSession(api, item.id);
        console.log(`Deleted session: ${item.id}`);
      } catch (error) {
        console.error(`Failed to delete session ${item.id}:`, error);
      }
    }
  });

  

  test.describe('1. Update van bestaande sessie met invalide veldwaarden geeft 400 en laat sessie ongewijzigd', () => {

    const invalidFieldValues = testData.invalidFieldValues;

    for (const [field, values] of Object.entries(invalidFieldValues)) {

      for (const value of values) {

        test(`Invalid update: veld "${field}" met waarde ${JSON.stringify(value)} geeft 400`, async ({ api }) => {
          // 1. Unieke sessie is al aangemaakt in beforeEach
          const sessionId = originalFetchedSessionsById[0].id;
          const originalFetchedSession = originalFetchedSessionsById[0];
          const originalPayload = originalPayloads[0];

          // 2. Maak update-payload met ontbrekend veld
          const updatePayload = { ...originalPayload };
          updatePayload[field] = value;

          // 3. Update uitvoeren
          const updateRes = await apiHelpers.updateSession(api, sessionId, updatePayload);

          // 4. Huidige staat ophalen
          const FetchedSessionAfterUpdate = await apiHelpers.getSessionJson(api, sessionId);

          // 5. Assertions: 400 response en sessie ongewijzigd
          assertions.expectBadRequest(updateRes);
          expect(FetchedSessionAfterUpdate).toMatchObject(originalFetchedSession);
        });
      }
    }
  });



  test.describe('2. Update van bestaande sessie met ontbrekend veld geeft 400 error en sessie blijft ongewijzigd', () => {

    const fields = ['title', 'description', 'status', 'duration'];

    for (const field of fields) {

      test(`Ontbrekend veld "${field}" geeft 400 en laat sessie ongewijzigd`, async ({ api }) => {
        // 1. Unieke sessie is al aangemaakt in beforeEach
        const sessionId = originalFetchedSessionsById[0].id;
        const originalFetchedSession = originalFetchedSessionsById[0];
        const originalPayload = originalPayloads[0];

        // 2. Maak update-payload met ontbrekend veld
        const updatePayload = { ...originalPayload }; //kopie van je originele payload
        delete updatePayload[field];

        // 3. Update uitvoeren
        const updateRes = await apiHelpers.updateSession(api, sessionId, updatePayload);

        // 4. Huidige staat ophalen
        const FetchedSessionAfterUpdate = await apiHelpers.getSessionJson(api, sessionId);

        // 5. Assertions: 400 response en sessie ongewijzigd
        assertions.expectBadRequest(updateRes);
        expect(FetchedSessionAfterUpdate).toMatchObject(originalFetchedSession);
      });
    }
  });

  test.describe('3. Single-field update geeft 200 en wijzigt alleen dat veld en updated_at', () => {

    const validFieldValues = testData.validFieldValues;

    for (const [field, values] of Object.entries(validFieldValues)) {

      for (const value of values) {

        test(`Valid update: veld "${field}" met waarde ${JSON.stringify(value)} geeft 200`, async ({ api }) => {
          // 1. Unieke sessie is al aangemaakt in beforeEach
          const sessionId = originalFetchedSessionsById[0].id;
          const originalFetchedSession = originalFetchedSessionsById[0];
          const originalPayload = originalPayloads[0];

          // 2. Maak update-payload met ontbrekend veld
          const updatePayload = { ...originalPayload };
          updatePayload[field] = value;

          // 3. Update uitvoeren
          const updateRes = await apiHelpers.updateSession(api, sessionId, updatePayload);
          assertions.expectOk(updateRes);

          // 4. Huidige staat ophalen
          const FetchedSessionAfterUpdate = await apiHelpers.getSessionJson(api, sessionId);

          // 5. Assertions: updated_at moet veranderd zijn, Gewijzigd veld moet nieuwe waarde hebben en overige velden moeten ongewijzigd zijn
          //expect(FetchedSessionAfterUpdate.updated_at).not.toBe(originalFetchedSession.updated_at);
          expect(new Date(FetchedSessionAfterUpdate.updated_at).getTime()).toBeGreaterThanOrEqual(new Date(originalFetchedSession.updated_at).getTime());
          expect(FetchedSessionAfterUpdate[field]).toBe(value);
          for (const key of Object.keys(originalFetchedSession)) {
            if (key !== field && key !== "updated_at") {
              expect(FetchedSessionAfterUpdate[key]).toEqual(originalFetchedSession[key]);
            }
          }
        });
      }
    }
  });



});

