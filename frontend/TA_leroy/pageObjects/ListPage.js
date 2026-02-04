import { expect } from '@playwright/test';

export class ListPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
    
    constructor(page) {
        this.page = page;

        //Elements
        this.fieldSessionTitle = page.getByLabel('Session Title *'); //Er is geen data-test-id dus gebruik ik hier label
        this.fieldDescription  = page.getByLabel('Description *');
        this.fieldStatus  = page.getByLabel('Status *');
        this.fieldDuration  = page.getByLabel('Duration (hours)');
        
        this.btnAddSession = page.getByTestId('add-session-button');
        this.btnEditSessionByTitle = title => this.page.getByRole('button', { name: `Edit training session: ${title}` });
        this.btnDeleteSessionByTitle = title => this.page.getByRole('button', { name: `Delete training session: ${title}` });

        this.btnConfirmDelete = page.getByRole('button', { name: 'Yes, proceed to final confirmation', });
        this.btnDeletePermanently = page.getByRole('button', { name: 'Yes, delete this training session permanently', });

        //Pak het juiste <li> op basis van de title-button in die row
        this.sessionsList = page.getByTestId('list-main');
        
        
        //this.getSessionItemByTitle(title) = title => this.sessionsList.getByRole('listitem').filter({ has: this.page.getByRole('button', { name: title, exact: true }), }).first();

  
    }
        

    //Actions
    getSessionItemByTitle(title) {
        return this.sessionsList
            .getByRole('listitem')
            .filter({
            has: this.btnEditSessionByTitle(title),
        })
        .first();
    }

    async assertSessionData(data) {
        //Get the right block based on title
        const item = this.getSessionItemByTitle(data.title);
        await expect(item.getByRole('button', { name: `Edit training session: ${data.title}`, exact: true })).toBeVisible();
        
        await expect(item.locator('button.title-edit-button')).toHaveText(data.title);
        await expect(item.locator('.session-description')).toHaveText(data.description);
        await expect(item.getByRole('status')).toHaveText(data.status);
        await expect(item.locator('.session-duration')).toHaveText(`Duration: ${data.durationHours} hours`);
    }
    
    
    async clickAddSessionButton(){
        await this.btnAddSession.click();
    }

    async editSessionByClickOnTitle(title) {
        await this.btnEditSessionByTitle(title).click();
    }

    async deleteSessionByClickOnTrashIcon(title) {
        await this.btnDeleteSessionByTitle(title).click();
    }

    async confirmDelete() {
        await this.btnConfirmDelete.click();
    }   
    
    async deletePermanently() {
        await expect(this.btnDeletePermanently).toBeVisible();
        await expect(this.btnDeletePermanently).toBeEnabled();
        await this.btnDeletePermanently.click();
    } 

    async expectSessionNotPresent(title) {
        await expect(this.btnEditSessionByTitle(title)).toHaveCount(0);
    }
        
    


}