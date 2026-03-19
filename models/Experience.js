const db = require('../config/db');

class Experience {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM experiences ORDER BY start_date DESC');
    return rows.map(row => ({
      ...row,
      description: JSON.parse(row.description || '[]')
    }));
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM experiences WHERE id = ?', [id]);
    if (rows[0]) {
      rows[0].description = JSON.parse(rows[0].description || '[]');
    }
    return rows[0];
  }

  static async create(data) {
    const { title, company, location, start_date, end_date, description, current } = data;
    const [result] = await db.execute(
      'INSERT INTO experiences (title, company, location, start_date, end_date, description, current) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, company, location, start_date, end_date, JSON.stringify(description || []), current ? 1 : 0]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { title, company, location, start_date, end_date, description, current } = data;
    await db.execute(
      'UPDATE experiences SET title = ?, company = ?, location = ?, start_date = ?, end_date = ?, description = ?, current = ? WHERE id = ?',
      [title, company, location, start_date, end_date, JSON.stringify(description || []), current ? 1 : 0, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM experiences WHERE id = ?', [id]);
  }
}

module.exports = Experience;
