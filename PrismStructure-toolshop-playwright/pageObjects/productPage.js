const { BasePage } = require('./basePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.productName = page.locator('h1, [data-test="product-name"]').first();
    this.productPrice = page.locator('[data-test="product-price"], .product-price, .price').first();
    this.inStockStatus = page.getByText(/in stock/i);
    this.outOfStockStatus = page.getByText(/out of stock/i);
  }

  async openById(productId) {
    await this.goto(`/product/${productId}`);
    await this.waitForPageLoad();
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async getProductName() {
    return (await this.productName.innerText()).trim();
  }

  async getProductPrice() {
    const priceText = await this.productPrice.innerText();
    return parseFloat(priceText.replace(/[^0-9.]/g, ''));
  }
}

module.exports = { ProductPage };
