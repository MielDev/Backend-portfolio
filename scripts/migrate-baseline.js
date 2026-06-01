#!/usr/bin/env node
/**
 * Baseline script: marks the existing schema as already migrated.
 *
 * Use this exactly once, on a database whose schema was created by the legacy
 * `syncDatabase()` from config/db.js. It will:
 *
 *   1. Create the `migrations` tracking table that db-migrate expects.
 *   2. Insert a row for the initial-schema migration so db-migrate doesn't try
 *      to re-create tables that already exist.
 *
 * On a fresh database, do NOT run this — just run `npm run migrate` instead.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mysql = require('mysql2/promise');
const fs = require('fs');

const INITIAL_MIGRATION = '20260524000000-initial-schema';

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    // 1) Ensure tracking table exists (same DDL as db-migrate creates).
    await conn.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        run_on DATETIME NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2) Check if the baseline row already exists.
    const [existing] = await conn.query(
      'SELECT id FROM migrations WHERE name = ? LIMIT 1',
      [`/${INITIAL_MIGRATION}`]
    );
    if (existing.length) {
      console.log(`Baseline already recorded for ${INITIAL_MIGRATION}. Nothing to do.`);
      return;
    }

    // 3) Insert it.
    await conn.query(
      'INSERT INTO migrations (name, run_on) VALUES (?, NOW())',
      [`/${INITIAL_MIGRATION}`]
    );
    console.log(`Baseline recorded: ${INITIAL_MIGRATION}`);
    console.log('From now on, only run `npm run migrate` to apply new migrations.');
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Baseline failed:', err.message);
  process.exit(1);
});
