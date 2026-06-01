# backend-portfolio

API Node/Express + MySQL pour le portfolio de Kadmiel Tognon.

## Stack

- **Express 5** + middlewares de sécurité (`helmet`, `cors`, `express-rate-limit`, `compression`, `morgan`, `sanitize-html`)
- **MySQL** via `mysql2/promise`
- **JWT** pour l'authentification admin (`jsonwebtoken` + `bcrypt`)
- **Multer** pour les uploads (images 5 MB max sur les contenus classiques ; assets de marque libres depuis les paramètres)
- **db-migrate** pour les migrations versionnées

## Setup

```bash
cp .env.example .env
# Édite .env et renseigne DB_*, JWT_SECRET (>= 32 chars en prod), ADMIN_PASSWORD
npm install
```

## Base de données

### Cas A — Base neuve (vide)

```bash
npm run migrate     # crée toutes les tables
npm run seed        # peuple l'admin + le contenu de démo
```

### Cas B — Base existante (créée par l'ancien `syncDatabase()`)

```bash
npm run migrate:baseline  # marque la migration initiale comme déjà appliquée
npm run migrate           # n'aura rien à faire pour l'instant, mais sera prêt
                          # pour les prochaines migrations
```

### Créer une nouvelle migration

```bash
npm run migrate:create -- add-some-column --sql-file
# Édite ensuite les deux fichiers générés dans migrations/sqls/
npm run migrate
```

### Autres commandes utiles

| Commande              | Effet                                                     |
| --------------------- | --------------------------------------------------------- |
| `npm run migrate`     | Applique toutes les migrations non encore appliquées      |
| `npm run migrate:down`| Rollback de la dernière migration                         |
| `npm run migrate:status` | Liste les migrations appliquées et en attente          |
| `npm run migrate:reset`  | Rollback de **toutes** les migrations (⚠️ destructif)  |

## Lancer le serveur

```bash
npm run dev    # nodemon
npm start      # production
```

L'API écoute sur `PORT` (5000 par défaut) et expose :

- `GET  /api/health` — healthcheck (ping DB inclus)
- `POST /api/auth/login` — rate-limité (5 tentatives / 15 min)
- `POST /api/messages` — formulaire de contact, rate-limité (5 / h)
- `POST /api/analytics/track` — public, rate-limité (60 / min)
- ... voir `routes/` pour la liste complète

## Sécurité

- Le password admin est hashé avec bcrypt (coût 10).
- Tous les champs texte des routes publiques passent par `sanitize-html` pour neutraliser le XSS stocké.
- Le body parser est plafonné à 100 kB pour mitiger le DoS mémoire.
- `helmet` ajoute les headers de sécurité par défaut (HSTS, X-Frame-Options, etc.).
- `JWT_SECRET` doit faire >= 32 caractères en production, sinon le démarrage échoue.
- L'arrêt est gracieux (SIGTERM/SIGINT) : le pool MySQL est fermé proprement avec un timeout dur de 10 s.

## Tests

```bash
npm test    # check syntaxique sur tous les .js
```

Pas encore de suite de tests unitaires — c'est prévu dans la Phase 3.
