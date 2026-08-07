const userDefaults = require('../test-data/user.defaults.json');

function uniqueEmail(prefix = 'testuser') {
  const timestamp = Date.now();
  return `${prefix}+${timestamp}@example.com`;
}

function uniquePassword() {
  return `${userDefaults.password}${Date.now().toString().slice(-4)}`;
}

function buildUser(overrides = {}) {
  return {
    first_name: userDefaults.first_name,
    last_name: userDefaults.last_name,
    email: uniqueEmail(),
    password: uniquePassword(),
    dob: userDefaults.dob,
    phone: userDefaults.phone,
    address: { ...userDefaults.address },
    ...overrides,
  };
}

function buildLoginPayload(email, password) {
  return { email, password };
}

function invalidResourceId(suffix = 'Z') {
  return `01ZZZZZZZZZZZZZZZZZZZZZZZ${suffix}`;
}

module.exports = {
  uniqueEmail,
  uniquePassword,
  buildUser,
  buildLoginPayload,
  invalidResourceId,
};
