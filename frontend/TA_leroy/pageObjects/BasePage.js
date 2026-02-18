import { expect } from '@playwright/test';

export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;

    //Elements
    this.pageTitle = page.locator("h1.page-title");
  }

  //Actions
  async assertUrlEndsWith(pathSegment) {
    const regex = new RegExp(`/${pathSegment}(\\?.*)?$`); //list?page=1 is hiermee ook goed
    await expect(this.page).toHaveURL(regex);
  }

  async assertPageTitle(expectedTitle) {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText(expectedTitle);
  }
}