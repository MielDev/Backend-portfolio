const db = require('../config/db');

class Analytics {
  static parseRangeDays(range = '30d') {
    const days = parseInt(range, 10);
    if (!Number.isFinite(days)) return 30;
    return Math.min(Math.max(days, 1), 365);
  }

  static sessionKeyExpression() {
    return "COALESCE(session_id, ip, CONCAT('anon-', id))";
  }

  static async scalar(sql, params = []) {
    const [[row]] = await db.execute(sql, params);
    return Number(row?.count ?? row?.value ?? 0);
  }

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
        page || null,
        path ? path.substring(0, 512) : null,
        source || null,
        ip || null,
        referrer || null,
        utm_source || null,
        utm_medium || null,
        utm_campaign || null,
        utm_content || null,
        utm_term || null,
        country || null,
        device || null,
        user_agent || null,
        language ? language.substring(0, 20) : null,
        timezone || null,
        screen_width || null,
        screen_height || null,
        session_id || null,
        consent_analytics ? 1 : 0,
        ad_interests ? JSON.stringify(ad_interests) : null,
        ad_click_source || null,
        retargeting_eligible ? 1 : 0,
        color_scheme || null,
        device_memory || null,
        hardware_concurrency || null
      ]
    );

    if (session_id) {
      await db.execute(
        `INSERT INTO cookies_data
        (session_id, ip, device, user_agent, language, country)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         ip = VALUES(ip),
         device = VALUES(device),
         user_agent = VALUES(user_agent),
         language = VALUES(language),
         country = VALUES(country),
         last_active = NOW()`,
        [session_id, ip, device, user_agent, language, country]
      );
    }
  }

  static async getOverview(range = '30d') {
    const days = Analytics.parseRangeDays(range);
    const sessionKey = Analytics.sessionKeyExpression();
    const pageviewFilter = "event_type = 'pageview'";

    const currentViews = await Analytics.scalar(
      `SELECT COUNT(*) as count
       FROM analytics
       WHERE ${pageviewFilter} AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    );
    const currentVisitors = await Analytics.scalar(
      `SELECT COUNT(DISTINCT ${sessionKey}) as count
       FROM analytics
       WHERE ${pageviewFilter} AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    );

    const [[currentAvgSession]] = await db.execute(`
      SELECT AVG(duration) as avg_duration
      FROM (
        SELECT LEAST(TIMESTAMPDIFF(SECOND, MIN(visited_at), MAX(visited_at)), 1800) as duration
        FROM analytics
        WHERE ${pageviewFilter} AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(visited_at), ${sessionKey}
      ) as sessions`, [days]);

    const prevViews = await Analytics.scalar(
      `SELECT COUNT(*) as count
       FROM analytics
       WHERE ${pageviewFilter}
       AND visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days * 2, days]
    );
    const prevVisitors = await Analytics.scalar(
      `SELECT COUNT(DISTINCT ${sessionKey}) as count
       FROM analytics
       WHERE ${pageviewFilter}
       AND visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days * 2, days]
    );

    const [[prevAvgSession]] = await db.execute(`
      SELECT AVG(duration) as avg_duration
      FROM (
        SELECT LEAST(TIMESTAMPDIFF(SECOND, MIN(visited_at), MAX(visited_at)), 1800) as duration
        FROM analytics
        WHERE ${pageviewFilter}
        AND visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(visited_at), ${sessionKey}
      ) as sessions`, [days * 2, days]);

    const [[currentSessions]] = await db.execute(`
      SELECT
        COUNT(*) as total_sessions,
        SUM(CASE WHEN pageviews = 1 THEN 1 ELSE 0 END) as bounce_sessions
      FROM (
        SELECT COUNT(*) as pageviews
        FROM analytics
        WHERE ${pageviewFilter} AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(visited_at), ${sessionKey}
      ) as sessions`, [days]);

    const [[prevSessions]] = await db.execute(`
      SELECT
        COUNT(*) as total_sessions,
        SUM(CASE WHEN pageviews = 1 THEN 1 ELSE 0 END) as bounce_sessions
      FROM (
        SELECT COUNT(*) as pageviews
        FROM analytics
        WHERE ${pageviewFilter}
        AND visited_at BETWEEN DATE_SUB(NOW(), INTERVAL ? DAY) AND DATE_SUB(NOW(), INTERVAL ? DAY)
        GROUP BY DATE(visited_at), ${sessionKey}
      ) as sessions`, [days * 2, days]);

    const calculateBounceRate = (bounces, totals) => (
      totals > 0 ? Math.round((bounces / totals) * 100) : 0
    );

    const currentBounceRate = calculateBounceRate(
      Number(currentSessions?.bounce_sessions || 0),
      Number(currentSessions?.total_sessions || 0)
    );
    const prevBounceRate = calculateBounceRate(
      Number(prevSessions?.bounce_sessions || 0),
      Number(prevSessions?.total_sessions || 0)
    );

    const calculateTrend = (current, previous) => {
      if (previous <= 0) {
        return {
          trend: current > 0 ? '100%' : '0.0%',
          trendUp: current > 0
        };
      }
      const trendValue = ((current - previous) / previous) * 100;
      return {
        trend: Math.abs(trendValue).toFixed(1) + '%',
        trendUp: trendValue >= 0
      };
    };

    const viewsTrend = calculateTrend(currentViews, prevViews);
    const visitorsTrend = calculateTrend(currentVisitors, prevVisitors);
    const durationTrend = calculateTrend(currentAvgSession?.avg_duration || 0, prevAvgSession?.avg_duration || 0);
    const bounceTrend = calculateTrend(currentBounceRate, prevBounceRate);

    return {
      totalViews: currentViews,
      totalViewsTrend: viewsTrend.trend,
      totalViewsTrendUp: viewsTrend.trendUp,
      uniqueVisitors: currentVisitors,
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
    const days = Analytics.parseRangeDays(range);
    const [rows] = await db.execute(`
      SELECT DATE(visited_at) as date, COUNT(*) as views
      FROM analytics
      WHERE event_type = 'pageview' AND visited_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(visited_at)
      ORDER BY date ASC`, [days - 1]);

    const countsByDate = new Map(rows.map((row) => [Analytics.formatDateKey(row.date), Number(row.views || 0)]));
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = Analytics.formatDateKey(d);
      result.push({ date: key, views: countsByDate.get(key) || 0 });
    }

    return result;
  }

  static async getSources(range = '30d') {
    const days = Analytics.parseRangeDays(range);
    const [rows] = await db.execute(`
      SELECT COALESCE(NULLIF(source, ''), 'direct') as source, COUNT(*) as count
      FROM analytics
      WHERE event_type = 'pageview' AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY COALESCE(NULLIF(source, ''), 'direct')
      ORDER BY count DESC`, [days]);
    return rows;
  }

  static async getCountries(range = '30d') {
    const days = Analytics.parseRangeDays(range);
    const [rows] = await db.execute(`
      SELECT COALESCE(NULLIF(country, ''), 'Inconnu') as country, COUNT(*) as count
      FROM analytics
      WHERE event_type = 'pageview' AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY COALESCE(NULLIF(country, ''), 'Inconnu')
      ORDER BY count DESC`, [days]);
    return rows;
  }

  static async getDevices(range = '30d') {
    const days = Analytics.parseRangeDays(range);
    const [rows] = await db.execute(`
      SELECT COALESCE(NULLIF(device, ''), 'desktop') as device, COUNT(*) as count
      FROM analytics
      WHERE event_type = 'pageview' AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY COALESCE(NULLIF(device, ''), 'desktop')
      ORDER BY count DESC`, [days]);
    return rows;
  }

  static async getBrowsers(range = '30d') {
    const days = Analytics.parseRangeDays(range);
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
      FROM analytics
      WHERE event_type = 'pageview'
      AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      AND user_agent IS NOT NULL
      GROUP BY browser
      ORDER BY count DESC`, [days]);
    return rows;
  }

  static async getTopPages(range = '30d') {
    const days = Analytics.parseRangeDays(range);
    const [rows] = await db.execute(`
      SELECT COALESCE(NULLIF(path, ''), '/') as path, COUNT(*) as views
      FROM analytics
      WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      AND event_type = 'pageview'
      GROUP BY COALESCE(NULLIF(path, ''), '/')
      ORDER BY views DESC
      LIMIT 10`, [days]);
    return rows;
  }

  static async getRecentEvents(limit = 20) {
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const [rows] = await db.execute(`
      SELECT id, event_type, COALESCE(NULLIF(path, ''), '/') as path,
      source, country, device, ip, session_id, visited_at
      FROM analytics
      ORDER BY visited_at DESC
      LIMIT ${safeLimit}`);
    return rows;
  }

  static async getRealtime(minutes = 5) {
    const safeMinutes = Math.min(Math.max(parseInt(minutes, 10) || 5, 1), 60);
    const sessionKey = Analytics.sessionKeyExpression();

    const activeVisitors = await Analytics.scalar(
      `SELECT COUNT(DISTINCT ${sessionKey}) as count
       FROM analytics
       WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
      [safeMinutes]
    );

    const [pages] = await db.execute(`
      SELECT COALESCE(NULLIF(path, ''), '/') as path, COUNT(*) as count
      FROM analytics
      WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
      GROUP BY COALESCE(NULLIF(path, ''), '/')
      ORDER BY count DESC
      LIMIT 5`, [safeMinutes]);

    return { activeVisitors, pages };
  }

  static async getHourlyStats(range = '30d') {
    const days = Analytics.parseRangeDays(range);
    const [rows] = await db.execute(`
      SELECT
        WEEKDAY(visited_at) as weekday,
        HOUR(visited_at) as hour,
        COUNT(*) as count
      FROM analytics
      WHERE event_type = 'pageview'
      AND visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY WEEKDAY(visited_at), HOUR(visited_at)
      ORDER BY weekday ASC, hour ASC`, [days]);

    return rows.map((row) => ({
      weekday: Number(row.weekday),
      hour: Number(row.hour),
      count: Number(row.count || 0)
    }));
  }

  static formatDateKey(value) {
    const date = value instanceof Date ? value : new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

module.exports = Analytics;
