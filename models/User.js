const db = require('../config/db');

class User {
  static async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, username FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  // Helper method for initial setup or admin creation
  static async create(username, password) {
    const [result] = await db.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    return result.insertId;
  }
}

module.exports = User;
