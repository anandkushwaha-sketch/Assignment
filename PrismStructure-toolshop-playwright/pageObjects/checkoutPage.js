const { BasePage } = require('./basePage');
const { confirmInvoiceTwice } = require('../utils/checkoutHelper');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.billingStreet = page.getByLabel(/street/i);
    this.billingCity = page.getByLabel(/city/i);
    this.billingState = page.getByLabel(/state/i);
    this.billingCountry = page.getByLabel(/country/i);
    this.billingPostalCode = page.getByLabel(/postal|zip/i);
    this.cashOnDeliveryOption = page.getByLabel(/cash on delivery/i).or(
      page.getByRole('radio', { name: /cash on delivery/i })
    ).or(page.getByText(/cash on delivery/i));
    this.confirmButton = page.getByRole('button', { name: /confirm/i });
    this.proceedButton = page.getByRole('button', { name: /proceed|next|continue/i });
    this.emptyCartMessage = page.getByText(/cart is empty|no items|add products|your cart is empty/i);
    this.successMessage = page.getByRole('alert').or(page.getByText(/invoice|order|success/i));
  }

  async open() {
    await this.goto('/checkout');
    await this.waitForPageLoad();
  }

  async proceedToBillingIfNeeded() {
    const maxSteps = 3;
    for (let step = 0; step < maxSteps; step += 1) {
      if (await this.billingStreet.isVisible()) {
        return;
      }

      if (await this.proceedButton.isVisible()) {
        await this.proceedButton.click();
      }
    }

    await this.billingStreet.waitFor({ state: 'visible' });
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
    await this.proceedToBillingIfNeeded();
    await this.fillBillingAddress(billing);
    await this.selectCashOnDelivery();
    await this.confirmOrderTwice();
  }
}

module.exports = { CheckoutPage };
