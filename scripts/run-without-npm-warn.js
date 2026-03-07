/**
 * Unset npm env vars that cause "Unknown env config" warnings (e.g. from Cursor/other tools),
 * then run the given command. Use: node scripts/run-without-npm-warn.js <cmd> [args...]
 */
const keysToRemove = [
  'npm_config_npm_globalconfig',
  'NPM_CONFIG_npm_globalconfig',
  'npm_config_verify_deps_before_run',
  'NPM_CONFIG_verify_deps_before_run',
  'npm_config__jsr_registry',
  'NPM_CONFIG__jsr_registry'
];

keysToRemove.forEach(k => {
  if (process.env[k] !== undefined) delete process.env[k];
});

const { spawn } = require('child_process');
const [cmd, ...args] = process.argv.slice(2);

if (!cmd) {
  console.error('Usage: node scripts/run-without-npm-warn.js <command> [args...]');
  process.exit(1);
}

const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('exit', code => process.exit(code ?? 0));
