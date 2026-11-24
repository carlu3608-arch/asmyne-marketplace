const path = require('path');
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const i18n = require('./lib/i18n');
const { loadUser, sameOrigin } = require('./lib/auth');
const { fmtPrice } = require('./lib/util');
const { BY_SLUG } = require('./lib/categories');
const { bootstrap } = require('./seed');

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URI;
if (!MONGO_URL) { console.error('MONGO_URL is required'); process.exit(1); }
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') { console.error('JWT_SECRET is required'); process.exit(1); }
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
}

const app = express();
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.disable('x-powered-by');
app.use(helmet({
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  contentSecurityPolicy: { directives: {
    defaultSrc: ["'self'"], imgSrc: ["'self'", 'data:'], styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'], scriptSrc: ["'self'"], formAction: ["'self'"], frameAncestors: ["'none'"],
  } },
}));
app.use(compression());
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '7d' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(cookieParser());
app.use(i18n.middleware);
app.use(loadUser);
app.use((req, res, next) => {
  res.locals.fmt = (n, c) => fmtPrice(n, c, req.lang);
  res.locals.catName = (slug) => (BY_SLUG[slug] ? BY_SLUG[slug].name[req.lang] : slug);
  res.locals.path = req.path;
  res.locals.query = req.query;
  res.locals.mainSite = process.env.MAIN_SITE_URL || 'https://www.asmynegroup.com';
  next();
});
app.use(sameOrigin);

app.get('/healthz', (req, res) => res.json({ ok: mongoose.connection.readyState === 1 }));
app.use('/', require('./routes/public'));
app.use('/', require('./routes/account'));
app.use('/admin', require('./routes/admin'));
app.use((req, res) => res.status(404).render('error', { code: 404, kind: 'notFound' }));
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return;
  const code = err.status === 413 || err.type === 'entity.too.large' ? 413 : 500;
  try { res.status(code).render('error', { code, kind: code === 413 ? 'tooLarge' : 'server' }); } catch (_) { res.status(code).send('Error'); }
});

(async () => {
  await mongoose.connect(MONGO_URL, { serverSelectionTimeoutMS: 15000 });
  console.log('Mongo connected');
  await bootstrap();
  app.listen(PORT, () => console.log('Marketplace Global on :' + PORT));
})().catch((e) => { console.error(e); process.exit(1); });
