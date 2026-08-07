# AI Prompt History — Test Data

> Static fixtures, generators, and runtime data strategy | `test-data/`, `utils/dataGenerator.js`

---

## Entry — Prompt 7: Framework test-data setup (part of scaffold)

### Prompt
Set up minimum Playwright JS structure with Prism conventions, reusable page/API helpers, separated test data, `@smoke`/`@regression` tags, HTML reports, env-based URLs, no hardcoded credentials/tokens.

### AI Response Summary
AI scaffolded `PrismStructure-toolshop-playwright/` including:
- `test-data/user.defaults.json` — base user fields and assessment password template `Test@1234`
- `test-data/billing.json` — default COD billing (Netherlands address)
- `utils/dataGenerator.js` — `uniqueEmail()`, `uniquePassword()`, `buildUser()`
- `utils/invoiceHelper.js` — `buildBillingAddress()`, `buildInvoicePayload()`
- `utils/env.js` — `BASE_URL` / `API_BASE_URL` with public defaults
- `.env.example` — URL template only (no secrets)

### Validation Notes
Committed as `6d63b92`. `.env` listed in root `.gitignore`. No bearer tokens or live credentials in committed files.

### Changes I Made
None beyond Prompt 7 requirements. **QA engineer rule** (commit per step) applied to scaffold commit.

### Reason for Changes
N/A — framework baseline.

---

## Entry — Prompt 8: Runtime unique users

### Prompt
Implement UI auth tests with unique valid user data at runtime. Do not use fixed waits.

### AI Response Summary
AI wired `testUser` fixture to `buildUser()` so each run uses `testuser+{timestamp}@example.com` and a password with timestamp suffix. Invalid login test uses `invalid+{timestamp}@example.com` and `WrongPass@99`.

### Validation Notes
Committed as `c7112ce` (auth specs). Passwords are generated, not hardcoded JWTs.

### Changes I Made
None — accepted AI approach for data isolation.

### Reason for Changes
Prevents duplicate-email failures and avoids committing credentials.

---

## Entry — Prompt 9 / fixture: Dynamic products and billing

### Prompt
E2E purchase flow with registered user, multiple products, COD checkout, double confirm, invoice verification.

### AI Response Summary
AI added fixtures in `prism.fixture.js`:
- `authenticatedUser` — registers via API then logs in via UI
- `inStockProducts` — queries API, filters `in_stock === true`, prioritizes distinct products
- `billingData` — derived from authenticated user's address

### Validation Notes
Committed as `b2c1563` (purchase spec). Products not hardcoded by ID in the spec.

### Changes I Made
None at creation time.

### Reason for Changes
N/A — AI-designed fixture pattern.

---

## Entry — Prompt 14: Billing and defaults adjusted during smoke debugging

### Prompt
Run `@smoke` tests; classify failures; suggest smallest corrections.

### AI Response Summary
AI updated `user.defaults.json`, `billing.json`, and registration flow after live-run failures (country `selectOption`, address field order, API billing override `TG`/`1234AA` in lifecycle spec separate from UI billing).

### Validation Notes
Smoke run eventually reported **3/3 passed** (TC-API-01, TC-UI-01, TC-UI-06). Changes were applied in working tree; **not yet committed** as of Prompt 19 (`git status` shows modified test-data files).

### Changes I Made
**QA engineer decision:** Directed smoke execution and accepted AI-proposed data/locator fixes after reviewing failure evidence. Did not weaken assertions.

### Reason for Changes
Align test data with live form behavior (country dropdown, billing validation) while keeping dynamic user generation.

---

## Entry — Prompt 15: Invalid ID helpers for API negatives

### Prompt
Fix regression failures with smallest reliable fix; no arbitrary timeouts.

### AI Response Summary
AI added `invalidResourceId()` in `dataGenerator.js` and `mutateResourceId()` in cart API spec. Probed live API to confirm invalid product add returns **422** (not 404). TC-API-07 invoice negative uses API-valid billing override so 404 reflects invalid `cart_id`, not address validation.

### Validation Notes
Regression failures addressed in working tree. `expectFieldValidationError()` updated to read `body.errors[field]`. **Not committed** as of Prompt 19.

### Changes I Made
**QA engineer decision:** Accepted AI fix to assert **observed** API status codes (422 for invalid `product_id`) rather than assumed 404.

### Reason for Changes
Assessment requires verifying API behavior; guessing status codes produced false failures.
