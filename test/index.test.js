const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { test } = require('node:test');

const { copySkills } = require('../src/index.js');

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'postinstall-skills-test-'));
}

test('does nothing when source has no skills directory', () => {
  const sourceDir = makeTmpDir();
  const targetDir = makeTmpDir();

  copySkills({ sourceDir, targetDir });

  assert.strictEqual(fs.existsSync(path.join(targetDir, 'skills')), false);
});

test('copies skills directory from source to target', () => {
  const sourceDir = makeTmpDir();
  const targetDir = makeTmpDir();

  fs.mkdirSync(path.join(sourceDir, 'skills'));
  fs.writeFileSync(path.join(sourceDir, 'skills', 'hello.txt'), 'hello');

  copySkills({ sourceDir, targetDir });

  const copied = path.join(targetDir, 'skills', 'hello.txt');
  assert.ok(fs.existsSync(copied));
  assert.strictEqual(fs.readFileSync(copied, 'utf8'), 'hello');
});

test('copies nested skills directories', () => {
  const sourceDir = makeTmpDir();
  const targetDir = makeTmpDir();

  fs.mkdirSync(path.join(sourceDir, 'skills', 'subdir'), { recursive: true });
  fs.writeFileSync(path.join(sourceDir, 'skills', 'subdir', 'nested.txt'), 'nested');

  copySkills({ sourceDir, targetDir });

  const copied = path.join(targetDir, 'skills', 'subdir', 'nested.txt');
  assert.ok(fs.existsSync(copied));
  assert.strictEqual(fs.readFileSync(copied, 'utf8'), 'nested');
});

test('copies multiple skill files', () => {
  const sourceDir = makeTmpDir();
  const targetDir = makeTmpDir();

  fs.mkdirSync(path.join(sourceDir, 'skills'));
  fs.writeFileSync(path.join(sourceDir, 'skills', 'a.txt'), 'a');
  fs.writeFileSync(path.join(sourceDir, 'skills', 'b.txt'), 'b');

  copySkills({ sourceDir, targetDir });

  assert.strictEqual(fs.readFileSync(path.join(targetDir, 'skills', 'a.txt'), 'utf8'), 'a');
  assert.strictEqual(fs.readFileSync(path.join(targetDir, 'skills', 'b.txt'), 'utf8'), 'b');
});
