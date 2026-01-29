import { test, expect } from '../fixtures/pages';
import { ERROR_MESSAGES } from '../constants/errorMessages.js';

test('1. Succesvolle login brengt je naar de list page', async ({ loginPage, basePage }) => {
  await loginPage.goToLoginPage();
  await basePage.assertUrlEndsWith('login');
  await loginPage.login(process.env.ADMIN_EMAIL_CORRECT, process.env.ADMIN_PASSWORD_CORRECT);
  await basePage.assertUrlEndsWith('list');
});

test('2. Incorrecte login resulteert in error "invalid credentials, je blijft op login page" ', async ({ loginPage, basePage }) => {
  await loginPage.goToLoginPage();
  await basePage.assertUrlEndsWith('login');
  await loginPage.login(process.env.EMAIL_INCORRECT, process.env.PASSWORD_INCORRECT);
  await basePage.assertUrlEndsWith('login');
  await loginPage.assertErrorTextInvalidLogin(ERROR_MESSAGES.INVALID_CREDENTIALS_TEXT);
});

test('3. Aanklikken Forgot password na poging inloggen met niet-bestaande user resulteert in error "User not found", je blijft op login page" ', async ({ loginPage, basePage }) => {
  await loginPage.goToLoginPage();
  await basePage.assertUrlEndsWith('login');
  await loginPage.login(process.env.EMAIL_INCORRECT, process.env.PASSWORD_INCORRECT);
  await basePage.assertUrlEndsWith('login');
  await loginPage.clickForgotPasswordLink();
  await loginPage.assertErrorTextInvalidLogin(ERROR_MESSAGES.USER_NOT_FOUND_TEXT);
});