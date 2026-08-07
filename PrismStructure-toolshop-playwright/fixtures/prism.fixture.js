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
  authenticatedUser: async ({ authApiPage, loginPage, page }, use) => {
    const user = buildUser();
    const response = await authApiPage.register(user);

    if (!response.ok()) {
      throw new Error(`Failed to register user for purchase flow: ${response.status()}`);
    }

    await loginPage.open();
    await loginPage.login(user.email, user.password);
    await page.waitForURL((url) => !url.pathname.includes('/auth/login'));

    await use(user);
  },
  inStockProducts: async ({ productApiPage }, use) => {
    const response = await productApiPage.getProducts();
    const body = await response.json();
    const products = (body.data || body).filter((product) => product.in_stock);

    if (products.length < 2) {
      throw new Error('Need at least two in-stock products for purchase flow test');
    }

    await use(
      products.slice(0, 2).map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
      }))
    );
  },
  billingData: async ({}, use) => {
    await use(buildBillingAddress());
  },
  invoicePayload: async ({}, use) => {
    await use((cartId, overrides = {}) => buildInvoicePayload(cartId, overrides));
  },
});

module.exports = { test, expect };
