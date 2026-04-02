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
    const { title, description, image, github_url, demo_url, tags, cat, status, year } = data;
    const [result] = await db.execute(
      'INSERT INTO projects (title, description, image, github_url, demo_url, tags, cat, status, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, image, github_url, demo_url, JSON.stringify(tags || []), cat, status || 'live', year]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { title, description, image, github_url, demo_url, tags, cat, status, year } = data;
    
    // Construction dynamique de la requête pour ne pas écraser l'image si elle n'est pas fournie
    let query = 'UPDATE projects SET title = ?, description = ?, github_url = ?, demo_url = ?, tags = ?, cat = ?, status = ?, year = ?';
    let params = [title, description, github_url, demo_url, JSON.stringify(tags || []), cat, status, year];
    
    if (image) {
      query += ', image = ?';
      params.push(image);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    await db.execute(query, params);
  }

  static async delete(id) {
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);
  }

  static async incrementViews(id) {
    await db.execute('UPDATE projects SET views = views + 1 WHERE id = ?', [id]);
  }
}

module.exports = Project;
