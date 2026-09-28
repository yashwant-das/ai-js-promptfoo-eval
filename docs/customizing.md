# Customizing the suites

## Cloud providers

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

## Translation test files

- `tests/translations.yaml` — Standard translations: greetings, questions, requests, formal language, idioms
- `tests/edge_cases.yaml` — Edge cases: idioms, special characters, code snippets, numbers/currency, script preservation, negative assertions

## Adding a Provider

Add to `providers` in `promptfooconfig.yaml` (or `promptfooconfig.full.yaml`):

```yaml
- id: openai:gpt-4.1-mini
  label: GPT-4.1 mini
  config:
    temperature: 0.3
```

For cloud providers, add the corresponding API key to `.env`.

## Adding a Test

### Translation test (append to `tests/translations.yaml`)

```yaml
- vars:
    language: Portuguese
    input: Good evening
  assert:
    - type: contains
      value: boa noite
```

### Edge-case test (append to `tests/edge_cases.yaml`)

```yaml
- vars:
    language: French
    input: The path is C:\Users\foo\bar.txt
  assert:
    - type: regex
      value: "C:\\\\Users\\\\foo\\\\bar\\.txt"
```

## Adding a Prompt

1. Create `prompts/new_strategy.txt`
2. Add to `prompts` in your config file:

```yaml
prompts:
  - id: file://prompts/new_strategy.txt
    label: New Strategy
```

## Conventions

- Use `similar` or `regex` assertions for non-English scripts
- Use `temperature` of 0.1–0.3 for evaluation consistency
- Use full model IDs (e.g., `claude-sonnet-4-20250514`) rather than aliases
- Commit test files, not results in `outputs/`
- Review results before merging provider or prompt changes
