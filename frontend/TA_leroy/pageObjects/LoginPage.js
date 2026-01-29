import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
    
    constructor(page) {
        this.page = page;

        //Elements
        this.fieldUserName = page.getByTestId('login-username-input');
        this.fieldPassword = page.getByTestId('login-password-input');
        this.btnSignIn = page.getByTestId('login-submit');
        this.lnkForgotPassword = page.getByTestId('forgot-password-link');
        this.errorAlertInvalidLogin = page.getByTestId('login-error');
    }

    //Actions
    async goToLoginPage() {
        await this.page.goto('/login');
    }

    async login(username, password){
        await this.fieldUserName.fill(username);
        await this.fieldPassword.fill(password);
        await this.btnSignIn.click();
    }

    async assertErrorTextInvalidLogin(errorText){
        await expect(this.errorAlertInvalidLogin).toHaveText(errorText);
    }

    async clickForgotPasswordLink(){
        await this.lnkForgotPassword.click();
    }





}