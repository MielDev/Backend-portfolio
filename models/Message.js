const db = require('../config/db');

class Message {
  static async getAll() {
    const [rows] = await db.execute('SELECT * FROM messages ORDER BY created_at DESC');
    return rows;
  }

  static async create(data) {
    const { name, email, subject, content } = data;
    const [result] = await db.execute(
      'INSERT INTO messages (name, email, subject, content) VALUES (?, ?, ?, ?)',
      [name, email, subject, content]
    );
    return result.insertId;
  }

  static async updateStatus(id, status) {
    await db.execute('UPDATE messages SET status = ? WHERE id = ?', [status, id]);
  }

  static async delete(id) {
    await db.execute('DELETE FROM messages WHERE id = ?', [id]);
  }
}

module.exports = Message;
