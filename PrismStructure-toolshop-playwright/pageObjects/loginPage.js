const { BasePage } = require('./basePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.loginButton = page.getByRole('button', { name: /login/i });
    this.registerLink = page.getByRole('link', { name: /register/i });
    this.errorAlert = page.getByRole('alert');
  }

  async open() {
    await this.goto('/auth/login');
    await this.waitForPageLoad();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  userMenu() {
    return this.page.getByTestId('nav-menu');
  }
}

module.exports = { LoginPage };
