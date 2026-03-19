import { test as base, expect } from '@playwright/test';
import { apiFixture } from '../../fixtures/api-fixture';
import * as assertions from '../utils/assertions';
import * as apiHelpers from '../utils/apiHelpers';
import * as testData from '../utils/testData';

// ********BUG*****: get veld 'Duration' kan ten onrechte alle waarden bevatten

const test = base.extend(apiFixture);

test.describe('Sessions update API', () => {

  let payloads = [];
  let responses = [];

  //Maak een x aantal sessies met willekeurige data aan voorafgaand aan elke test
  test.beforeEach(async ({ api }) => {
    const result = await apiHelpers.createMultipleSessions(api, 1);
    payloads = result.payloads;
    responses = result.responses;
    
    console.log('Request bodies:', payloads);
    console.log('Response bodies:', responses);
  });

  // Verwijder alle aangemaakte sessies na elke test
  test.afterEach(async ({ api }) => {
    for (const response of responses) {
      try {
        await apiHelpers.deleteSession(api, response.id);
        console.log(`Deleted session: ${response.id}`);
      } catch (error) {
        console.error(`Failed to delete session ${response.id}:`, error);
      }
    }
  });

  
  test('1. Update van bestaande sessie met ongeldige data resulteert in 400-error', async ({ api }) => {

    // 1. Neem de eerste session die in beforeEach is aangemaakt
    const sessionId = responses[0].id;
    let originalSession = responses[0];
    
    // 2. Genereer invalid payloads
    const invalidCases = testData.generateInvalidUpdatePayloads();
    let invalidUpdatesCount = 0;

    // 3. Test elke invalid case
    for (const invalidCase of invalidCases) {
        //console.log(`Testing invalid field: ${invalidCase.field} with value: ${invalidCase.value}`);

        // 4. Probeer de session te updaten met invalid data
        const updateRes = await apiHelpers.updateSession(api, sessionId, invalidCase.payload);

        // 5. Verwacht een 400 Bad Request response
        if (updateRes.status() !== 400) {
            console.log(`❌ INVALID UPDATE ACCEPTED: field "${invalidCase.field}" with value "${invalidCase.value}" resulted in status ${updateRes.status()} instead of 400`);
            invalidUpdatesCount += 1;

            // 3. Rollback: originele sessie herstellen
            await apiHelpers.updateSession(api, sessionId, {
            title: originalSession.title,
            description: originalSession.description,
            status: originalSession.status,
            duration: originalSession.duration
            });
        }
        

        // 6. Optioneel: verifieer dat de sessie ongewijzigd is gebleven na de update poging of na eventuele rollback
        const currentSession = await apiHelpers.getSession(api, sessionId);

        expect(currentSession).toMatchObject({
                id: originalSession.id,
                title: originalSession.title,
                description: originalSession.description,
                status: originalSession.status,
                duration: originalSession.duration
            });
        console.log(`✓ Original session unchanged after invalid update attempt`);

    }

    // 7. Log het resultaat van alle invalid update tests
    console.log(`Tested ${invalidCases.length} invalid update cases. ${invalidUpdatesCount} cases were incorrectly accepted.`);

    // 8. Test faalt alleen indien er ten onrechte een invalid update is geaccepteerd, niet bij 400 responses of correcte rollbacks
    if (invalidUpdatesCount > 0) {
        throw new Error(`${invalidUpdatesCount} invalid update cases were incorrectly accepted.`);
    }


    });
});

