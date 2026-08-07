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
    const addItemResponse = this.page.waitForResponse(async (response) => {
      if (response.request().method() !== 'POST' || !response.url().includes('/carts') || !response.ok()) {
        return false;
      }

      const body = await response.json().catch(() => ({}));
      return /item added|updated/i.test(body.result || '');
    });

    await this.addToCartButton.click();
    await addItemResponse;
  }

  async openPurchasableProduct(product) {
    await this.openById(product.id);

    if (await this.addToCartButton.isEnabled()) {
      return product;
    }

    return null;
  }

  async findPurchasableProducts(products, count = 2) {
    const selected = [];

    for (const product of products) {
      if (selected.some((item) => item.id === product.id)) {
        continue;
      }

      await this.openById(product.id);

      if (await this.addToCartButton.isEnabled()) {
        selected.push(product);
      }

      if (selected.length === count) {
        return selected;
      }
    }

    throw new Error(`Could not find ${count} purchasable products in the UI`);
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
