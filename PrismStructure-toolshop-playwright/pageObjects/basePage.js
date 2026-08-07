const { getBaseUrl } = require('../utils/env');

class BasePage {
  constructor(page) {
    this.page = page;
    this.baseUrl = getBaseUrl();
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { BasePage };
