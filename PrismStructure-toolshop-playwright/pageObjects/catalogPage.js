const { BasePage } = require('./basePage');

class CatalogPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByPlaceholder(/search/i);
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.productCards = page.locator('.card, [data-test="product-name"], .product');
  }

  async open() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async searchProduct(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  productByName(name) {
    return this.page.getByRole('link', { name: new RegExp(name, 'i') }).first();
  }

  async openProduct(name) {
    await this.productByName(name).click();
  }
}

module.exports = { CatalogPage };
