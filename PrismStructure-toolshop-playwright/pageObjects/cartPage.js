const { BasePage } = require('./basePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartIcon = page.getByTestId('nav-cart');
    this.cartItems = page.locator('[data-test="cart-item"], table tbody tr, .cart-item');
    this.quantityInputs = page.locator('input[type="number"], [data-test="product-quantity"]');
    this.lineTotals = page.locator('[data-test="line-total"], .line-total, td.text-end');
    this.subtotal = page.getByText(/subtotal|total/i).locator('..').locator('span, strong, td').last();
    this.proceedButton = page.getByRole('button', { name: /proceed|checkout|next/i }).or(
      page.getByRole('link', { name: /proceed|checkout|next/i })
    );
  }

  async openCart() {
    await this.goto('/checkout');
    await this.waitForPageLoad();
  }

  async getCartBadgeCount() {
    const badgeText = await this.cartIcon.innerText();
    const count = parseInt(badgeText.replace(/\D/g, ''), 10);
    return Number.isNaN(count) ? 0 : count;
  }

  async getItemCount() {
    return this.cartItems.count();
  }

  async updateFirstItemQuantity(quantity) {
    const quantityInput = this.quantityInputs.first();
    await quantityInput.fill(String(quantity));
    await quantityInput.press('Tab');
  }

  async getFirstItemQuantity() {
    return parseInt(await this.quantityInputs.first().inputValue(), 10);
  }

  async proceedToNextStep() {
    if (await this.proceedButton.isVisible()) {
      await this.proceedButton.click();
    }
  }
}

module.exports = { CartPage };
