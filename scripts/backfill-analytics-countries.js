require('dotenv').config();

const db = require('../config/db');
const { normalizeCountry, normalizeIp } = require('../utils/geoCountry');
const geoip = require('geoip-lite');

async function main() {
  const [rows] = await db.execute(`
    SELECT id, ip
    FROM analytics
    WHERE ip IS NOT NULL
    AND ip <> ''
    AND (country IS NULL OR country = '' OR LOWER(country) = 'inconnu')
    LIMIT 5000
  `);

  let updated = 0;
  for (const row of rows) {
    const ip = normalizeIp(row.ip);
    const country = normalizeCountry(geoip.lookup(ip)?.country);
    if (!country) continue;

    await db.execute('UPDATE analytics SET country = ? WHERE id = ?', [country, row.id]);
    updated += 1;
  }

  console.log(`analytics country backfill: scanned=${rows.length} updated=${updated}`);
  await db.end();
}

main().catch(async (error) => {
  console.error(error);
  try {
    await db.end();
  } catch {}
  process.exit(1);
});
