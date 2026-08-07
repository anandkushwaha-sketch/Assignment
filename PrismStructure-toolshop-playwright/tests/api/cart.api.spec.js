const { test, expect } = require('../../fixtures/prism.fixture');
const { buildUser } = require('../../utils/dataGenerator');
const { expectStatus, expectNotFoundError } = require('../../utils/apiAssertions');

test.describe('API cart and product negatives', () => {
  test('TC-API-05 invalid cart and product ids return 404 @regression', async ({
    authApiPage,
    cartApiPage,
  }) => {
    const user = buildUser();
    await authApiPage.register(user);
    const token = await authApiPage.loginAndGetToken(user.email, user.password);
    const invalidCartId = `invalid-cart-${Date.now()}`;
    const invalidProductId = `invalid-product-${Date.now()}`;

    const cartResponse = await cartApiPage.getCart(invalidCartId, token);
    const cartBody = await cartResponse.json();
    expectStatus(cartResponse, 404);
    expectNotFoundError(cartBody);

    const { cartId } = await cartApiPage.createCartAndGetId(token);
    const productResponse = await cartApiPage.addProduct(cartId, invalidProductId, 1, token);
    const productBody = await productResponse.json();
    expectStatus(productResponse, 404);
    expectNotFoundError(productBody);
  });
});
