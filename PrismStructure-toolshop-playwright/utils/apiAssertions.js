const { expect } = require('@playwright/test');

function expectStatus(response, status) {
  expect(response.status(), `Expected HTTP ${status}`).toBe(status);
}

function expectUserRegistration(body, user) {
  expect(body).toMatchObject({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });
  expect(body.id).toBeTruthy();
}

function expectTokenResponse(body) {
  expect(body.access_token).toBeTruthy();
  expect(body.token_type.toLowerCase()).toBe('bearer');
  expect(typeof body.expires_in).toBe('number');
}

function expectPaginatedProducts(body) {
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);
  expect(body.data[0]).toMatchObject({
    id: expect.any(String),
    name: expect.any(String),
    price: expect.any(Number),
  });
}

function expectInvoiceCreated(body, invoiceRequest) {
  expect(body.id).toBeTruthy();
  expect(body.invoice_number).toBeTruthy();
  expect(body.billing_street).toBe(invoiceRequest.billing_street);
  expect(body.billing_city).toBe(invoiceRequest.billing_city);
  expect(body.billing_state).toBe(invoiceRequest.billing_state);
  expect(body.billing_country).toBe(invoiceRequest.billing_country);
  expect(body.billing_postal_code).toBe(invoiceRequest.billing_postal_code);
  expect(typeof body.subtotal).toBe('number');
  expect(typeof body.total).toBe('number');
}

function expectInvoiceResponse(body, invoiceRequest) {
  expectInvoiceCreated(body, invoiceRequest);
  expect(body.status).toBeTruthy();
  expect(Array.isArray(body.invoicelines)).toBe(true);
  expect(body.invoicelines.length).toBeGreaterThan(0);
}

function expectUnauthorizedError(body) {
  const message = body.message || body.error;
  expect(message).toBeTruthy();
  expect(String(message).toLowerCase()).toContain('unauthorized');
}

function expectNotFoundError(body) {
  expect(body.message).toBeTruthy();
  expect(String(body.message).toLowerCase()).toMatch(/not found/);
}

function expectFieldValidationError(body, field) {
  const fieldErrors = body[field] || body.errors?.[field];
  expect(fieldErrors).toBeTruthy();
  expect(Array.isArray(fieldErrors)).toBe(true);
  expect(fieldErrors.length).toBeGreaterThan(0);
}

function expectConflictError(body, field) {
  if (body[field]) {
    expectFieldValidationError(body, field);
    return;
  }

  expect(body.message).toBeTruthy();
}

function extractCartProductIds(cartBody) {
  const collections = [
    cartBody.cart_items,
    cartBody.items,
    cartBody.products,
    cartBody.product_items,
  ].filter(Array.isArray);

  if (collections.length === 0) {
    return [];
  }

  return collections[0].map((item) => item.product_id || item.id || item.product?.id).filter(Boolean);
}

module.exports = {
  expectStatus,
  expectUserRegistration,
  expectTokenResponse,
  expectPaginatedProducts,
  expectInvoiceCreated,
  expectInvoiceResponse,
  expectUnauthorizedError,
  expectNotFoundError,
  expectFieldValidationError,
  expectConflictError,
  extractCartProductIds,
};
