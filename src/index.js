const fs = require('fs');
const path = require('path');

/**
 * Copy skills from the source package directory to the consumer's project directory.
 *
 * @param {object} [options]
 * @param {string} [options.sourceDir] - Directory of the package declaring the postinstall script.
 *   Defaults to `process.cwd()`.
 * @param {string} [options.targetDir] - Root of the consumer project that ran `npm install`.
 *   Defaults to `process.env.INIT_CWD`, falling back to `process.cwd()`.
 */
function copySkills(options = {}) {
  const sourceDir = options.sourceDir || process.cwd();
  const targetDir =
    options.targetDir || process.env.INIT_CWD || process.cwd();

  const skillsSource = path.join(sourceDir, 'skills');

  if (!fs.existsSync(skillsSource)) {
    return;
  }

  const skillsTarget = path.join(targetDir, 'skills');

  copyDir(skillsSource, skillsTarget);
}

/**
 * Recursively copy a directory.
 *
 * @param {string} src
 * @param {string} dest
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

module.exports = { copySkills };
