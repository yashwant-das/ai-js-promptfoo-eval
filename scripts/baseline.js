#!/usr/bin/env node
// Compares an eval run with a committed baseline, or records a new baseline.
//
//   node scripts/baseline.js check  <results.json> <baseline.json>
//   node scripts/baseline.js update <results.json> <baseline.json>
//
// check fails when any run's pass rate or metric falls more than the baseline's tolerance below
// the recorded value, when a recorded run is missing, or when there is no baseline file yet.
// update rewrites the baseline from the results, keeping the existing tolerance.

const fs = require('node:fs');
const { load, summarize } = require('./results');

const DEFAULT_TOLERANCE = 0.05;

const pct = (n) => `${(n * 100).toFixed(1)}%`;

function compareToBaseline(current, baseline) {
  const tolerance = baseline.tolerance ?? DEFAULT_TOLERANCE;
  const rows = [];
  for (const [key, base] of Object.entries(baseline.runs ?? {})) {
    const run = current[key];
    if (!run) {
      rows.push({ run: key, score: 'all', baseline: null, current: null, regressed: true, note: 'run missing from results' });
      continue;
    }
    const scores = [['pass rate', base.passRate, run.passRate], ...Object.entries(base.metrics ?? {}).map(([m, v]) => [m, v, run.metrics[m]])];
    for (const [score, was, now] of scores) {
      const missing = now === undefined;
      rows.push({
        run: key,
        score,
        baseline: was,
        current: missing ? null : now,
        regressed: missing || now < was - tolerance - 1e-9,
        note: missing ? 'metric missing from results' : '',
      });
    }
  }
  return { tolerance, rows, regressed: rows.some((r) => r.regressed) };
}

function report({ tolerance, rows, regressed }) {
  const lines = [
    `Tolerance: ${pct(tolerance)} below baseline`,
    '',
    '| Run | Score | Baseline | Current | |',
    '|---|---|---|---|---|',
    ...rows.map((r) => {
      const mark = r.regressed ? '❌' : r.current > r.baseline ? '⬆️' : '✅';
      const fmt = (v) => (v === null ? '—' : pct(v));
      return `| ${r.run} | ${r.score} | ${fmt(r.baseline)} | ${fmt(r.current)} | ${mark} ${r.note} |`;
    }),
    '',
    regressed ? '**Regression: at least one score fell below the baseline.**' : 'No score fell below the baseline.',
  ];
  return lines.join('\n');
}

function writeSummary(markdown) {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
}

function buildBaseline(data, runs, previous) {
  return {
    description: data.config?.description ?? '',
    recordedAt: data.results.timestamp ?? new Date().toISOString(),
    promptfooVersion: data.metadata?.promptfooVersion ?? data.results.version ?? null,
    tolerance: previous?.tolerance ?? DEFAULT_TOLERANCE,
    runs,
  };
}

function main([command, resultsFile, baselineFile]) {
  if (!['check', 'update'].includes(command) || !resultsFile || !baselineFile) {
    console.error('Usage: node scripts/baseline.js check|update <results.json> <baseline.json>');
    return 2;
  }
  const data = load(resultsFile);
  const runs = summarize(data);
  const previous = fs.existsSync(baselineFile) ? JSON.parse(fs.readFileSync(baselineFile, 'utf8')) : null;

  if (command === 'update') {
    fs.writeFileSync(baselineFile, `${JSON.stringify(buildBaseline(data, runs, previous), null, 2)}\n`);
    console.log(`Wrote ${baselineFile}`);
    return 0;
  }

  if (!previous) {
    const proposed = JSON.stringify(buildBaseline(data, runs, null), null, 2);
    const message = `No baseline at ${baselineFile}. To accept this run as the baseline, commit:\n\n\`\`\`json\n${proposed}\n\`\`\``;
    console.log(message);
    writeSummary(message);
    return 1;
  }

  const result = compareToBaseline(runs, previous);
  const markdown = report(result);
  console.log(markdown);
  writeSummary(`### ${baselineFile}\n\n${markdown}`);
  return result.regressed ? 1 : 0;
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { compareToBaseline, buildBaseline };
