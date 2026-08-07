const { getApiBaseUrl } = require('../utils/env');

class BaseApiPage {
  constructor(request) {
    this.request = request;
    this.baseURL = getApiBaseUrl();
  }

  url(path) {
    return `${this.baseURL}${path}`;
  }

  authHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  async get(path, options = {}) {
    return this.request.get(this.url(path), options);
  }

  async post(path, options = {}) {
    return this.request.post(this.url(path), options);
  }

  async put(path, options = {}) {
    return this.request.put(this.url(path), options);
  }

  async delete(path, options = {}) {
    return this.request.delete(this.url(path), options);
  }
}

module.exports = { BaseApiPage };
