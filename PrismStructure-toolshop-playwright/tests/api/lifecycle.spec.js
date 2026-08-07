const { test, expect } = require('../../fixtures/prism.fixture');
const { buildUser, buildLoginPayload } = require('../../utils/dataGenerator');
const { buildInvoicePayload } = require('../../utils/invoiceHelper');
const {
  expectStatus,
  expectUserRegistration,
  expectTokenResponse,
  expectPaginatedProducts,
  expectInvoiceResponse,
  extractCartProductIds,
} = require('../../utils/apiAssertions');

test.describe('API lifecycle', () => {
  test('TC-API-01 complete user cart and invoice lifecycle @smoke @regression', async ({
    authApiPage,
    productApiPage,
    cartApiPage,
    invoiceApiPage,
  }) => {
    const user = buildUser();
    const firstProductQuantity = 2;
    const secondProductQuantity = 1;

    const registerResponse = await authApiPage.register(user);
    const registeredUser = await registerResponse.json();
    expectStatus(registerResponse, 201);
    expectUserRegistration(registeredUser, user);

    const loginResponse = await authApiPage.login(user.email, user.password);
    const tokenBody = await loginResponse.json();
    expectStatus(loginResponse, 200);
    expectTokenResponse(tokenBody);
    const token = tokenBody.access_token;

    const meResponse = await authApiPage.getCurrentUser(token);
    const meBody = await meResponse.json();
    expectStatus(meResponse, 200);
    expect(meBody.email).toBe(user.email);

    const productsResponse = await productApiPage.getProducts();
    const productsBody = await productsResponse.json();
    expectStatus(productsResponse, 200);
    expectPaginatedProducts(productsBody);

    const inStockProducts = productsBody.data.filter((product) => product.in_stock === true);
    expect(inStockProducts.length).toBeGreaterThanOrEqual(2);
    const [firstProduct, secondProduct] = inStockProducts;

    const { response: createCartResponse, cartId, body: cartBody } =
      await cartApiPage.createCartAndGetId(token);
    expectStatus(createCartResponse, 201);
    expect(cartBody.id).toBe(cartId);

    const addFirstResponse = await cartApiPage.addProduct(
      cartId,
      firstProduct.id,
      firstProductQuantity,
      token
    );
    const addFirstBody = await addFirstResponse.json();
    expectStatus(addFirstResponse, 200);
    expect(addFirstBody.result).toMatch(/item added|updated/i);

    const addSecondResponse = await cartApiPage.addProduct(
      cartId,
      secondProduct.id,
      secondProductQuantity,
      token
    );
    expectStatus(addSecondResponse, 200);

    const cartResponse = await cartApiPage.getCart(cartId, token);
    const verifiedCart = await cartResponse.json();
    expectStatus(cartResponse, 200);
    expect(verifiedCart.id).toBe(cartId);

    const cartProductIds = extractCartProductIds(verifiedCart);
    if (cartProductIds.length > 0) {
      expect(cartProductIds).toEqual(
        expect.arrayContaining([firstProduct.id, secondProduct.id])
      );
    }

    const invoiceRequest = buildInvoicePayload(cartId, {
      payment_method: 'cash-on-delivery',
      payment_details: {},
    });
    const invoiceResponse = await invoiceApiPage.createInvoice(invoiceRequest, token);
    const invoiceBody = await invoiceResponse.json();
    expectStatus(invoiceResponse, 200);
    expectInvoiceResponse(invoiceBody, invoiceRequest);

    const invoicesListResponse = await invoiceApiPage.getInvoices(token);
    const invoicesListBody = await invoicesListResponse.json();
    expectStatus(invoicesListResponse, 200);
    expect(invoicesListBody.data.some((invoice) => invoice.id === invoiceBody.id)).toBe(true);

    const invoiceByIdResponse = await invoiceApiPage.getInvoiceById(invoiceBody.id, token);
    const invoiceByIdBody = await invoiceByIdResponse.json();
    expectStatus(invoiceByIdResponse, 200);
    expect(invoiceByIdBody.id).toBe(invoiceBody.id);
    expect(invoiceByIdBody.invoice_number).toBe(invoiceBody.invoice_number);
    expect(invoiceByIdBody.invoicelines.map((line) => line.product_id)).toEqual(
      expect.arrayContaining([firstProduct.id, secondProduct.id])
    );
  });
});
