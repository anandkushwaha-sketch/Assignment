const { BaseApiPage } = require('./baseApiPage');

class AuthApiPage extends BaseApiPage {
  async register(user) {
    return this.post('/users/register', {
      data: user,
    });
  }

  async login(email, password) {
    return this.post('/users/login', {
      data: { email, password },
    });
  }

  async getCurrentUser(token) {
    if (!token) {
      return this.get('/users/me');
    }

    return this.get('/users/me', {
      headers: this.authHeaders(token),
    });
  }

  async loginAndGetToken(email, password) {
    const response = await this.login(email, password);
    const body = await response.json();
    return body.access_token;
  }
}

module.exports = { AuthApiPage };
