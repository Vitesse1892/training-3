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

    }

    //Actions
    

    async assertSessionData(data) {
        await expect(this.fieldSessionTitle).toHaveValue(data.title);
        await expect(this.fieldDescription).toHaveValue(data.description);
        await expect(this.fieldStatus).toHaveValue(data.status);
        await expect(this.fieldDuration).toHaveValue(data.durationHours);
    }

    async saveChanges(){
        await this.btnSaveChanges.click();
    }
}