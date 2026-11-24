const express = require('express');
const { Listing, User, Message } = require('../models');
const { CATEGORIES, BY_SLUG, SLUGS } = require('../lib/categories');
const { escapeRegex, clampInt, toNum, str, isObjectId } = require('../lib/util');
const { requireAuth } = require('../lib/auth');
const { LANGS } = require('../lib/i18n');
const { streamImage } = require('../lib/images');

const r = express.Router();
const PUBLIC = { status: 'active', moderation: 'approved' };
const PER_PAGE = 24;

r.get('/img/:id', streamImage);

r.get('/lang/:code', (req, res) => {
  const code = LANGS.includes(req.params.code) ? req.params.code : 'es';
  res.cookie('lang', code, { maxAge: 365 * 24 * 3600 * 1000, sameSite: 'lax' });
  const back = req.get('referer');
  let to = '/';
  try { if (back && new URL(back).host === req.get('host')) to = new URL(back).pathname + new URL(back).search; } catch (_) {}
  res.redirect(to);
});

r.get('/', async (req, res, next) => {
  try {
    let featured = await Listing.find({ ...PUBLIC, featured: true }).sort({ updatedAt: -1 }).limit(8).populate('seller', 'name').lean();
    if (featured.length < 4) featured = await Listing.find(PUBLIC).sort({ views: -1, createdAt: -1 }).limit(8).populate('seller', 'name').lean();
    const latest = await Listing.find(PUBLIC).sort({ createdAt: -1 }).limit(12).populate('seller', 'name').lean();
    const counts = Object.fromEntries((await Listing.aggregate([{ $match: PUBLIC }, { $group: { _id: '$category', n: { $sum: 1 } } }])).map((c) => [c._id, c.n]));
    res.render('home', { featured, latest, counts, CATEGORIES });
  } catch (e) { next(e); }
});

async function searchHandler(req, res, next, forcedCat) {
  try {
    const q = str(req.query.q, 100);
    const cat = forcedCat || (SLUGS.includes(req.query.cat) ? req.query.cat : '');
    const cond = ['new', 'used', 'refurbished'].includes(req.query.cond) ? req.query.cond : '';
    const min = toNum(req.query.min); const max = toNum(req.query.max);
    const sort = ['new', 'price_asc', 'price_desc'].includes(req.query.sort) ? req.query.sort : 'new';
    const page = clampInt(req.query.page, 1, 500, 1);
    const filter = { ...PUBLIC };
    if (q) { const rx = new RegExp(escapeRegex(q), 'i'); filter.$or = [{ title: rx }, { description: rx }]; }
    if (cat) filter.category = cat;
    if (cond) filter.condition = cond;
    if (min !== undefined || max !== undefined) { filter.price = {}; if (min !== undefined) filter.price.$gte = min; if (max !== undefined) filter.price.$lte = max; }
    const sortBy = sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { createdAt: -1 };
    const [total, items] = await Promise.all([
      Listing.countDocuments(filter),
      Listing.find(filter).sort(sortBy).skip((page - 1) * PER_PAGE).limit(PER_PAGE).populate('seller', 'name').lean(),
    ]);
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    const qs = (p) => { const u = new URLSearchParams(); if (q) u.set('q', q); if (cat && !forcedCat) u.set('cat', cat); if (cond) u.set('cond', cond); if (min !== undefined) u.set('min', min); if (max !== undefined) u.set('max', max); if (sort !== 'new') u.set('sort', sort); if (p > 1) u.set('page', p); const s = u.toString(); return s ? '?' + s : ''; };
    res.render('search', { items, total, page, pages, qs, q, cat, cond, min, max, sort, forcedCat, category: cat ? BY_SLUG[cat] : null, CATEGORIES, basePath: forcedCat ? `/c/${forcedCat}` : '/search' });
  } catch (e) { next(e); }
}
r.get('/search', (req, res, next) => searchHandler(req, res, next));
r.get('/c/:slug', (req, res, next) => (SLUGS.includes(req.params.slug) ? searchHandler(req, res, next, req.params.slug) : res.status(404).render('error', { code: 404, kind: 'notFound' })));

r.get('/p/:id', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(404).render('error', { code: 404, kind: 'notFound' });
    const item = await Listing.findById(req.params.id).populate('seller', 'name createdAt').lean();
    const isOwner = req.user && item && String(item.seller._id) === String(req.user._id);
    const isAdmin = req.user && req.user.role === 'admin';
    if (!item || ((item.status !== 'active' || item.moderation !== 'approved') && !isOwner && !isAdmin)) return res.status(404).render('error', { code: 404, kind: 'notFound' });
    if (!isOwner) Listing.updateOne({ _id: item._id }, { $inc: { views: 1 } }).catch(() => {});
    const sellerCount = await Listing.countDocuments({ ...PUBLIC, seller: item.seller._id });
    const related = await Listing.find({ ...PUBLIC, category: item.category, _id: { $ne: item._id } }).limit(4).populate('seller', 'name').lean();
    res.render('product', { item, isOwner, sellerCount, related, category: BY_SLUG[item.category], sent: req.query.m === 'msgSent' });
  } catch (e) { next(e); }
});

r.post('/p/:id/contact', requireAuth, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.status(404).render('error', { code: 404, kind: 'notFound' });
    const item = await Listing.findById(req.params.id).lean();
    const body = str(req.body.body, 2000);
    if (!item || !body || String(item.seller) === String(req.user._id)) return res.redirect(`/p/${req.params.id}`);
    await Message.create({ listing: item._id, from: req.user._id, to: item.seller, body });
    res.redirect(`/p/${item._id}?m=msgSent#contact`);
  } catch (e) { next(e); }
});

module.exports = r;
