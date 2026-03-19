const db = require('../config/db');

class Hero {
  static async get() {
    const [rows] = await db.execute('SELECT * FROM hero LIMIT 1');
    return rows[0];
  }

  static async update(data) {
    const { greeting, name, role, description, cv, projects_count, experience_years, passion_icon } = data;
    
    const existing = await this.get();
    
    if (existing) {
      await db.execute(
        'UPDATE hero SET greeting = ?, name = ?, role = ?, description = ?, cv = ?, projects_count = ?, experience_years = ?, passion_icon = ? WHERE id = ?',
        [greeting, name, role, description, cv, projects_count, experience_years, passion_icon, existing.id]
      );
    } else {
      await db.execute(
        'INSERT INTO hero (greeting, name, role, description, cv, projects_count, experience_years, passion_icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [greeting, name, role, description, cv, projects_count, experience_years, passion_icon]
      );
    }
  }
}

module.exports = Hero;
