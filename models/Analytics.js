const db = require('../config/db');

class Analytics {
  static async track(data) {
    const {
      event_type, page, path, 
      source, ip, referrer,
      utm_source, utm_medium, 
      utm_campaign, utm_content, 
      utm_term,
      country, device, user_agent, 
      language, timezone,
      screen_width, screen_height, 
      session_id, consent_analytics,
      ad_interests, 
      ad_click_source, 
      retargeting_eligible, 
      color_scheme, 
      device_memory, 
      hardware_concurrency
    } = data;

    await db.execute(
      `INSERT INTO analytics (
        event_type, page, path, 
        source, ip, referrer, 
        utm_source, utm_medium, 
        utm_campaign, utm_content, 
        utm_term,
        country, device, 
        user_agent, language, 
        timezone, 
        screen_width, 
        screen_height, session_id, 
        consent_analytics,
        ad_interests, 
        ad_click_source, 
        retargeting_eligible, 
        color_scheme, 
        device_memory, 
        hardware_concurrency, 
        visited_at
      ) VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ?, ?, ?, ?, ?, ?, NOW())`,
      [
        event_type || 'pageview', 
        page || null, path ? path.
        substring(0, 512) : null,
        source || null, ip || null, 
        referrer || null, 
        utm_source || null, 
        utm_medium || null,
        utm_campaign || null, 
        utm_content || null, 
        utm_term || null, 
        country || null,
        device || null, 
        user_agent || null, 
        language ? language.
        substring(0, 20) : null,
        timezone || null, 
        screen_width || null, 
        screen_height || null, 
        session_id || null,
        consent_analytics ? 1 : 0, 
        ad_interests ? JSON.
        stringify(ad_interests) : 
        null,
        ad_click_source || null, 
        retargeting_eligible ? 1 : 
        0, color_scheme || null,
        device_memory || null, 
        hardware_concurrency || null
      ]
    );

    if (session_id) {
      await db.execute(
        `INSERT INTO cookies_data 
        (session_id, ip, device, 
        user_agent, language, 
        country) 
         VALUES (?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         last_active = NOW()`,
        [session_id, ip, device, 
        user_agent, language, 
        country]
      );
    }
  }

  static async getOverview(range = '30d') {
    const days = parseInt(range) || 30;

    // --- Période Actuelle ---
    const [[currentViews]] = await db.execute(
      'SELECT COUNT(*) as count FROM analytics WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', 
      [days]
    );
    const [[currentVisitors]] = await db.execute(
      'SELECT COUNT(DISTINCT ip) as count FROM analytics WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', 
      [days]
    );
    const [[currentAvgSession]] = await db.execute(`
      SELECT AVG(duration) as avg_duration FROM (
        SELECT session_id, TIMESTAMPDIFF(SECOND, MIN(visited_at), MAX(visited_at)) as duration
        FROM analytics WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND session_id IS NOT NULL
        GROUP BY session_id HAVING duration > 0
      ) as sessions`, [days]);

    // --- Période Précédente ---
    const [[prevViews]] = await db.execute(
      'SELECT COUNT(*) as count FROM analytics WHERE visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)', 
      [days * 2, days]
    );
    const [[prevVisitors]] = await db.execute(
      'SELECT COUNT(DISTINCT ip) as count FROM analytics WHERE visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)', 
      [days * 2, days]
    );
    const [[prevAvgSession]] = await db.execute(`
      SELECT AVG(duration) as avg_duration FROM (
        SELECT session_id, TIMESTAMPDIFF(SECOND, MIN(visited_at), MAX(visited_at)) as duration
        FROM analytics WHERE (visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)) AND session_id IS NOT NULL
        GROUP BY session_id HAVING duration > 0
      ) as sessions`, [days * 2, days]);

    // --- Taux de rebond (Bounce Rate) ---
    // Période Actuelle
    const [[currentTotalSessions]] = await db.execute(
      'SELECT COUNT(DISTINCT session_id) as count FROM analytics WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)', 
      [days]
    );
    const [[currentBounceSessions]] = await db.execute(`
      SELECT COUNT(*) as count FROM (
        SELECT session_id FROM analytics 
        WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND session_id IS NOT NULL
        GROUP BY session_id HAVING COUNT(*) = 1
      ) as bounces`, [days]);

    // Période Précédente
    const [[prevTotalSessions]] = await db.execute(
      'SELECT COUNT(DISTINCT session_id) as count FROM analytics WHERE visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)', 
      [days * 2, days]
    );
    const [[prevBounceSessions]] = await db.execute(`
      SELECT COUNT(*) as count FROM (
        SELECT session_id FROM analytics 
        WHERE (visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)) AND session_id IS NOT NULL
        GROUP BY session_id HAVING COUNT(*) = 1
      ) as bounces`, [days * 2, days]);

    const calculateBounceRate = (bounces, totals) => {
      return totals > 0 ? Math.round((bounces / totals) * 100) : 0;
    };

    const currentBounceRate = calculateBounceRate(currentBounceSessions.count, currentTotalSessions.count);
    const prevBounceRate = calculateBounceRate(prevBounceSessions.count, prevTotalSessions.count);

    const calculateTrend = (current, previous) => {
      if (previous <= 0) {
        // Si pas de données précédentes, on affiche 100% si on a du trafic actuel
        return { 
          trend: current > 0 ? '100%' : '0.0%', 
          trendUp: current > 0 
        };
      }
      const trendValue = ((current - previous) / previous) * 100;
      return {
        trend: Math.abs(trendValue).toFixed(1) + '%', // On envoie la valeur absolue
        trendUp: trendValue >= 0 // Le sens est géré par ce booléen
      };
    };

    const viewsTrend = calculateTrend(currentViews.count, prevViews.count);
    const visitorsTrend = calculateTrend(currentVisitors.count, prevVisitors.count);
    const durationTrend = calculateTrend(currentAvgSession?.avg_duration || 0, prevAvgSession?.avg_duration || 0);
    const bounceTrend = calculateTrend(currentBounceRate, prevBounceRate);

    return {
      totalViews: currentViews.count,
      totalViewsTrend: viewsTrend.trend,
      totalViewsTrendUp: viewsTrend.trendUp,
      uniqueVisitors: currentVisitors.count,
      uniqueVisitorsTrend: visitorsTrend.trend,
      uniqueVisitorsTrendUp: visitorsTrend.trendUp,
      avgSessionDuration: Math.round(currentAvgSession?.avg_duration || 0),
      avgSessionDurationTrend: durationTrend.trend,
      avgSessionDurationTrendUp: durationTrend.trendUp,
      bounceRate: currentBounceRate,
      bounceRateTrend: bounceTrend.trend,
      bounceRateTrendUp: bounceTrend.trendUp
    };
  }

  static async getDailyStats(range = '30d') {
    const days = parseInt(range) || 30;
    const [rows] = await db.execute(`
      SELECT DATE(visited_at) as 
      date, COUNT(*) as views 
      FROM analytics WHERE 
      visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(visited_at) 
      ORDER BY date ASC`, [days]);
    return rows;
  }

  static async getSources(range = '30d') {
    const days = parseInt(range) || 30;
    const [rows] = await db.execute(`
      SELECT source, COUNT(*) as 
      count FROM analytics 
      WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY source ORDER BY 
      count DESC`, [days]);
    return rows;
  }

  static async getCountries(range = '30d') {
    const days = parseInt(range) || 30;
    const [rows] = await db.execute(`
      SELECT country, COUNT(*) as 
      count FROM analytics 
      WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY country ORDER BY 
      count DESC`, [days]);
    return rows;
  }

  static async getDevices(range = '30d') {
    const days = parseInt(range) || 30;
    const [rows] = await db.execute(`
      SELECT device, COUNT(*) as 
      count FROM analytics 
      WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND 
      device IS NOT NULL
      GROUP BY device ORDER BY 
      count DESC`, [days]);
    return rows;
  }

  static async getBrowsers(range = '30d') {
    const days = parseInt(range) || 30;
    const [rows] = await db.execute(`
      SELECT 
        CASE 
          WHEN user_agent LIKE '%Chrome%' AND user_agent NOT LIKE '%Edg%' AND user_agent NOT LIKE '%OPR%' THEN 'Chrome'
          WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
          WHEN user_agent LIKE '%Safari%' AND user_agent NOT LIKE '%Chrome%' THEN 'Safari'
          WHEN user_agent LIKE '%Edg%' THEN 'Edge'
          WHEN user_agent LIKE '%OPR%' OR user_agent LIKE '%Opera%' THEN 'Opera'
          ELSE 'Autre'
        END as browser, COUNT(*) as count
      FROM analytics WHERE 
      visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND 
      user_agent IS NOT NULL
      GROUP BY browser ORDER BY 
      count DESC`, [days]);
    return rows;
  }

  static async getTopPages(range = '30d') {
    const days = parseInt(range) || 30;
    const [rows] = await db.execute(`
      SELECT path, COUNT(*) as 
      views FROM analytics 
      WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY) AND 
      event_type = 'pageview'
      GROUP BY path ORDER BY views 
      DESC LIMIT 10`, [days]);
    return rows;
  }

  static async getRecentEvents(limit = 10) {
    const [rows] = await db.execute(`
      SELECT event_type, path, 
      country, visited_at FROM 
      analytics 
      ORDER BY visited_at DESC 
      LIMIT ?`, [limit]);
    return rows;
  }
}

module.exports = Analytics;
