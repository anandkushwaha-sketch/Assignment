const { BaseApiPage } = require('./baseApiPage');

class ProductApiPage extends BaseApiPage {
  async getProducts() {
    return this.get('/products');
  }

  async searchProducts(query) {
    return this.get('/products/search', {
      params: { q: query },
    });
  }

  async getProductById(productId) {
    return this.get(`/products/${productId}`);
  }

  async getInStockProducts(minCount = 1) {
    const response = await this.getProducts();
    const body = await response.json();
    const products = (body.data || body).filter((product) => product.in_stock === true);

    if (products.length < minCount) {
      throw new Error(`Need at least ${minCount} in-stock products, found ${products.length}`);
    }

    return { response, products };
  }

  async getFirstInStockProduct() {
    const { products } = await this.getInStockProducts(1);
    return products[0];
  }

  async getFirstOutOfStockProduct() {
    const response = await this.getProducts();
    const body = await response.json();
    const products = body.data || body;
    return products.find((product) => product.in_stock === false);
  }
}

module.exports = { ProductApiPage };
