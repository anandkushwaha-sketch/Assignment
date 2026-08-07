# Requirements Analysis — QA Practical Assessment

> Extracted from `QA Practical Assessment.pdf` (Prompt 1)

## 1. Mandatory Deliverables

### Part A — AI Workflow Foundation (30%)
- `project-info.md` documenting AI-assisted testing workflow across the full lifecycle

### Part B — QA Mini Project (70%)
| # | Deliverable |
|---|-------------|
| 1 | Requirement and risk analysis for the SUT |
| 2 | `project-info.md` (UI, API, positive/negative/edge, Smoke/Regression) |
| 3 | Manual test suite — `FunctionalTestCase.csv` |
| 4 | UI automation (Playwright) — smoke + regression |
| 5 | API automation (Playwright) — core lifecycle APIs |
| 6 | Test data strategy |
| 7 | Execution evidence (logs, reports, screenshots) |
| 8 | `readme.md` with setup and run instructions |
| 9 | Full prompt history in `ai-prompts/` |
| 10 | All lifecycle artifacts in clear repo structure |
| 11 | Execution reports — all tests status `Passed` |
| 12 | Public Git repo URL shared |

## 2. UI and API Acceptance Criteria

### System Under Test
| Layer | URL |
|-------|-----|
| UI | https://practicesoftwaretesting.com/ |
| API | https://api.practicesoftwaretesting.com/api/documentation |

### UI ACs
- **AC1:** Register → Login → Verify profile
- **AC2:** Browse products → Add multiple items → Update quantity → COD checkout → View invoice in My Invoices
- **Special:** Press Confirm **twice** to generate invoice

### API ACs
- **AC1:** Register → Login → Bearer token → Create cart
- **AC2:** Get products → Add to cart → Verify cart → Generate invoice (COD)

## 3. Test-Count Restrictions

- **5–8 test cases per type:** Manual, UI, API
- Count includes both `@Smoke` and `@regression` tags within each type
- Approximate total: 15–24 test cases

## 4. Required Tools and Framework

| Tool | Requirement |
|------|-------------|
| Automation | Playwright + Prism Framework |
| AI | Cursor AI |
| Language | Playwright JS |
| API testing | Playwright request API (same framework) |

## 5. Submission Structure

```
qa-ai-practical-assessment/
├── FunctionalTestCase.csv
├── PrismStructure/
├── project-info.md
├── readme.md
├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
└── .Cursor/ (optional)
```

## 6. Important Special Instructions

- Not pass/fail — focus on AI workflow visibility
- Core effort: 5–10 focused hours
- All test cases must show status `Passed` in execution reports
- Iterative prompting and **iterative Git commits** (not single push)
- Payment method: Cash on Delivery
- Stay within Cursor monthly token limit
- Use Auto/Composer for planning; Sonnet for automation/debugging

## 7. Ambiguous or Conflicting Requirements

| Issue | Resolution |
|-------|------------|
| Generic CRUD ACs vs ecommerce SUT | Follow AC1/AC2 examples; map CRUD to catalog/cart/invoice flows |
| "All possible flows" vs 5–8 cap | Prioritize and document exclusions in risk analysis |
| Sanity vs Smoke | Treat Sanity ≈ Smoke; use `@Smoke` tag in Playwright |
| `ai-prompts/` file list mismatch | Include all 5 files (with `test-data.md`) |
| All Passed vs negative tests | Assert expected error behavior so tests still Pass |
| Selenium mentioned in folder template | Use Playwright only |
