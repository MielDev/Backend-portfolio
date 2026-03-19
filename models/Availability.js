const db = require('../config/db');

class Availability {
  static async get() {
    const [rows] = await db.execute('SELECT * FROM availability LIMIT 1');
    if (rows[0]) {
      rows[0].tags = JSON.parse(rows[0].tags || '[]');
    }
    return rows[0];
  }

  static async upsert(data) {
    const {
      badge_text,
      headline,
      description,
      tags,
      primary_cta_text,
      primary_cta_type,
      secondary_cta_text,
      secondary_cta_url
    } = data;

    const existing = await this.get();
    const tagsJson = JSON.stringify(tags || []);

    if (existing) {
      await db.execute(
        'UPDATE availability SET badge_text = ?, headline = ?, description = ?, tags = ?, primary_cta_text = ?, primary_cta_type = ?, secondary_cta_text = ?, secondary_cta_url = ? WHERE id = ?',
        [
          badge_text,
          headline,
          description,
          tagsJson,
          primary_cta_text,
          primary_cta_type,
          secondary_cta_text,
          secondary_cta_url,
          existing.id
        ]
      );
      return existing.id;
    }

    const [result] = await db.execute(
      'INSERT INTO availability (badge_text, headline, description, tags, primary_cta_text, primary_cta_type, secondary_cta_text, secondary_cta_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        badge_text,
        headline,
        description,
        tagsJson,
        primary_cta_text,
        primary_cta_type,
        secondary_cta_text,
        secondary_cta_url
      ]
    );
    return result.insertId;
  }
}

module.exports = Availability;

