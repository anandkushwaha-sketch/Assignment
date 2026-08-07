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

  async getFirstInStockProduct() {
    const response = await this.getProducts();
    const body = await response.json();
    const products = body.data || body;
    return products.find((product) => product.in_stock === true);
  }

  async getFirstOutOfStockProduct() {
    const response = await this.getProducts();
    const body = await response.json();
    const products = body.data || body;
    return products.find((product) => product.in_stock === false);
  }
}

module.exports = { ProductApiPage };
