const { BasePage } = require('./basePage');
const { expect } = require('@playwright/test');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameField = page.getByLabel(/first name/i);
    this.lastNameField = page.getByLabel(/last name/i);
    this.emailField = page.getByLabel(/email/i);
    this.pageTitle = page.getByTestId('page-title');
  }

  async open() {
    await this.goto('/account/profile');
    await this.waitForPageLoad();
  }

  async getProfileDetails() {
    await expect(this.firstNameField).not.toHaveValue('', { timeout: 15_000 });

    return {
      firstName: await this.firstNameField.inputValue(),
      lastName: await this.lastNameField.inputValue(),
      email: await this.emailField.inputValue(),
    };
  }
}

module.exports = { ProfilePage };
