import { test } from '../fixtures/pages.js';


  test('1. Mock backend online en verifieer status online health check en error text niet zichtbaar', async ({ healthPage }) => {
    await healthPage.mockBackendOnline();
    await healthPage.goToHealthPage();
    await healthPage.assertStatus("online");
    await healthPage.assertBackendOfflineErrorTextNotVisible();
  });

  test('2. Mock backend offline en verifieer status offline health check en error text zichtbaar', async ({ healthPage }) => {
    await healthPage.mockBackendOffline();
    await healthPage.goToHealthPage(); 
    await healthPage.assertStatus("offline");
    await healthPage.assertBackendOfflineErrorTextVisible();
  });

  test('3. Mock backend checking en verifieer status checking health check en error text niet zichtbaar', async ({ healthPage }) => {
    await healthPage.mockBackendChecking();
    await healthPage.goToHealthPage(); 
    await healthPage.assertStatus("checking");
    await healthPage.assertBackendOfflineErrorTextNotVisible();
  });

  test("4. Mock backend offline en verifieer correcte error text", async ({
    healthPage,
  }) => {
    await healthPage.mockBackendOffline();
    await healthPage.goToHealthPage();
    await healthPage.assertStatus("offline");
    await healthPage.assertBackendOfflineErrorTextVisible();
    const backendOfflineExpectedErrorText = "Cannot connect to backend server";
    await healthPage.assertHealthErrorText(backendOfflineExpectedErrorText);
  });

  test("5. Last checked tekst is zichtbaar, voldoet aan format en updatete na 5 seconden", async ({
    healthPage,
  }) => {
    await healthPage.mockBackendOnline();
    await healthPage.goToHealthPage();
    await healthPage.assertStatus("online");
    await healthPage.assertLastCheckedVisible();
    await healthPage.assertLastCheckedFormat();
    await healthPage.assertLastCheckedUpdates(7000); // 7 seconden om zeker te zijn dat de update heeft plaatsgevonden
  });




