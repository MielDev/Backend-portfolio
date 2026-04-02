const db = require('../config/db');
/**
 * Script de seeding pour les données d'analytics.
 * Génère des données pour les 60 derniers jours avec des tendances et du rebond.
 */
const seedAnalytics = async () => {
  try {
    console.log('--- Démarrage du seeding des Analytics ---');

    // On vide d'abord la table analytics pour repartir sur une base propre
    console.log('Nettoyage de la table analytics...');
    await db.execute('DELETE FROM analytics');
    await db.execute('DELETE FROM cookies_data');

    const countries = ['France', 'Bénin', 'USA', 'Canada', 'Sénégal', 'Côte d\'Ivoire', 'Belgique', 'Suisse'];
    const devices = ['Mobile', 'Desktop', 'Tablet'];
    const browsers = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', // Chrome
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0', // Firefox
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15', // Safari
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0' // Edge
    ];
    const paths = ['/', '/projects', '/about', '/blog', '/contact'];
    const sources = ['Direct', 'Google', 'LinkedIn', 'Twitter', 'GitHub', 'Email'];

    const now = new Date();
    const records = [];

    // On génère des données pour les 60 derniers jours
    for (let i = 59; i >= 0; i--) {
      const currentDate = new Date(now);
      currentDate.setDate(now.getDate() - i);
      
      // On simule une tendance : plus de visites dans les 30 derniers jours (période actuelle)
      // que dans les 30 jours précédents (période de comparaison)
      const isCurrentPeriod = i < 30;
      const baseVisits = isCurrentPeriod ? 25 : 15; // Moyenne de visites par jour
      const dailyVisits = baseVisits + Math.floor(Math.random() * 15); // Variation quotidienne

      for (let j = 0; j < dailyVisits; j++) {
        const sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
        const country = countries[Math.floor(Math.random() * countries.length)];
        const device = devices[Math.floor(Math.random() * devices.length)];
        const userAgent = browsers[Math.floor(Math.random() * browsers.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;

        // Heure aléatoire dans la journée
        const visitedAt = new Date(currentDate);
        visitedAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        // --- Simulation du rebond ---
        // 40% de chance d'être un "rebond" (une seule page vue)
        const isBounce = Math.random() < 0.4;
        const pagesToVisit = isBounce ? 1 : 2 + Math.floor(Math.random() * 3);

        for (let p = 0; p < pagesToVisit; p++) {
          const path = paths[Math.floor(Math.random() * paths.length)];
          
          // On ajoute un petit délai entre les pages vues d'une même session
          const pageVisitedAt = new Date(visitedAt);
          pageVisitedAt.setSeconds(visitedAt.getSeconds() + (p * 45));

          records.push([
            'pageview',
            path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.substring(2),
            path,
            source,
            ip,
            null, // referrer
            null, null, null, null, null, // UTMs
            country,
            device,
            userAgent,
            'fr-FR',
            'Europe/Paris',
            1920, 1080,
            sessionId,
            1, // consent
            null, null, 0, 'dark', 8, 8,
            pageVisitedAt
          ]);
        }

        // Ajout dans cookies_data pour la cohérence
        await db.execute(
          `INSERT INTO cookies_data (session_id, ip, device, user_agent, language, country, last_active, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE last_active = ?`,
          [sessionId, ip, device, userAgent, 'fr-FR', country, visitedAt, visitedAt, visitedAt]
        );
      }
    }

    // Insertion groupée (bulk insert) pour les analytics
    console.log(`Insertion de ${records.length} enregistrements d'analytics...`);
    
    // MySQL a une limite sur le nombre de paramètres, on insère par paquets
    const chunkSize = 100;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
      const flatValues = chunk.reduce((acc, val) => acc.concat(val), []);
      
      await db.execute(
        `INSERT INTO analytics (
          event_type, page, path, source, ip, referrer,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          country, device, user_agent, language, timezone,
          screen_width, screen_height, session_id, consent_analytics,
          ad_interests, ad_click_source, retargeting_eligible, color_scheme,
          device_memory, hardware_concurrency, visited_at
        ) VALUES ${placeholders}`,
        flatValues
      );
    }

    console.log('--- Seeding des Analytics terminé avec succès ! ---');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding des analytics :', error);
    process.exit(1);
  }
};

seedAnalytics();
