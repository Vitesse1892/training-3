import { test as base, expect, type Page } from '@playwright/test';

import { AddPage } from '../pageObjects/AddPage';
import { EditPage } from '../pageObjects/EditPage';
import { LoginPage } from '../pageObjects/LoginPage';
import { HomePage } from '../pageObjects/HomePage';
import { HealthPage } from '../pageObjects/HealthPage';
import { ListPage } from '../pageObjects/ListPage';
import { BestPracticesPage } from '../pageObjects/BestPracticesPage';
import { ShadowDomPage } from '../pageObjects/ShadowDomPage';
import { BasePage } from '../pageObjects/BasePage';

type Fixtures = {
  addPage: AddPage;
  editPage: EditPage;
  loginPage: LoginPage;
  homePage: HomePage;
  healthPage: HealthPage;
  listPage: ListPage;
  bestPracticesPage: BestPracticesPage;
  shadowDomPage: ShadowDomPage;
  basePage: BasePage;
};

export const test = base.extend<Fixtures>({
  addPage: async ({ page }, use) => { await use(new AddPage(page)); },
  editPage: async ({ page }, use) => { await use(new EditPage(page)); },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  healthPage: async ({ page }, use) => { await use(new HealthPage(page)); },
  listPage: async ({ page }, use) => { await use(new ListPage(page)); },
  bestPracticesPage: async ({ page }, use) => { await use(new BestPracticesPage(page)); },
  shadowDomPage: async ({ page }, use) => { await use(new ShadowDomPage(page)); },
  basePage: async ({ page }, use) => { await use(new BasePage(page)); },
});

export { expect };