const test = require('node:test');
const assert = require('node:assert/strict');
const { summarize } = require('./results');
const { compareToBaseline } = require('./baseline');
const { diff } = require('./compare');

const result = (prompt, description, success, namedScores = {}) => ({
  provider: { id: 'ollama:chat:qwen3:4b', label: 'Qwen 3 4B' },
  prompt: { label: `${prompt}: prompts/${prompt}.txt: Translate {{input}}` },
  testCase: { description },
  success,
  namedScores,
});

const output = (results) => ({
  config: { prompts: [{ label: 'Direct' }, { label: 'Detailed' }] },
  results: { results },
});

test('summarize groups by provider and configured prompt label, and averages metrics', () => {
  const runs = summarize(output([
    result('Direct', 'a', true, { coverage: 1 }),
    result('Direct', 'b', false, { coverage: 0.5 }),
    result('Detailed', 'a', true),
  ]));
  assert.deepEqual(runs['Qwen 3 4B · Direct'], { tests: 2, passed: 1, passRate: 0.5, metrics: { coverage: 0.75 } });
  assert.equal(runs['Qwen 3 4B · Detailed'].passRate, 1);
});

test('summarize counts an errored result as a failure', () => {
  const runs = summarize(output([result('Direct', 'a', false), result('Direct', 'b', true)]));
  assert.equal(runs['Qwen 3 4B · Direct'].passRate, 0.5);
});

const baseline = {
  tolerance: 0.05,
  runs: { 'Qwen 3 4B · Direct': { passRate: 0.8, metrics: { coverage: 0.9 } } },
};

test('a drop within the tolerance passes', () => {
  const current = { 'Qwen 3 4B · Direct': { passRate: 0.76, metrics: { coverage: 0.95 } } };
  assert.equal(compareToBaseline(current, baseline).regressed, false);
});

test('a drop beyond the tolerance on any score fails', () => {
  const current = { 'Qwen 3 4B · Direct': { passRate: 0.8, metrics: { coverage: 0.84 } } };
  const { regressed, rows } = compareToBaseline(current, baseline);
  assert.equal(regressed, true);
  assert.deepEqual(rows.filter((r) => r.regressed).map((r) => r.score), ['coverage']);
});

test('a run or metric missing from the results fails', () => {
  assert.equal(compareToBaseline({}, baseline).regressed, true);
  assert.equal(compareToBaseline({ 'Qwen 3 4B · Direct': { passRate: 1, metrics: {} } }, baseline).regressed, true);
});

test('diff reports score changes and tests that flipped', () => {
  const before = output([result('Direct', 'a', true), result('Direct', 'b', false)]);
  const after = output([result('Direct', 'a', false), result('Direct', 'b', true)]);
  const { scores, flips } = diff(before, after);
  assert.deepEqual(scores, [{ run: 'Qwen 3 4B · Direct', score: 'pass rate', before: 0.5, after: 0.5 }]);
  assert.deepEqual(flips.map((f) => [f.test, f.now]), [['a', 'broke'], ['b', 'fixed']]);
});
