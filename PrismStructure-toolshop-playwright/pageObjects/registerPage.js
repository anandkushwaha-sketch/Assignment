const { BasePage } = require('./basePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.getByRole('textbox', { name: /first name/i });
    this.lastNameInput = page.getByRole('textbox', { name: /last name/i });
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByRole('textbox', { name: /^password$/i });
    this.dobInput = page.locator('input[type="date"], input[name*="dob"], #dob').first();
    this.registerButton = page.getByRole('button', { name: /register/i });
  }

  async open() {
    await this.goto('/auth/register');
    await this.waitForPageLoad();
  }

  async register(user) {
    await this.firstNameInput.fill(user.first_name);
    await this.lastNameInput.fill(user.last_name);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);

    if (await this.dobInput.isVisible().catch(() => false)) {
      await this.dobInput.fill(user.dob);
    }

    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };
