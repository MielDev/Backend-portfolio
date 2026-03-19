const db = require('../config/db');

class Testimonial {
  static async getPublic() {
    const [rows] = await db.execute('SELECT * FROM testimonials WHERE status = "published" ORDER BY created_at DESC');
    return rows;
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM testimonials ORDER BY created_at DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute('SELECT * FROM testimonials WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, role, company, content, photo, status } = data;
    const [result] = await db.execute(
      'INSERT INTO testimonials (name, role, company, content, photo, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, role, company, content, photo, status || 'pending']
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { name, role, company, content, photo, status } = data;
    await db.execute(
      'UPDATE testimonials SET name = ?, role = ?, company = ?, content = ?, photo = ?, status = ? WHERE id = ?',
      [name, role, company, content, photo, status, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM testimonials WHERE id = ?', [id]);
  }
}

module.exports = Testimonial;
