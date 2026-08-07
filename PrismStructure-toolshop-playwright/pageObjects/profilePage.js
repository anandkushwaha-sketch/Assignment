const { BasePage } = require('./basePage');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameField = page.locator('[data-test="first-name"], #first-name, input[name="first_name"]');
    this.lastNameField = page.locator('[data-test="last-name"], #last-name, input[name="last_name"]');
    this.emailField = page.locator('[data-test="email"], #email, input[name="email"]');
  }

  async open() {
    await this.goto('/account/profile');
    await this.waitForPageLoad();
  }

  async getProfileDetails() {
    return {
      firstName: await this.firstNameField.inputValue(),
      lastName: await this.lastNameField.inputValue(),
      email: await this.emailField.inputValue(),
    };
  }
}

module.exports = { ProfilePage };
