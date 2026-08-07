const { BasePage } = require('./basePage');

class CatalogPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByPlaceholder(/search/i);
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.productCards = page.locator('[data-test="product-name"], .card-title, .product-title');
  }

  async open() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  async browseCatalog() {
    await this.open();
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  async searchProduct(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  productByName(name) {
    return this.page.getByRole('link', { name: new RegExp(name, 'i') }).first();
  }

  noResultsMessage() {
    return this.page.getByText(/no products|no results|not found|0 products/i);
  }

  async searchAndOpenProduct(keyword) {
    await this.searchProduct(keyword);
    await this.productByName(keyword).click();
  }
}

module.exports = { CatalogPage };
