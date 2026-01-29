import { test, expect } from '../fixtures/pages.js';
import { SESSION_STATUS } from '../constants/sessionStatus.js';
import { createSessionContext } from '../utils/sessionTestData.js';

test('1. Een succesvol toegevoegde session is zichtbaar in de lijst en bevat de correctie informatie indien er op wordt geklikt', async ({ loginPage, basePage, listPage, addPage, editPage }) => {
  await loginPage.goToLoginPage();
  await basePage.assertUrlEndsWith('login');
  await loginPage.login(process.env.ADMIN_EMAIL_CORRECT, process.env.ADMIN_PASSWORD_CORRECT);
  await basePage.assertUrlEndsWith('list');
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);

  //Naar edit page navigeren
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);

  //Controleren of de juiste data is ingevuld
  await editPage.assertSessionData(scenarioContextAddedSessions);
  await editPage.saveChanges();

});



