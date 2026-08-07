const DEFAULT_BASE_URL = 'https://practicesoftwaretesting.com';
const DEFAULT_API_BASE_URL = 'https://api.practicesoftwaretesting.com';

function getBaseUrl() {
  return process.env.BASE_URL || DEFAULT_BASE_URL;
}

function getApiBaseUrl() {
  return process.env.API_BASE_URL || DEFAULT_API_BASE_URL;
}

module.exports = {
  getBaseUrl,
  getApiBaseUrl,
  DEFAULT_BASE_URL,
  DEFAULT_API_BASE_URL,
};
