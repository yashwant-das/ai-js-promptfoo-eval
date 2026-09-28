// Loads the test-design stories without their model-graded must-haves, so CI grades
// outputs with the code checks alone. A small CPU model is too weak a grader to gate on.
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const stories = yaml.load(fs.readFileSync(path.join(__dirname, '../tests/test-design/stories.yaml'), 'utf8'));

module.exports = stories.map(({ assert, ...story }) => ({
  ...story,
  assert: (assert ?? []).filter((a) => a.type !== 'llm-rubric'),
}));
