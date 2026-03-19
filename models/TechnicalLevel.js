const db = require('../config/db');

class TechnicalLevel {
  static async getAll(type) {
    if (type) {
      const [rows] = await db.execute(
        'SELECT * FROM technical_levels WHERE type = ? ORDER BY sort_order ASC, id ASC',
        [type]
      );
      return rows;
    }
    const [rows] = await db.execute('SELECT * FROM technical_levels ORDER BY type ASC, sort_order ASC, id ASC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM technical_levels WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { type, title, description, percent, icon, sort_order } = data;
    const [result] = await db.execute(
      'INSERT INTO technical_levels (type, title, description, percent, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [type, title, description || null, percent ?? null, icon || null, sort_order ?? 0]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { type, title, description, percent, icon, sort_order } = data;
    await db.execute(
      'UPDATE technical_levels SET type = ?, title = ?, description = ?, percent = ?, icon = ?, sort_order = ? WHERE id = ?',
      [type, title, description || null, percent ?? null, icon || null, sort_order ?? 0, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM technical_levels WHERE id = ?', [id]);
  }
}

module.exports = TechnicalLevel;

