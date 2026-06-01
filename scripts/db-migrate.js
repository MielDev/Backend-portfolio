#!/usr/bin/env node
/**
 * Wrapper around db-migrate CLI that loads .env first so the placeholders
 * in database.json resolve properly.
 *
 *   node scripts/db-migrate.js up
 *   node scripts/db-migrate.js create add-some-column --sql-file
 *
 * The npm scripts (`npm run migrate`, etc.) call this wrapper.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { spawn } = require('child_process');

const args = process.argv.slice(2);
const cliPath = require.resolve('db-migrate/bin/db-migrate');

const child = spawn(process.execPath, [cliPath, ...args], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));
