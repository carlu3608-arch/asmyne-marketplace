const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const clampInt = (v, min, max, def) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };
const toNum = (v) => { if (v === undefined || v === '' || v === null) return undefined; const n = Number(v); return Number.isFinite(n) && n >= 0 ? n : undefined; };
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const isObjectId = (s) => /^[a-f0-9]{24}$/i.test(String(s));
const MSG_KEYS = ['saved', 'deleted', 'msgSent', 'invalidInput', 'invalidLogin', 'emailTaken', 'tooMany', 'suspended'];
const flash = (q) => (MSG_KEYS.includes(q) ? q : null);
function fmtPrice(n, cur, lang) {
  const loc = { es: 'es-MX', en: 'en-US', fr: 'fr-FR' }[lang] || 'es-MX';
  try { return new Intl.NumberFormat(loc, { style: 'currency', currency: cur, maximumFractionDigits: 2 }).format(n); }
  catch { return `${n} ${cur}`; }
}
module.exports = { escapeRegex, clampInt, toNum, str, EMAIL_RE, isObjectId, flash, fmtPrice };
