const { BaseApiPage } = require('./baseApiPage');

class CartApiPage extends BaseApiPage {
  async createCart() {
    return this.post('/carts');
  }

  async getCart(cartId, token) {
    return this.get(`/carts/${cartId}`, {
      headers: this.authHeaders(token),
    });
  }

  async addProduct(cartId, productId, token) {
    return this.post(`/carts/${cartId}/product/${productId}`, {
      headers: this.authHeaders(token),
    });
  }

  async updateQuantity(cartId, productId, quantity, token) {
    return this.put(`/carts/${cartId}/product/quantity`, {
      headers: this.authHeaders(token),
      data: {
        product_id: productId,
        quantity,
      },
    });
  }

  async createCartAndGetId(token) {
    const response = await this.createCart();
    const body = await response.json();
    return body.id;
  }
}

module.exports = { CartApiPage };
