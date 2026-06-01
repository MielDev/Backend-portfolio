const db = require('../config/db');
const { parseArray, parseObject } = require('../utils/json');

class About {
  static async get() {
    const [rows] = await db.execute('SELECT * FROM about LIMIT 1');
    if (rows[0]) {
      rows[0].interests = parseArray(rows[0].interests);
      rows[0].social_links = parseObject(rows[0].social_links);
    }
    return rows[0];
  }

  static async update(data) {
    const {
      name,
      title,
      bio,
      photo,
      resume_url,
      email,
      phone,
      location,
      nationality,
      interests,
      social_links,
    } = data;

    const existing = await this.get();

    if (existing) {
      await db.execute(
        'UPDATE about SET name = ?, title = ?, bio = ?, photo = ?, resume_url = ?, email = ?, phone = ?, location = ?, nationality = ?, interests = ?, social_links = ? WHERE id = ?',
        [
          name,
          title,
          bio,
          photo,
          resume_url,
          email,
          phone,
          location,
          nationality,
          JSON.stringify(interests || []),
          JSON.stringify(social_links || {}),
          existing.id,
        ]
      );
    } else {
      await db.execute(
        'INSERT INTO about (name, title, bio, photo, resume_url, email, phone, location, nationality, interests, social_links) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          name,
          title,
          bio,
          photo,
          resume_url,
          email,
          phone,
          location,
          nationality,
          JSON.stringify(interests || []),
          JSON.stringify(social_links || {}),
        ]
      );
    }
  }

  static async updatePhoto(photoPath) {
    const existing = await this.get();
    if (existing) {
      await db.execute('UPDATE about SET photo = ? WHERE id = ?', [photoPath, existing.id]);
    } else {
      await db.execute('INSERT INTO about (photo) VALUES (?)', [photoPath]);
    }
  }
}

module.exports = About;
