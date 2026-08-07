# AI Prompt History — Automation and Debugging

> Framework scaffold, UI/API specs, execution, and fixes | `PrismStructure-toolshop-playwright/`

---

## Entry — Prompt 7: Framework setup

### Prompt
Set up minimum Playwright JavaScript structure for Toolshop UI and API testing following Prism conventions.

### AI Response Summary
AI created full scaffold: `playwright.config.js` (Chromium, HTML + JSON reporters, `data-test` attribute), `package.json` scripts, `pageObjects/`, `apiPages/`, `fixtures/prism.fixture.js`, `utils/`, `tests/ui/`, `tests/api/`. Explained each file after implementation.

### Validation Notes
Committed as `6d63b92`. `npm run` lists: `test`, `test:smoke`, `test:regression`, `test:ui`, `test:api`, `report`.

### Changes I Made
None beyond prompt requirements.

### Reason for Changes
N/A — greenfield scaffold (Prompt 6 confirmed no prior Prism folder).

---

## Entry — Prompt 8: Registration and login UI

### Prompt
Implement UI tests for successful registration/login and invalid login. Unique runtime data, stable locators, `@smoke` / `@regression`, no fixed waits.

### AI Response Summary
AI added `tests/ui/auth.spec.js`: TC-UI-01 (register + login + profile, `@smoke`), TC-UI-03 (invalid login, `@regression`). Extended `registerPage`, `loginPage`, `profilePage`.

### Validation Notes
Committed as `c7112ce`. TC-UI-01 combines register and profile verification (no separate TC-UI-02 file).

### Changes I Made
None at creation.

### Reason for Changes
N/A.

---

## Entry — Prompt 9: Purchase flow E2E

### Prompt
E2E UI test: login, browse/search, multi-product cart, quantity update, COD checkout, double confirm, My Invoices verification. Tag `@smoke` and `@regression`.

### AI Response Summary
AI added `tests/ui/purchase.spec.js` (TC-UI-06) and `utils/checkoutHelper.js` with `confirmInvoiceTwice()`. Extended checkout, cart, product, invoices page objects.

### Validation Notes
Committed as `b2c1563`. Double-confirm helper documented as assessment quirk.

### Changes I Made
None at creation.

### Reason for Changes
N/A.

---

## Entry — Prompt 10: Additional UI scenarios

### Prompt
Add highest-value missing UI scenarios; keep total 5–8; negative/edge for search, cart, or checkout; no E2E duplication.

### AI Response Summary
AI added three specs to reach **7 UI tests**: TC-UI-04 (search + detail), TC-UI-05 (no results), TC-UI-07 (empty cart checkout blocked), TC-UI-08 (out-of-stock add disabled). Updated `catalogPage`, `checkoutPage`, `productPage`, `productApiPage.getFirstOutOfStockProduct()`.

### Validation Notes
Committed as `e3dba23`. Final UI count: 7 (within 5–8).

### Changes I Made
None — accepted AI selection of scenarios to fill gaps without duplicating TC-UI-06.

### Reason for Changes
N/A.

---

## Entry — Prompt 11: API investigation

### Prompt
Review API documentation; identify endpoints, bodies, auth, status codes for register, login, products, cart, invoice. Do not guess undocumented fields.

### AI Response Summary
AI fetched OpenAPI spec, saved `docs/api-docs.json` and `docs/04-api-investigation.md` with endpoint tables, auth scheme, status codes, and documented uncertainties.

### Validation Notes
Committed as `c7c1c96`. Used as reference for API specs in Prompts 12–13.

### Changes I Made
None.

### Reason for Changes
N/A — investigation only.

---

## Entry — Prompt 12: API lifecycle tests

### Prompt
Implement Playwright API lifecycle: register, login/token, products, cart, add products, verify cart, COD invoice, validate response. Dynamic IDs, no hardcoded tokens. `@smoke` `@regression`.

### AI Response Summary
AI added `tests/api/lifecycle.spec.js` (TC-API-01) and initial negative specs in `auth.api.spec.js` / `cart.api.spec.js`. Added `utils/apiAssertions.js`.

### Validation Notes
Committed as `d972f89`.

### Changes I Made
None at creation.

### Reason for Changes
N/A.

---

## Entry — Prompt 13: Negative API tests

### Prompt
Add negative API tests; keep suite 5–8; assert status and error bodies from live API behavior, not assumptions.

### AI Response Summary
AI expanded/refined suite to **7 API tests**: TC-API-02 (401 login), TC-API-03 (409 duplicate), TC-API-04 (401 missing/invalid bearer), TC-API-05 (cart/product negatives), TC-API-06 (422 missing billing field), TC-API-07 (404 invalid cart on invoice). Removed invalid out-of-stock API negative after live API returned 200 for some cases. Added `invoice.api.spec.js`.

### Validation Notes
Committed as `dd73bb9`. Last committed state before execution phase.

### Changes I Made
None — accepted AI decision to drop out-of-stock API negative when live behavior did not match expectation.

### Reason for Changes
N/A at commit time; later Prompt 15 further corrected TC-API-05 product assertion to 422.

---

## Entry — Prompt 14: Run smoke tests

### Prompt
Run `@smoke` tests first. For each failure: classify (product/test/data/locator/environment defect), show evidence, suggest smallest fix. Do not weaken assertions.

### AI Response Summary
AI installed Node.js LTS (was missing on PATH), ran `npm install` and `npx playwright install chromium`, then executed `npm run test:smoke`. Initial run: **3 failed**. After iterative fixes across page objects, assertions, and checkout helper, final smoke run: **3/3 passed**. AI classified 10 failure categories (token_type case, invoice 201 shape, country selectOption, password locator, API/UI stock mismatch, cart sync, checkout wizard, double confirm, invoice locators).

### Validation Notes
Final smoke result from conversation: TC-API-01, TC-UI-01, TC-UI-06 all passed. Fixes exist in working tree; **commit for Prompt 14 was attempted but not present in `git log`** as of Prompt 19 — changes remain staged/uncommitted.

### Changes I Made
**QA engineer decision:** Ran smoke suite on local machine; approved environment setup (Node via winget). Reviewed AI failure classifications before accepting fixes.

### Reason for Changes
Smoke must pass before regression; fixes targeted observed live app behavior without removing assertions.

---

## Entry — Prompt 15: Fix regression failures

### Prompt
Analyze Playwright failures from error/trace/screenshot/source. Root cause, smallest fix, no arbitrary timeouts/force clicks. Explain how assertion intent is preserved.

### AI Response Summary
AI ran `npm run test:regression` — **6 failures** initially (smoke already green). Applied fixes:
- TC-API-05: invalid product add → **422** + `errors.product_id`
- TC-API-07: API-valid billing override for 404 cart test
- TC-UI-03: login error via text, not `role="alert"`
- TC-UI-04: purchasable product via enabled Add to cart button
- TC-UI-05: `getByTestId('no-results')` for strict mode
- TC-UI-07: guest empty cart — 0 rows, no Proceed/Confirm buttons

After fixes, AI reported smoke **3/3** and previously failing regression cases passing. Full 13-test regression re-run completed successfully in later Prompt 16.

### Validation Notes
Probed live API with one-off Node scripts during debugging (later removed `scripts/debug-cart-404.js`). No fixed `sleep()` added.

### Changes I Made
**QA engineer decision:** Issued fix prompt after smoke phase; accepted API status code corrections based on live probes rather than OpenAPI assumptions.

### Reason for Changes
Regression suite must reflect actual API contract; UI assertions must match rendered DOM.

---

## Entry — Prompt 16: Final validation

### Prompt
Run complete UI and API regression suite. Confirm all tests pass, all npm commands work, HTML reports generated, no credentials in code/logs/reports/commits, test counts 5–8 per tier.

### AI Response Summary
AI ran `npm run test:api`, `test:ui`, `test:smoke`, `test:regression`. Results on final run:
- API: **7/7**
- UI: **7/7**
- Smoke: **3/3**
- Regression: **13/13**

Noted one transient TC-API-04 timeout on first API run (passed on retry). Verified `playwright-report/index.html` and `reports/test-results.json` exist. Scanned reports for tokens — none found. Counts: Manual 8, UI 7, API 7. `.env` not tracked; only `.env.example` committed.

### Validation Notes
Commands match `package.json`. Reports gitignored per `.gitignore`. `Test@1234` present in `user.defaults.json` and manual CSV as documented practice-app fixture.

### Changes I Made
**QA engineer decision:** Requested full validation before documentation phase. No code changes in this prompt.

### Reason for Changes
Assessment requires execution evidence and confirmation before submission docs.
