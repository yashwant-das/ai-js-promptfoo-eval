// Deterministic checks for LLM-written test cases. Each export is a promptfoo
// javascript assertion: (output, context) => { pass, score, reason }.

const CASE_TYPES = ['positive', 'negative', 'boundary', 'edge'];

const VAGUE_EXPECTED = [
  /\bworks?\s+(correctly|properly|fine|as expected)\b/i,
  /\bas expected\b/i,
  /\bbehaves?\s+(correctly|properly)\b/i,
  /\bshould work\b/i,
  /^\s*(success(ful)?|pass(es)?|ok|no errors?)\.?\s*$/i,
];

function parseCases(output) {
  const text = String(output ?? '').trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end <= start) {
    throw new Error('no JSON object found in the output');
  }
  const parsed = JSON.parse(body.slice(start, end + 1));
  if (!Array.isArray(parsed.test_cases)) {
    throw new Error('"test_cases" is missing or not an array');
  }
  return parsed.test_cases;
}

function withCases(output, check) {
  let cases;
  try {
    cases = parseCases(output);
  } catch (err) {
    return { pass: false, score: 0, reason: `Unparseable output: ${err.message}` };
  }
  return check(cases);
}

function criteriaIds(context) {
  const ids = context?.vars?.ac_ids;
  return Array.isArray(ids) ? ids : String(ids ?? '').split(',').map((s) => s.trim()).filter(Boolean);
}

function validStructure(output) {
  return withCases(output, (cases) => {
    if (cases.length === 0 || cases.length > 30) {
      return { pass: false, score: 0, reason: `Expected 1-30 test cases, got ${cases.length}` };
    }
    const problems = [];
    cases.forEach((tc, i) => {
      const label = tc?.id || `case ${i + 1}`;
      if (typeof tc?.title !== 'string' || !tc.title.trim()) problems.push(`${label}: missing title`);
      if (!CASE_TYPES.includes(String(tc?.type).toLowerCase())) problems.push(`${label}: type "${tc?.type}" is not one of ${CASE_TYPES.join('/')}`);
      if (!Array.isArray(tc?.covers) || tc.covers.length === 0) problems.push(`${label}: "covers" must list acceptance criteria`);
      if (!Array.isArray(tc?.steps) || tc.steps.length === 0 || !tc.steps.every((s) => typeof s === 'string' && s.trim())) problems.push(`${label}: "steps" must be a non-empty list of strings`);
      if (typeof tc?.expected !== 'string' || !tc.expected.trim()) problems.push(`${label}: missing expected result`);
    });
    const valid = cases.length - new Set(problems.map((p) => p.split(':')[0])).size;
    return {
      pass: problems.length === 0,
      score: valid / cases.length,
      reason: problems.length ? problems.slice(0, 5).join('; ') : `${cases.length} well-formed test cases`,
    };
  });
}

function coversAllCriteria(output, context) {
  const ids = criteriaIds(context);
  return withCases(output, (cases) => {
    const covered = new Set(cases.flatMap((tc) => (Array.isArray(tc?.covers) ? tc.covers : [])).map((c) => String(c).trim().toUpperCase()));
    const missing = ids.filter((id) => !covered.has(id.toUpperCase()));
    return {
      pass: missing.length === 0,
      score: ids.length ? (ids.length - missing.length) / ids.length : 1,
      reason: missing.length ? `No test case covers ${missing.join(', ')}` : `All ${ids.length} acceptance criteria covered`,
    };
  });
}

function includesNegative(output) {
  return withCases(output, (cases) => {
    const count = cases.filter((tc) => String(tc?.type).toLowerCase() === 'negative').length;
    return { pass: count > 0, score: count > 0 ? 1 : 0, reason: `${count} negative test case(s)` };
  });
}

function includesBoundary(output, context) {
  if (!context?.vars?.has_limits) {
    return { pass: true, score: 1, reason: 'Story has no numeric limits; boundary cases not required' };
  }
  return withCases(output, (cases) => {
    const count = cases.filter((tc) => String(tc?.type).toLowerCase() === 'boundary').length;
    return { pass: count > 0, score: count > 0 ? 1 : 0, reason: `${count} boundary test case(s)` };
  });
}

function specificExpectedResults(output) {
  return withCases(output, (cases) => {
    const vague = cases.filter((tc) => VAGUE_EXPECTED.some((re) => re.test(String(tc?.expected ?? ''))));
    return {
      pass: vague.length === 0,
      score: cases.length ? (cases.length - vague.length) / cases.length : 0,
      reason: vague.length
        ? `Vague expected results: ${vague.slice(0, 3).map((tc) => `"${tc.expected}"`).join(', ')}`
        : 'Every expected result is specific',
    };
  });
}

function noDuplicateTitles(output) {
  return withCases(output, (cases) => {
    const seen = new Map();
    for (const tc of cases) {
      const key = String(tc?.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      seen.set(key, (seen.get(key) ?? 0) + 1);
    }
    const dupes = [...seen].filter(([, n]) => n > 1).map(([t]) => t);
    return {
      pass: dupes.length === 0,
      score: dupes.length === 0 ? 1 : 0,
      reason: dupes.length ? `Duplicate titles: ${dupes.join(', ')}` : 'No duplicate titles',
    };
  });
}

module.exports = {
  parseCases,
  validStructure,
  coversAllCriteria,
  includesNegative,
  includesBoundary,
  specificExpectedResults,
  noDuplicateTitles,
};
