# Toolshop QA Assessment

Playwright automation (UI + API) for the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/), built with the Prism Page Object Model pattern. This repo also contains manual test cases, planning documents, and AI-assisted workflow documentation.

| Layer | URL |
|-------|-----|
| UI | https://practicesoftwaretesting.com/ |
| API | https://api.practicesoftwaretesting.com |

For workflow details, risk analysis, and coverage mapping, see [`project-info.md`](project-info.md).

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Node.js** | LTS recommended (v18+). Required to run Playwright. |
| **npm** | Ships with Node.js. |
| **Git** | To clone the repository. |
| **Network access** | Tests run against the public practice UI and API. |

Browser: tests run on **Chromium** (Desktop Chrome) — install via Playwright CLI after `npm install`.

---

## Installation

Clone the repo and install dependencies from the automation project folder:

```bash
git clone https://github.com/anandkushwaha-sketch/Assignment.git
cd Assignment/PrismStructure-toolshop-playwright
npm install
npx playwright install chromium
```

`npm install` installs:

- `@playwright/test` (^1.51.0)
- `dotenv` (^16.4.7)

---

## Configuration

Environment variables are optional. Defaults point at the public practice application.

1. Copy the example file:

```bash
cp .env.example .env
```

2. Edit `.env` only if you need different URLs:

```env
BASE_URL=https://practicesoftwaretesting.com
API_BASE_URL=https://api.practicesoftwaretesting.com
```

**Security notes:**

- `.env` is **gitignored** — never commit it.
- Only `.env.example` is tracked in the repo.
- No API keys or production credentials are required; the practice app uses public registration/login.
- Test users are created dynamically at runtime (unique email per run).

Configuration is loaded in `playwright.config.js` via `dotenv` and read through `utils/env.js`. If `.env` is missing, defaults from `utils/env.js` are used.

---

## Test Data

Static defaults and fixtures live under `PrismStructure-toolshop-playwright/test-data/`:

| File | Purpose |
|------|---------|
| `user.defaults.json` | Base first/last name, DOB, phone, address, and password template |
| `billing.json` | Default COD billing address and payment method |

Runtime data is built in `utils/dataGenerator.js` and `utils/invoiceHelper.js`:

- **Users** — unique email (`testuser+{timestamp}@example.com`) and password per run
- **Products** — fetched from the live API (`in_stock` filter); UI tests verify purchasability before add-to-cart
- **Invalid IDs** — synthetic IDs for negative API tests (`invalidResourceId()`)

Manual test steps and sample data: [`FunctionalTestCase.csv`](FunctionalTestCase.csv).

---

## Running Tests

All commands below are run from `PrismStructure-toolshop-playwright/`:

```bash
cd PrismStructure-toolshop-playwright
```

| Command | What it runs | npm script |
|---------|--------------|------------|
| All tests | Full suite (`tests/`) | `npm test` |
| UI only | `tests/ui/` | `npm run test:ui` |
| API only | `tests/api/` | `npm run test:api` |
| Smoke | Tests tagged `@smoke` | `npm run test:smoke` |
| Regression | Tests tagged `@regression` | `npm run test:regression` |

### Examples

```bash
# Full suite (7 UI + 7 API = 14 tests)
npm test

# By layer
npm run test:ui
npm run test:api

# By tag
npm run test:smoke      # 3 tests
npm run test:regression # 13 tests (includes smoke paths also tagged @regression)
```

### Playwright configuration (verified)

From `playwright.config.js`:

| Setting | Value |
|---------|-------|
| `testDir` | `./tests` |
| Browser | Chromium (Desktop Chrome) |
| `fullyParallel` | `true` |
| `timeout` | 60s per test |
| `expect.timeout` | 10s |
| `retries` | 1 when `CI` is set, else 0 |
| `workers` | 1 when `CI` is set, else default |
| `baseURL` | `BASE_URL` env or `https://practicesoftwaretesting.com` |
| `testIdAttribute` | `data-test` |
| Trace | `on-first-retry` |
| Screenshot | `only-on-failure` |
| Video | `retain-on-failure` |

Run a single spec or test (Playwright CLI, not an npm script):

```bash
npx playwright test tests/ui/auth.spec.js
npx playwright test -g "TC-UI-01"
```

---

## Reports

Reports are generated automatically on every test run (configured in `playwright.config.js`).

| Reporter | Output | Location |
|----------|--------|----------|
| `list` | Console output | Terminal |
| `html` | Interactive HTML report | `playwright-report/` |
| `json` | Machine-readable results | `reports/test-results.json` |

### View HTML report

```bash
npm run report
```

This runs `playwright show-report playwright-report` and opens a local server for the last HTML report.

**Note:** `playwright-report/`, `test-results/`, and `reports/*.json` are gitignored. Generate them locally after cloning.

On failure, artifacts (screenshots, video, trace) are stored under `test-results/`.

---

## Repository Structure

```
Assignment/
├── README.md                          # This file
├── project-info.md                    # AI workflow, strategy, and coverage
├── FunctionalTestCase.csv             # 8 manual test cases
├── docs/
│   ├── 01-requirements-analysis.md
│   ├── 02-application-analysis.md
│   ├── 03-requirement-and-risk-analysis.md
│   ├── 04-api-investigation.md
│   └── api-docs.json
└── PrismStructure-toolshop-playwright/
    ├── package.json                   # npm scripts
    ├── playwright.config.js           # Playwright + reporters
    ├── .env.example                   # Environment template (safe to commit)
    ├── fixtures/
    │   └── prism.fixture.js           # Page/API object + data fixtures
    ├── pageObjects/                   # UI Page Object Model
    ├── apiPages/                      # API Page Object Model
    ├── utils/                         # env, dataGenerator, assertions, helpers
    ├── test-data/                     # user.defaults.json, billing.json
    ├── tests/
    │   ├── ui/                        # 7 UI specs
    │   └── api/                       # 7 API specs
    ├── reports/                       # JSON report output (.gitkeep tracked)
    ├── playwright-report/             # HTML report (generated, gitignored)
    └── test-results/                  # Failure artifacts (generated, gitignored)
```

### Test inventory

| Type | Count | Location |
|------|-------|----------|
| Manual | 8 | `FunctionalTestCase.csv` |
| UI | 7 | `tests/ui/*.spec.js` |
| API | 7 | `tests/api/*.spec.js` |

---

## Known Application Behavior

### Invoice double confirmation (UI only)

On the checkout page, the **Confirm** button must be clicked **twice** to complete invoice generation. A single click does not create an invoice (covered manually in `TC-MAN-08`).

Automation handles this in `utils/checkoutHelper.js` (`confirmInvoiceTwice`):

1. Click **Confirm**
2. Wait for **"Payment was successful"**
3. Click **Confirm** again

The API creates an invoice with a single `POST /invoices` — no double-confirm on the API path.

### Cash on Delivery only

Assessment scope uses **Cash on Delivery** (`cash-on-delivery`). Other payment methods are out of scope.

### Stock vs purchasability

The API `in_stock` flag does not always match whether the UI **Add to cart** button is enabled. UI tests use `productPage.findPurchasableProducts()` to probe the live UI before adding items.

### API response quirks (used by assertions)

| Behavior | Detail |
|----------|--------|
| Login token | `token_type` is lowercase `"bearer"` |
| Invalid product on cart add | HTTP **422** with `errors.product_id` (not 404) |
| Invoice create | HTTP **201**; full line items verified on subsequent GET |

---

## Troubleshooting

### `playwright: command not found` or browser missing

```bash
cd PrismStructure-toolshop-playwright
npm install
npx playwright install chromium
```

### Tests fail with wrong base URL

Confirm `.env` values or remove `.env` to use defaults from `utils/env.js`. UI uses `BASE_URL`; API uses `API_BASE_URL`.

### `TC-UI-06` purchase flow timeout

Common causes:

- Checkout **Confirm** not clicked twice — see [Invoice double confirmation](#invoice-double-confirmation-ui-only)
- Billing fields not filled — country/postal may need `selectOption` and auto-fill wait
- Parallel runs against a slow network — re-run, or set `CI=1` for single worker and one retry:

```bash
# PowerShell
$env:CI=1; npm run test:ui

# Bash
CI=1 npm run test:ui
```

### `TC-API-04` or other API tests timeout

The public API can be slow intermittently. Re-run the suite. Persistent timeouts usually indicate network or API availability issues, not local config.

### Empty HTML report or `npm run report` fails

Run any test command first to generate `playwright-report/`:

```bash
npm test
npm run report
```

### Strict mode / locator errors

UI locators use `data-test` attributes (`testIdAttribute: 'data-test'` in config). If the application changes, update the matching page object under `pageObjects/`.

### Secrets accidentally committed

- Never commit `.env`
- Do not commit `playwright-report/`, `test-results/`, or `reports/test-results.json` (gitignored)
- Scan artifacts for bearer tokens before sharing

---

## Related Documentation

- [`project-info.md`](project-info.md) — scope, risk analysis, AI workflow, reuse guide
- [`docs/03-requirement-and-risk-analysis.md`](docs/03-requirement-and-risk-analysis.md) — detailed risk matrix
- [`docs/04-api-investigation.md`](docs/04-api-investigation.md) — API endpoints and status codes

---

*Practice Software Testing Toolshop — QA Practical Assessment | Playwright + Prism POM*
