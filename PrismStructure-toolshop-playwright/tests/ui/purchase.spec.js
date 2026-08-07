const { test, expect } = require('../../fixtures/prism.fixture');

test.describe('Purchase flow', () => {
  test('TC-UI-06 complete purchase flow with COD and invoice verification @smoke @regression', async ({
    page,
    catalogPage,
    productPage,
    cartPage,
    checkoutPage,
    invoicesPage,
    authenticatedUser,
    inStockProducts,
    billingData,
  }) => {
    const purchasableProducts = await productPage.findPurchasableProducts(inStockProducts, 2);
    const [firstProduct, secondProduct] = purchasableProducts;
    const updatedQuantity = 2;

    await catalogPage.browseCatalog();
    await expect(catalogPage.productCards.first()).toBeVisible();

    await productPage.openById(firstProduct.id);
    const firstProductName = await productPage.getProductName();
    await expect(productPage.addToCartButton).toBeEnabled();
    await productPage.addToCart();

    await cartPage.openCart();
    await expect(cartPage.cartItems.filter({ hasText: firstProductName }).first()).toBeVisible();

    await page.getByRole('button', { name: /continue shopping/i }).click();
    await productPage.openById(secondProduct.id);
    const secondProductName = await productPage.getProductName();
    await expect(productPage.addToCartButton).toBeEnabled();
    await productPage.addToCart();

    await cartPage.openCart();
    await expect(cartPage.cartItems.first()).toBeVisible();
    expect(await cartPage.getItemCount()).toBeGreaterThanOrEqual(2);
    await expect(cartPage.cartItems.filter({ hasText: firstProductName }).first()).toBeVisible();
    await expect(cartPage.cartItems.filter({ hasText: secondProductName }).first()).toBeVisible();

    await cartPage.updateFirstItemQuantity(updatedQuantity);
    await expect(cartPage.quantityInputs.first()).toHaveValue(String(updatedQuantity));

    await cartPage.proceedToNextStep();
    await checkoutPage.completeCashOnDeliveryCheckout(billingData);

    await invoicesPage.open();
    await expect(invoicesPage.pageTitle).toContainText(/invoice/i);
    await expect(invoicesPage.invoiceRows.first()).toBeVisible();

    await invoicesPage.openFirstInvoice();
    const invoiceDetail = invoicesPage.invoiceDetailContent();
    const invoiceProducts = invoicesPage.invoiceProductsTable();
    await expect(invoiceProducts).toContainText(firstProductName);
    await expect(invoiceProducts).toContainText(secondProductName);
    await expect(page.getByLabel(/postal/i)).toHaveValue(billingData.billing_postal_code);

    await expect(page.getByTestId('nav-menu')).toContainText(authenticatedUser.first_name);
  });
});
