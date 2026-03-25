import { test as base, expect } from '@playwright/test';
import { apiFixture } from '../../fixtures/api-fixture';
import * as apiHelpers from '../utils/apiHelpers';

const test = base.extend(apiFixture);

//Mocks waarin backend uit staat of laadt, staan in de FE tests.

test.describe('Health API', () => {
  
    test('should return OK on GET /health', async ({ api }) => {
        const response = await apiHelpers.getHealth(api);
        await expect(response).toBeOK();

        const json = await response.json();
        expect(json).toEqual({
            status: 'OK',
            message: 'Training Sessions API is running'
        });
    });

});
