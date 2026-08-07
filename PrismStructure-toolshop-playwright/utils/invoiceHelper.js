const billingDefaults = require('../test-data/billing.json');

function buildBillingAddress(overrides = {}) {
  return {
    ...billingDefaults,
    ...overrides,
    payment_details: overrides.payment_details || {},
  };
}

function buildInvoicePayload(cartId, overrides = {}) {
  return {
    ...buildBillingAddress(),
    cart_id: cartId,
    ...overrides,
  };
}

module.exports = {
  buildBillingAddress,
  buildInvoicePayload,
};
