import { expect } from '@playwright/test';

export class ListPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;

    //Elements
    this.btnAddSession = page.getByTestId("add-session-button");
    this.btnEditSessionByTitle = (title) =>
      this.page.getByRole("button", {
        name: `Edit training session: ${title}`,
      });
    this.btnDeleteSessionByTitle = (title) =>
      this.page.getByRole("button", {
        name: `Delete training session: ${title}`,
      });

    this.btnConfirmDelete = page.getByRole("button", {
      name: "Yes, proceed to final confirmation",
    });
    this.btnDeletePermanently = page.getByRole("button", {
      name: "Yes, delete this training session permanently",
    });

    //Pak het juiste <li> op basis van de title-button in die row
    this.sessionsList = page.getByTestId("sessions-list");

    //this.getSessionItemByTitle(title) = title => this.sessionsList.getByRole('listitem').filter({ has: this.page.getByRole('button', { name: title, exact: true }), }).first();

    this.txtTitle = this.page.locator('[data-testid^="edit-session-"]');
    this.txtStatus = this.page.locator('[data-testid^="status-badge-"]');
    this.txtDescription = this.page.locator('p.session-description');
    this.txtDuration = this.page.locator('p.session-duration');

    this.filterTitle = page.getByTestId("filter-title");
    this.filterDuration = page.getByTestId("filter-duration");
    this.filterStatus = page.getByTestId("filter-status");
    this.btnClearFilters = page.getByTestId("clear-filters");
  }

  //Actions
  getSessionItemByTitle(title) {
    return this.sessionsList
      .getByRole("listitem")
      .filter({
        has: this.btnEditSessionByTitle(title),
      })
      .first();
  }

  async assertSessionData(data) {
    //Get the right block based on title
    const item = this.getSessionItemByTitle(data.title);
    await expect(
      item.getByRole("button", {
        name: `Edit training session: ${data.title}`,
        exact: true,
      }),
    ).toBeVisible();

    await expect(item.locator("button.title-edit-button")).toHaveText(
      data.title,
    );
    await expect(item.locator(".session-description")).toHaveText(
      data.description,
    );
    await expect(item.getByRole("status")).toHaveText(data.status);
    await expect(item.locator(".session-duration")).toHaveText(
      `Duration: ${data.durationHours} hours`,
    );
  }

  async clickAddSessionButton() {
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

//Onderstaande verder optimaliseren
  async getAllVisibleSessions() {
  
  const items = await this.page.getByRole('listitem').all();
  const sessions = [];

  for (const item of items) {
    const title = (
      await item.locator('[data-testid^="edit-session-"]').innerText()
    ).trim();

    const description = (
      await item.locator('p.session-description').innerText()
    ).trim();

    const status = (
      await item.locator('[data-testid^="status-badge-"]').innerText()
    ).trim();

    const durationText = (
      await item.locator('p.session-duration').innerText()
    ).trim();

    const durationHours = this._parseDurationHours(durationText);

    sessions.push({
      title,
      description,
      status,
      durationText,
      durationHours,
    });
  }

  return sessions;
}

  _parseDurationHours(durationText) {
    // "Duration: 2 hours" -> 2
    const match = durationText.match(/Duration:\s*([\d.]+)\s*hours?/i);
    return match ? Number(match[1]) : null;
  }
}