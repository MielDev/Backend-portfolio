const db = require('../config/db');

class Project {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }));
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows[0]) {
      rows[0].tags = JSON.parse(rows[0].tags || '[]');
    }
    return rows[0];
  }

  static async create(data) {
    const { title, description, image, github_url, demo_url, tags } = data;
    const [result] = await db.execute(
      'INSERT INTO projects (title, description, image, github_url, demo_url, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, image, github_url, demo_url, JSON.stringify(tags || [])]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { title, description, image, github_url, demo_url, tags } = data;
    await db.execute(
      'UPDATE projects SET title = ?, description = ?, image = ?, github_url = ?, demo_url = ?, tags = ? WHERE id = ?',
      [title, description, image, github_url, demo_url, JSON.stringify(tags || []), id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);
  }
}

module.exports = Project;
