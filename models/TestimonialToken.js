const db = require('../config/db');
const crypto = require('crypto');

class TestimonialToken {
  static async create() {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // Valide 48h
    await db.execute(
      'INSERT INTO testimonial_tokens (token, expires_at) VALUES (?, ?)',
      [token, expiresAt]
    );
    return token;
  }

  static async verify(token) {
    const [rows] = await db.execute(
      'SELECT * FROM testimonial_tokens WHERE token = ? AND used = 0 AND expires_at > NOW()',
      [token]
    );
    return rows.length > 0;
  }

  static async use(token) {
    await db.execute('UPDATE testimonial_tokens SET used = 1 WHERE token = ?', [token]);
  }
}

module.exports = TestimonialToken;
