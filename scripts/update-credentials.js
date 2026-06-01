/**
 * Met à jour les identifiants de connexion admin en base de données.
 * Usage : node scripts/update-credentials.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const db = require('../config/db');
const bcrypt = require('bcrypt');

async function updateCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('❌  ADMIN_USERNAME ou ADMIN_PASSWORD manquant dans le .env');
    process.exit(1);
  }

  try {
    console.log(`🔄  Mise à jour de l'identifiant → ${username}`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'UPDATE users SET username = ?, password = ? WHERE id = (SELECT id FROM (SELECT id FROM users ORDER BY id LIMIT 1) AS u)',
      [username, hashedPassword]
    );

    if (result.affectedRows === 0) {
      // Aucun utilisateur n'existe encore → on le crée
      console.log('ℹ️  Aucun utilisateur trouvé, création du compte admin...');
      await db.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );
    }

    console.log('✅  Identifiants mis à jour avec succès !');
    console.log(`   Login    : ${username}`);
    console.log(`   Mot de passe : (tel que défini dans .env)`);
    process.exit(0);
  } catch (err) {
    console.error('❌  Erreur :', err.message);
    process.exit(1);
  }
}

updateCredentials();
