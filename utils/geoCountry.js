const geoip = require('geoip-lite');

const COUNTRY_HEADER_NAMES = [
  'cf-ipcountry',
  'x-vercel-ip-country',
  'x-country-code',
  'x-appengine-country',
  'cloudfront-viewer-country'
];

const IP_HEADER_NAMES = [
  'cf-connecting-ip',
  'true-client-ip',
  'x-real-ip',
  'x-client-ip',
  'x-forwarded-for',
  'forwarded'
];

const UNKNOWN_COUNTRIES = new Set(['', 'unknown', 'inconnu', 'xx', 'zz']);
const regionNames = typeof Intl !== 'undefined' && Intl.DisplayNames
  ? new Intl.DisplayNames(['fr'], { type: 'region' })
  : null;

function firstHeaderValue(value) {
  if (!value) return null;
  const raw = Array.isArray(value) ? value[0] : String(value);
  return raw.split(',')[0].trim() || null;
}

function normalizeCountry(value) {
  if (!value) return null;
  const country = String(value).trim();
  if (UNKNOWN_COUNTRIES.has(country.toLowerCase())) return null;

  const code = country.toUpperCase();
  if (/^[A-Z]{2}$/.test(code)) {
    return regionNames?.of(code) || code;
  }

  return country.substring(0, 80);
}

function normalizeIp(value) {
  const raw = firstHeaderValue(value);
  if (!raw) return null;

  const forwardedMatch = raw.match(/for="?([^;,"]+)/i);
  let ip = forwardedMatch ? forwardedMatch[1] : raw;
  ip = ip.trim().replace(/^\[/, '').replace(/\]$/, '');
  ip = ip.replace(/^::ffff:/i, '');

  if (ip.includes(':') && !ip.includes('::')) {
    const maybeIpv4WithPort = ip.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
    if (maybeIpv4WithPort) ip = maybeIpv4WithPort[1];
  }

  if (isPrivateIp(ip)) return null;
  return ip;
}

function isPrivateIp(ip) {
  if (!ip) return true;
  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === 'localhost') return true;
  if (lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) return true;

  const parts = ip.split('.').map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return false;

  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
}

function getClientIp(req) {
  for (const headerName of IP_HEADER_NAMES) {
    const ip = normalizeIp(req.headers[headerName]);
    if (ip) return ip;
  }

  return normalizeIp(req.ip || req.socket?.remoteAddress);
}

function resolveCountry(req, ip = null, providedCountry = null) {
  const normalizedProvided = normalizeCountry(providedCountry);
  if (normalizedProvided) return normalizedProvided;

  for (const headerName of COUNTRY_HEADER_NAMES) {
    const country = normalizeCountry(req.headers[headerName]);
    if (country) return country;
  }

  const lookupIp = ip || getClientIp(req);
  if (!lookupIp) return null;

  const geo = geoip.lookup(lookupIp);
  return normalizeCountry(geo?.country);
}

module.exports = {
  getClientIp,
  normalizeCountry,
  normalizeIp,
  resolveCountry,
};
