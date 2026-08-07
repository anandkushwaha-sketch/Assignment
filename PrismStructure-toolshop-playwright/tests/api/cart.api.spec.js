const { test, expect } = require('../../fixtures/prism.fixture');
const { buildUser, invalidResourceId } = require('../../utils/dataGenerator');
const {
  expectStatus,
  expectNotFoundError,
  expectFieldValidationError,
} = require('../../utils/apiAssertions');

function mutateResourceId(resourceId) {
  const lastCharacter = resourceId.slice(-1);
  const alternateCharacter = lastCharacter === 'A' ? 'B' : 'A';

  return `${resourceId.slice(0, -1)}${alternateCharacter}`;
}

test.describe('API cart and product negatives', () => {
  test('TC-API-05 invalid cart and product ids return 404 @regression', async ({
    authApiPage,
    cartApiPage,
  }) => {
    const user = buildUser();
    await authApiPage.register(user);
    const token = await authApiPage.loginAndGetToken(user.email, user.password);

    const { cartId } = await cartApiPage.createCartAndGetId(token);
    const invalidCartId = mutateResourceId(cartId);

    const cartResponse = await cartApiPage.getCart(invalidCartId, token);
    const cartBody = await cartResponse.json();
    expectStatus(cartResponse, 404);
    expectNotFoundError(cartBody);

    const invalidProductId = invalidResourceId('Z');
    const productResponse = await cartApiPage.addProduct(cartId, invalidProductId, 1, token);
    const productBody = await productResponse.json();
    expectStatus(productResponse, 422);
    expectFieldValidationError(productBody, 'product_id');
  });
});
