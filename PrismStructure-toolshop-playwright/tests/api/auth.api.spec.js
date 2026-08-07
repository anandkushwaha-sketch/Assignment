const { test, expect } = require('../../fixtures/prism.fixture');
const { buildUser, buildLoginPayload, uniqueEmail, uniquePassword } = require('../../utils/dataGenerator');
const { buildInvoicePayload } = require('../../utils/invoiceHelper');
const {
  expectStatus,
  expectUnauthorizedError,
  expectConflictError,
} = require('../../utils/apiAssertions');

test.describe('API authentication negatives', () => {
  test('TC-API-02 login with invalid credentials returns 401 @regression', async ({
    authApiPage,
  }) => {
    const credentials = buildLoginPayload(uniqueEmail('invalid'), uniquePassword());
    const response = await authApiPage.login(credentials.email, credentials.password);
    const body = await response.json();

    expectStatus(response, 401);
    expectUnauthorizedError(body);
  });

  test('TC-API-03 duplicate user registration returns 409 @regression', async ({
    authApiPage,
  }) => {
    const user = buildUser();

    const firstResponse = await authApiPage.register(user);
    expectStatus(firstResponse, 201);

    const duplicateResponse = await authApiPage.register(user);
    const duplicateBody = await duplicateResponse.json();

    expectStatus(duplicateResponse, 409);
    expectConflictError(duplicateBody, 'email');
  });
});

test.describe('API authorization negatives', () => {
  test('TC-API-04 protected endpoints reject missing and invalid bearer tokens @regression', async ({
    authApiPage,
    invoiceApiPage,
    cartApiPage,
    productApiPage,
  }) => {
    const { products } = await productApiPage.getInStockProducts(1);
    const { cartId } = await cartApiPage.createCartAndGetId();
    await cartApiPage.addProduct(cartId, products[0].id, 1);

    const missingTokenMe = await authApiPage.getCurrentUser(null);
    const missingTokenMeBody = await missingTokenMe.json();
    expectStatus(missingTokenMe, 401);
    expectUnauthorizedError(missingTokenMeBody);

    const invalidTokenMe = await authApiPage.getCurrentUser('invalid-bearer-token');
    const invalidTokenMeBody = await invalidTokenMe.json();
    expectStatus(invalidTokenMe, 401);
    expectUnauthorizedError(invalidTokenMeBody);

    const missingTokenInvoice = await invoiceApiPage.createInvoice(
      buildInvoicePayload(cartId),
      null
    );
    const missingTokenInvoiceBody = await missingTokenInvoice.json();
    expectStatus(missingTokenInvoice, 401);
    expectUnauthorizedError(missingTokenInvoiceBody);
  });
});
