# API Investigation — Practice Software Testing Toolshop v5.0

> Prompt 11 | Source: https://api.practicesoftwaretesting.com/api/documentation  
> OpenAPI spec: `GET /docs?api-docs.json` (saved locally as `docs/api-docs.json`)

**Base URL:** `https://api.practicesoftwaretesting.com`

**Authentication scheme (`apiAuth`):**
- Type: HTTP Bearer
- Format: JWT
- Header: `Authorization: Bearer <access_token>`
- Token obtained from `POST /users/login`

---

## 1. User Registration

| Item | Detail |
|------|--------|
| **Endpoint** | `POST /users/register` |
| **Auth required** | No (`security` not declared) |
| **Content-Type** | `application/json` |

### Request body (`UserRequest`)

**Required fields:**
| Field | Type | Constraints |
|-------|------|-------------|
| `first_name` | string | maxLength 40 |
| `last_name` | string | maxLength 20 |
| `email` | string (email) | maxLength 256 |
| `password` | string (password) | minLength 8; must include uppercase, lowercase, number, symbol |

**Optional fields:**
| Field | Type | Constraints |
|-------|------|-------------|
| `address` | object | `street`, `house_number`, `city`, `state`, `country`, `postal_code` |
| `phone` | string | maxLength 24 |
| `dob` | string (date) | Must be valid date between 18 and 75 years ago |

### Documented responses

| Status | Description |
|--------|-------------|
| **201** | Success — returns `UserResponse` |
| **400** | Bad Request |
| **401** | Unauthorized |
| **403** | Forbidden |
| **409** | Duplicate conflict (e.g. email already exists) |

### Response body (`UserResponse` — documented fields)
`id`, `first_name`, `last_name`, `email`, `address`, `phone`, `dob`, `provider`, …

---

## 2. Login

| Item | Detail |
|------|--------|
| **Endpoint** | `POST /users/login` |
| **Auth required** | No |
| **Content-Type** | `application/json` |

### Request body (`AccountRequest`)

**Required fields:**
| Field | Type | Example |
|-------|------|---------|
| `email` | string | `customer@practicesoftwaretesting.com` |
| `password` | string | `welcome01` |

### Documented responses

| Status | Description |
|--------|-------------|
| **200** | Success — returns `TokenResponse` |

### Response body (`TokenResponse`)
| Field | Type | Example |
|-------|------|---------|
| `access_token` | string | `super-secret-token` |
| `token_type` | string | `Bearer` |
| `expires_in` | number | `120` |

### Related authenticated endpoint
| Endpoint | Auth | Success |
|----------|------|---------|
| `GET /users/me` | Bearer required | **200** `UserResponse` |
| | | **401** Unauthorized |

---

## 3. Product Retrieval

### 3a. List all products

| Item | Detail |
|------|--------|
| **Endpoint** | `GET /products` |
| **Auth required** | No |

**Optional query parameters:** `by_brand`, `by_category`, `is_rental`, `between`, `sort`, `page`

| Status | Description |
|--------|-------------|
| **200** | Paginated `ProductResponse[]` in `data` array |
| **404** | Resource not found |
| **405** | Method not allowed |

**Pagination wrapper fields:** `current_page`, `data`, `from`, `last_page`, `per_page`, `to`, `total`

### 3b. Search products

| Item | Detail |
|------|--------|
| **Endpoint** | `GET /products/search` |
| **Auth required** | No |

**Required query parameter:** `q` (search phrase — searches `name` column)

**Optional:** `page`

| Status | Description |
|--------|-------------|
| **200** | Paginated `ProductResponse[]` |
| **404** | Resource not found |
| **405** | Method not allowed |

### 3c. Get product by ID

| Item | Detail |
|------|--------|
| **Endpoint** | `GET /products/{productId}` |
| **Auth required** | No |

| Status | Description |
|--------|-------------|
| **200** | `ProductResponse` |
| **404** | Item not found |
| **405** | Method not allowed |

### `ProductResponse` (documented fields)
`id`, `name`, `description`, `price`, `is_location_offer`, `is_rental`, `in_stock`, `co2_rating`, `is_eco_friendly`, `brand`, `category`, `product_image`

---

## 4. Cart Creation

| Item | Detail |
|------|--------|
| **Endpoint** | `POST /carts` |
| **Auth required** | No (`security` not declared) |
| **Request body** | None documented |

| Status | Description |
|--------|-------------|
| **201** | Success — returns `{ "id": "<cartId>" }` |
| **404** | Item not found |
| **405** | Method not allowed |
| **422** | Unprocessable entity |

---

## 5. Adding Products to Cart

| Item | Detail |
|------|--------|
| **Endpoint** | `POST /carts/{id}` |
| **Auth required** | **Not declared in OpenAPI** |
| **Path parameter** | `id` — Cart ID |
| **Content-Type** | `application/json` |

### Request body (required)

| Field | Type | Example |
|-------|------|---------|
| `product_id` | string | `01HHJC7RERZ0M3VDGS6X9HM33A` |
| `quantity` | integer | `1` |

| Status | Description |
|--------|-------------|
| **200** | Success — `{ "result": "item added or updated" }` |
| **404** | Item not found |
| **405** | Method not allowed |
| **422** | Unprocessable entity |

### Related: Update quantity

| Item | Detail |
|------|--------|
| **Endpoint** | `PUT /carts/{cartId}/product/quantity` |
| **Body** | `{ "product_id": string, "quantity": integer }` |
| **Auth** | Not declared |
| **Success** | **200** (`UpdateResponse`) |

### ⚠️ Note on `/carts/{cartId}/product/{productId}`
OpenAPI documents **only `DELETE`** on this path (remove product from cart).  
There is **no documented `POST`** on `/carts/{cartId}/product/{productId}` for adding items.

---

## 6. Cart Verification

| Item | Detail |
|------|--------|
| **Endpoint** | `GET /carts/{cartId}` |
| **Auth required** | **Not declared in OpenAPI** |

| Status | Description |
|--------|-------------|
| **200** | Returns `CartResponse` |
| **404** | Item not found |
| **405** | Method not allowed |

### `CartResponse` (documented schema)
Only `id` (string) is documented.

---

## 7. Invoice Generation

| Item | Detail |
|------|--------|
| **Endpoint** | `POST /invoices` |
| **Auth required** | **Yes** — Bearer token (`apiAuth`) |
| **Content-Type** | `application/json` |

### Request body (`InvoiceRequest`)

**Required fields:**
| Field | Type | Notes |
|-------|------|-------|
| `billing_street` | string | |
| `billing_city` | string | |
| `billing_state` | string | |
| `billing_country` | string | |
| `billing_postal_code` | string | |
| `payment_method` | string | enum — see below |
| `payment_details` | object | Required; shape depends on payment method |
| `cart_id` | string | Cart to invoice |

**`payment_method` enum values:**
- `bank-transfer`
- `cash-on-delivery`
- `credit-card`
- `buy-now-pay-later`
- `gift-card`

**`payment_details` for Cash on Delivery:**
- Schema title: `CashOnDeliveryDetails`
- Type: `object` (no additional properties documented — empty `{}` is valid per assessment example)

### Documented responses

| Status | Description |
|--------|-------------|
| **200** | Success — returns `InvoiceResponse` (not 201) |
| **401** | Unauthorized |
| **404** | Item not found |
| **405** | Method not allowed |
| **422** | Unprocessable entity |

### `InvoiceResponse` (documented fields)
`id`, `user_id`, `invoice_date`, `invoice_number`, `billing_street`, `billing_city`, `billing_state`, `billing_country`, `billing_postal_code`, `additional_discount_percentage`, `additional_discount_amount`, `subtotal`, `total`, `status`, `status_message`, `invoicelines`, `created_at`

### Related: List invoices (verification)

| Item | Detail |
|------|--------|
| **Endpoint** | `GET /invoices` |
| **Auth required** | Yes — Bearer token |
| **Success** | **200** — paginated `InvoiceResponse[]` |
| **401** | Unauthorized |

| Item | Detail |
|------|--------|
| **Endpoint** | `GET /invoices/{invoiceId}` |
| **Auth required** | Yes |
| **Success** | **200** — single `InvoiceResponse` |

---

## 8. Recommended API Test Flow (AC1 + AC2)

```
POST /users/register          → 201
POST /users/login             → 200 (capture access_token)
GET  /users/me                → 200 (optional profile verify)
GET  /products                → 200 (select in_stock products)
POST /carts                   → 201 (capture cart id)
POST /carts/{id}              → 200 (add product_id + quantity)
GET  /carts/{cartId}          → 200 (verify cart)
POST /invoices                → 200 (Bearer + InvoiceRequest COD)
GET  /invoices                → 200 (verify invoice listed)
```

---

## 9. Documentation Uncertainties (report before writing tests)

| # | Area | Issue | Impact on tests |
|---|------|-------|-----------------|
| 1 | **Login failure** | OpenAPI documents **only 200** for `POST /users/login`. No 401/422 error response documented. | Cannot assert documented status for invalid login — must discover at runtime or treat as undocumented. |
| 2 | **Cart auth** | `POST /carts`, `POST /carts/{id}`, `GET /carts/{cartId}` have **no `security` block**. Unclear if Bearer token is required, optional, or not needed. | Tests must verify whether cart operations work without token vs require authenticated user. |
| 3 | **Cart response shape** | `CartResponse` schema documents **only `id`**. No `items`, `products`, `quantity`, or `total` fields documented. | Cart verification assertions cannot rely on documented fields alone — response shape is under-specified. |
| 4 | **Add-to-cart endpoint naming** | Documented add endpoint is `POST /carts/{id}` with JSON body — **not** `POST /carts/{cartId}/product/{productId}`. | Existing `cartApiPage.addProduct()` uses undocumented path — **must be corrected** before API tests. |
| 5 | **Path parameter naming** | Add item uses `{id}`; get cart uses `{cartId}`. Same value, inconsistent param names in spec. | Low risk — use cart ID value in both. |
| 6 | **Registration optional fields** | `address`, `phone`, `dob` are optional in schema but may be **required at runtime** by API validation. | Tests should include them (as assessment examples do) until proven optional. |
| 7 | **Invoice success code** | Returns **200** not **201** for `POST /invoices`. | Assert 200, not 201. |
| 8 | **Invoice `payment_details`** | COD `payment_details` is required but schema defines empty object with no properties. | Use `{}` for COD per assessment sample; do not invent fields. |
| 9 | **Product list pagination** | Default `per_page` and whether all products returned on page 1 is **not documented**. | Tests should not assume single-page results without checking `last_page`. |
| 10 | **Token expiry** | `expires_in` example is `120` seconds. | Long E2E API chains may need token refresh via `POST /users/refresh` (exists but out of scope). |
| 11 | **Cart–user association** | Not documented whether cart is linked to authenticated user or session-only. | May affect whether login is required before add/invoice steps. |
| 12 | **422 error body** | `UnprocessableEntityResponse` referenced but error body structure not detailed in this review. | Negative tests need runtime inspection for assertion messages. |

---

## 10. Framework alignment gaps (existing `cartApiPage.js`)

| Current implementation | Documented API | Action needed |
|------------------------|----------------|---------------|
| `POST /carts/{cartId}/product/{productId}` | **Not documented** | Replace with `POST /carts/{id}` + body |
| `GET /carts/{cartId}` with Bearer | Auth not documented | Confirm at runtime; may work without token |
| `authApiPage.register()` → `/users/register` | Correct | OK |
| `authApiPage.login()` → `/users/login` | Correct | OK |

---

*Next step: Prompt 12 — API automation tests (after resolving uncertainties above)*
