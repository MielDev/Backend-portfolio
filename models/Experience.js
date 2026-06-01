const db = require('../config/db');
const { parseArray } = require('../utils/json');

class Experience {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM experiences ORDER BY start_date DESC');
    return rows.map((row) => ({ ...row, description: parseArray(row.description) }));
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM experiences WHERE id = ?', [id]);
    if (rows[0]) rows[0].description = parseArray(rows[0].description);
    return rows[0];
  }

  static async create(data) {
    const { title, company, location, start_date, end_date, description, current, type, icon, color, digital_folder_url } = data;
    const [result] = await db.execute(
      'INSERT INTO experiences (title, company, location, start_date, end_date, description, current, type, icon, color, digital_folder_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        company,
        location,
        start_date,
        end_date,
        JSON.stringify(description || []),
        current ? 1 : 0,
        type || 'work',
        icon || null,
        color || null,
        digital_folder_url || null,
      ]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { title, company, location, start_date, end_date, description, current, type, icon, color, digital_folder_url } = data;
    await db.execute(
      'UPDATE experiences SET title = ?, company = ?, location = ?, start_date = ?, end_date = ?, description = ?, current = ?, type = ?, icon = ?, color = ?, digital_folder_url = ? WHERE id = ?',
      [
        title,
        company,
        location,
        start_date,
        end_date,
        JSON.stringify(description || []),
        current ? 1 : 0,
        type || 'work',
        icon || null,
        color || null,
        digital_folder_url || null,
        id,
      ]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM experiences WHERE id = ?', [id]);
  }
}

module.exports = Experience;
