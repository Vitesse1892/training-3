import { expect } from "@playwright/test";

export class ShadowDomPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;

    //Elements
    this.btnClickMe = page.getByTestId("shadow-button");
    this.txtStatusClickCount = page.getByTestId("shadow-status");

    this.fieldEnterText = page.getByTestId("shadow-input");
    this.btnSubmit = page.getByTestId("shadow-submit");
    this.txtResultSubmitted = page.getByTestId("shadow-result");
  }

  //Actions
  async goToShadowDomPage() {
    await this.page.goto("/shadow-dom");
  }

  async assertClickStatusTextVisible() {
    await expect(this.txtStatusClickCount).toBeVisible();
  }

  async assertSubmitResultTextVisible() {
    await expect(this.txtResultSubmitted).toBeVisible();
  }

  async assertClickStatusTextHidden() {
    await expect(this.txtStatusClickCount).toBeHidden();
  }

  async assertSubmitResultTextHidden() {
    await expect(this.txtResultSubmitted).toBeHidden();
  }

  async clickClickMeButton(amountOfClicks) {
    for (let i = 0; i < amountOfClicks; i++) {
      await this.btnClickMe.click();
    }
  }

  async assertClickCountTextToBeEmpty() {
    await expect(this.txtStatusClickCount).toHaveText("");
  }

  async assertSubmitTextToBeEmpty() {
    await expect(this.txtResultSubmitted).toHaveText("");
  }

  async assertClickCountText(expectedCount) {
    const suffix = expectedCount === 1 ? "time" : "times";
    await expect(this.txtStatusClickCount).toHaveText(
      `Clicked ${expectedCount} ${suffix}`,
    );
  }

  async enterTextAndSubmit(text) {
    await this.fieldEnterText.fill(text);
    await this.btnSubmit.click();
  }

  async assertSubmitText(text) {
    await expect(this.txtResultSubmitted).toHaveText(`Submitted: "${text}"`);
  }
}
