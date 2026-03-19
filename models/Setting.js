const db = require('../config/db');

class Setting {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM settings');
    return rows;
  }

  static async getByKey(key) {
    const [rows] = await db.execute('SELECT value FROM settings WHERE setting_key = ?', [key]);
    return rows[0] ? rows[0].value : null;
  }

  static async update(key, value) {
    const existing = await this.getByKey(key);
    if (existing !== null) {
      await db.execute('UPDATE settings SET value = ? WHERE setting_key = ?', [value, key]);
    } else {
      await db.execute('INSERT INTO settings (setting_key, value) VALUES (?, ?)', [key, value]);
    }
  }
}

module.exports = Setting;
