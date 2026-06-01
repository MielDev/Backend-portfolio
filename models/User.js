const db = require('../config/db');

class User {
  /**
   * Returns the row INCLUDING the password hash.
   * Used exclusively by the login flow — must never be returned to the client.
   */
  static async findByUsernameForAuth(username) {
    const [rows] = await db.execute(
      'SELECT id, username, password, created_at FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    return rows[0];
  }

  // Kept as an alias for backward compat — same semantics.
  static async findByUsername(username) {
    return User.findByUsernameForAuth(username);
  }

  /** Public-safe lookup: never returns the password hash. */
  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, username, created_at FROM users WHERE id = ? LIMIT 1',
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
