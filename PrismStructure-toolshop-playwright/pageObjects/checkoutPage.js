const { BasePage } = require('./basePage');
const { confirmInvoiceTwice } = require('../utils/checkoutHelper');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.billingStreet = page.getByRole('textbox', { name: /street/i });
    this.billingCity = page.getByRole('textbox', { name: /city/i });
    this.billingState = page.getByRole('textbox', { name: /state/i });
    this.billingCountry = page.getByRole('textbox', { name: /country/i });
    this.billingPostalCode = page.getByRole('textbox', { name: /postal|zip/i });
    this.cashOnDeliveryOption = page.getByLabel(/cash on delivery/i).or(
      page.getByText(/cash on delivery/i)
    );
    this.confirmButton = page.getByRole('button', { name: /confirm/i });
    this.placeOrderButton = page.getByRole('button', { name: /place order|confirm|pay/i });
  }

  async open() {
    await this.goto('/checkout');
    await this.waitForPageLoad();
  }

  async fillBillingAddress(billing) {
    await this.billingStreet.fill(billing.billing_street);
    await this.billingCity.fill(billing.billing_city);
    await this.billingState.fill(billing.billing_state);
    await this.billingCountry.fill(billing.billing_country);
    await this.billingPostalCode.fill(billing.billing_postal_code);
  }

  async selectCashOnDelivery() {
    await this.cashOnDeliveryOption.click();
  }

  async confirmOrderTwice() {
    await confirmInvoiceTwice(this.page, this.confirmButton);
  }

  async completeCashOnDeliveryCheckout(billing) {
    await this.fillBillingAddress(billing);
    await this.selectCashOnDelivery();
    await this.confirmOrderTwice();
  }
}

module.exports = { CheckoutPage };
