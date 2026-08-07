const { test, expect } = require('../../fixtures/prism.fixture');
const { buildUser } = require('../../utils/dataGenerator');
const { buildInvoicePayload } = require('../../utils/invoiceHelper');
const {
  expectStatus,
  expectNotFoundError,
  expectFieldValidationError,
} = require('../../utils/apiAssertions');

test.describe('API invoice negatives', () => {
  test('TC-API-06 invoice with missing required field returns 422 @regression', async ({
    authApiPage,
    invoiceApiPage,
    cartApiPage,
    productApiPage,
  }) => {
    const user = buildUser();
    await authApiPage.register(user);
    const token = await authApiPage.loginAndGetToken(user.email, user.password);
    const { products } = await productApiPage.getInStockProducts(1);
    const { cartId } = await cartApiPage.createCartAndGetId(token);
    await cartApiPage.addProduct(cartId, products[0].id, 1, token);

    const invalidPayload = buildInvoicePayload(cartId);
    delete invalidPayload.billing_street;

    const response = await invoiceApiPage.createInvoice(invalidPayload, token);
    const body = await response.json();

    expectStatus(response, 422);
    expectFieldValidationError(body, 'billing_street');
  });

  test('TC-API-07 invoice with invalid cart id returns 404 @regression', async ({
    authApiPage,
    invoiceApiPage,
  }) => {
    const user = buildUser();
    await authApiPage.register(user);
    const token = await authApiPage.loginAndGetToken(user.email, user.password);
    const invalidCartId = `invalid-cart-${Date.now()}`;

    const response = await invoiceApiPage.createInvoice(
      buildInvoicePayload(invalidCartId),
      token
    );
    const body = await response.json();

    expectStatus(response, 404);
    expectNotFoundError(body);
  });
});
