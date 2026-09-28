#!/usr/bin/env node
// Compares two eval runs saved with `promptfoo eval -o`: score changes per run, and the tests
// that passed in one and failed in the other.
//
//   node scripts/compare.js <before.json> <after.json>

const { load, summarize, outcomes } = require('./results');

const pct = (n) => (n === undefined ? '—' : `${(n * 100).toFixed(1)}%`);
const delta = (a, b) => (a === undefined || b === undefined ? '' : `${b - a >= 0 ? '+' : ''}${((b - a) * 100).toFixed(1)}`);

function diff(before, after) {
  const [sb, sa] = [summarize(before), summarize(after)];
  const [ob, oa] = [outcomes(before), outcomes(after)];
  const scores = [];
  const flips = [];
  for (const key of new Set([...Object.keys(sb), ...Object.keys(sa)])) {
    const [b, a] = [sb[key], sa[key]];
    scores.push({ run: key, score: 'pass rate', before: b?.passRate, after: a?.passRate });
    for (const metric of new Set([...Object.keys(b?.metrics ?? {}), ...Object.keys(a?.metrics ?? {})])) {
      scores.push({ run: key, score: metric, before: b?.metrics[metric], after: a?.metrics[metric] });
    }
    for (const test of Object.keys(ob[key] ?? {})) {
      const [was, now] = [ob[key][test], oa[key]?.[test]];
      if (now !== undefined && was !== now) flips.push({ run: key, test, now: now ? 'fixed' : 'broke' });
    }
  }
  return { scores, flips };
}

function main([beforeFile, afterFile]) {
  if (!beforeFile || !afterFile) {
    console.error('Usage: node scripts/compare.js <before.json> <after.json>');
    return 2;
  }
  const { scores, flips } = diff(load(beforeFile), load(afterFile));
  console.log('| Run | Score | Before | After | Change (points) |\n|---|---|---|---|---|');
  for (const s of scores) console.log(`| ${s.run} | ${s.score} | ${pct(s.before)} | ${pct(s.after)} | ${delta(s.before, s.after)} |`);
  console.log(flips.length ? '\nTests that changed:' : '\nNo test changed outcome.');
  for (const f of flips) console.log(`- ${f.now === 'fixed' ? 'fixed' : 'BROKE'}: ${f.run} :: ${f.test}`);
  return 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { diff };
