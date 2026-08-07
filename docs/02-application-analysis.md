# Application Analysis — Practice Software Testing Toolshop

> Prompt 2 — QA engineer analysis of https://practicesoftwaretesting.com/

## Application Overview

| Item | Detail |
|------|--------|
| App | E-commerce toolshop (Angular 20 SPA) |
| API | Laravel 12 REST API v5.0 |
| UI URL | https://practicesoftwaretesting.com/ |
| API URL | https://api.practicesoftwaretesting.com/ |

### Key Routes
| Route | Purpose |
|-------|---------|
| `/auth/register` | User registration |
| `/auth/login` | User login |
| `/account/profile` | Profile view/update |
| `/account/invoices` | My Invoices |
| `/checkout` | Checkout wizard |
| `/product/{id}` | Product detail |
| `/` | Product catalog |

## Testable Flows

### 1. Registration
| Type | Scenario |
|------|----------|
| Positive | Valid first/last name, email, strong password |
| Negative | Duplicate email, weak password, invalid email |
| Edge | Min password length, DOB outside 18–75 range |

### 2. Login & Profile
| Type | Scenario |
|------|----------|
| Positive | Login + verify profile name/email |
| Negative | Wrong password, unregistered email, unauthenticated access |
| Edge | Login immediately after registration |

### 3. Product Browsing & Search
| Type | Scenario |
|------|----------|
| Positive | View catalog, open detail, search by name, filter/sort |
| Negative | Search with no matches |
| Edge | Out-of-stock product detail view |

### 4. Cart & Quantity
| Type | Scenario |
|------|----------|
| Positive | Add single/multiple products, update quantity, remove item |
| Negative | Add out-of-stock product |
| Edge | Quantity min/max boundaries |

### 5. Checkout (Cash on Delivery)
| Type | Scenario |
|------|----------|
| Positive | Logged-in checkout with valid billing + COD |
| Negative | Empty cart, missing billing fields |
| Edge | Guest checkout (if enabled) |

### 6. Invoice Generation
| Type | Scenario |
|------|----------|
| Positive | Double-confirm → invoice created → visible in My Invoices |
| Negative | Single confirm only (invoice not generated) |
| Edge | Invoice totals match cart |

## Smoke vs Regression

| Area | Smoke | Regression |
|------|-------|------------|
| Registration | Valid new user | Duplicate email, weak password |
| Login/Profile | Login + verify profile | Invalid login, unauth access |
| Browse/Search | View catalog + 1 product | Search, filters, no-results |
| Cart | Add 1 product | Multi-item, qty update, remove |
| Checkout | COD with valid billing | Empty cart, missing fields |
| Invoice | Generate (confirm x2) + view | Single confirm failure |

## Recommended UI Automation Suite (7 tests)

| ID | Tag | Title | Type |
|----|-----|-------|------|
| TC-UI-01 | @Smoke | Register new user with valid details | Positive |
| TC-UI-02 | @Smoke | Login and verify profile information | Positive |
| TC-UI-03 | @regression | Login with invalid credentials | Negative |
| TC-UI-04 | @regression | Search product and open detail page | Positive |
| TC-UI-05 | @regression | Add multiple products and update cart quantity | Positive/Edge |
| TC-UI-06 | @Smoke @regression | Complete COD checkout and generate invoice (confirm x2) | Positive |
| TC-UI-07 | @regression | Verify invoice in My Invoices | Positive |

Optional 8th: TC-UI-08 — Add out-of-stock product (Negative/Edge)

## Test Data Strategy

| Data | Approach |
|------|----------|
| Users | Unique email per run (`user+{timestamp}@test.com`) |
| Password | `Test@1234` (meets complexity rules) |
| In-stock products | Claw Hammer, Hammer (dynamic `in_stock === true`) |
| Out-of-stock | Combination Pliers |
| Billing | Assessment sample: Zoey Shore, Hesselbury, Florida, TG, 1234AA |
| Payment | `cash-on-delivery` only |

## Risks

| Risk | Mitigation |
|------|------------|
| Double-confirm invoice | Two explicit confirm clicks in TC-UI-06 |
| Out-of-stock flakiness | Select products dynamically by stock status |
| SPA async loading | Playwright auto-wait + stable locators |
| Shared environment | Unique users per run |
