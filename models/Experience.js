const db = require('../config/db');
const { parseArray } = require('../utils/json');

const toBooleanInt = (value) =>
  value === true || value === 1 || value === '1' || value === 'true' ? 1 : 0;

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
    const { title, company, location, start_date, end_date, description, current, type, icon, color, digital_folder_url, image } = data;
    const [result] = await db.execute(
      'INSERT INTO experiences (title, company, location, start_date, end_date, description, current, type, icon, color, digital_folder_url, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        company,
        location,
        start_date,
        end_date,
        JSON.stringify(description || []),
        toBooleanInt(current),
        type || 'work',
        icon || null,
        color || null,
        digital_folder_url || null,
        image || null,
      ]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { title, company, location, start_date, end_date, description, current, type, icon, color, digital_folder_url, image } = data;
    let query =
      'UPDATE experiences SET title = ?, company = ?, location = ?, start_date = ?, end_date = ?, description = ?, current = ?, type = ?, icon = ?, color = ?, digital_folder_url = ?';
    const params = [
      title,
      company,
      location,
      start_date,
      end_date,
      JSON.stringify(description || []),
      toBooleanInt(current),
      type || 'work',
      icon || null,
      color || null,
      digital_folder_url || null,
    ];

    if (Object.prototype.hasOwnProperty.call(data, 'image')) {
      query += ', image = ?';
      params.push(image || null);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.execute(query, params);
  }

  static async delete(id) {
    await db.execute('DELETE FROM experiences WHERE id = ?', [id]);
  }
}

module.exports = Experience;
