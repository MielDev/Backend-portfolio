'use strict';

const fs = require('fs');
const path = require('path');

exports.up = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls', '20260527000000-add-experience-digital-folder-up.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports.down = function (db, callback) {
  const sql = fs.readFileSync(path.join(__dirname, 'sqls', '20260527000000-add-experience-digital-folder-down.sql'), 'utf8');
  db.runSql(sql, callback);
};

exports._meta = { version: 1 };
