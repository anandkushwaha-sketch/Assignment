# API Test Execution Report

> Executed: 2026-08-07 | Framework: Playwright `@playwright/test` | SUT API: https://api.practicesoftwaretesting.com

## Summary

| Metric | Value |
|--------|-------|
| Total API tests | 7 |
| Passed | **7** |
| Failed | 0 |
| Skipped | 0 |

## Results

| ID | Test | Tag | Status | Assertions verified |
|----|------|-----|--------|---------------------|
| TC-API-01 | Complete user cart and invoice lifecycle | @smoke @regression | **Passed** | 201 register, 200 login/token, 200 products, 201 cart, 200 add-to-cart, 201 invoice, 200 list/get invoice |
| TC-API-02 | Invalid login returns 401 | @regression | **Passed** | HTTP 401 + unauthorized error body |
| TC-API-03 | Duplicate registration returns 409 | @regression | **Passed** | HTTP 409 + email conflict error |
| TC-API-04 | Missing/invalid bearer token returns 401 | @regression | **Passed** | GET `/users/me` and POST `/invoices` without token return 401 |
| TC-API-05 | Invalid cart/product IDs | @regression | **Passed** | GET invalid cart → 404; invalid product add → 422 `errors.product_id` |
| TC-API-06 | Invoice missing required field | @regression | **Passed** | POST invoice without `billing_street` → 422 |
| TC-API-07 | Invoice invalid cart ID | @regression | **Passed** | POST invoice with non-existent `cart_id` → 404 |

## Spec files

| File | Tests |
|------|-------|
| `tests/api/lifecycle.spec.js` | TC-API-01 |
| `tests/api/auth.api.spec.js` | TC-API-02, TC-API-03, TC-API-04 |
| `tests/api/cart.api.spec.js` | TC-API-05 |
| `tests/api/invoice.api.spec.js` | TC-API-06, TC-API-07 |

## Console log

Full API run output: [`api-execution-console-log.txt`](./api-execution-console-log.txt)

## Machine-readable results

- CSV: [`api-test-execution-report.csv`](./api-test-execution-report.csv)
- JSON (full suite): [`playwright-test-results.json`](./playwright-test-results.json)

**Note:** API tests use Playwright `request` — no browser video is produced. Evidence is HTTP status and response body assertions in logs and JSON.
