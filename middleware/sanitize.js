const sanitizeHtml = require('sanitize-html');

/**
 * Two presets:
 *
 *   STRICT  : strips ALL HTML — used for plain-text fields (name, email subject,
 *             message content, testimonial content, about bio, etc.).
 *             Prevents stored XSS even if the front-end ever renders the value
 *             with [innerHTML].
 *
 *   RICH    : allows a safe whitelist of tags — used for the blog body where the
 *             admin wants to write formatted content.
 */

const STRICT = {
  allowedTags: [],
  allowedAttributes: {},
  allowedIframeHostnames: [],
};

const RICH = {
  allowedTags: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'u', 'a',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'img', 'figure', 'figcaption',
    'hr', 'span', 'div',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    span: ['class'],
    div: ['class'],
    code: ['class'],
    pre: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }, true),
  },
};

const clean = (value, preset) => {
  if (value == null) return value;
  if (typeof value !== 'string') return value;
  return sanitizeHtml(value, preset);
};

/**
 * Returns an Express middleware that sanitizes `req.body` in place.
 *
 *   sanitizeFields({ strict: ['name', 'email'], rich: ['content'] })
 *
 * Unknown field types fall through untouched, so it's safe to layer on top of
 * any route without breaking other validators.
 */
const sanitizeFields = ({ strict = [], rich = [] } = {}) => (req, _res, next) => {
  if (!req.body || typeof req.body !== 'object') return next();
  for (const field of strict) {
    if (field in req.body) req.body[field] = clean(req.body[field], STRICT);
  }
  for (const field of rich) {
    if (field in req.body) req.body[field] = clean(req.body[field], RICH);
  }
  next();
};

module.exports = {
  sanitizeFields,
  STRICT,
  RICH,
};
