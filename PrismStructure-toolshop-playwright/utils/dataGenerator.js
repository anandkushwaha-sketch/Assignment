const userDefaults = require('../test-data/user.defaults.json');

function uniqueEmail(prefix = 'testuser') {
  const timestamp = Date.now();
  return `${prefix}+${timestamp}@example.com`;
}

function buildUser(overrides = {}) {
  return {
    first_name: userDefaults.first_name,
    last_name: userDefaults.last_name,
    email: uniqueEmail(),
    password: userDefaults.password,
    dob: userDefaults.dob,
    phone: userDefaults.phone,
    address: { ...userDefaults.address },
    ...overrides,
  };
}

function buildLoginPayload(email, password = userDefaults.password) {
  return { email, password };
}

module.exports = {
  uniqueEmail,
  buildUser,
  buildLoginPayload,
};
