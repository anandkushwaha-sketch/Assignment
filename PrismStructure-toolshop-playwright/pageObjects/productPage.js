const { BasePage } = require('./basePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.productName = page.locator('h1, [data-test="product-name"]').first();
    this.productPrice = page.locator('[data-test="product-price"], .price').first();
    this.stockStatus = page.getByText(/in stock|out of stock/i);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async getProductName() {
    return this.productName.innerText();
  }
}

module.exports = { ProductPage };
