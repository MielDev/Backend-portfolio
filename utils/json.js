/**
 * Safe JSON parser:
 * - returns `fallback` if the input is null/undefined/empty/invalid
 * - never throws (so a single corrupted row can't take down a whole route)
 * - handles already-parsed values (mysql2 may auto-parse JSON columns
 *   depending on driver flags) by returning them as-is
 */
function safeParse(value, fallback = null) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'object') return value; // already parsed by the driver
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch (_err) {
    return fallback;
  }
}

const parseArray = (v) => {
  const out = safeParse(v, []);
  return Array.isArray(out) ? out : [];
};

const parseObject = (v) => {
  const out = safeParse(v, {});
  return out && typeof out === 'object' && !Array.isArray(out) ? out : {};
};

module.exports = { safeParse, parseArray, parseObject };
