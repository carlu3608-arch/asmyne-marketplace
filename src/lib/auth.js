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
const requireAdmin = (req, res, next) => (req.user && req.user.role === 'admin' ? next() : res.status(404).render('404'));

// CSRF defense for cookie auth: state-changing requests must come from our own origin.
function sameOrigin(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin') || req.get('referer');
  if (!origin) return next();
  try {
    if (new URL(origin).host === req.get('host')) return next();
  } catch (_) {}
  return res.status(403).send('Forbidden');
}

module.exports = { setSession, clearSession, loadUser, requireAuth, requireSeller, requireAdmin, sameOrigin };
