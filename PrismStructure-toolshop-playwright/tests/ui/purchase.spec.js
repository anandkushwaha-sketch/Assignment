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
    const [firstProduct, secondProduct] = inStockProducts;
    const updatedQuantity = 2;

    await catalogPage.browseCatalog();
    await expect(catalogPage.productCards.first()).toBeVisible();

    await catalogPage.searchAndOpenProduct(firstProduct.name);
    const firstProductName = await productPage.getProductName();
    await expect(productPage.inStockStatus).toBeVisible();
    await productPage.addToCart();

    await catalogPage.open();
    await catalogPage.searchAndOpenProduct(secondProduct.name);
    const secondProductName = await productPage.getProductName();
    await productPage.addToCart();

    await expect(cartPage.cartIcon).toBeVisible();

    await cartPage.openCart();
    await expect(cartPage.cartItems.first()).toBeVisible();
    expect(await cartPage.getItemCount()).toBeGreaterThanOrEqual(2);
    await expect(page.getByText(firstProductName)).toBeVisible();
    await expect(page.getByText(secondProductName)).toBeVisible();

    await cartPage.updateFirstItemQuantity(updatedQuantity);
    await expect(cartPage.quantityInputs.first()).toHaveValue(String(updatedQuantity));

    await checkoutPage.open();
    await checkoutPage.completeCashOnDeliveryCheckout(billingData);

    await invoicesPage.open();
    await expect(invoicesPage.pageTitle).toContainText(/invoice/i);
    await expect(invoicesPage.invoiceRows.first()).toBeVisible();

    await invoicesPage.openFirstInvoice();
    const invoiceDetail = invoicesPage.invoiceDetailContent();
    await expect(invoiceDetail).toContainText(firstProductName);
    await expect(invoiceDetail).toContainText(billingData.billing_street);
    await expect(invoiceDetail).toContainText(billingData.billing_city);

    await expect(page.getByTestId('nav-menu')).toContainText(authenticatedUser.first_name);
  });
});
