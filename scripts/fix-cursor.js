/**
 * Réactive le curseur personnalisé en base de données.
 * Usage : node scripts/fix-cursor.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../config/db');

async function fixCursor() {
  try {
    // Lire les settings display actuels
    const [rows] = await db.execute(
      "SELECT value FROM settings WHERE setting_key = 'display'"
    );

    let display = {
      customCursor: true,
      bgGrid: true,
      animations: true,
      floatingCv: true
    };

    if (rows.length > 0) {
      try {
        const existing = JSON.parse(rows[0].value);
        display = { ...display, ...existing };
      } catch (e) {}
    }

    // Forcer customCursor à true
    display.customCursor = true;

    const value = JSON.stringify(display);

    if (rows.length > 0) {
      await db.execute(
        "UPDATE settings SET value = ? WHERE setting_key = 'display'",
        [value]
      );
    } else {
      await db.execute(
        "INSERT INTO settings (setting_key, value) VALUES ('display', ?)",
        [value]
      );
    }

    console.log('✅ Curseur personnalisé réactivé !');
    console.log('   Paramètres display :', display);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
  }
}

fixCursor();
