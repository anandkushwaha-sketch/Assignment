const { test, expect } = require('../../fixtures/prism.fixture');

test.describe('Checkout validation', () => {
  test('TC-UI-07 empty cart checkout is blocked @regression', async ({
    page,
    checkoutPage,
    cartPage,
  }) => {
    await checkoutPage.open();

    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(checkoutPage.proceedButton).not.toBeVisible();
    await expect(checkoutPage.confirmButton).not.toBeVisible();
    await expect(page).not.toHaveURL(/invoice/i);
  });
});
