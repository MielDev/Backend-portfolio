const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { globalLimiter } = require('./middleware/rateLimit');
const db = require('./config/db');

const app = express();

const isProd = process.env.NODE_ENV === 'production';

// ─── JWT secret hardening ──────────────────────────────────────────────
const insecureJwtSecrets = new Set(['change_me', 'replace_with_a_long_random_secret']);
if (
  isProd &&
  (!process.env.JWT_SECRET ||
    insecureJwtSecrets.has(process.env.JWT_SECRET) ||
    process.env.JWT_SECRET.length < 32)
) {
  throw new Error('JWT_SECRET must be configured with a strong value in production');
}

// ─── Trust proxy (needed for correct client IPs behind nginx/cloudflare) ─
// 1 = trust first hop. Change if you sit behind more proxies.
app.set('trust proxy', 1);

// ─── Security headers ──────────────────────────────────────────────────
app.use(
  helmet({
    // We serve uploaded images that may be embedded by the Angular front
    // hosted on a different origin in dev, so relax this single header.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    // CSP is best configured at the front (Angular) since the API only
    // returns JSON. Leave Helmet's default off to avoid breaking the
    // /uploads static serving when consumed from other origins.
    contentSecurityPolicy: false,
  })
);

// ─── Gzip ──────────────────────────────────────────────────────────────
app.use(compression());

// ─── Access logs ───────────────────────────────────────────────────────
app.use(morgan(isProd ? 'combined' : 'dev'));

// ─── CORS ──────────────────────────────────────────────────────────────
const parseOrigins = (value) =>
  String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = new Set([
  'http://localhost:4200',
  'https://portfolio-kadmiel.vercel.app',
  'https://kadmiel-tognon.vercel.app',
  'https://kadmiel-togonon.reseau-solidarite-france.fr',
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.CLIENT_URLS),
]);

// Helper to check if origin is allowed
const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser requests (Postman, etc.)
  if (allowedOrigins.has(origin)) return true;
  if (/^https:\/\/portfolio-kadmiel-[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
  if (/^https:\/\/kadmiel-tognon-[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        console.error(`[CORS Error] Origin ${origin} not allowed`);
        callback(null, false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// ─── Body parsers (with hard limits to mitigate DoS) ───────────────────
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// ─── Global rate-limit (defense-in-depth) ──────────────────────────────
app.use('/api/', globalLimiter);

// ─── Healthcheck (before routes, no auth, cheap) ───────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ success: true, status: 'ok', uptime: process.uptime() });
  } catch (err) {
    res.status(503).json({ success: false, status: 'db_unavailable' });
  }
});

// ─── Static folder for uploads ─────────────────────────────────────────
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    // Disable directory listing & dotfiles.
    dotfiles: 'deny',
    index: false,
    maxAge: '7d',
  })
);

// ─── Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/experiences', require('./routes/experiences'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/about', require('./routes/about'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/technical-levels', require('./routes/technical-levels'));
app.use('/api/availability', require('./routes/availability'));

// ─── Error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  if (err.name === 'MulterError' || err.message === 'Only image files are allowed') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Payload too large.' });
  }
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: isProd ? undefined : err.message,
  });
});

// ─── Boot + graceful shutdown ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  server.close(async () => {
    try {
      if (typeof db.end === 'function') {
        await db.end();
      }
      console.log('Closed HTTP server and DB pool. Bye.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
  // Force exit if cleanup hangs for more than 10s.
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
