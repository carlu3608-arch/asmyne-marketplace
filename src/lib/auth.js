const jwt = require('jsonwebtoken');
const { User } = require('../models');

const secret = () => process.env.JWT_SECRET;
const COOKIE = 'mg_session';

function setSession(res, user) {
  const token = jwt.sign({ sub: String(user._id) }, secret(), { expiresIn: '7d' });
  res.cookie(COOKIE, token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 3600 * 1000,
  });
}
function clearSession(res) { res.clearCookie(COOKIE); }

async function loadUser(req, res, next) {
  res.locals.user = null;
  const token = req.cookies[COOKIE];
  if (token) {
    try {
      const { sub } = jwt.verify(token, secret());
      const user = await User.findById(sub).lean();
      if (user && !user.banned) { req.user = user; res.locals.user = user; }
    } catch (_) { clearSession(res); }
  }
  next();
}

const requireAuth = (req, res, next) => (req.user ? next() : res.redirect('/login?next=' + encodeURIComponent(req.originalUrl)));
const requireSeller = (req, res, next) => (req.user && ['seller', 'admin'].includes(req.user.role) ? next() : res.redirect('/dashboard'));
const requireAdmin = (req, res, next) => (req.user && req.user.role === 'admin' ? next() : res.status(404).render('error', { code: 404, kind: 'notFound' }));

// CSRF defense for cookie auth (cookies are also SameSite=Lax).
// Only state-changing requests are checked. Browsers send `Origin: null` on same-origin
// form posts when the page's Referrer-Policy is no-referrer, so we rely first on
// Sec-Fetch-Site, then on Origin/Referer compared against every host we serve.
function allowedHosts(req) {
  const hosts = new Set();
  const add = (h) => { if (h) String(h).split(',').forEach((x) => { x = x.trim().toLowerCase(); if (x) hosts.add(x); }); };
  add(req.get('host')); add(req.get('x-forwarded-host'));
  add(process.env.RAILWAY_PUBLIC_DOMAIN);
  add(process.env.PUBLIC_HOSTS || 'market.asmynegroup.com');
  return hosts;
}
function hostOf(u) { try { return new URL(u).host.toLowerCase(); } catch (_) { return null; } }

function sameOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const site = req.get('sec-fetch-site');
  if (site === 'same-origin' || site === 'none') return next();
  const hosts = allowedHosts(req);
  const origin = req.get('origin');
  if (origin && origin !== 'null') { if (hosts.has(hostOf(origin))) return next(); return reject(req, res, 'origin ' + origin); }
  const ref = req.get('referer');
  if (ref) { if (hosts.has(hostOf(ref))) return next(); return reject(req, res, 'referer ' + ref); }
  if (site === 'cross-site') return reject(req, res, 'sec-fetch-site cross-site');
  return next(); // no browser signals (e.g. API clients); SameSite=Lax still protects the session cookie
}
function reject(req, res, why) {
  console.warn(`[csrf] blocked ${req.method} ${req.originalUrl}: ${why}`);
  res.status(403).render('error', { code: 403, kind: 'forbidden' });
}

module.exports = { setSession, clearSession, loadUser, requireAuth, requireSeller, requireAdmin, sameOrigin };
