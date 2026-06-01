const db = require('../config/db');
const { parseArray } = require('../utils/json');

class Skill {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM skills ORDER BY title');
    return rows.map((row) => ({ ...row, technologies: parseArray(row.technologies) }));
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM skills WHERE id = ?', [id]);
    if (rows[0]) rows[0].technologies = parseArray(rows[0].technologies);
    return rows[0];
  }

  static async create(data) {
    const { title, description, technologies, icon } = data;
    const [result] = await db.execute(
      'INSERT INTO skills (title, description, technologies, icon) VALUES (?, ?, ?, ?)',
      [title, description, JSON.stringify(technologies || []), icon]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { title, description, technologies, icon } = data;
    await db.execute(
      'UPDATE skills SET title = ?, description = ?, technologies = ?, icon = ? WHERE id = ?',
      [title, description, JSON.stringify(technologies || []), icon, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM skills WHERE id = ?', [id]);
  }
}

module.exports = Skill;
