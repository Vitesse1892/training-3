export class ListPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
    
    constructor(page) {
        this.page = page;

        //Elements
        this.btnAddSession = page.getByTestId('add-session-button');

    }

    //Actions
    async clickAddSessionButton(){
        await this.btnAddSession.click();
    }

    async editSessionByClickOnTitle(title) {
        await this.page.getByRole('button', {
            name: `Edit training session: ${title}`,
        }).click();
    }
}