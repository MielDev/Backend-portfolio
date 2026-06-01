const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

/**
 * Connection pool only.
 *
 * Schema is no longer managed here — see /migrations and `npm run migrate`.
 * If you need to create or alter a table, generate a new migration with:
 *
 *   npm run migrate:create -- name-of-change --sql-file
 *
 * Then edit the up/down .sql files under migrations/sqls/ and run `npm run migrate`.
 */

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Sanity-check the connection at boot (non-fatal: lets the app still start so
// the healthcheck can report the issue).
pool
  .getConnection()
  .then((conn) => {
    console.log('Successfully connected to MySQL database');
    conn.release();
  })
  .catch((err) => {
    console.error('MySQL connection failed at boot:', err.message);
  });

module.exports = pool;
