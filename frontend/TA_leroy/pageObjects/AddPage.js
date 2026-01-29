import { expect } from '@playwright/test';

export class AddPage {
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
        this.btnCreateSession = page.getByRole('button', { name: 'Create training session' })

    }

    //Actions
    async selectSessionStatus(status) {
        await this.fieldStatus.selectOption(status);
    }

    async createSessionWithData(data) {
        await this.fieldSessionTitle.fill(data.title);
        await this.fieldDescription.fill(data.description);
        await this.fieldStatus.selectOption(data.status);
        await this.fieldDuration.fill(data.durationHours);
        await this.btnCreateSession.click();
    }   
}