import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { test } from 'node:test';

import { copySkills } from '../src/index.js';

function makeTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'postinstall-skills-test-'));
}

test('does nothing when source has no skills directory', () => {
  const sourceDir = makeTmpDir();
  const targetDir = makeTmpDir();

  copySkills({ sourceDir, targetDir });

  assert.strictEqual(fs.existsSync(path.join(targetDir, '.agents', 'skills')), false);
});

test('copies skills directory from source to target', () => {
  const sourceDir = makeTmpDir();
  const targetDir = makeTmpDir();

  fs.mkdirSync(path.join(sourceDir, 'skills'));
  fs.writeFileSync(path.join(sourceDir, 'skills', 'hello.txt'), 'hello');

  copySkills({ sourceDir, targetDir });

  const copied = path.join(targetDir, '.agents', 'skills', 'hello.txt');
  assert.ok(fs.existsSync(copied));
  assert.strictEqual(fs.readFileSync(copied, 'utf8'), 'hello');
});

test('copies nested skills directories', () => {
  const sourceDir = makeTmpDir();
  const targetDir = makeTmpDir();

  fs.mkdirSync(path.join(sourceDir, 'skills', 'subdir'), { recursive: true });
  fs.writeFileSync(path.join(sourceDir, 'skills', 'subdir', 'nested.txt'), 'nested');

  copySkills({ sourceDir, targetDir });

  const copied = path.join(targetDir, '.agents', 'skills', 'subdir', 'nested.txt');
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

  assert.strictEqual(fs.readFileSync(path.join(targetDir, '.agents', 'skills', 'a.txt'), 'utf8'), 'a');
  assert.strictEqual(fs.readFileSync(path.join(targetDir, '.agents', 'skills', 'b.txt'), 'utf8'), 'b');
});
