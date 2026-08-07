const { BasePage } = require('./basePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.dobInput = page.getByLabel(/date of birth|dob/i);
    this.phoneInput = page.getByLabel(/phone/i);
    this.streetInput = page.getByLabel(/street/i);
    this.houseNumberInput = page.getByLabel(/house number|house no/i);
    this.cityInput = page.getByLabel(/city/i);
    this.stateInput = page.getByLabel(/state/i);
    this.countryInput = page.getByLabel(/country/i);
    this.postalCodeInput = page.getByLabel(/postal|zip/i);
    this.registerButton = page.getByRole('button', { name: /register/i });
    this.successAlert = page.getByRole('alert');
  }

  async open() {
    await this.goto('/auth/register');
    await this.waitForPageLoad();
  }

  async register(user) {
    await this.firstNameInput.fill(user.first_name);
    await this.lastNameInput.fill(user.last_name);

    if (await this.dobInput.isVisible()) {
      await this.dobInput.fill(user.dob);
    }

    if (await this.countryInput.isVisible()) {
      await this.countryInput.selectOption({ label: user.address.country });
    }

    if (await this.postalCodeInput.isVisible()) {
      await this.postalCodeInput.fill(user.address.postal_code);
    }

    if (await this.houseNumberInput.isVisible()) {
      await this.houseNumberInput.fill(user.address.house_number);
    }

    if (await this.streetInput.isVisible()) {
      await this.streetInput.waitFor({ state: 'visible' });
      const streetValue = await this.streetInput.inputValue();
      if (!streetValue) {
        await this.streetInput.fill(user.address.street);
      }
    }

    if (await this.cityInput.isVisible()) {
      const cityValue = await this.cityInput.inputValue();
      if (!cityValue) {
        await this.cityInput.fill(user.address.city);
      }
    }

    if (await this.stateInput.isVisible()) {
      const stateValue = await this.stateInput.inputValue();
      if (!stateValue) {
        await this.stateInput.fill(user.address.state);
      }
    }

    if (await this.phoneInput.isVisible()) {
      await this.phoneInput.fill(user.phone);
    }

    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };
