# AI Prompt History — Documentation and Summary

> `project-info.md`, `README.md`, prompt history | Phase 7

---

## Entry — Prompt 17: project-info.md

### Prompt
Create `project-info.md` for the Toolshop QA assessment with project summary, SUT, tools, scope/ACs, risk analysis, UI/API strategy, smoke/regression strategy, coverage, test-data strategy, AI usage, responsible AI, and reuse guidance. Describe only work present in the repository.

### AI Response Summary
AI reviewed repo structure, docs, tests, and git history, then created `project-info.md` at repository root. Documented actual test IDs, file locations, npm scripts, 7 UI / 7 API / 8 manual counts, double-confirm quirk, and noted where planning docs differ from final automation (e.g. TC-UI-01/06 consolidated flows).

### Validation Notes
File created (`project-info.md`). Cross-checked against committed artifacts through `dd73bb9` plus uncommitted Prompt 14–15 fixes noted in git status. **Not committed** as of Prompt 19.

### Changes I Made
None beyond issuing the prompt and scope constraint ("only work actually present").

### Reason for Changes
N/A — documentation deliverable.

---

## Entry — Prompt 18: README.md

### Prompt
Create `README.md` from actual repository: overview, prerequisites, installation, configuration without secrets, test-data location, all run commands, reports, structure, known behavior (double confirm), troubleshooting. Verify commands against `package.json` and `playwright.config.js`.

### AI Response Summary
AI read `package.json`, `playwright.config.js`, `.env.example`, `.gitignore`, and test layout. Created `README.md` with verified npm scripts (`test`, `test:ui`, `test:api`, `test:smoke`, `test:regression`, `report`), reporter paths (`playwright-report/`, `reports/test-results.json`), and troubleshooting from real Prompt 14–16 issues.

### Validation Notes
Ran `npm run` to list scripts — matches README table. Config values (60s timeout, Chromium, `data-test`, CI retries/workers) verified against `playwright.config.js`. **Not committed** as of Prompt 19.

### Changes I Made
None beyond issuing the prompt.

### Reason for Changes
N/A — setup/run guide for evaluators and future reuse.

---

## Entry — Prompt 19: Prompt history format

### Prompt
Summarize this conversation for the appropriate `ai-prompts` markdown file(s). Use Entry / Prompt / AI Response Summary / Validation Notes / Changes I Made / Reason for Changes. Do not invent prompts, responses, validation, or results. Distinguish AI suggestions from QA engineer decisions.

### AI Response Summary
AI created the `ai-prompts/` folder with five files per assessment submission structure:
- `requirements-and-planning.md` — Prompts 1–3, Git setup, commit rule, Prompt 6
- `test-design.md` — Prompts 4–5
- `test-data.md` — data fixtures and Prompt 14–15 data fixes
- `automation-and-debugging.md` — Prompts 7–16
- `documentation-and-summary.md` — Prompts 17–19 (this file)

Summaries derived from conversation transcript and `git log`; execution results only where tests were actually run in the session.

### Validation Notes
Transcript searched for `### Prompt` markers (Prompts 1–19). Git history: commits through `dd73bb9`; Prompt 14–18 file changes largely uncommitted per `git status` at time of writing.

### Changes I Made
**QA engineer decision:** Requested structured prompt history as final documentation deliverable.

### Reason for Changes
Assessment Part A (30%) requires visible AI workflow across the lifecycle; prompt history satisfies submission structure in `docs/01-requirements-analysis.md`.

---

## Summary: AI vs QA engineer roles

| Activity | Primarily AI | Primarily QA engineer |
|----------|--------------|----------------------|
| Requirements extraction | Drafted `docs/01` from PDF | Provided PDF path |
| Risk/manual design | Drafted analysis and CSV | Approved Prompt 5 corrections ("yes") |
| Framework/tests | Scaffolded code and specs | Set commit-per-step rule; directed execution prompts |
| Debugging | Proposed locators/assertion fixes from traces | Approved fixes; rejected weakening assertions |
| API status codes | Probed live API, updated expectations | Accepted observed 422 vs assumed 404 |
| Documentation | Drafted `project-info.md`, `README.md`, prompt history | Scoped docs to actual repo contents |
| Validation | Ran suites, reported pass/fail counts | Requested Prompt 16 full validation before docs |

---

## Known gaps (as of Prompt 19)

| Item | Status |
|------|--------|
| Prompt 14–15 automation fixes | Modified in working tree; not in `git log` after `dd73bb9` |
| `project-info.md`, `README.md`, `ai-prompts/` | Created; uncommitted |
| Public Git push | Not performed in this conversation |
| Manual CSV execution | `ActualResult` / `Status` still blank (not executed manually in session) |
