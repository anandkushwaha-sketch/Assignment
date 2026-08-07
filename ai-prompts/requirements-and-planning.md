# AI Prompt History — Requirements and Planning

> Phases 1 and setup | Repository: `Assignment` | SUT: Practice Software Testing Toolshop

---

## Entry — GitHub repository connection

### Prompt
Connect the local workspace to `https://github.com/anandkushwaha-sketch/Assignment.git`.

### AI Response Summary
AI inspected the local folder and remote repository, confirmed the Git remote, and reported repository state (existing commits vs. empty local tree).

### Validation Notes
Remote URL and branch alignment were checked via Git commands. No application tests were run in this step.

### Changes I Made
**QA engineer decision:** Requested GitHub connection before starting assessment work.

### Reason for Changes
Establish version control and remote backup for iterative commits required by the assessment.

---

## Entry — Prompt 1: Project requirements

### Prompt
Read the attached QA Practical Assessment document. Extract mandatory deliverables, UI/API acceptance criteria, test-count restrictions, required tools/framework, submission structure, and special instructions. Do not create code. Highlight ambiguous or conflicting requirements.

### AI Response Summary
AI requested the PDF path when the file was not attached initially. After receiving `QA Practical Assessment.pdf`, AI produced `docs/01-requirements-analysis.md` covering deliverables (including `project-info.md`, `FunctionalTestCase.csv`, Prism Playwright, `ai-prompts/`), AC1/AC2 for UI and API, 5–8 tests per tier, Playwright + Prism + Cursor AI, and noted ambiguities (e.g. double-confirm invoice, tag counting within tier limits).

### Validation Notes
Content was derived from the assessment PDF. Committed as `c427b98`. No code created.

### Changes I Made
**QA engineer decision:** Provided PDF path (`c:\Users\Anand Kushwaha\Downloads\QA Practical Assessment.pdf`) when prompted.

### Reason for Changes
PDF was required input; AI could not extract requirements without the source document.

---

## Entry — Prompt 2: Application analysis

### Prompt
Analyze https://practicesoftwaretesting.com/ as a QA engineer. Identify testable ecommerce flows (registration, login/profile, browse/search, cart, COD checkout, invoice). Categorize Smoke vs Regression with positive/negative/edge scenarios. Keep scope suitable for 5–8 UI automated tests.

### AI Response Summary
AI analyzed the live application and produced `docs/02-application-analysis.md` with routes, flow tables, smoke/regression mapping, and a proposed 7-test UI suite (TC-UI-01 through TC-UI-08 optional).

### Validation Notes
Analysis based on live site exploration and application structure. Committed as `83a0e92`.

### Changes I Made
None beyond issuing the prompt.

### Reason for Changes
N/A — planning-only step.

---

## Entry — Working rule: commit after each step

### Prompt
"always commit after each step"

### AI Response Summary
AI acknowledged the rule and retroactively committed Prompts 1–2 as separate commits (`c427b98`, `83a0e92`), then committed each subsequent phase individually.

### Validation Notes
`git log` shows one commit per completed prompt through Prompt 13 (`dd73bb9`).

### Changes I Made
**QA engineer decision:** Set iterative commit expectation for all remaining work.

### Reason for Changes
Matches assessment instruction for visible, incremental Git history.

---

## Entry — Prompt 3: Risk analysis

### Prompt
Create requirement and risk analysis for the Toolshop. For each major flow: requirement/AC, business risk, failure impact, testing priority, recommended UI/API coverage, Smoke/Regression classification. Special focus on auth, cart state, checkout, duplicate confirmation, and invoice generation.

### AI Response Summary
AI created `docs/03-requirement-and-risk-analysis.md` with P1–P4 priority matrix, per-flow risk tables, double-confirm quirk documentation, scope exclusions, and recommended test allocation across manual/UI/API tiers.

### Validation Notes
Committed as `660cfea`. Cross-referenced against Prompts 1–2 docs.

### Changes I Made
None beyond issuing the prompt.

### Reason for Changes
N/A — planning deliverable.

---

## Entry — Prompt 6: Existing project inspection

### Prompt
Inspect the existing repository and Prism Playwright structure. Explain folder conventions, POM pattern, fixtures, test-data, tagging, UI/API execution, and report configuration. Follow existing patterns. Do not modify files.

### AI Response Summary
AI reported **no Prism structure existed** — only `docs/`, `FunctionalTestCase.csv`, and `.gitignore`. Documented expected Prism conventions to follow when scaffolding in Prompt 7.

### Validation Notes
Verified by listing repository contents at that point in the conversation. No files modified.

### Changes I Made
None — read-only inspection.

### Reason for Changes
N/A — reconnaissance before framework setup.
