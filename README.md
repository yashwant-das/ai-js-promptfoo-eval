# ai-js-promptfoo-eval

Evaluates LLM output with [Promptfoo](https://www.promptfoo.dev) and local models through [Ollama](https://ollama.com). No API keys needed. Two suites:

- **Test design**: a model writes test cases from a user story, and the suite grades them the way a QA lead would review them.
- **Translation**: translation quality across prompts, including idioms, code, numbers and scripts.

## Prerequisites

- [Node.js](https://nodejs.org) 22.22 or later
- [Ollama](https://ollama.com) running locally with the tested models pulled:

  ```bash
  ollama pull qwen3.8:27b-mlx
  ollama pull qwen3.6:35b-mlx   # second model for the test-design comparison
  ```

The `-mlx` builds run on Apple Silicon. On other machines, use the standard Qwen tags and update the provider ids in the configs.

## Quick start

```bash
npm install                  # installs promptfoo locally
npm run eval:test-design     # test-design suite
npm run eval                 # translation suite
npm run report               # open the results in your browser
```

## Test design suite

A model reads a user story and its acceptance criteria, and returns test cases as JSON: title, type (positive, negative, boundary, edge), the criteria each test covers, preconditions, steps and expected result. Each output is graded in two layers.

**Code checks** ([`tests/test-design/checks.js`](tests/test-design/checks.js)) run on every output, with no model involved:

| Metric | Passes when |
|---|---|
| `structure` | The output is valid JSON with 1 to 30 complete test cases |
| `coverage` | Every acceptance criterion is covered by at least one test |
| `negative-tests` | At least one negative test |
| `boundary-tests` | At least one boundary test, when the story has numeric or time limits |
| `specific-results` | No expected result is vague, such as "works as expected" |
| `no-duplicates` | No two tests share a title |

**Must-have tests** ([`tests/test-design/stories.yaml`](tests/test-design/stories.yaml)) are the 3 or 4 tests an experienced QA engineer would expect for each story, such as "4 failed attempts don't lock the account and the 5th does". A grader model checks each one separately, so the report shows exactly which important cases a model missed.

The five stories cover account lockout, password reset, a discount code, document upload and bank transfers. Two prompts are compared: a plain request, and one that asks for named test design techniques (boundary value analysis, equivalence partitioning, state transitions).

`npm test` runs unit tests for the code checks. They need no model and run in CI.

### Results (2026-09-26, Apple M4 Max, 64 GB)

| Model | Prompt | All checks pass | Must-haves found | Tests per story | Time per story |
|---|---|---|---|---|---|
| Qwen 3.8 27B | Basic | 3/5 | 17/19 | 8.0 | 31 s |
| Qwen 3.8 27B | Test design techniques | 4/5 | 18/19 | 12.2 | 39 s |
| Qwen 3.6 35B | Basic | 1/5 | 13/19 | 6.6 | 28 s |
| Qwen 3.6 35B | Test design techniques | 4/5 | 18/19 | 10.0 | 35 s |

- Every output passed the structure, coverage, specific-results and duplicate checks. The code checks set a floor; the must-haves separate the results.
- Naming test design techniques in the prompt helped most on Qwen 3.6: must-haves found rose from 13 to 18, and boundary tests appeared for every story.
- The most-missed must-have was the lockout counter reset: failures, then a success, then failures again. Three of four outputs tested the reset but never checked the counting that follows.

Writing must-haves: the grader tends to read example values literally. State the behaviour and mark any values as an illustration, as the stories file does.

**Grader bias:** by default `qwen3.8:27b-mlx` also grades, so it grades its own output. To use a different grader, change `defaultTest.options.provider` in [`promptfooconfig.test-design.yaml`](promptfooconfig.test-design.yaml).

## Translation suite

Translates short English texts into other languages with three prompts (direct, detailed, and code-aware) and checks the results: 24 standard tests, and 21 edge cases covering idioms, special characters, code, numbers and currency, and script preservation. Results are saved to `outputs/results.json` and `outputs/results-latest.csv`.

On 2026-09-26, Qwen 3.8 27B passed 133 of 135 checks. The two misses were both from the Detailed prompt: "ハローワールド" instead of "こんにちは世界" for "Hello world", and "Salut !" for "What's up?".

## Project structure

| File | Description |
|---|---|
| `promptfooconfig.test-design.yaml` | Test-design suite: two local models, code checks and model-graded must-haves |
| `prompts/test-design/` | Basic and test-design-techniques prompts |
| `tests/test-design/stories.yaml` | User stories, acceptance criteria and must-have tests |
| `tests/test-design/checks.js` | Code checks, with unit tests in `checks.test.js` |
| `promptfooconfig.yaml` | Translation suite, local model |
| `promptfooconfig.full.yaml` | Translation suite with OpenAI, Anthropic and Google added |
| `prompts/direct.txt`, `detailed.txt`, `code_mixing.txt` | Translation prompts |
| `tests/translations.yaml`, `tests/edge_cases.yaml` | Translation tests |
| `outputs/` | Evaluation results (git-ignored) |
| `.env.example` | API key template for cloud providers |

## Commands

| Command | Description |
|---|---|
| `npm run eval:test-design` | Test-design suite on the local models |
| `npm run eval` | Translation suite on the local model |
| `npm run eval:full` | Translation suite with cloud providers (needs API keys) |
| `npm test` | Unit tests for the test-design code checks |
| `npm run eval:watch` | Re-run the translation suite on file changes |
| `npm run report` | View results locally |
| `npm run publish` | Publish results to the promptfoo web dashboard |
| `npm run compare` | Compare two evaluation runs |

## Configuration

Every local provider sets `think: false`. Qwen models otherwise prefix their answer with their reasoning, which breaks JSON parsing and the translation checks.

### Full configuration

To compare against cloud providers, copy the env template and add your API keys:

```bash
cp .env.example .env
# Edit .env with your keys
npm run eval:full
```

| Provider | Model ID | Temp | API Key |
|---|---|---|---|
| OpenAI | `gpt-4.1-mini` | 0.3 | `OPENAI_API_KEY` |
| OpenAI | `gpt-4o` | 0.3 | `OPENAI_API_KEY` |
| OpenAI | `o3-mini` | 0.3 | `OPENAI_API_KEY` |
| Anthropic | `claude-sonnet-4-20250514` | 0.3 | `ANTHROPIC_API_KEY` |
| Google | `gemini-2.5-flash` | 0.3 | `GOOGLE_API_KEY` |

### Tests

- `tests/translations.yaml` — Standard translations: greetings, questions, requests, formal language, idioms
- `tests/edge_cases.yaml` — Edge cases: idioms, special characters, code snippets, numbers/currency, script preservation, negative assertions

## Customizing

### Adding a Provider

Add to `providers` in `promptfooconfig.yaml` (or `promptfooconfig.full.yaml`):

```yaml
- id: openai:gpt-3.5-turbo
  label: GPT-3.5 Turbo
  config:
    temperature: 0.3
```

For cloud providers, add the corresponding API key to `.env`.

### Adding a Test

#### Translation test (append to `tests/translations.yaml`)

```yaml
- vars:
    language: Portuguese
    input: Good evening
  assert:
    - type: contains
      value: boa noite
```

#### Edge-case test (append to `tests/edge_cases.yaml`)

```yaml
- vars:
    language: French
    input: The path is C:\Users\foo\bar.txt
  assert:
    - type: regex
      value: "C:\\\\Users\\\\foo\\\\bar\\.txt"
```

### Adding a Prompt

1. Create `prompts/new_strategy.txt`
2. Add to `prompts` in your config file:

```yaml
prompts:
  - id: file://prompts/new_strategy.txt
    label: New Strategy
```

## Notes

- Use `similar` or `regex` assertions for non-English scripts
- Use `temperature` of 0.1–0.3 for evaluation consistency
- Use full model IDs (e.g., `claude-sonnet-4-20250514`) rather than aliases
- Commit test files, not results in `outputs/`
- Review results before merging provider or prompt changes

## License

MIT. See [LICENSE](LICENSE).
