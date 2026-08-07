const { test, expect } = require('../../fixtures/prism.fixture');

test.describe('Catalog and search', () => {
  test('TC-UI-04 search product and open detail page @regression', async ({
    page,
    catalogPage,
    productPage,
    productApiPage,
  }) => {
    const response = await productApiPage.getProducts();
    const body = await response.json();
    const candidates = (body.data || body).filter((product) => product.in_stock === true);

    let purchasableProduct;
    for (const product of candidates) {
      await productPage.openById(product.id);
      if (await productPage.addToCartButton.isEnabled()) {
        purchasableProduct = product;
        break;
      }
    }

    expect(purchasableProduct).toBeTruthy();

    await catalogPage.open();
    await catalogPage.searchProduct(purchasableProduct.name);
    await catalogPage.productByName(purchasableProduct.name).click();

    await expect(page).toHaveURL(new RegExp(`/product/${purchasableProduct.id}|/product/`));
    await expect(productPage.productName).toContainText(purchasableProduct.name);
    await expect(productPage.addToCartButton).toBeEnabled();
  });

  test('TC-UI-05 search with no matching products shows empty state @regression', async ({
    catalogPage,
  }) => {
    const noMatchQuery = `zzznomatch${Date.now()}`;

    await catalogPage.open();
    await catalogPage.searchProduct(noMatchQuery);

    await expect(catalogPage.noResultsMessage()).toBeVisible();
    await expect(catalogPage.noResultsMessage()).toContainText(/no products found/i);
    await expect(catalogPage.productCards).toHaveCount(0);
  });
});
