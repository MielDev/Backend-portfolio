const db = require('../config/db');

class BlogPost {
  static async getPublished() {
    const [rows] = await db.execute('SELECT * FROM blog_posts WHERE status = "published" ORDER BY created_at DESC');
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }));
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM blog_posts ORDER BY created_at DESC');
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]')
    }));
  }

  static async getBySlug(slug) {
    const [rows] = await db.execute('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
    if (rows[0]) {
      rows[0].tags = JSON.parse(rows[0].tags || '[]');
    }
    return rows[0];
  }

  static async create(data) {
    const { title, slug, content, read_minutes, image, tags, status } = data;
    const [result] = await db.execute(
      'INSERT INTO blog_posts (title, slug, content, read_minutes, image, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, slug, content, read_minutes, image, JSON.stringify(tags || []), status || 'draft']
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { title, slug, content, read_minutes, image, tags, status } = data;
    await db.execute(
      'UPDATE blog_posts SET title = ?, slug = ?, content = ?, read_minutes = ?, image = ?, tags = ?, status = ? WHERE id = ?',
      [title, slug, content, read_minutes, image, JSON.stringify(tags || []), status, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM blog_posts WHERE id = ?', [id]);
  }
}

module.exports = BlogPost;
