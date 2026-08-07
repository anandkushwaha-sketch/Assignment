const path = require('path');
const base = require('./playwright.config');

const reportsDir = path.join(__dirname, '..', 'Reports');

module.exports = {
  ...base,
  retries: 0,
  workers: 1,
  outputDir: path.join(reportsDir, 'test-artifacts'),
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(reportsDir, 'playwright-html-report'), open: 'never' }],
    ['json', { outputFile: path.join(reportsDir, 'playwright-test-results.json') }],
  ],
  use: {
    ...base.use,
    video: 'on',
    screenshot: 'on',
    trace: 'on',
  },
};
