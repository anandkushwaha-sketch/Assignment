const { test: base, expect } = require('@playwright/test');
const {
  LoginPage,
  RegisterPage,
  CatalogPage,
  ProductPage,
  CartPage,
  CheckoutPage,
  ProfilePage,
  InvoicesPage,
} = require('../pageObjects');
const {
  AuthApiPage,
  ProductApiPage,
  CartApiPage,
  InvoiceApiPage,
} = require('../apiPages');
const { buildUser } = require('../utils/dataGenerator');
const { buildBillingAddress, buildInvoicePayload } = require('../utils/invoiceHelper');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  invoicesPage: async ({ page }, use) => {
    await use(new InvoicesPage(page));
  },
  authApiPage: async ({ request }, use) => {
    await use(new AuthApiPage(request));
  },
  productApiPage: async ({ request }, use) => {
    await use(new ProductApiPage(request));
  },
  cartApiPage: async ({ request }, use) => {
    await use(new CartApiPage(request));
  },
  invoiceApiPage: async ({ request }, use) => {
    await use(new InvoiceApiPage(request));
  },
  testUser: async ({}, use) => {
    await use(buildUser());
  },
  billingData: async ({}, use) => {
    await use(buildBillingAddress());
  },
  invoicePayload: async ({}, use) => {
    await use((cartId, overrides = {}) => buildInvoicePayload(cartId, overrides));
  },
});

module.exports = { test, expect };
