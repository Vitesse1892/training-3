import { expect } from '@playwright/test';

export class EditPage {
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
        this.btnSaveChanges = page.getByRole('button', { name: 'Save changes to training session' })

        this.btnDeleteSession = page.getByTestId('edit-delete');
        this.btnConfirmDelete = this.page.getByRole('button', { name: 'Yes, proceed to final confirmation',});
        this.btnConfirmDeletePermanently = this.page.getByRole('button', { name: 'Yes, delete this training session permanently', });

    }

    //Actions

    async assertSessionData(data) {
        await expect(this.fieldSessionTitle).toHaveValue(data.title);
        await expect(this.fieldDescription).toHaveValue(data.description);
        await expect(this.fieldStatus).toHaveValue(data.status);
        await expect(this.fieldDuration).toHaveValue(data.durationHours);
    }

    async editSessionWithData(data) { //Betreft vrijwel dezelfde code als in AddPage.js, later iets mee doen
        await this.fieldSessionTitle.fill(data.title);
        await this.fieldDescription.fill(data.description);
        await this.fieldStatus.selectOption(data.status);
        await this.fieldDuration.fill(data.durationHours);
    } 

    async saveChanges(){
        await this.btnSaveChanges.click();
    }

    async clickDeleteSession() {
        await this.btnDeleteSession.click();
    }

    async confirmDelete() {
        await this.btnConfirmDelete.click();
    }

    async confirmDeletePermanently() {
        await this.btnConfirmDeletePermanently.click();
    }
}