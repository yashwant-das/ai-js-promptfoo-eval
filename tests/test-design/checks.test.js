const { test } = require('node:test');
const assert = require('node:assert/strict');
const checks = require('./checks');

const context = { vars: { ac_ids: ['AC1', 'AC2'], has_limits: true } };

const goodCases = [
  {
    id: 'TC-01',
    title: 'Fifth failed attempt locks the account',
    type: 'boundary',
    covers: ['AC1'],
    preconditions: ['Account is active with 0 failed attempts'],
    steps: ['Enter a wrong password 5 times'],
    expected: 'Login is refused and "Account locked. Try again in 30 minutes." is shown',
  },
  {
    id: 'TC-02',
    title: 'Wrong password is refused',
    type: 'negative',
    covers: ['AC2'],
    preconditions: [],
    steps: ['Enter a wrong password once'],
    expected: 'Message "Incorrect password" is shown and the counter is 1',
  },
];

const asJson = (cases) => JSON.stringify({ test_cases: cases });
const run = (name, cases, ctx = context) => checks[name](typeof cases === 'string' ? cases : asJson(cases), ctx);
const allChecks = ['validStructure', 'coversAllCriteria', 'includesNegative', 'includesBoundary', 'specificExpectedResults', 'noDuplicateTitles'];

test('a good set of test cases passes every check', () => {
  for (const name of allChecks) {
    const result = run(name, goodCases);
    assert.equal(result.pass, true, `${name}: ${result.reason}`);
    assert.equal(result.score, 1, name);
  }
});

test('JSON inside a code fence with surrounding text is parsed', () => {
  const output = `Here are the tests:\n\`\`\`json\n${asJson(goodCases)}\n\`\`\`\nDone.`;
  assert.equal(checks.parseCases(output).length, 2);
  assert.equal(run('validStructure', output).pass, true);
});

test('output that is not JSON fails with score 0', () => {
  for (const name of allChecks.filter((n) => n !== 'includesBoundary')) {
    const result = run(name, 'Thinking: the user wants test cases...');
    assert.equal(result.pass, false, name);
    assert.equal(result.score, 0, name);
    assert.match(result.reason, /Unparseable output/);
  }
});

test('validStructure reports cases with missing fields and a partial score', () => {
  const broken = [{ ...goodCases[0] }, { ...goodCases[1], type: 'happy-path', steps: [] }];
  const result = run('validStructure', broken);
  assert.equal(result.pass, false);
  assert.equal(result.score, 0.5);
  assert.match(result.reason, /TC-02: type "happy-path"/);
  assert.match(result.reason, /TC-02: "steps"/);
});

test('coversAllCriteria names the uncovered criteria', () => {
  const result = run('coversAllCriteria', [goodCases[0]]);
  assert.equal(result.pass, false);
  assert.equal(result.score, 0.5);
  assert.match(result.reason, /AC2/);
});

test('coversAllCriteria matches ids case-insensitively and accepts a comma-separated var', () => {
  const lower = goodCases.map((tc) => ({ ...tc, covers: tc.covers.map((c) => c.toLowerCase()) }));
  const result = run('coversAllCriteria', lower, { vars: { ac_ids: 'AC1, AC2' } });
  assert.equal(result.pass, true, result.reason);
});

test('includesNegative fails when every case is positive', () => {
  const positive = goodCases.map((tc) => ({ ...tc, type: 'positive' }));
  assert.equal(run('includesNegative', positive).pass, false);
});

test('includesBoundary is required only when the story has limits', () => {
  const noBoundary = goodCases.map((tc) => ({ ...tc, type: 'negative' }));
  assert.equal(run('includesBoundary', noBoundary).pass, false);
  assert.equal(run('includesBoundary', noBoundary, { vars: { has_limits: false } }).pass, true);
});

test('specificExpectedResults flags vague expected results', () => {
  for (const vague of ['Login works as expected', 'The feature works correctly', 'Success', 'should work']) {
    const result = run('specificExpectedResults', [goodCases[0], { ...goodCases[1], expected: vague }]);
    assert.equal(result.pass, false, vague);
    assert.equal(result.score, 0.5, vague);
  }
});

test('noDuplicateTitles ignores case and punctuation', () => {
  const dupes = [goodCases[0], { ...goodCases[1], title: 'fifth failed attempt LOCKS the account!' }];
  assert.equal(run('noDuplicateTitles', dupes).pass, false);
});
