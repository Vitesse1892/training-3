import { log } from 'node:console';
import { test, expect } from '../fixtures/pages.js';

//Verder kijken naar methodes, aangezien genoemde elementen altijd aanwezig zijn.

test.describe('Shadow DOM feature', () => {
  test.beforeEach(async ({ shadowDomPage, basePage }) => {
    await shadowDomPage.goToShadowDomPage();
    await basePage.assertPageTitle('Shadow DOM');
  });

  test('1. De click me status tekst is bij aanvang niet zichtbaar', async ({ shadowDomPage }) => {
    await shadowDomPage.assertClickCountTextToBeEmpty();
  });

  test("2. De submit result tekst is bij aanvang leeg, element wel zichtbaar", async ({ shadowDomPage }) => {
    await shadowDomPage.assertSubmitResultTextVisible();
    await shadowDomPage.assertSubmitTextToBeEmpty();
  });

  test('3. Na 1 klik op de click me button is de click me status tekst zichtbaar en toont deze dat er 1 klik is geweest', async ({ shadowDomPage }) => {
    await shadowDomPage.assertClickCountTextToBeEmpty();
    await shadowDomPage.clickClickMeButton(1);
    await shadowDomPage.assertClickStatusTextVisible();
    await shadowDomPage.assertClickCountText(1);
  });

  test('4. Na 5 klikken op de click me button is de click me status tekst zichtbaar en toont deze dat er 5 klikken zijn geweest', async ({ shadowDomPage }) => {
    await shadowDomPage.clickClickMeButton(5);
    await shadowDomPage.assertClickCountText(5);
  });

  test('5. Na het invullen van tekst in het input veld en klikken op submit, is de submit result tekst zichtbaar en toont deze de ingevulde tekst', async ({ shadowDomPage }) => {
    await shadowDomPage.assertSubmitTextToBeEmpty();
    const textToSubmit = "This is the first text to submit!";
    await shadowDomPage.enterTextAndSubmit(textToSubmit);
    await shadowDomPage.assertSubmitText(textToSubmit);
  });

  test('6. Na het invullen van een andere tekst in het input veld en klikken op submit, is de submit result tekst zichtbaar en toont deze de nieuwe ingevulde tekst', async ({ shadowDomPage }) => {
    const firstTextToSubmit = "This is the first text to submit!";
    const secondTextToSubmit = "Another text to submit!";
    await shadowDomPage.enterTextAndSubmit(firstTextToSubmit);
    await shadowDomPage.assertSubmitText(firstTextToSubmit);
    await shadowDomPage.enterTextAndSubmit(secondTextToSubmit);
    await shadowDomPage.assertSubmitText(secondTextToSubmit);
  });

  test("7. De getoonde Click Me tekst en submit tekst verdwijnen na verlaten shadow-dom page en terugkeren", async ({ shadowDomPage, loginPage }) => {
    const textToSubmit = "This is the first text to submit!......";
    await shadowDomPage.enterTextAndSubmit(textToSubmit);
    await shadowDomPage.assertSubmitText(textToSubmit);
    await shadowDomPage.clickClickMeButton(10);
    await shadowDomPage.assertClickCountText(10);

    //Verlaat de pagina en keer terug. Click Me tekst en submit tekst zijn verdwenen
    await loginPage.goToLoginPage();
    await shadowDomPage.goToShadowDomPage();
    await shadowDomPage.assertClickCountTextToBeEmpty();
    await shadowDomPage.assertSubmitTextToBeEmpty();
  });

});