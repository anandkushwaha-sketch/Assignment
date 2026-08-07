const { test, expect } = require('../../fixtures/prism.fixture');

test.describe('Authentication', () => {
  test('TC-UI-01 register and login with valid user @smoke', async ({
    page,
    registerPage,
    loginPage,
    profilePage,
    testUser,
  }) => {
    await registerPage.open();
    await registerPage.register(testUser);

    await expect(page).not.toHaveURL(/\/auth\/register/);

    await loginPage.open();
    await loginPage.login(testUser.email, testUser.password);

    await expect(page).not.toHaveURL(/\/auth\/login/);
    await expect(loginPage.userMenu()).toContainText(testUser.first_name);

    await profilePage.open();
    await expect(profilePage.pageTitle).toContainText(/profile|account/i);

    const profile = await profilePage.getProfileDetails();
    expect(profile.firstName).toBe(testUser.first_name);
    expect(profile.lastName).toBe(testUser.last_name);
    expect(profile.email).toBe(testUser.email);
  });

  test('TC-UI-03 login with invalid credentials shows error @regression', async ({
    page,
    loginPage,
  }) => {
    const invalidEmail = `invalid+${Date.now()}@example.com`;
    const invalidPassword = 'WrongPass@99';

    await loginPage.open();
    await loginPage.login(invalidEmail, invalidPassword);

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).not.toBeEmpty();
  });
});
