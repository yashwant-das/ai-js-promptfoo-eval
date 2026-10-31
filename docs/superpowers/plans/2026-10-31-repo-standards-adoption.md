# Promptfoo Eval Repo Standards Adoption Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` to implement this plan task by task after owner review. Steps use checkboxes for tracking. This is the approved historical execution plan. Implementation and verification are recorded in [development](../../development.md); full adoption remains pending owner review of model-score differences, security findings and repository settings.

**Goal:** Apply the `complete` repo-standards profile while preserving all existing documentation information and the flagship README's technical depth and impact.

**Architecture:** Keep the runner-native Promptfoo layout and both existing suites. Add architecture, development and agent guidance around the existing README and customization guide; introduce reproducible tooling and offline quality gates without changing evaluation semantics.

**Tech stack:** JavaScript/CommonJS, Node test runner, npm, Promptfoo, Ollama, optional cloud providers, GitHub Actions. Proposed quality tools: ESLint, Prettier, markdownlint-cli2 and pre-commit.

**Spec:** The owner's request: create a plan to apply repo-standards; `README.md` and `docs/customizing.md` are accurate; miss no data and preserve their impact. The constraints and preservation inventory below make this request executable. Policy reference: [repo-standards at a429dd2](https://github.com/yashwant-das/repo-standards/tree/a429dd2f2da55a4c3e1c73c7c0d1111f9cd0b9a9), including its README, AGENTS and all five guides. This is the inspected local revision; verify its published status at execution time before pinning it.

## Global constraints

- `README.md` and `docs/customizing.md` are authoritative content baselines. Preserve their information, examples, qualifications and evidence.
- Keep the root README a flagship showcase; no generic rewrite, arbitrary line-count reduction or replacement with links to deep guides.
- Keep benchmark numbers, date, hardware, model/prompt identities, findings and caveats together on the landing page. Never replace historical results with invented or newly relabelled measurements.
- Keep `docs/customizing.md` at its existing path as the authoritative customization guide. It fits the complete profile's optional-guide budget.
- Preserve suite configuration, prompt text, stories, translation data, scoring, grader selection, concurrency and baseline semantics. Formatting must not change parsed data or behavior.
- Keep `prompts/`, `tests/`, `scripts/` and root `promptfooconfig*.yaml`. No artificial `src/` migration or filename normalization of functional inputs.
- Keep all existing npm commands working. Evaluations stay outside automatic CI; local unit/static checks need no models or API keys.
- Node 22.22 is the existing deliberate minimum; Node 24 is the standards target. Review compatibility and obtain an explicit baseline decision before raising the minimum. A pending decision is not an approved exception.
- Keep standards SHA/profile in `AGENTS.md`; put verification, pending work and exceptions in `docs/development.md`, not README rollout boilerplate.
- Plan creation does not authorize implementation, publishing evaluation results, metadata/settings changes, merging or paid provider runs.

## Review focus

1. A documentation edit can retain headings while dropping useful facts: Task 2 requires a complete content inventory and a human-readable before/after reconciliation.
2. Version updates can misrepresent old benchmarks: Tasks 2–3 separate current install versions from historical measurements and retain their provenance.
3. Formatting YAML or prompt files can alter model inputs, escaping or scores: Tasks 1 and 4 compare protected files and restrict formatter scope.
4. Offline green checks can be mistaken for successful model evaluations: Tasks 3 and 5 require explicit integration evidence or skipped-scope reporting.
5. Hooks can validate unstaged content or corrupt partially staged changes: Task 4 requires actual staged-file behavior probes and index/worktree preservation checks.

## Audit snapshot — 2026-10-31

| Area | Inspected state | Planned response |
| --- | --- | --- |
| Target checkout | Clean `main`, `ff1bb8a841d47889d6be3a899985f4a68b557e2e` | Recheck/fetch before execution; preserve branches and unrelated work |
| Standards checkout | Clean `main`, `a429dd2f2da55a4c3e1c73c7c0d1111f9cd0b9a9` | Verify remote revision, then pin explicitly |
| Documentation | README already has badges, motivation, two-layer Mermaid, results, stack, structure and commands; customization guide is substantial | Preserve and extend; add missing architecture/development/agent guides and README index |
| Runtime | Manifest `>=22.22.0`, README Node 22, CI Node 22; no runtime file | Review Node 24 adoption; align declarations only after the baseline decision |
| Packages | Manifest declares `promptfoo: ^0.124.1`, `js-yaml: ^5.4.2`; npm lock present | Verify resolved versions and current compatible stable releases at execution time |
| README versions | Promptfoo badge/table say 0.123 | Reconcile current tool metadata narrowly; do not infer benchmark tool version |
| Unit evidence | `npm test`: 16 passed, 0 failed, 0 skipped on host Node `v26.13.0`, npm `11.20.0` | Preserve tests and repeat on the selected supported runtime; this is not Node 24 evidence |
| Quality gates | No tracked lint/format/Markdown config, hooks or Dependabot file | Add bounded tooling with matched local and CI scope |
| CI | `tests.yml`: Node 22 unit tests, tag-based checkout/setup-node; no dependency install | Keep offline unit coverage; add installed static gates and workflow hardening |
| Live verification | No evaluations, report inspection, clean install or remote settings audit performed for this plan | Record as unverified, not passed |

## Approach and file responsibilities

Use additive adoption. A broad documentation rewrite has needless content risk; documentation-only adoption would leave dependency and CI requirements outstanding. Neither is the proposed execution path. Make small, reviewable changes with separate documentation and tooling diffs.

| File/path | Responsibility and intended change |
| --- | --- |
| `README.md` | Retain showcase and every existing substantive section; add a guide index, focused capability summary and links; narrowly reconcile commands/runtime/tool metadata when verified |
| `docs/customizing.md` | Keep all sections, examples and conventions; only necessary formatting and cross-links |
| `docs/architecture.md` — new | Detailed suite/data flows, module responsibilities, external boundaries and grading/baseline trade-offs; link to existing authoritative details |
| `docs/development.md` — new | Contributor setup, configuration matrix, gates, troubleshooting, version decisions, verification and pending exceptions; link to customization examples |
| `AGENTS.md` — new | Profile/pin, commands, functional layout, content preservation, trust boundaries and no-hook-bypass instructions |
| `package.json`, `package-lock.json` | Compatible tool dependencies and new static-check scripts, preserving all existing commands |
| `.node-version` — new | Selected Node baseline, coordinated with engines/docs/CI after explicit decision |
| `eslint.config.js`, `.prettierrc.json`, `.prettierignore` — new | CommonJS/Node lint and conservative formatting scope |
| `.markdownlint-cli2.jsonc` — new | Default rules with only MD013 disabled; maintained Markdown selected, generated/dependency/historical files excluded |
| `.pre-commit-config.yaml` — new | Fast staged checks using locked Node tools and pinned generic text/syntax hooks |
| `.github/workflows/tests.yml` | Least-privilege, SHA-pinned, time-bounded offline quality/test jobs using documented commands |
| `.github/dependabot.yml` — new | Weekly npm and GitHub Actions update proposals |
| `docs/assets/` — conditional | A real, inspected report preview only when an authentic run is available; do not manufacture results |
| This plan under `docs/superpowers/` | Historical planning record, excluded from current setup/lint scope explicitly |

## Documentation preservation inventory

Every row must be reconciled against the baseline diff, including subordinate paragraphs and code blocks. This table is an index, not permission to discard unlisted wording. Default disposition is **retain in the same file**; moving any substantive material requires recording its exact destination and checking that the root showcase remains equally informative.

| Baseline content | Required preservation |
| --- | --- |
| README title, opening and badges | Both suite purposes, local Ollama/no-key scope, CI/license/tool links; retain repo slug and URLs |
| Why it exists | Evidence-based QA framing, deterministic floor versus story-specific model grading, both suite descriptions |
| Architecture | Inline two-layer grading diagram and explanatory paragraph; root diagram remains visible |
| Quickstart | Clone/root directory, dependency install, offline tests, both eval commands, viewer, both model pull commands, Apple Silicon `-mlx` note and alternate-tag instructions |
| Reports/results introduction | Exact automatic-CI versus local-model boundary, `outputs/`, local viewer and explicit publish command |
| Test-design benchmark | Date `2026-09-26`, Apple M4 Max/64 GB; all four model/prompt rows and all six columns unchanged |
| Benchmark values | Qwen 3.8 Basic: `3/5`, `17/19`, `8.0`, `31 s`; techniques: `4/5`, `18/19`, `12.2`, `39 s`; Qwen 3.6 Basic: `1/5`, `13/19`, `6.6`, `28 s`; techniques: `4/5`, `18/19`, `10.0`, `35 s` |
| Benchmark interpretation | Structure/coverage/specific-results/duplicate findings, technique improvement from 13 to 18, boundary finding, lockout-counter-reset failure and three-of-four qualification |
| Grading cautions | Literal-value behavior of the grader and illustrative-value guidance; default self-grading bias and exact `defaultTest.options.provider` override path |
| Translation results | Date, `133 of 135`, Detailed prompt attribution and both exact examples: `ハローワールド` versus `こんにちは世界`, and `Salut !` for `What's up?` |
| Baselines/comparison | Trusted-run update/check/compare commands and paths, default 5-point tolerance, missing run/metric failures, machine/model dependence and ignored local outputs |
| Test-design explanation | JSON fields, six metric names and meanings, 1–30 constraint, 3–4 must-haves per story, all five story domains, both prompt strategies and technique names |
| Translation explanation | 24 standard and 21 edge cases, three prompt strategies, all edge-case categories and both output filenames |
| Reasoning control | Every local provider's `think: false` rationale and JSON/translation consequences |
| Stack, structure, commands, license | Every existing row, optional cloud scope, all npm commands and MIT link; add relevant new paths/commands without losing existing entries |
| Customizing: cloud | Env-copy command, `.env` instruction, `eval:full`, all five provider/model rows, temperatures and API-key variable names |
| Customizing: test files | Both paths and complete standard/edge category descriptions, including negative assertions |
| Customizing: provider example | Both destination config choices, exact OpenAI example ID/label/temperature and cloud-key instruction |
| Customizing: test examples | Portuguese `Good evening`/`boa noite` assertion and French Windows-path regex example, preserving escaping |
| Customizing: prompt example | `prompts/new_strategy.txt`, config `file://` path and `New Strategy` label |
| Customizing: conventions | Non-English `similar`/`regex`, temperature 0.1–0.3, full model IDs, test files versus ignored outputs and reviewing results before merging |

## Task 1: Establish the execution baseline

**Files:** Read the complete tracked target tree and affected standards; no product changes. Record evidence later in `docs/development.md`.

- [x] Recheck status, fetch the default branch and inspect any remote changes since the audited SHA. Preserve this plan and unrelated work; do not reset either. Create a dedicated adoption branch/isolated checkout following the applicable workspace instructions.
- [x] Verify the selected standards revision exists remotely. Read any changed policy before pinning; record the exact SHA/profile, not a floating branch.
- [x] Save baseline copies/hashes of both docs and protected evaluation inputs outside ignored result paths. Inventory every heading, paragraph, table row, link and fenced example for reconciliation.
- [x] Capture `npm test`, Node/npm versions, resolved package versions and tracked/ignored state. Expected starting test result: 16 passes with no skipped tests. Investigate any difference before proceeding.
- [x] Identify existing local outputs/baselines without modifying them. Keep real results, keys and ignored files out of commits; do not overwrite a trusted run while gathering evidence.

## Task 2: Extend documentation without diminishing the showcase

**Files:** Modify `README.md` and minimally `docs/customizing.md`; create `docs/architecture.md`, `docs/development.md`, `AGENTS.md`.

- [x] Add focused capability bullets covering deterministic assertions, per-story must-haves, prompt/model comparisons, translation edge cases and baseline regression checks, using existing facts. Avoid duplicating the full explanations.
- [x] Retain the benchmark tables, analysis, grader caveats, suite details and baseline examples in the README. If rearranging stack/structure or usage to follow the standard's sequence, move sections intact and check old anchors/incoming links.
- [x] Keep an inline root grading diagram; verify it describes both grading layers without implying code-check failure prevents grading. Add deep diagrams to architecture for suite configuration, generation, grading and result consumption, with Ollama/cloud boundaries and sequential CLI use.
- [x] Explain responsibilities of `checks.js`, `results.js`, `baseline.js`, `compare.js`, configs and test data. Document tolerance units, missing run/metric failure and errors counted as failures. Link to README results and customization examples rather than copying their catalogs.
- [x] Write development setup/configuration, offline-versus-live execution matrix, report handling, quality commands, troubleshooting, runtime decisions and verification ledger. Keep model tags, temperatures, grader/concurrency settings and all config examples unchanged.
- [x] Add `AGENTS.md` with profile `complete`, verified standards SHA, actual project commands, documentation-preservation instructions, secret/trust boundaries and required hook behavior. Add a README index linking all three maintained guides and explaining their roles.
- [x] Reconcile every preservation-inventory row with baseline copies. Check **all** deleted/changed prose and code, not just matching headings. Parse/check the Windows-path YAML example to ensure it retains its regex meaning. Record any factual adjustment with source/evidence; no speculative corrections to accurate docs.
- [x] Render and visually inspect the root README, tables and Mermaid diagrams; check layout, grading arrows, links and anchors. Verify benchmark prominence and readability. Use an authentic report preview only if available, with date/run scope and readable captions; otherwise record the preview as pending.

## Task 3: Align runtime and dependencies deliberately

**Files:** `package.json`, `package-lock.json`, `.node-version`, related narrow README/development updates.

- [x] Review Node 24 support against official runtime and dependency sources; confirm native/transitive installation needs. Present the concrete 22-to-24 compatibility evidence for the baseline decision. Until decided, preserve Node 22 declarations and record alignment as pending.
- [x] On approval of Node 24, coordinate `.node-version`, package engines, CI, README prerequisites/badge/stack and development instructions. State the tested runtime range accurately; do not treat a lower-bound engine declaration as evidence for all future majors.
- [x] Resolve compatible stable package/tool versions from official registries/release notes at execution time; inspect Promptfoo config/assertion/output compatibility before selecting an upgrade. Do not equate successful unit tests with successful Promptfoo evaluation.
- [x] Add bounded ESLint, Prettier and markdownlint-cli2 development dependencies and lock the complete installation. Preserve CommonJS and every existing npm script. Do not remove `js-yaml` simply because its usage needs investigation.
- [x] Use `npm ci` in a fresh checkout on the selected runtime; rerun the 16 existing tests and check Promptfoo CLI startup/config references without paid or implicit model requests. Update README install to `npm ci` only with that evidence.
- [x] If evaluation dependencies/runtime change, run both local suites when their models are available and verify result JSON consumption by baseline/compare. Save new runs under distinct names. If unavailable, document exact skipped integrations and leave compatibility/completion claims pending; never relabel old benchmark results as new evidence.
- [x] Reconcile current Promptfoo badge/stack with the selected manifest/lock. Do not infer or rewrite the tool version used for the historical benchmark; retain all historical values and date/hardware context.

## Task 4: Add staged and full-repository quality gates

**Files:** New lint/format/Markdown/pre-commit configuration, package scripts and development instructions. Existing JavaScript may receive reviewed formatting-only changes.

- [x] Configure ESLint for Node/CommonJS and existing test/CLI globals. Configure Prettier conservatively for JavaScript and new tool config; avoid overlapping Markdown formatters. Exclude prompt text, evaluation data/config YAML, outputs, lockfiles and dependencies from automatic formatting.
- [x] Add `.markdownlint-cli2.jsonc` using default rules with MD013 disabled. Explicitly cover root/agent/current-guide Markdown; exclude dependencies/generated output and label `docs/superpowers/` as historical. Keep heading, fence, spacing and image-alt rules enabled.
- [x] Expose `npm run lint:js`, `npm run format:check`, `npm run lint:md` and aggregate `npm run lint`; document each scope. Establish generic text/syntax checking via pinned pre-commit hooks so CI can run the same checks for all tracked files.
- [x] Configure one hook manager: default `pre-commit`. Node hooks use lockfile-installed tools and staged filenames; full unit/model tests stay out of commit hooks. Document `pre-commit install` and `pre-commit run --all-files` with setup prerequisites.
- [x] Check trailing whitespace, EOF, merge markers and YAML/JSON with real-format-aware filters. Preserve intentional Markdown hard breaks, YAML scalars, multilingual data and prompt content. Treat `.markdownlint-cli2.jsonc` as JSONC, not strict JSON.
- [x] Demonstrate each gate rejecting a representative invalid file in a disposable checkout, then passing after correction. Include Markdown, JS, strict JSON, YAML, merge markers and whitespace. For any added custom helper, add focused behavioral tests before implementation; avoid a bespoke validator when existing tools suffice.
- [x] Probe real commits with a partially staged JS/doc edit and an unstaged invalid hunk, plus deletion and generated-file exclusions. Verify staged content is checked, unrelated work is not staged and the index/worktree are restored exactly. Never bypass a failed hook.
- [x] Run all maintained-file gates plus `npm test`; compare protected input hashes and parsed config/test data against Task 1. Expected: unchanged prompts/data/scoring and all 16 existing tests passing. Any required non-format behavior fix is a separate, explicitly reviewed scope decision.

## Task 5: Harden CI and prepare a reviewable handoff

**Files:** `.github/workflows/tests.yml`, `.github/dependabot.yml`, `docs/development.md`; conditional verified report assets/links.

- [x] Retain push/PR offline testing and existing test coverage. Use full verified action SHAs, `permissions: contents: read`, `persist-credentials: false`, job timeouts, lockfile-aware npm caching and `npm ci`. Pin/install the same pre-commit version used locally for full-file gates.
- [x] Run the documented JS lint, format, Markdown, text/syntax and unit commands in CI with identical rules/exclusions. Do not add TypeScript/build steps to a CommonJS evaluation project or automatic model/cloud/publish jobs. Preserve secret-free PR operation.
- [x] Add weekly npm and `github-actions` dependency PRs, with no automatic major merges. Keep artifacts at 1–3 days if uploaded and ensure no keys/local model output are accidentally included.
- [x] Read current repository description/topics, branch enforcement, security settings and available check names through the connected GitHub tools. Prepare any necessary proposals with exact values; do not change settings or metadata as a side effect. Record inaccessible settings as unknown.
- [x] From a clean checkout, run `npm ci`, `npm run lint`, `npm test` and `pre-commit run --all-files`. Inspect documented CLI/help and file references; distinguish synthetic/fixture checks from actual local-model runs. Record versions, command outcomes, failures and skips in development.
- [x] Repeat the complete preservation reconciliation and inspect the rendered README/customization guide. Verify every old table value, command, provider/regex example and caveat remains available at its recorded location; review the entire branch diff for changed model inputs or lost information.
- [x] Prepare a PR summary with documentation impact, dependency/runtime decisions, hook behavior, offline evidence, live evidence/skips and pending settings. Open/push only when execution is authorized; do not merge. Check hosted results at the exact PR head rather than reusing old-head success.

## Acceptance and handoff

- [x] Every preservation row is reconciled, and the full prose/example diff has no unexplained loss. README results and engineering detail remain visible on the landing page.
- [x] Three useful maintained guides are indexed; customizing stays authoritative; the profile and standards SHA are recorded in AGENTS.
- [x] Protected evaluation inputs and existing npm interfaces retain their behavior; offline checks and staged probes pass.
- [x] Runtime/dependency decisions have compatibility evidence; unavailable integrations/settings are clearly pending. No unsupported full-adoption claim.
- [x] The final review distinguishes local verification, hosted verification, live model execution and owner decisions.

**Original planning-only verification (before implementation):** Inspected the tracked layout, both complete baseline docs, relevant policy guides, package/lock declarations, workflow, scoring/helpers and prompt/story references. Existing `npm test` passed 16/16 on Node 26. No dependency install, model evaluation, hook setup, external setting mutation or implementation was performed. Only this proposed plan was added.

**Execution handoff (2026-10-31):** Draft [PR #5](https://github.com/yashwant-das/ai-js-promptfoo-eval/pull/5) contains the implementation. Node 22/24 clean checks and all 12 staged probes pass. Translation passed 135/135; test design completed with 11/20 passes, 9 assertion failures and no execution errors. Model-score differences and 16 affected audit packages (5 high) remain for owner review. No merge, paid evaluation or repository setting change.
