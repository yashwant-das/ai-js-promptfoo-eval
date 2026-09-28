// Reads promptfoo JSON output (`promptfoo eval -o results.json`) into per-run scores that the
// baseline check and the compare script share. A run is one provider and one prompt.

const fs = require('node:fs');

function load(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(data?.results?.results)) {
    throw new Error(`${file} is not promptfoo JSON output (no results.results array)`);
  }
  return data;
}

// promptfoo labels a file prompt "<label>: <path>: <prompt text>", so the configured label is
// matched back where possible to keep keys short and stable when the prompt text changes.
function runKey(result, configPrompts = []) {
  const provider = result.provider?.label || result.provider?.id || 'unknown provider';
  const full = result.prompt?.label || result.promptId || 'unknown prompt';
  const configured = configPrompts.map((p) => p?.label).find((label) => label && (full === label || full.startsWith(`${label}: `)));
  return `${provider} · ${configured ?? full}`;
}

function testKey(result) {
  return result.testCase?.description || JSON.stringify(result.vars ?? result.testCase?.vars ?? {});
}

const round = (n) => Math.round(n * 1000) / 1000;

// Returns { [runKey]: { tests, passed, passRate, metrics: { [metric]: mean score } } }.
// Errors count as failures, so a model that times out cannot raise the pass rate.
function summarize(data) {
  const runs = {};
  const sums = {};
  for (const result of data.results.results) {
    const key = runKey(result, data.config?.prompts);
    const run = (runs[key] ??= { tests: 0, passed: 0, passRate: 0, metrics: {} });
    const metricSums = (sums[key] ??= {});
    run.tests += 1;
    if (result.success) run.passed += 1;
    for (const [metric, score] of Object.entries(result.namedScores ?? {})) {
      const s = (metricSums[metric] ??= { total: 0, count: 0 });
      s.total += score;
      s.count += 1;
    }
  }
  for (const [key, run] of Object.entries(runs)) {
    run.passRate = round(run.passed / run.tests);
    for (const [metric, { total, count }] of Object.entries(sums[key])) {
      run.metrics[metric] = round(total / count);
    }
  }
  return runs;
}

// Returns { [runKey]: { [testKey]: pass } } for spotting tests that flipped between two runs.
function outcomes(data) {
  const out = {};
  for (const result of data.results.results) {
    (out[runKey(result, data.config?.prompts)] ??= {})[testKey(result)] = Boolean(result.success);
  }
  return out;
}

module.exports = { load, summarize, outcomes, runKey, testKey };
