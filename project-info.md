# Project Info — Toolshop QA Assessment

## Project Summary

This repository documents an AI-assisted QA workflow for the **Practice Software Testing Toolshop** assessment. Work spans requirements analysis, manual test design, and Playwright automation using the **Prism Page Object Model** pattern in JavaScript.

Deliverables in the repo:

| Artifact | Location |
|----------|----------|
| Requirements and planning docs | `docs/` |
| Manual test suite (8 cases) | `FunctionalTestCase.csv` |
| Playwright automation framework | `PrismStructure-toolshop-playwright/` |
| API reference (OpenAPI export) | `docs/api-docs.json`, `docs/04-api-investigation.md` |

Automation is organized by **UI** (`tests/ui/`), **API** (`tests/api/`), and **Smoke / Regression** tags. Execution reports are produced locally under `playwright-report/` (HTML) and `reports/test-results.json` (JSON); these paths are gitignored.

---

## Application Under Test

| Layer | URL |
|-------|-----|
| **UI** | https://practicesoftwaretesting.com/ |
| **API** | https://api.practicesoftwaretesting.com |
| **API docs** | https://api.practicesoftwaretesting.com/api/documentation |

The Toolshop is an e-commerce SPA (Angular) backed by a Laravel REST API. Core user journeys:

1. Register and log in
2. Browse/search products and manage a cart
3. Complete **Cash on Delivery (COD)** checkout
4. Generate an invoice (UI requires **Confirm clicked twice**)
5. View invoices under **My Invoices**

Key routes exercised by automation: `/auth/register`, `/auth/login`, `/account/profile`, `/`, `/product/{id}`, `/checkout`, `/account/invoices`.

---

## Tools Used

| Tool | Role |
|------|------|
| **Playwright (JS)** | UI and API automation via `@playwright/test` |
| **Prism POM** | Page objects (`pageObjects/`), API pages (`apiPages/`), custom fixture (`fixtures/prism.fixture.js`) |
| **dotenv** | Environment configuration (`BASE_URL`, `API_BASE_URL`) |
| **Cursor AI** | Planning, test design, scaffolding, debugging, and documentation |
| **Git** | Iterative commits per assessment phase |

**npm scripts** (`PrismStructure-toolshop-playwright/package.json`):

| Command | Purpose |
|---------|---------|
| `npm test` | Run all Playwright tests |
| `npm run test:ui` | UI specs only (`tests/ui/`) |
| `npm run test:api` | API specs only (`tests/api/`) |
| `npm run test:smoke` | Tests tagged `@smoke` |
| `npm run test:regression` | Tests tagged `@regression` |
| `npm run report` | Open HTML report viewer |

Browser: **Chromium** (Desktop Chrome profile). Reporters: `list`, `html`, `json`.

---

## Scope and Acceptance Criteria

### Assessment constraints

- **5–8 test cases** each for Manual, UI, and API (tags count within each type)
- **Smoke** and **Regression** coverage required
- **Positive, negative, and edge** scenarios
- COD payment only; double-confirm invoice quirk on UI

### UI acceptance criteria (from assessment)

| AC | Requirement | Automated coverage |
|----|-------------|-------------------|
| **AC1** | Register → Login → Verify profile | `TC-UI-01` (register, login, profile assertions) |
| **AC2** | Browse → Add items → Update quantity → COD checkout → View invoice | `TC-UI-06` (full purchase flow including invoice verification) |

### API acceptance criteria

| AC | Requirement | Automated coverage |
|----|-------------|-------------------|
| **AC1** | Register → Login → Bearer token → Create cart | `TC-API-01` |
| **AC2** | Get products → Add to cart → Verify cart → Generate invoice (COD) | `TC-API-01` |

### In-scope exclusions (documented in `docs/03-requirement-and-risk-analysis.md`)

Favorites, contact forms, non-COD payments, admin flows, guest checkout, invoice PDF download, and TOTP/2FA are out of scope to stay within the test budget.

---

## Requirement and Risk Analysis

Full analysis: **`docs/03-requirement-and-risk-analysis.md`**

### Priority summary

| Priority | Flows |
|----------|-------|
| **P1 — Critical** | Registration, login/auth, cart integrity, COD checkout, double-confirm invoice, invoice verification |
| **P2 — High** | Profile data, cart totals, invoice listing |
| **P3 — Medium** | Catalog search, stock validation, negative auth |
| **P4 — Low** | Filters, favorites, guest checkout (manual or excluded) |

### Highest-risk areas

1. **Authentication** — Blocks all downstream UI and API tests if registration/login fails
2. **Cart state** — Wrong products or quantities break checkout and invoice assertions
3. **Double-confirm quirk** — Single Confirm click does not generate a UI invoice (`utils/checkoutHelper.js`)
4. **API vs UI divergence** — API creates invoices in one POST; UI needs two Confirm clicks
5. **Stock mismatch** — API `in_stock` flag does not always match UI purchasability; tests select products dynamically

Supporting documents: `docs/01-requirements-analysis.md`, `docs/02-application-analysis.md`, `docs/04-api-investigation.md`.

---

## UI / API Strategy

### Framework structure

```
PrismStructure-toolshop-playwright/
├── fixtures/prism.fixture.js    # Injects page objects, API pages, test data fixtures
├── pageObjects/                 # UI POM (basePage, login, register, catalog, product, cart, checkout, profile, invoices)
├── apiPages/                    # API POM (auth, product, cart, invoice)
├── utils/                       # env, dataGenerator, apiAssertions, checkoutHelper, invoiceHelper
├── test-data/                   # user.defaults.json, billing.json
└── tests/
    ├── ui/                      # 7 UI specs
    └── api/                     # 7 API specs
```

### UI strategy

- **Locator approach:** `data-test` attributes (`testIdAttribute: 'data-test'`), role-based selectors, and text matchers
- **Page objects** encapsulate navigation and form interaction (e.g. `registerPage.register()`, `checkoutPage.completeCashOnDeliveryCheckout()`)
- **Fixtures** provide `testUser`, `authenticatedUser`, `inStockProducts`, `outOfStockProduct`, and `billingData`
- **Dynamic product selection:** `productPage.findPurchasableProducts()` and API-driven in-stock lists avoid flaky hardcoded product IDs
- **Assessment quirk:** `confirmInvoiceTwice()` in `utils/checkoutHelper.js` clicks Confirm twice with a wait for "Payment was successful"

### API strategy

- **Playwright `request` fixture** — same framework for UI and API
- **API page classes** extend `baseApiPage.js` with `get`/`post` helpers and `authHeaders(token)`
- **Shared assertions** in `utils/apiAssertions.js` (status codes, token shape, validation errors, invoice shape)
- **Lifecycle test** (`TC-API-01`) covers the full positive path in one spec; negatives are split into focused specs

---

## Smoke / Regression Strategy

Tags are embedded in test titles: `@smoke`, `@regression`.

| Suite | Command | Tests | Purpose |
|-------|---------|-------|---------|
| **Smoke** | `npm run test:smoke` | 3 | Fast confidence on critical paths |
| **Regression** | `npm run test:regression` | 13 | Broader coverage including negatives |
| **UI** | `npm run test:ui` | 7 | All UI automation |
| **API** | `npm run test:api` | 7 | All API automation |

### Smoke tests (3)

| ID | Scope |
|----|-------|
| `TC-UI-01` | Register, login, profile verification |
| `TC-UI-06` | Full COD purchase + invoice verification |
| `TC-API-01` | Full API lifecycle (register through invoice) |

### Regression tests (13 unique tagged runs)

All `@regression` tests across UI and API, including auth negatives, catalog/search, empty cart, out-of-stock UI, cart/invoice API negatives, and the smoke paths that also carry `@regression`.

**Design principle:** Smoke validates revenue-critical happy paths; regression adds negative and edge coverage without exceeding the 5–8 per-type limit.

---

## Positive / Negative / Edge Coverage

### Manual tests — 8 (`FunctionalTestCase.csv`)

| ID | Type | Title |
|----|------|-------|
| TC-MAN-01 | Positive / Smoke | Register with valid details |
| TC-MAN-02 | Positive / Smoke | Login and verify profile |
| TC-MAN-03 | Negative / Regression | Invalid credentials error |
| TC-MAN-04 | Positive / Regression | Browse catalog and search |
| TC-MAN-05 | Positive / Regression | Add multiple in-stock products |
| TC-MAN-06 | Edge / Regression | Update cart quantity |
| TC-MAN-07 | Positive / Smoke | COD checkout, double confirm, verify invoice |
| TC-MAN-08 | Negative / Regression | Single Confirm does not generate invoice |

### UI automation — 7

| ID | Type | Tag(s) | File |
|----|------|--------|------|
| TC-UI-01 | Positive | @smoke | `auth.spec.js` |
| TC-UI-03 | Negative | @regression | `auth.spec.js` |
| TC-UI-04 | Positive | @regression | `catalog.spec.js` |
| TC-UI-05 | Negative | @regression | `catalog.spec.js` |
| TC-UI-06 | Positive | @smoke @regression | `purchase.spec.js` |
| TC-UI-07 | Negative | @regression | `checkout.spec.js` |
| TC-UI-08 | Edge | @regression | `product.spec.js` |

*Note: TC-UI-02 (standalone login/profile) and separate invoice-only UI test were consolidated — registration, login, profile, multi-item cart, quantity update, checkout, and invoice checks are covered within TC-UI-01 and TC-UI-06.*

### API automation — 7

| ID | Type | Tag(s) | File |
|----|------|--------|------|
| TC-API-01 | Positive | @smoke @regression | `lifecycle.spec.js` |
| TC-API-02 | Negative | @regression | `auth.api.spec.js` |
| TC-API-03 | Negative | @regression | `auth.api.spec.js` |
| TC-API-04 | Negative | @regression | `auth.api.spec.js` |
| TC-API-05 | Negative | @regression | `cart.api.spec.js` |
| TC-API-06 | Negative | @regression | `invoice.api.spec.js` |
| TC-API-07 | Negative | @regression | `invoice.api.spec.js` |

---

## Test-Data Strategy

| Data | Source | Approach |
|------|--------|----------|
| **Users** | `test-data/user.defaults.json` + `utils/dataGenerator.js` | Unique email per run (`testuser+{timestamp}@example.com`); password suffix appended for uniqueness |
| **Billing** | `test-data/billing.json` + `utils/invoiceHelper.js` | Default Netherlands address; lifecycle API test uses TG/`1234AA` billing override where required |
| **Products** | Live API at runtime | `inStockProducts` / `outOfStockProduct` fixtures query `/products` and filter by `in_stock`; UI tests verify purchasability before adding to cart |
| **Invalid IDs** | `invalidResourceId()` in `dataGenerator.js` | Mutated cart IDs and synthetic product IDs for 404/422 negatives |
| **Environment** | `.env.example` → `.env` | `BASE_URL` and `API_BASE_URL`; `.env` is gitignored |

No production credentials are stored. The assessment default password `Test@1234` appears in `user.defaults.json` and the manual CSV as documented test data for the public practice application.

---

## How AI Was Used

Work was driven through **iterative Cursor AI prompts** (17 phases), with **git commits after each completed step** (see `git log`).

| Phase | AI contribution |
|-------|-----------------|
| **Planning** (Prompts 1–3) | Extracted assessment requirements; analyzed application flows; produced requirement/risk matrix in `docs/` |
| **Manual design** (Prompts 4–5) | Generated `FunctionalTestCase.csv`; reviewed coverage against ACs |
| **API investigation** (Prompt 11) | Documented endpoints, status codes, and quirks from OpenAPI spec |
| **Framework scaffold** (Prompt 7) | Created Prism POM structure, fixtures, config, page/API objects |
| **UI automation** (Prompts 8–10) | Auth, purchase E2E, catalog/search, checkout, stock specs |
| **API automation** (Prompts 12–13) | Lifecycle and negative API specs with verified assertions |
| **Validation** (Prompts 14–16) | Ran smoke/regression suites; debugged failures (locators, double-confirm, API status codes, stock/purchasability mismatch) |
| **Documentation** (Prompt 17) | This file |

### Debugging examples (AI-assisted)

- **Double-confirm invoice:** Identified assessment quirk; added `confirmInvoiceTwice()` with state waits
- **API token assertion:** `token_type` is lowercase `"bearer"`
- **Invalid product on cart add:** Returns **422** with `errors.product_id`, not 404
- **Login error locator:** Text matcher instead of `role="alert"`
- **Purchasability:** API `in_stock` ≠ UI enabled Add to Cart; dynamic product probing added

Human review validated AI output against live application behavior before committing.

---

## Responsible AI and Sensitive-Data Precautions

| Practice | Implementation |
|----------|----------------|
| **No secrets in repo** | `.env` gitignored; only `.env.example` committed |
| **No tokens in artifacts** | `playwright-report/`, `test-results/`, and `reports/*.json` gitignored |
| **Dynamic credentials** | Users created per test run; passwords generated with timestamp suffix |
| **Public SUT only** | Tests target the official practice URLs, not production systems |
| **Assertion over logging** | API helpers assert response shape; tokens are not written to reports |
| **Documented test passwords** | `Test@1234` is the assessment's documented practice-app password, not a live secret |
| **Human verification** | Failures investigated on real runs; AI-suggested fixes validated before commit |

Before sharing reports or commits, scan for accidental inclusion of bearer tokens, `.env` files, or personal data.

---

## Reusing This Workflow

This repo is a template for AI-assisted QA on similar web + API applications:

1. **Requirements first** — Capture ACs and constraints in `docs/` before writing tests
2. **Risk-weighted design** — Prioritize P1 flows (auth, cart, checkout, invoice) within test-count limits
3. **Prism POM + fixtures** — Clone `PrismStructure-toolshop-playwright/`, swap `pageObjects/` and `apiPages/` for the new SUT
4. **Tag-driven execution** — Use `@smoke` / `@regression` grep filters for CI stages
5. **Dynamic test data** — Avoid hardcoded IDs; query live catalog or seed data at runtime
6. **Iterative AI prompting** — One phase per commit; re-run suites after each change
7. **Document quirks early** — Application-specific behavior (e.g. double-confirm) belongs in helpers and `project-info.md`

To adapt for a new project:

- Update `BASE_URL` / `API_BASE_URL` in `.env`
- Replace page and API objects to match new routes and payloads
- Regenerate manual CSV and risk analysis for the new ACs
- Keep the same folder layout and npm script pattern for consistency

---

## Repository Structure

```
Assignment/
├── FunctionalTestCase.csv
├── project-info.md                 ← this file
├── docs/
│   ├── 01-requirements-analysis.md
│   ├── 02-application-analysis.md
│   ├── 03-requirement-and-risk-analysis.md
│   ├── 04-api-investigation.md
│   └── api-docs.json
└── PrismStructure-toolshop-playwright/
    ├── playwright.config.js
    ├── package.json
    ├── fixtures/
    ├── pageObjects/
    ├── apiPages/
    ├── utils/
    ├── test-data/
    ├── tests/ui/
    ├── tests/api/
    ├── reports/                    # JSON results (gitignored when generated)
    └── playwright-report/          # HTML report (gitignored when generated)
```

---

*Assessment: QA Practical — Practice Software Testing Toolshop | Playwright + Prism + Cursor AI*
