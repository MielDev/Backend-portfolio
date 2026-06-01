const rateLimit = require('express-rate-limit');

/**
 * Reusable rate limiters.
 * - Keys are derived from the client IP (rate-limit handles trust-proxy automatically
 *   when `app.set('trust proxy', ...)` is configured in server.js).
 * - All limiters return a clean JSON payload consistent with the rest of the API.
 */

const buildLimiter = (options) =>
  rateLimit({
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, _next, opts) => {
      res.status(opts.statusCode || 429).json({
        success: false,
        message: opts.message || 'Too many requests, please try again later.',
      });
    },
    ...options,
  });

// 1) Login : protège contre le brute-force.
const loginLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  skipSuccessfulRequests: true, // un login réussi ne consomme pas le quota
});

// 2) Formulaire de contact : empêche le spam.
const contactLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000, // 1 h
  max: 5,
  message: 'Vous avez envoyé trop de messages. Réessayez dans une heure.',
});

// 3) Endpoint analytics public : limite raisonnable par IP (un user actif émet ~1 event / page).
const analyticsLimiter = buildLimiter({
  windowMs: 60 * 1000, // 1 min
  max: 60,
  message: 'Too many analytics events.',
});

// 4) Témoignages publics (création via token).
const testimonialPublicLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000, // 1 h
  max: 10,
  message: 'Trop de tentatives. Réessayez plus tard.',
});

// 5) Global : filet de sécurité contre les abus généraux.
const globalLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
  message: 'Too many requests.',
});

module.exports = {
  loginLimiter,
  contactLimiter,
  analyticsLimiter,
  testimonialPublicLimiter,
  globalLimiter,
};
