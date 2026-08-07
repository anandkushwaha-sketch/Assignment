# PrismStructure — Toolshop Playwright

Minimum Playwright JavaScript framework for UI and API testing of [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/).

## Setup

```bash
cd PrismStructure-toolshop-playwright
cp .env.example .env
npm install
npx playwright install chromium
```

## Run tests

```bash
npm test                 # all tests
npm run test:smoke       # @smoke tagged tests
npm run test:regression  # @regression tagged tests
npm run test:ui          # UI specs only
npm run test:api         # API specs only
npm run report           # open HTML report
```

Tag tests in titles, e.g. `test('register user @smoke', ...)`.

## Structure

- `pageObjects/` — UI Page Object Model classes
- `apiPages/` — API helper classes (Prism pattern)
- `fixtures/` — Playwright `test.extend` injection
- `utils/` — env, data generators, checkout helpers
- `test-data/` — static JSON fixtures (no credentials)
- `tests/ui/` — UI spec files
- `tests/api/` — API spec files
- `reports/` — JSON/HTML execution output
