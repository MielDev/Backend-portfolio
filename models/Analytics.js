const db = require('../config/db');

class Analytics {
  static async track(data) {
    const { page, source, country, device } = data;
    await db.execute(
      'INSERT INTO analytics (page, source, country, device, visited_at) VALUES (?, ?, ?, ?, NOW())',
      [page, source, country, device]
    );
  }

  static async getOverview() {
    const [totalViews] = await db.execute('SELECT COUNT(*) as count FROM analytics');
    const [uniqueVisitors] = await db.execute('SELECT COUNT(DISTINCT country, device) as count FROM analytics');
    return {
      totalViews: totalViews[0].count,
      uniqueVisitors: uniqueVisitors[0].count
    };
  }

  static async getDailyStats() {
    const [rows] = await db.execute(`
      SELECT DATE(visited_at) as date, COUNT(*) as views 
      FROM analytics 
      GROUP BY DATE(visited_at) 
      ORDER BY date DESC 
      LIMIT 30
    `);
    return rows;
  }

  static async getSources() {
    const [rows] = await db.execute(`
      SELECT source, COUNT(*) as count 
      FROM analytics 
      GROUP BY source 
      ORDER BY count DESC
    `);
    return rows;
  }

  static async getCountries() {
    const [rows] = await db.execute(`
      SELECT country, COUNT(*) as count 
      FROM analytics 
      GROUP BY country 
      ORDER BY count DESC
    `);
    return rows;
  }
}

module.exports = Analytics;
