# Execution Report — Toolshop QA Assessment

> Generated: 2026-08-07 | Environment: Windows | Browser: Chromium  
> SUT: https://practicesoftwaretesting.com/ | API: https://api.practicesoftwaretesting.com/

## Summary

| Suite | Command | Result | Duration (approx.) |
|-------|---------|--------|-------------------|
| API | `npm run test:api` | **7 / 7 passed** | 12s |
| UI | `npm run test:ui` | **6 / 7 passed** (1 flaky) | 66s |
| Smoke | `npm run test:smoke` | **3 / 3 passed** | 31s |
| Regression | `npm run test:regression` | **13 / 13 passed** | 44s |

**Note:** `TC-UI-06` failed once during the full parallel UI run (checkout success message timeout). It passed on the dedicated smoke and regression runs immediately afterward. Treat as intermittent timing under parallel load, not an assertion removal.

## API tests (7/7 passed)

| ID | Title | Status |
|----|-------|--------|
| TC-API-01 | Complete user cart and invoice lifecycle | Passed |
| TC-API-02 | Invalid login returns 401 | Passed |
| TC-API-03 | Duplicate registration returns 409 | Passed |
| TC-API-04 | Missing/invalid bearer token returns 401 | Passed |
| TC-API-05 | Invalid cart/product IDs | Passed |
| TC-API-06 | Invoice missing required field returns 422 | Passed |
| TC-API-07 | Invalid cart ID on invoice returns 404 | Passed |

## UI tests

| ID | Title | Full UI run | Smoke / Regression |
|----|-------|-------------|-------------------|
| TC-UI-01 | Register and login | Passed | Passed |
| TC-UI-03 | Invalid login error | Passed | Passed |
| TC-UI-04 | Search and open detail | Passed | Passed |
| TC-UI-05 | No search results | Passed | Passed |
| TC-UI-06 | Purchase E2E + invoice | **Failed** (timeout) | **Passed** |
| TC-UI-07 | Empty cart blocked | Passed | Passed |
| TC-UI-08 | Out-of-stock disabled | Passed | Passed |

## Smoke tests (3/3 passed)

- TC-UI-01 — Register and login with valid user
- TC-UI-06 — Complete purchase flow with COD and invoice verification
- TC-API-01 — Complete API lifecycle

## Regression tests (13/13 passed)

All `@regression` UI and API tests passed, including TC-UI-06.

## Report artifacts (local, gitignored)

| Artifact | Path |
|----------|------|
| HTML report | `PrismStructure-toolshop-playwright/playwright-report/index.html` |
| JSON results | `PrismStructure-toolshop-playwright/reports/test-results.json` |
| Failure screenshots/video | `PrismStructure-toolshop-playwright/test-results/` (on failure only) |

Regenerate after clone:

```bash
cd PrismStructure-toolshop-playwright
npm install
npx playwright install chromium
npm run test:regression
npm run report
```

## Security check

No bearer tokens or live passwords were included in this report. Dynamic users are created per test run via `buildUser()`.
