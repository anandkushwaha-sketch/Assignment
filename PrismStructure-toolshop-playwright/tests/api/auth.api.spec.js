const { test, expect } = require('../../fixtures/prism.fixture');
const { buildUser, buildLoginPayload, uniqueEmail } = require('../../utils/dataGenerator');
const { buildInvoicePayload } = require('../../utils/invoiceHelper');
const { expectStatus } = require('../../utils/apiAssertions');

test.describe('API authentication', () => {
  test('TC-API-02 login with invalid credentials is rejected @regression', async ({
    authApiPage,
  }) => {
    const credentials = buildLoginPayload(uniqueEmail('invalid'), 'WrongPass@99');
    const response = await authApiPage.login(credentials.email, credentials.password);

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('TC-API-03 duplicate user registration returns conflict @regression', async ({
    authApiPage,
  }) => {
    const user = buildUser();

    const firstResponse = await authApiPage.register(user);
    expectStatus(firstResponse, 201);

    const duplicateResponse = await authApiPage.register(user);
    expectStatus(duplicateResponse, 409);
  });
});

test.describe('API authorization', () => {
  test('TC-API-04 invoice creation without bearer token is unauthorized @regression', async ({
    invoiceApiPage,
    cartApiPage,
    productApiPage,
  }) => {
    const { products } = await productApiPage.getInStockProducts(1);
    const { cartId } = await cartApiPage.createCartAndGetId();
    await cartApiPage.addProduct(cartId, products[0].id, 1);

    const response = await invoiceApiPage.createInvoice(
      buildInvoicePayload(cartId),
      null
    );

    expectStatus(response, 401);
  });

  test('TC-API-05 current user endpoint requires bearer token @regression', async ({
    authApiPage,
  }) => {
    const response = await authApiPage.getCurrentUser(null);
    expectStatus(response, 401);
  });
});
