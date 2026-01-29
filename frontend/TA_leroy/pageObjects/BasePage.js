import { expect } from '@playwright/test';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
    
    constructor(page) {
        this.page = page;

        //Elements

    }

    //Actions
    async assertUrlEndsWith(pathSegment) { 
        const regex = new RegExp(`/${pathSegment}(\\?.*)?$`); //list?page=1 is hiermee ook goed
        await expect(this.page).toHaveURL(regex);
    }

    

}