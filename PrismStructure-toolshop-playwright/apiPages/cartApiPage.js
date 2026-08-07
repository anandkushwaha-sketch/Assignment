const { BaseApiPage } = require('./baseApiPage');

class CartApiPage extends BaseApiPage {
  buildOptions(token, data) {
    const options = {};
    if (data) {
      options.data = data;
    }
    if (token) {
      options.headers = this.authHeaders(token);
    }
    return options;
  }

  async createCart(token) {
    return this.post('/carts', this.buildOptions(token));
  }

  async getCart(cartId, token) {
    return this.get(`/carts/${cartId}`, this.buildOptions(token));
  }

  async addProduct(cartId, productId, quantity = 1, token) {
    return this.post(
      `/carts/${cartId}`,
      this.buildOptions(token, {
        product_id: productId,
        quantity,
      })
    );
  }

  async updateQuantity(cartId, productId, quantity, token) {
    return this.put(
      `/carts/${cartId}/product/quantity`,
      this.buildOptions(token, {
        product_id: productId,
        quantity,
      })
    );
  }

  async createCartAndGetId(token) {
    const response = await this.createCart(token);
    const body = await response.json();
    return { response, cartId: body.id, body };
  }
}

module.exports = { CartApiPage };
