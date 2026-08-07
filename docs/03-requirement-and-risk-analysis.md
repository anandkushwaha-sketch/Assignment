# Requirement and Risk Analysis — Practice Software Testing Toolshop

> Prompt 3 | SUT: https://practicesoftwaretesting.com/ | API: https://api.practicesoftwaretesting.com/

## 1. Executive Summary

The Toolshop application is an e-commerce platform where revenue-critical paths depend on **authentication**, **cart state integrity**, **checkout completion**, and **invoice generation**. Failures in these areas directly block purchase completion and order verification.

Given the assessment scope (5–8 tests per tier) and the documented **double-confirm invoice quirk**, testing priority is weighted toward:

1. **P1 — Critical:** Auth, E2E purchase, invoice generation (double confirm)
2. **P2 — High:** Cart state, COD checkout, invoice verification
3. **P3 — Medium:** Product search/browse, negative auth, stock validation
4. **P4 — Low:** Filters, favorites, guest checkout, non-COD payment methods

---

## 2. Risk Matrix by Major Flow

### 2.1 User Registration

| Field | Detail |
|-------|--------|
| **Requirement / AC** | A new user can register with valid first name, last name, email, and password meeting complexity rules (min 8 chars, uppercase, lowercase, number, symbol). |
| **Business risk** | Invalid or duplicate accounts pollute user data; weak validation allows insecure accounts. Registration is the entry point for all authenticated flows. |
| **Failure impact** | User cannot log in or complete purchase; downstream UI and API tests blocked. |
| **Testing priority** | **P1 — Critical** |
| **Recommended coverage** | **UI:** TC-UI-01 (valid registration). **API:** POST `/users/register` with valid payload (201). **Manual:** Duplicate email, weak password, invalid email. |
| **Classification** | **Smoke** — valid registration; **Regression** — duplicate email, password validation, missing required fields |

---

### 2.2 User Login & Session (Authentication)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | Registered user can log in with correct credentials and access protected routes (`/account/profile`, `/account/invoices`, `/checkout`). API returns a valid bearer token via POST `/users/login`. |
| **Business risk** | Authentication is the security gate for profile, cart persistence, checkout, and invoice access. Broken auth exposes account data or blocks legitimate users. |
| **Failure impact** | **High** — entire purchase journey fails; invoices inaccessible; API tests cannot obtain bearer token. |
| **Testing priority** | **P1 — Critical** |
| **Recommended coverage** | **UI:** TC-UI-02 (login + profile verify), TC-UI-03 (invalid credentials). **API:** POST `/users/login` (200 + token), GET `/users/me` with bearer (200), without token (401). |
| **Classification** | **Smoke** — valid login + profile; **Regression** — wrong password, unregistered email, unauthenticated route access |

**Authentication-specific risks:**

| Sub-risk | Description | Mitigation |
|----------|-------------|------------|
| Token expiry mid-flow | Bearer token invalid during checkout/invoice API calls | Obtain fresh token per API test; re-login in long UI E2E if needed |
| Session vs cart mismatch | User logs in but cart from guest session is lost or merged incorrectly | Verify cart contents after login in regression test |
| Profile data drift | Registered name/email does not match profile page | Assert profile fields immediately after login (TC-UI-02) |

---

### 2.3 Profile Verification

| Field | Detail |
|-------|--------|
| **Requirement / AC** | After login, user can view profile and see correct first name, last name, and email matching registration data (AC1). |
| **Business risk** | Incorrect profile data indicates registration or session binding failure; erodes user trust. |
| **Failure impact** | **Medium** — does not block purchase directly but signals data integrity issues that may affect billing/invoice details. |
| **Testing priority** | **P2 — High** |
| **Recommended coverage** | **UI:** TC-UI-02 (assert profile fields). **API:** GET `/users/me` — compare response to registration payload. |
| **Classification** | **Smoke** — profile view with correct data; **Regression** — profile update (out of automation scope, manual only) |

---

### 2.4 Product Browsing & Search

| Field | Detail |
|-------|--------|
| **Requirement / AC** | User can view the product catalog, open product detail pages, and search products by name. Products display price, stock status, and an add-to-cart action. |
| **Business risk** | Users cannot find or select products to purchase. Out-of-stock items shown as purchasable cause cart/checkout failures later. |
| **Failure impact** | **Medium** — blocks purchase initiation; may cause flaky downstream cart/checkout tests if wrong product selected. |
| **Testing priority** | **P3 — Medium** |
| **Recommended coverage** | **UI:** TC-UI-04 (search + open detail). **API:** GET `/products`, GET `/products/search?q=Hammer`, GET `/products/{id}`. **Manual:** Filters, sort, no-results search. |
| **Classification** | **Smoke** — view catalog + open one product; **Regression** — search, out-of-stock indicator, empty search results |

---

### 2.5 Cart State Management

| Field | Detail |
|-------|--------|
| **Requirement / AC** | User can add in-stock products to cart, add multiple items, update quantities, and see correct cart totals. Cart state must be consistent before checkout (AC2). |
| **Business risk** | Cart is the bridge between product selection and payment. Stale quantities, wrong totals, or lost items cause incorrect orders or checkout rejection. |
| **Failure impact** | **High** — wrong invoice amounts, checkout failures, customer disputes over order contents. |
| **Testing priority** | **P1 — Critical** |
| **Recommended coverage** | **UI:** TC-UI-05 (multi-item + quantity update). **API:** POST `/carts`, POST `/carts/{cartId}/product/{productId}`, PUT `/carts/{cartId}/product/quantity`, GET `/carts/{cartId}`. |
| **Classification** | **Smoke** — add one in-stock product; **Regression** — multi-item, quantity update, out-of-stock add attempt |

**Cart state-specific risks:**

| Sub-risk | Description | Mitigation |
|----------|-------------|------------|
| Cart ID lost between steps | `cart_id` in sessionStorage/localStorage cleared before checkout | Persist cart ID through E2E flow; verify cart before checkout |
| Quantity boundary | Qty set to 0 or negative behaves unexpectedly | Regression: decrease qty to 1, then remove; API: validate 422 on invalid qty |
| Out-of-stock after add | Product goes out of stock between browse and checkout | Select products dynamically where `in_stock === true`; optional TC-UI-08 |
| Multi-tab cart conflict | Two browser tabs modify same cart | Out of scope; document as known limitation |
| Cart not linked to user | Guest cart not merged on login | Verify cart contents after login in regression |

---

### 2.6 Checkout — Cash on Delivery

| Field | Detail |
|-------|--------|
| **Requirement / AC** | Logged-in user with items in cart can complete checkout using **Cash on Delivery** with valid billing address (street, city, state, country, postal code). |
| **Business risk** | Checkout is the revenue conversion point. Billing validation failures or wrong payment method block order completion. |
| **Failure impact** | **Critical** — no order placed, no invoice generated, direct revenue loss in a real system. |
| **Testing priority** | **P1 — Critical** |
| **Recommended coverage** | **UI:** TC-UI-06 (COD checkout E2E). **API:** POST `/invoices` with `payment_method: "cash-on-delivery"` and valid billing + `cart_id`. **Manual:** Empty cart, missing billing fields. |
| **Classification** | **Smoke** — COD checkout with valid billing; **Regression** — empty cart blocked, missing required billing fields |

**Checkout-specific risks:**

| Sub-risk | Description | Mitigation |
|----------|-------------|------------|
| Empty cart checkout | User reaches checkout with no items | Assert checkout blocked or redirect; API returns 404/422 |
| Invalid billing data | Missing postal code, invalid country | Negative manual test; API 422 validation |
| Wrong payment method | Assessment requires COD only | Hardcode `cash-on-delivery` in all checkout tests |
| Guest vs authenticated checkout | Guest flow may differ from logged-in | Use logged-in path for smoke; document guest as out-of-scope |
| Billing address mismatch with profile | Invoice billing differs from profile address | Use consistent test data across UI and API |

---

### 2.7 Duplicate Confirmation (Invoice Generation UI Quirk)

| Field | Detail |
|-------|--------|
| **Requirement / AC** | After completing checkout, user must press the **Confirm button twice** to generate the invoice. Single confirm does not complete invoice creation (assessment special instruction). |
| **Business risk** | This is a **known application behavior** (likely intentional for bug-hunting practice). Testers and automation that click Confirm once will report false failures or miss invoices. |
| **Failure impact** | **Critical** — invoice not created; order appears incomplete; TC-UI-06 and TC-UI-07 fail; false-negative bug reports. |
| **Testing priority** | **P1 — Critical** |
| **Recommended coverage** | **UI:** TC-UI-06 — explicitly click Confirm twice with wait between clicks. **Manual:** Verify single-click does NOT generate invoice. **API:** N/A (API invoice creation does not require double confirm). |
| **Classification** | **Smoke** — double-confirm success path; **Regression** — single-confirm negative (manual only, assert no invoice created) |

**Duplicate confirmation risks:**

| Sub-risk | Description | Mitigation |
|----------|-------------|------------|
| Automation clicks once | Playwright clicks Confirm once and proceeds | Implement `confirmInvoice()` helper with two explicit clicks + wait for confirmation state |
| Race condition | Second click before UI ready | Wait for confirm button enabled/visible before each click |
| UI text change | Button label changes after first click | Use role-based locator (`button:has-text("Confirm")`) not index |
| API vs UI divergence | API creates invoice in one call; UI needs two | Document difference; UI and API tests are independent |

---

### 2.8 Invoice Generation & Verification

| Field | Detail |
|-------|--------|
| **Requirement / AC** | After successful checkout and double confirmation, invoice is generated and visible under **My Invoices** with correct line items, totals, and billing details (AC2). API: POST `/invoices` returns invoice with `cart_id` reference. |
| **Business risk** | Invoice is the proof of purchase. Missing, incorrect, or inaccessible invoices cause support burden and legal/accounting issues. |
| **Failure impact** | **Critical** — customer cannot verify order; reconciliation fails; assessment AC2 not met. |
| **Testing priority** | **P1 — Critical** |
| **Recommended coverage** | **UI:** TC-UI-06 (invoice created), TC-UI-07 (verify in My Invoices). **API:** POST `/invoices`, GET `/invoices/{invoiceId}`, GET `/invoices` (list). |
| **Classification** | **Smoke** — invoice generated and listed; **Regression** — invoice detail matches cart totals and billing address |

**Invoice-specific risks:**

| Sub-risk | Description | Mitigation |
|----------|-------------|------------|
| Invoice not listed immediately | Async creation delay | Wait for invoice to appear in My Invoices before assertion |
| Total mismatch | Invoice total ≠ cart subtotal | Assert line items and total in TC-UI-07 |
| Unauthorized invoice access | Invoice visible to wrong user | API: GET `/invoices` without token returns 401 |
| Invalid cart_id | Invoice POST with expired/empty cart | API negative: 404/422 with invalid `cart_id` |
| PDF download | Invoice PDF endpoint exists but not in assessment scope | Out of scope; document exclusion |

---

## 3. Consolidated Priority Matrix

| Flow | Priority | Smoke | Regression | UI Tests | API Tests |
|------|----------|-------|------------|----------|-----------|
| Registration | P1 | Valid register | Duplicate email, weak password | TC-UI-01 | POST `/users/register` |
| Login & Auth | P1 | Login + token | Invalid creds, 401 unauth | TC-UI-02, TC-UI-03 | POST `/users/login`, GET `/users/me` |
| Profile | P2 | Verify profile data | Profile update | TC-UI-02 | GET `/users/me` |
| Browse & Search | P3 | View catalog | Search, out-of-stock | TC-UI-04 | GET `/products`, `/products/search` |
| Cart State | P1 | Add 1 product | Multi-item, qty update, OOS | TC-UI-05 | POST/PUT `/carts/*` |
| Checkout (COD) | P1 | COD E2E | Empty cart, bad billing | TC-UI-06 | POST `/invoices` |
| Double Confirm | P1 | Confirm x2 success | Single confirm (manual) | TC-UI-06 | N/A |
| Invoice | P1 | Invoice listed | Total/detail match | TC-UI-06, TC-UI-07 | POST/GET `/invoices` |

---

## 4. End-to-End Risk Chain

```
Registration (P1) → Login (P1) → Browse (P3) → Cart (P1) → Checkout (P1) → Confirm x2 (P1) → Invoice (P1)
       ↓                  ↓                                        ↓                ↓
  Blocks all          Blocks auth                           Revenue loss      Order unverifiable
  downstream          routes & API
```

A failure at any **P1** step blocks the full AC2 journey. Cart state and double-confirm are the highest-flake points in automation.

---

## 5. Scope Exclusions (Documented)

| Area | Reason for exclusion |
|------|---------------------|
| Favorites | Not in assessment ACs; saves test budget |
| Contact/messages | Not in assessment ACs |
| Non-COD payment methods | Assessment mandates Cash on Delivery only |
| Admin flows | Out of user-journey scope |
| Filter/sort permutations | Covered manually; low P4 priority |
| Guest checkout | Logged-in path satisfies AC2; guest is P4 |
| Invoice PDF download | Not required by assessment |
| TOTP/2FA | `/totp/setup`, `/totp/verify` exist but not in ACs |

---

## 6. Recommended Test Allocation (within 5–8 limit)

### UI Automation (7 tests)
| ID | Flow | Priority | Tag |
|----|------|----------|-----|
| TC-UI-01 | Registration | P1 | @Smoke |
| TC-UI-02 | Login + Profile | P1 | @Smoke |
| TC-UI-03 | Invalid Login | P1 | @regression |
| TC-UI-04 | Search + Product Detail | P3 | @regression |
| TC-UI-05 | Cart Multi-item + Qty | P1 | @regression |
| TC-UI-06 | COD Checkout + Confirm x2 | P1 | @Smoke @regression |
| TC-UI-07 | Invoice Verification | P1 | @regression |

### API Automation (7 tests — aligned)
| ID | Flow | Priority | Tag |
|----|------|----------|-----|
| TC-API-01 | Register user | P1 | @Smoke |
| TC-API-02 | Login + get token | P1 | @Smoke |
| TC-API-03 | Login invalid credentials | P1 | @regression |
| TC-API-04 | Create cart + add product | P1 | @Smoke |
| TC-API-05 | Update cart quantity + verify | P1 | @regression |
| TC-API-06 | Generate invoice (COD) | P1 | @Smoke @regression |
| TC-API-07 | Get invoice list (auth) | P1 | @regression |

### Manual Tests (7 tests — aligned)
| ID | Flow | Priority | Tag |
|----|------|----------|-----|
| TC-MAN-01 | Registration valid | P1 | @Smoke |
| TC-MAN-02 | Login + profile verify | P1 | @Smoke |
| TC-MAN-03 | Invalid login error message | P1 | @regression |
| TC-MAN-04 | Search no results | P3 | @regression |
| TC-MAN-05 | Out-of-stock product add blocked | P2 | @regression |
| TC-MAN-06 | Checkout empty cart blocked | P1 | @regression |
| TC-MAN-07 | Single confirm does not create invoice | P1 | @regression |

---

## 7. Risk Mitigation Summary

| Risk area | Key mitigation |
|-----------|----------------|
| **Authentication** | Unique users per run; fresh token per API test; assert 401 without token |
| **Cart state** | Dynamic in-stock product selection; verify cart before checkout; carry `cart_id` through flow |
| **Checkout** | COD only; valid billing fixture; block empty cart |
| **Double confirm** | Dedicated helper with two clicks + explicit waits |
| **Invoice** | Wait for invoice in My Invoices; assert totals match cart; API POST validates `cart_id` |

---

*Next step: Manual test cases CSV (Prompt 4)*
