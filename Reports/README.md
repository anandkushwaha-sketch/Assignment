# Reports Folder — Toolshop QA Assessment

Execution artifacts generated on **2026-08-07**.

## Contents

| File / folder | Description |
|---------------|-------------|
| [`assessment-completion-status.md`](./assessment-completion-status.md) | Completed vs incomplete items per assessment PDF |
| [`api-test-execution-report.md`](./api-test-execution-report.md) | API test results (7/7 Passed) |
| [`api-test-execution-report.csv`](./api-test-execution-report.csv) | API results spreadsheet |
| [`ui-test-execution-report.csv`](./ui-test-execution-report.csv) | UI results + video file mapping |
| [`manual-test-execution-report.csv`](./manual-test-execution-report.csv) | Manual case status |
| [`playwright-html-report/`](./playwright-html-report/) | Interactive HTML report (open `index.html`) |
| [`playwright-test-results.json`](./playwright-test-results.json) | Machine-readable full suite results (14/14 Passed) |
| [`videos/`](./videos/) | UI execution screen recordings (`.webm`) |
| [`test-artifacts/`](./test-artifacts/) | Raw Playwright artifacts (traces, screenshots, videos) |
| `full-execution-console-log.txt` | Full suite console output |
| `api-execution-console-log.txt` | API-only console output |
| `ui-execution-console-log.txt` | UI-only console output (earlier run) |
| [`FunctionalTestCase.csv`](./FunctionalTestCase.csv) | Copy of manual test suite with status |

## Quick results

| Suite | Passed |
|-------|--------|
| Full automation (14 tests) | **14 / 14** |
| API (7 tests) | **7 / 7** |
| UI (7 tests) | **7 / 7** (final recorded run) |
| Manual (8 cases) | **7 Passed**, **1 Pending Manual** (TC-MAN-08) |

## View HTML report

Open `playwright-html-report/index.html` in a browser, or from project root:

```bash
cd PrismStructure-toolshop-playwright
npx playwright show-report ../Reports/playwright-html-report
```

## Regenerate

```bash
cd PrismStructure-toolshop-playwright
npx playwright test -c playwright.record.config.js
```

Videos and reports will be refreshed under `Reports/`.
