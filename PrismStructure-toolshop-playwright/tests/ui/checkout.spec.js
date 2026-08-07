const { test, expect } = require('../../fixtures/prism.fixture');

test.describe('Checkout validation', () => {
  test('TC-UI-07 empty cart checkout is blocked @regression', async ({
    page,
    checkoutPage,
    authenticatedUser,
  }) => {
    await checkoutPage.open();

    await expect(checkoutPage.emptyCartMessage).toBeVisible();
    await expect(checkoutPage.confirmButton).not.toBeVisible();
    await expect(page).not.toHaveURL(/invoice/i);
    await expect(page.getByTestId('nav-menu')).toContainText(authenticatedUser.first_name);
  });
});
