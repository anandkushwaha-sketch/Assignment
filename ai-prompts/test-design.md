# AI Prompt History — Test Design

> Manual test cases and coverage review | `FunctionalTestCase.csv`

---

## Entry — Prompt 4: Manual test CSV

### Prompt
Create 8 manual functional test cases covering registration/login, invalid login, product search, multi-product cart, quantity update, COD checkout, invoice verification, and one edge/negative checkout scenario. Use the specified CSV columns. Use Smoke/Regression tags. Leave `ActualResult` and `Status` blank.

### AI Response Summary
AI created `FunctionalTestCase.csv` with TC-MAN-01 through TC-MAN-08. Initial TC-MAN-08 was an empty-cart checkout negative. All rows initially used `TestType: Functional`.

### Validation Notes
8 cases within 5–8 limit. Committed as `5c07cd0`. `ActualResult` and `Status` columns left empty as requested.

### Changes I Made
None beyond specifying 8 cases and required coverage areas.

### Reason for Changes
N/A — first manual suite draft.

---

## Entry — Prompt 5: Review test coverage

### Prompt
Review `FunctionalTestCase.csv` against assessment requirements. Check traceability, positive/negative/edge coverage, Smoke/Regression tags, preconditions/expected results, duplicates, and 5–8 test limit. List problems first, then propose only necessary corrections.

### AI Response Summary
AI identified five issues: (1) all `TestType` values were `Functional`, (2) browse step missing in search case, (3) empty-cart negative overlapped automation scope vs. higher-value single-confirm negative, (4) registration steps lacked DOB/address detail, (5) missing execution-order preconditions. Proposed corrections 1–5 without applying them until approved.

### Validation Notes
Review was against `docs/01-requirements-analysis.md` ACs and risk doc priorities. No file changes until next prompt.

### Changes I Made
None at review stage — AI listed problems and proposals only.

### Reason for Changes
N/A — review-only step.

---

## Entry — Prompt 5 (approval): Apply corrections

### Prompt
"yes"

### AI Response Summary
AI applied corrections 1–5 to `FunctionalTestCase.csv`: updated `TestType` to Positive/Negative/Edge; expanded TC-MAN-04 for catalog browse + search; replaced TC-MAN-08 with **single Confirm does not generate invoice** negative; clarified TC-MAN-01 registration fields; added preconditions on TC-MAN-02, TC-MAN-06, TC-MAN-07.

### Validation Notes
Committed as `e556b2c`. Re-reviewed CSV — still 8 cases, within limit.

### Changes I Made
**QA engineer decision:** Approved AI-proposed corrections with "yes". Chose single-confirm negative over empty-cart checkout for TC-MAN-08 (AI recommendation accepted).

### Reason for Changes
Single-confirm maps to the assessment's documented invoice quirk; empty-cart was deferred to UI automation (TC-UI-07).
