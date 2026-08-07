const { test, expect } = require('../../fixtures/prism.fixture');
const { buildUser } = require('../../utils/dataGenerator');
const { expectStatus } = require('../../utils/apiAssertions');

test.describe('API cart validation', () => {
  test('TC-API-06 retrieve non-existent cart returns not found @regression', async ({
    authApiPage,
    cartApiPage,
  }) => {
    const user = buildUser();
    await authApiPage.register(user);
    const token = await authApiPage.loginAndGetToken(user.email, user.password);
    const invalidCartId = `invalid-cart-${Date.now()}`;

    const response = await cartApiPage.getCart(invalidCartId, token);
    expectStatus(response, 404);
  });

  test('TC-API-07 add out-of-stock product to cart is rejected @regression', async ({
    authApiPage,
    cartApiPage,
    productApiPage,
  }) => {
    const user = buildUser();
    await authApiPage.register(user);
    const token = await authApiPage.loginAndGetToken(user.email, user.password);
    const outOfStockProduct = await productApiPage.getFirstOutOfStockProduct();

    expect(outOfStockProduct).toBeTruthy();

    const { cartId } = await cartApiPage.createCartAndGetId(token);
    const response = await cartApiPage.addProduct(cartId, outOfStockProduct.id, 1, token);

    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
