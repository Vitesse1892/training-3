import { test, expect } from '../fixtures/pages.js';
import { SESSION_STATUS } from '../constants/sessionStatus.js';
import { createSessionContext } from '../utils/sessionTestData.js';

//Cancellation of session not possible
//Ingelogd moeten zijn om bepaalde handelingen uit te kunnen voeren
//Na bewerken worden opgegeven halve uren opgeslagen als hele uren
//List page data assertions toevoegen

test.describe('Sessions feature', () => {

  test.beforeEach(async ({ loginPage, basePage }) => {
    //Succesvol inloggen en vervolgens uitkomen op de list page
    await loginPage.goToLoginPage();
    await basePage.assertUrlEndsWith('login');
    await loginPage.login(
      process.env.ADMIN_EMAIL_CORRECT,
      process.env.ADMIN_PASSWORD_CORRECT
    );
    await basePage.assertUrlEndsWith('list');
    await basePage.assertPageTitle("Training Sessions");
  });

test('1. Een succesvol toegevoegde session is zichtbaar op de list page en bevat daar de juiste data', async ({ listPage, addPage, basePage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Checken of waarden op list page overeenkomen met toegevoegde session
  await basePage.assertUrlEndsWith('list');
  await listPage.assertSessionData(scenarioContextAddedSessions);
});

test('2. Een succesvol toegevoegde session is klikbaar op de list page en bevat de juiste data in de edit page', async ({ listPage, addPage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Naar edit page navigeren en controleren of de juiste data is ingevuld
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);
  await editPage.assertSessionData(scenarioContextAddedSessions);
});

test('3. Een succesvol gewijzigde session is zichtbaar op de list page en bevat daar de juiste data --> De data van de oorspronkelijke sessie is niet meer zichtbaar', async ({ listPage, addPage, basePage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Session data bewerken en opslaan
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);
  const scenarioContextEditedSessions = createSessionContext();
  await editPage.editSessionWithData(scenarioContextEditedSessions);
  await editPage.saveChanges();

  //Checken of waarden op list page overeenkomen met gewijzigde session
  await basePage.assertUrlEndsWith('list');
  await listPage.assertSessionData(scenarioContextEditedSessions);

  //Oorspronkelijke sessie data is niet meer zichtbaar op de list page
  await listPage.expectSessionNotPresent(scenarioContextAddedSessions.title);
});

test('4. Een succesvol gewijzigde session is klikbaar op de list page en bevat de juiste data in de edit page', async ({ listPage, addPage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken, naar edit page navigeren en checken of nu de data van aangemaakte sessie wordt getoond
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);

  //Session data bewerken en opslaan
  const scenarioContextEditedSessions = createSessionContext();
  await editPage.editSessionWithData(scenarioContextEditedSessions);
  await editPage.saveChanges();

  //Controleren of de juiste data na edit is ingevuld
  await listPage.editSessionByClickOnTitle(scenarioContextEditedSessions.title);
  await editPage.assertSessionData(scenarioContextEditedSessions);
});


test('5. Een sessie kan succesvol worden verwijderd vanuit de list page', async ({ basePage, listPage, addPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Controleren of de juiste data na edit is ingevuld
  await listPage.deleteSessionByClickOnTrashIcon(scenarioContextAddedSessions.title);
  await listPage.confirmDelete();
  await listPage.deletePermanently();

  //Controleren of sessie niet meer in de lijst staat
  await basePage.assertUrlEndsWith('list');
  await listPage.expectSessionNotPresent(scenarioContextAddedSessions.title);
});

test('6. Een sessie kan succesvol worden verwijderd vanuit de edit page --> Redirect naar list page', async ({ basePage, listPage, addPage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Sessie die zojuist is aangemaakt, verwijderen via edit page
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);
  await editPage.assertSessionData(scenarioContextAddedSessions);
  await editPage.clickDeleteSession();
  await editPage.confirmDelete();
  await editPage.confirmDeletePermanently();

  //Controleren of je op de list page bent en sessie niet meer in de lijst staat
  await basePage.assertUrlEndsWith('list');
  await listPage.expectSessionNotPresent(scenarioContextAddedSessions.title);
});

test("7. Een sessie kan succesvol worden gefilterd op title, duration en status", async ({
  listPage,
}) => {
  await listPage.getAllVisibleSessions();
});

});
