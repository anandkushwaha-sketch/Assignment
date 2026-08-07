const { BasePage } = require('./basePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItems = page.locator('[data-test="cart-item"], .cart-item, table tbody tr');
    this.quantityInput = page.locator('input[type="number"], [data-test="product-quantity"]').first();
    this.increaseButton = page.getByRole('button', { name: /\+|increase/i }).first();
    this.decreaseButton = page.getByRole('button', { name: /-|decrease/i }).first();
    this.checkoutButton = page.getByRole('link', { name: /checkout|proceed/i }).or(
      page.getByRole('button', { name: /checkout|proceed/i })
    );
    this.cartIcon = page.locator('[data-test="nav-cart"], a[href*="cart"], .fa-cart-shopping').first();
  }

  async openCart() {
    if (await this.cartIcon.isVisible().catch(() => false)) {
      await this.cartIcon.click();
      return;
    }
    await this.goto('/checkout');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async setQuantity(quantity) {
    await this.quantityInput.fill(String(quantity));
    await this.quantityInput.press('Tab');
  }
}

module.exports = { CartPage };
