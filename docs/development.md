# Development

## Setup

Run commands from the repository root. Use Node 24 from [`.node-version`](../.node-version); the existing minimum remains Node 22.22.0. The manifest and lockfile own package versions.

```bash
npm ci
npm run lint
npm test
```

The unit suite uses Node's test runner and needs no model or API key. It covers six grading checks and result summarization/baseline/comparison behavior; the expected baseline is 16 passing tests. Installation needs network access and may build native Promptfoo dependencies.

Install [pre-commit](https://pre-commit.com/) 4.7.0 using your Python tool manager, then activate the local hooks:

```bash
pipx install pre-commit==4.7.0
pre-commit install
pre-commit run --all-files
```

Use an existing pre-commit 4.7.0 installation instead of installing it twice. Initial hook setup downloads pinned tools; subsequent checks are independent of models and cloud services. Review changes made by whitespace/newline hooks and restage deliberately; a failed hook blocks the commit.

## Configuration and extension

| Mode | Config/command | Prerequisites and output |
| --- | --- | --- |
| Offline checks | `npm run lint`, `npm test`, `pre-commit run --all-files` | Locked tools; no model, keys or evaluation output |
| Test design | `npm run eval:test-design` | Ollama and both configured Qwen models; `outputs/test-design-results.json` and `.csv` |
| Translation | `npm run eval` | Ollama and configured Qwen 3.8 model; `outputs/results.json` and `outputs/results-latest.csv` |
| Cloud comparison | `npm run eval:full` | Local model plus provider keys; same translation output paths, so preserve earlier results first |
| Watch | `npm run eval:watch` | Translation prerequisites; reevaluates changes |
| Viewer/sharing | `npm run report`, `npm run publish` | Existing run; publish shares externally and requires a deliberate decision |
| Regression analysis | `npm run baseline`, `npm run compare` | Compatible saved JSON runs; see the README for argument examples |

The [README quickstart](../README.md#quickstart) owns model pulls and platform notes. [Customizing the suites](customizing.md) owns cloud setup, env variables, all provider/test/prompt examples and evaluation conventions. Keep secrets in ignored `.env` files. Do not copy keys or real user data into committed fixtures or reports.

For test-design changes, edit the story criteria and must-haves together, retain observable expected results and inspect model-graded output. For assertion/helper code changes, extend the nearby `*.test.js` behavioral tests before changing the implementation. Changes to prompts, grader, provider, runtime or evaluation dependencies need local-model execution evidence in addition to unit checks. Keep trusted results/baselines under separate names before running commands that reuse the configured output paths.

## Quality gates

| Command | Scope |
| --- | --- |
| `npm run lint:js` | All maintained JavaScript, using ESLint's recommended rules and Node/CommonJS globals |
| `npm run format:check` | JavaScript and JSON/JSONC tool configuration, using Prettier in check mode |
| `npm run lint:md` | Root Markdown and current guides, using markdownlint defaults with MD013 disabled |
| `npm run lint` | All three checks above |
| `npm test` | Existing assertion and saved-run-analysis unit tests |
| `pre-commit run --all-files` | Static checks above plus whitespace, final newline, merge markers, YAML and strict JSON syntax on tracked files |

Hooks receive staged paths; pre-commit temporarily stashes unstaged changes. ESLint, Prettier and Markdown hooks use the npm-locked versions. CI independently checks every maintained tracked file, not just the diff. Generic hook revisions are SHA-pinned. Markdown hard breaks are allowed; JSONC is formatted as JSONC, not passed to a strict JSON parser.

Prompt text and evaluation YAML are excluded from formatting, not from applicable syntax/text checks. Generated outputs, dependencies and `.superpowers/` scratch are excluded. `docs/superpowers/` holds historical planning records and is excluded from maintained-guide checks. There is no coverage-percentage gate or TypeScript build in this JavaScript evaluation project.

CI runs `Quality and unit tests (Node 24)` and `Node 22 compatibility`. Model evaluation, cloud requests and publishing never run automatically. Actions use full commit SHAs, read-only repository permissions and job timeouts; dependency updates are proposed weekly for npm and actions. Workflow checks do not become required merge checks until repository enforcement is configured.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Native dependency install fails | Confirm Node/npm versions, platform build tools and the locked dependency's installation error; do not delete the lockfile to hide incompatibility |
| Ollama connection/model error | Confirm the local service and exact provider tag, including the MLX versus standard-tag platform difference |
| JSON/translation assertion fails unexpectedly | Inspect raw output and confirm `think: false`; do not weaken assertions to accept reasoning text |
| Grader misses a must-have | Check behavior-based wording and literal example values; retain the README's grader-bias caveat |
| Local requests queue or time out | Retain the test-design concurrency limit and check model memory/availability |
| Baseline check fails | Inspect score changes and missing runs/metrics; do not automatically accept a new baseline |
| Hook cannot find Node tools | Run `npm ci` at the repository root and retry; do not bypass the hook |

## Verification and adoption record

Profile: `complete`. Policy revision: [a429dd2f2da55a4c3e1c73c7c0d1111f9cd0b9a9](https://github.com/yashwant-das/repo-standards/tree/a429dd2f2da55a4c3e1c73c7c0d1111f9cd0b9a9). Starting application revision: `ff1bb8a841d47889d6be3a899985f4a68b557e2e`.

### Compatibility decisions

- Node 24 is the development/primary-CI baseline; retain `>=22.22.0` and a Node 22 compatibility job rather than silently raising the supported minimum. Revisit if dependencies drop Node 22 support or before its end of support.
- Registry/release-note review on 2026-10-31 selected Promptfoo 0.125.1, js-yaml 5.5.0 and exact development-tool versions recorded in the manifest/lock. Promptfoo 0.125 makes Claude Agent/Codex SDKs and jks-js opt-in; this repository uses neither integration. Verify real local suites before claiming evaluation compatibility.
- Preserve the Promptfoo-native folder layout; no `src/` migration is needed. Keep customizing as a distinct third guide. The README retains historical benchmarks and all interpretation/caveat text; current dependency badges do not identify the historical benchmark's tool version.

### Execution evidence

The pre-adoption unit baseline passed 16/16 on Node 26.13.0. Supported-runtime, static, staged, presentation and model evidence follows. Passing offline checks does not imply every model output passed grading or that pending security/settings work is complete.

### Local verification (2026-10-31)

| Check | Evidence |
| --- | --- |
| Clean installation and offline checks | `npm ci`, `npm run lint`, `npm test` (16/16, no skips) and Promptfoo startup passed on Node 24.22.1/npm 11.20.0 and Node 22.22.0/npm 10.9.4 |
| Lock compatibility | npm 10 exposed two missing optional transitive entries in the npm 11 lock; regenerating with npm 10 restored clean installation on both toolchains |
| Configuration | All three unchanged Promptfoo configs pass `promptfoo validate config`; an isolated `PROMPTFOO_CONFIG_DIR` avoids modifying the user's normal database |
| Staged hooks | Twelve disposable-repository probes passed: valid commit, rejection of invalid JS/Markdown/JSON/YAML/merge markers/whitespace, unstaged-document isolation, partial JS staging with preserved unstaged hunk, Markdown hard breaks, deletion and ignored results |
| Content preservation | Thirteen protected prompt/config/data/license/env-example files byte-identical; six JavaScript files have formatting-only changes; all nine original npm scripts unchanged; customization differs only in table-separator whitespace |
| Showcase preservation | Entire benchmark/interpretation/caveat/baseline section retained, with table separator normalization only; 22 local file/anchor links resolve |
| Presentation | Root README, customizing and architecture rendered in Chromium; three Mermaid diagrams parsed and were visually inspected |
| Independent review | No blocking findings; clarified tested runtime wording and database-backed viewer data flow |

### Security and remote settings

A scoped override updates markdownlint's exact `re2js` dependency from vulnerable 2.8.6 to patched 2.8.7 without replacing the Markdown tool or changing its rules. Revisit/remove this override when markdownlint includes the fix. The older CLI was also checked but introduces different advisories, so the current stable CLI is retained with this patch.

After compatible transitive updates, `npm audit` reports 16 affected packages (5 high, 7 moderate, 4 low; none critical), including inherited advisory chains. This is pending security work, not an approved exception or a claim of safety. The remaining chains include Promptfoo's FTP/proxy and glob dependencies, ESLint's minimatch, and Markdown tooling's math dependencies. Do not run `npm audit fix --force`: its proposed historical Promptfoo/ESLint downgrades change the product/tool contracts. Owner: Yashwant Das; review before merge and when upstream patched compatible dependencies become available. Review exposure and narrow compatible upgrades rather than interpreting a passing test suite as security clearance.

The remote audit found an active default-branch ruleset preventing deletion and force pushes, but no required-status-check rule; classic branch protection returns “Branch not protected.” Proposed required checks are `Quality and unit tests (Node 24)` and `Node 22 compatibility`. Secret scanning and push protection are enabled; Dependabot security updates are disabled. Code-scanning availability/configuration remains to be confirmed. No settings were changed.

The existing description is 103 characters and already starts with “Grades”; retain it. Proposed topics for owner review: `ai-testing`, `javascript`, `promptfoo`, `ollama`, `llm-evaluation`, `test-generation`, `test-design`, `translation`. This removes the unused LM Studio topic. Metadata was not changed.

### Local-model execution

Both complete local suites ran on Node 24.22.1 with Promptfoo 0.125.1, unchanged prompts/configs/data, `--no-cache`, `--no-share` and `--no-write`. Results were exported separately and retained locally under ignored `outputs/standards-verification-2026-10-31/`; the existing results and baselines were preserved byte-for-byte.

| Suite | Result | Interpretation |
| --- | --- | --- |
| Translation | 135/135 passed; no assertion failures or execution errors; 1m 7s | Real generation and assertion execution across all three prompts |
| Test design | 11/20 passed, 9 assertion failures, 0 execution errors; 10m 5s | Real generation on both configured models and grading; this is completed execution, **not an all-green model evaluation** |

The saved 2026-10-19 run contains 14/20 passing cases. Comparing against that run flags pass-rate/metric drops beyond the default five-point baseline tolerance. The baseline command correctly exits 1 for these drops; a same-file baseline roundtrip passes. `compare` consumes the fresh output and reports changed cases. These observations do not isolate dependency effects from generation/grading variability; review the raw outputs before accepting an upgrade baseline. No baseline was automatically accepted, and no benchmark was rewritten. Owner review of the new scores remains pending.

The report screenshot in the README comes from the saved **2026-10-19** run (Promptfoo 0.123.1), imported into an isolated 0.125.1 viewer database. It shows only the two Qwen 3.8 prompt columns and is explicitly separate from both the September benchmark and fresh verification. The screenshot is the committed preview; the raw results and viewer database were not uploaded, and `npm run publish` was not run.

### Hosted verification and remaining review

At implementation head `2807b9e944a32834a3fffff45952f8e9c1dd590a`, both hosted checks passed: Node 24 quality/unit (37s) and Node 22 compatibility (28s). Later evidence/documentation commits require their own head checks; previous-head success does not satisfy that gate.

[Draft PR #5](https://github.com/yashwant-das/ai-js-promptfoo-eval/pull/5) remains for owner review of score differences, outstanding audit findings and settings proposals. Cloud-provider calls, publishing, merge and metadata/settings changes were not performed. Full compliance and unchanged model quality are not claimed.
