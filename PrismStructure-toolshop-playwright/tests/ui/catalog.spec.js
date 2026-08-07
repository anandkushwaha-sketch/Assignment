const { test, expect } = require('../../fixtures/prism.fixture');

test.describe('Catalog and search', () => {
  test('TC-UI-04 search product and open detail page @regression', async ({
    page,
    catalogPage,
    productPage,
    productApiPage,
  }) => {
    const inStockProduct = await productApiPage.getFirstInStockProduct();
    expect(inStockProduct).toBeTruthy();

    await catalogPage.open();
    await catalogPage.searchProduct(inStockProduct.name);
    await catalogPage.productByName(inStockProduct.name).click();

    await expect(page).toHaveURL(new RegExp(`/product/${inStockProduct.id}|/product/`));
    await expect(productPage.productName).toContainText(inStockProduct.name);
    await expect(productPage.inStockStatus).toBeVisible();
    await expect(productPage.addToCartButton).toBeVisible();
  });

  test('TC-UI-05 search with no matching products shows empty state @regression', async ({
    catalogPage,
  }) => {
    const noMatchQuery = `zzznomatch${Date.now()}`;

    await catalogPage.open();
    await catalogPage.searchProduct(noMatchQuery);

    await expect(catalogPage.noResultsMessage()).toBeVisible();
    await expect(catalogPage.productCards).toHaveCount(0);
  });
});
