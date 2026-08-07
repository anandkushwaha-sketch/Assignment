const { BasePage } = require('./basePage');
const { expect } = require('@playwright/test');
const { confirmInvoiceTwice } = require('../utils/checkoutHelper');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.billingStreet = page.getByLabel(/street/i);
    this.billingCity = page.getByLabel(/city/i);
    this.billingState = page.getByLabel(/state/i);
    this.billingCountry = page.getByLabel(/country/i);
    this.billingPostalCode = page.getByLabel(/postal|zip/i);
    this.cashOnDeliveryOption = page.getByLabel(/payment method/i);
    this.confirmButton = page.getByRole('button', { name: /confirm/i });
    this.proceedButton = page.getByRole('button', { name: /proceed|checkout|next|continue/i });
    this.billingHeading = page.getByRole('heading', { name: /billing address/i });
    this.paymentHeading = page.getByRole('heading', { name: /payment/i });
    this.emptyCartMessage = page.getByText(/cart is empty|no items|add products|your cart is empty/i);
    this.successMessage = page.getByRole('alert').or(page.getByText(/invoice|order|success|thank you/i));
  }

  async open() {
    await this.goto('/checkout');
    await this.waitForPageLoad();
  }

  async advanceCheckoutStep(stepHeading) {
    for (let step = 0; step < 6; step += 1) {
      if (await stepHeading.isVisible()) {
        return;
      }

      const proceedButton = this.proceedButton.first();
      if (await proceedButton.isVisible()) {
        await proceedButton.click();
      }
    }

    await stepHeading.waitFor({ state: 'visible' });
  }

  async proceedToBillingIfNeeded() {
    await this.advanceCheckoutStep(this.billingHeading);
  }

  async fillBillingAddress(billing) {
    if (await this.billingCountry.isVisible()) {
      if (await this.billingCountry.evaluate((element) => element.tagName === 'SELECT')) {
        await this.billingCountry.selectOption({ label: billing.billing_country });
      } else {
        await this.billingCountry.fill(billing.billing_country);
      }
    }

    await this.billingPostalCode.fill(billing.billing_postal_code);
    await expect(this.billingStreet).not.toHaveValue('', { timeout: 10_000 });

    const streetValue = await this.billingStreet.inputValue();
    if (!streetValue) {
      await this.billingStreet.fill(billing.billing_street);
    }

    const cityValue = await this.billingCity.inputValue();
    if (!cityValue) {
      await this.billingCity.fill(billing.billing_city);
    }

    const stateValue = await this.billingState.inputValue();
    if (!stateValue) {
      await this.billingState.fill(billing.billing_state);
    }
  }

  async proceedToPaymentIfNeeded() {
    await this.advanceCheckoutStep(this.paymentHeading);
  }

  async selectCashOnDelivery() {
    await this.cashOnDeliveryOption.selectOption('cash-on-delivery');
  }

  async confirmOrderTwice() {
    await confirmInvoiceTwice(this.page, this.confirmButton);
    await expect(this.page.getByText(/thanks for your order|invoice number is/i)).toBeVisible({
      timeout: 15_000,
    });
  }

  async completeCashOnDeliveryCheckout(billing) {
    await this.proceedToBillingIfNeeded();
    await this.fillBillingAddress(billing);

    const billingProceed = this.proceedButton.first();
    if (await billingProceed.isVisible()) {
      await billingProceed.click();
    }

    await this.proceedToPaymentIfNeeded();
    await this.selectCashOnDelivery();
    await this.confirmOrderTwice();
  }
}

module.exports = { CheckoutPage };
