const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const { User, Listing, Message } = require('../models');
const { SLUGS, CATEGORIES } = require('../lib/categories');
const { setSession, clearSession, requireAuth, requireSeller } = require('../lib/auth');
const { str, toNum, clampInt, EMAIL_RE, isObjectId, flash } = require('../lib/util');
const { upload, saveImage, deleteImage, MAX_FILES } = require('../lib/images');

const r = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false,
  handler: (req, res) => res.status(429).render(req.path.includes('signup') ? 'signup' : 'login', { error: 'tooMany', form: {}, next: '' }),
});
const safeNext = (n) => (typeof n === 'string' && /^\/[^/\\]/.test(n) ? n : '/dashboard');

r.get('/login', (req, res) => res.render('login', { error: flash(req.query.m), form: {}, next: safeNext(req.query.next) }));
r.post('/login', authLimiter, async (req, res, next) => {
  try {
    const email = str(req.body.email, 160).toLowerCase(); const password = typeof req.body.password === 'string' ? req.body.password : '';
    const user = email ? await User.findOne({ email }) : null;
    const ok = user && (await bcrypt.compare(password.slice(0, 200), user.passwordHash));
    if (!ok) return res.status(401).render('login', { error: 'invalidLogin', form: { email }, next: safeNext(req.body.next) });
    if (user.banned) return res.status(403).render('login', { error: 'suspended', form: { email }, next: '' });
    setSession(res, user);
    res.redirect(safeNext(req.body.next));
  } catch (e) { next(e); }
});

r.get('/signup', (req, res) => res.render('signup', { error: null, form: { role: req.query.role === 'seller' ? 'seller' : 'buyer' }, next: safeNext(req.query.next) }));
r.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const name = str(req.body.name, 80); const email = str(req.body.email, 160).toLowerCase();
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const role = req.body.role === 'seller' ? 'seller' : 'buyer';
    const form = { name, email, role };
    if (name.length < 2 || !EMAIL_RE.test(email) || password.length < 8 || password.length > 200) return res.status(400).render('signup', { error: 'invalidInput', form, next: '' });
    if (await User.exists({ email })) return res.status(409).render('signup', { error: 'emailTaken', form, next: '' });
    const user = await User.create({ name, email, role, passwordHash: await bcrypt.hash(password, 12) });
    setSession(res, user);
    res.redirect(role === 'seller' ? '/dashboard/new' : safeNext(req.body.next));
  } catch (e) { next(e); }
});

r.post('/logout', (req, res) => { clearSession(res); res.redirect('/'); });

r.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 }).lean();
    const unread = await Message.countDocuments({ to: req.user._id, read: false });
    res.render('dashboard', { listings, unread, m: flash(req.query.m) });
  } catch (e) { next(e); }
});
r.post('/dashboard/become-seller', requireAuth, async (req, res) => {
  if (req.user.role === 'buyer') await User.updateOne({ _id: req.user._id }, { role: 'seller' });
  res.redirect('/dashboard/new');
});

function parseListing(body) {
  const v = {
    title: str(body.title, 120), description: str(body.description, 5000), price: toNum(body.price),
    currency: ['USD', 'EUR', 'MXN', 'DOP', 'HTG', 'CAD'].includes(body.currency) ? body.currency : 'USD',
    category: SLUGS.includes(body.category) ? body.category : null,
    stock: clampInt(body.stock, 0, 100000, 1),
    condition: ['new', 'used', 'refurbished'].includes(body.condition) ? body.condition : 'new',
    status: body.status === 'paused' ? 'paused' : 'active',
  };
  const valid = v.title.length >= 3 && v.description.length >= 10 && v.price !== undefined && v.price <= 1e8 && v.category;
  return { v, valid };
}
const uploadPhotos = (req, res, next) => upload.array('photos', MAX_FILES)(req, res, (err) => { if (err) req.uploadError = err.code || 'upload'; next(); });

r.get('/dashboard/new', requireAuth, requireSeller, (req, res) => res.render('listing-form', { item: null, form: { currency: 'USD', stock: 1, condition: 'new', status: 'active' }, error: null, CATEGORIES }));
r.post('/dashboard/new', requireAuth, requireSeller, uploadPhotos, async (req, res, next) => {
  try {
    const { v, valid } = parseListing(req.body);
    if (!valid || req.uploadError) return res.status(400).render('listing-form', { item: null, form: v, error: 'invalidInput', CATEGORIES });
    const images = [];
    for (const f of req.files || []) images.push(await saveImage(f.buffer, { owner: String(req.user._id) }));
    const moderation = process.env.REQUIRE_APPROVAL === 'true' && req.user.role !== 'admin' ? 'pending' : 'approved';
    const item = await Listing.create({ ...v, images, seller: req.user._id, moderation });
    res.redirect(`/p/${item._id}`);
  } catch (e) {
    if (e.code === 'BAD_IMAGE') return res.status(400).render('listing-form', { item: null, form: parseListing(req.body).v, error: 'invalidInput', CATEGORIES });
    next(e);
  }
});

async function ownListing(req, res) {
  if (!isObjectId(req.params.id)) return null;
  const q = { _id: req.params.id };
  if (req.user.role !== 'admin') q.seller = req.user._id;
  return Listing.findOne(q);
}
r.get('/dashboard/edit/:id', requireAuth, requireSeller, async (req, res, next) => {
  try {
    const item = await ownListing(req, res); if (!item) return res.status(404).render('404');
    res.render('listing-form', { item, form: item.toObject(), error: null, CATEGORIES });
  } catch (e) { next(e); }
});
r.post('/dashboard/edit/:id', requireAuth, requireSeller, uploadPhotos, async (req, res, next) => {
  try {
    const item = await ownListing(req, res); if (!item) return res.status(404).render('404');
    const { v, valid } = parseListing(req.body);
    if (!valid || req.uploadError) return res.status(400).render('listing-form', { item, form: { ...v, images: item.images }, error: 'invalidInput', CATEGORIES });
    const removeIds = [].concat(req.body.removeImages || []).map(String);
    const kept = item.images.filter((id) => !removeIds.includes(String(id)));
    for (const id of item.images) if (removeIds.includes(String(id))) await deleteImage(id);
    for (const f of (req.files || []).slice(0, Math.max(0, MAX_FILES - kept.length))) kept.push(await saveImage(f.buffer, { owner: String(req.user._id) }));
    Object.assign(item, v, { images: kept });
    await item.save();
    res.redirect('/dashboard?m=saved');
  } catch (e) {
    if (e.code === 'BAD_IMAGE') return res.redirect(`/dashboard/edit/${req.params.id}`);
    next(e);
  }
});
r.post('/dashboard/delete/:id', requireAuth, requireSeller, async (req, res, next) => {
  try {
    const item = await ownListing(req, res); if (!item) return res.status(404).render('404');
    for (const id of item.images) await deleteImage(id);
    await item.deleteOne();
    res.redirect('/dashboard?m=deleted');
  } catch (e) { next(e); }
});
r.post('/dashboard/toggle/:id', requireAuth, requireSeller, async (req, res, next) => {
  try {
    const item = await ownListing(req, res); if (!item) return res.status(404).render('404');
    item.status = item.status === 'active' ? 'paused' : 'active'; await item.save();
    res.redirect('/dashboard?m=saved');
  } catch (e) { next(e); }
});

r.get('/messages', requireAuth, async (req, res, next) => {
  try {
    const me = req.user._id;
    const msgs = await Message.find({ $or: [{ to: me }, { from: me }] }).sort({ createdAt: -1 }).limit(200)
      .populate('from', 'name').populate('to', 'name').populate('listing', 'title').lean();
    await Message.updateMany({ to: me, read: false }, { read: true });
    res.render('messages', { msgs, sent: req.query.m === 'msgSent' });
  } catch (e) { next(e); }
});
r.post('/messages/reply/:id', requireAuth, async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.redirect('/messages');
    const orig = await Message.findOne({ _id: req.params.id, to: req.user._id }).lean();
    const body = str(req.body.body, 2000);
    if (orig && body) await Message.create({ listing: orig.listing, from: req.user._id, to: orig.from, body });
    res.redirect('/messages?m=msgSent');
  } catch (e) { next(e); }
});

module.exports = r;
