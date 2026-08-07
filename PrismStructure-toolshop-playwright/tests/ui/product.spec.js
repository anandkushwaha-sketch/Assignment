const { test, expect } = require('../../fixtures/prism.fixture');

test.describe('Product stock validation', () => {
  test('TC-UI-08 cannot add out-of-stock product to cart @regression', async ({
    productPage,
    outOfStockProduct,
  }) => {
    await productPage.openById(outOfStockProduct.id);

    await expect(productPage.productName).toContainText(outOfStockProduct.name);
    await expect(productPage.outOfStockStatus).toBeVisible();
    await expect(productPage.addToCartButton).toBeDisabled();
  });
});
