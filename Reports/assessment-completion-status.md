# QA Assessment — Completion Status vs PDF Requirements

> Source: `QA Practical Assessment.pdf` | Audit date: 2026-08-07

## Part A — AI Workflow Foundation (30%)

| # | PDF requirement | Status | Evidence |
|---|-----------------|--------|----------|
| A1 | `project-info.md` documenting AI-assisted workflow | **Complete** | `/project-info.md` |
| A2 | Full prompt history in `ai-prompts/` (5 files) | **Complete** | `/ai-prompts/*.md` |

## Part B — QA Mini Project (70%)

| # | PDF requirement | Status | Evidence |
|---|-----------------|--------|----------|
| 1 | Requirement and risk analysis | **Complete** | `docs/03-requirement-and-risk-analysis.md` |
| 2 | `project-info.md` (UI, API, coverage, Smoke/Regression) | **Complete** | `project-info.md` |
| 3 | Manual test suite `FunctionalTestCase.csv` | **Complete** | `FunctionalTestCase.csv` (8 cases) |
| 4 | UI automation — smoke + regression | **Complete** | `tests/ui/` — 7 tests, tags present |
| 5 | API automation — core lifecycle | **Complete** | `tests/api/` — 7 tests |
| 6 | Test data strategy | **Complete** | `test-data/`, `utils/dataGenerator.js`, documented in `project-info.md` |
| 7 | Execution evidence (logs, reports, screenshots) | **Complete** | This `Reports/` folder |
| 8 | `readme.md` with setup and run instructions | **Complete** (name variant) | `README.md` at repo root |
| 9 | Full prompt history | **Complete** | `ai-prompts/` |
| 10 | Clear repo structure | **Complete** (folder name variant) | `PrismStructure-toolshop-playwright/` |
| 11 | Execution reports — all tests `Passed` | **Mostly complete** | Automation 14/14 passed (see below); manual TC-MAN-08 pending |
| 12 | Public Git repo URL shared | **Complete** | https://github.com/anandkushwaha-sketch/Assignment.git |

## Acceptance criteria

| AC | Requirement | Status | Automated coverage |
|----|-------------|--------|-------------------|
| UI AC1 | Register → Login → Verify profile | **Complete** | TC-UI-01 |
| UI AC2 | Browse → Cart → Qty → COD → Invoice | **Complete** | TC-UI-06 |
| UI Special | Confirm button twice for invoice | **Complete** | `checkoutHelper.confirmInvoiceTwice()` |
| API AC1 | Register → Login → Token → Cart | **Complete** | TC-API-01 |
| API AC2 | Products → Cart → Verify → Invoice (COD) | **Complete** | TC-API-01 |

## Test-count rules (5–8 per type)

| Type | Count | Status |
|------|-------|--------|
| Manual | 8 | **Complete** |
| UI | 7 | **Complete** |
| API | 7 | **Complete** |

## Coverage types

| Type | Manual | UI | API |
|------|--------|----|-----|
| Positive | Yes | Yes | Yes (TC-API-01) |
| Negative | Yes | Yes | Yes |
| Edge | Yes (TC-MAN-06) | Yes (TC-UI-08) | — |

## Smoke / Regression

| Tag | Count | Status |
|-----|-------|--------|
| `@smoke` | 3 | **Complete** |
| `@regression` | 13 runs | **Complete** |

---

## Incomplete or partial items

| Item | Status | Action needed |
|------|--------|---------------|
| **TC-MAN-08** single-Confirm negative | **Incomplete** | Manual walkthrough only; CSV status = `Pending Manual` |
| Folder name `PrismStructure/` vs `PrismStructure-toolshop-playwright/` | **Naming variant** | Acceptable; documented in README |
| `readme.md` vs `README.md` | **Naming variant** | GitHub standard uses `README.md` |
| API tests have no browser video | **N/A** | API uses HTTP requests; logs in `api-execution-console-log.txt` |

---

## Latest automation execution (2026-08-07)

| Suite | Result |
|-------|--------|
| Full suite (14 tests) | **14 / 14 Passed** |
| API only (7 tests) | **7 / 7 Passed** |
| UI only (7 tests) | **6 / 7 Passed** on one parallel run; **7 / 7** on final recorded run |

See `full-execution-console-log.txt`, `api-test-execution-report.csv`, and `playwright-html-report/index.html`.
