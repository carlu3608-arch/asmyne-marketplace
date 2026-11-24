const express = require('express');
const { User, Listing, Message } = require('../models');
const { requireAuth, requireAdmin } = require('../lib/auth');
const { isObjectId, str, escapeRegex, clampInt, flash } = require('../lib/util');
const { deleteImage } = require('../lib/images');

const r = express.Router();
r.use(requireAuth, requireAdmin);

r.get('/', async (req, res, next) => {
  try {
    const tab = req.query.tab === 'users' ? 'users' : 'listings';
    const q = str(req.query.q, 100); const mod = ['approved', 'pending', 'removed'].includes(req.query.mod) ? req.query.mod : '';
    const page = clampInt(req.query.page, 1, 500, 1);
    const stats = {
      users: await User.countDocuments(), sellers: await User.countDocuments({ role: 'seller' }),
      listings: await Listing.countDocuments(), pending: await Listing.countDocuments({ moderation: 'pending' }),
      removed: await Listing.countDocuments({ moderation: 'removed' }), messages: await Message.countDocuments(),
    };
    let rows = [];
    if (tab === 'users') {
      const f = q ? { $or: [{ email: new RegExp(escapeRegex(q), 'i') }, { name: new RegExp(escapeRegex(q), 'i') }] } : {};
      rows = await User.find(f, '-passwordHash').sort({ createdAt: -1 }).skip((page - 1) * 50).limit(50).lean();
    } else {
      const f = {}; if (mod) f.moderation = mod; if (q) f.title = new RegExp(escapeRegex(q), 'i');
      rows = await Listing.find(f).sort({ createdAt: -1 }).skip((page - 1) * 50).limit(50).populate('seller', 'name email').lean();
    }
    res.render('admin', { tab, rows, stats, q, mod, page, m: flash(req.query.m) });
  } catch (e) { next(e); }
});

r.post('/listing/:id/:action', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) return res.redirect('/admin');
    const a = req.params.action; const item = await Listing.findById(req.params.id);
    if (item) {
      if (a === 'approve' || a === 'restore') item.moderation = 'approved';
      else if (a === 'remove') item.moderation = 'removed';
      else if (a === 'feature') item.featured = !item.featured;
      else if (a === 'delete') { for (const id of item.images) await deleteImage(id); await item.deleteOne(); return res.redirect('/admin?m=deleted'); }
      await item.save();
    }
    res.redirect(req.get('referer') && new URL(req.get('referer')).host === req.get('host') ? new URL(req.get('referer')).pathname + new URL(req.get('referer')).search : '/admin');
  } catch (e) { next(e); }
});

r.post('/user/:id/:action', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id) || String(req.params.id) === String(req.user._id)) return res.redirect('/admin?tab=users');
    const a = req.params.action; const u = await User.findById(req.params.id);
    if (u && u.role !== 'admin') {
      if (a === 'ban') { u.banned = true; await Listing.updateMany({ seller: u._id }, { moderation: 'removed' }); }
      else if (a === 'unban') u.banned = false;
      else if (a === 'make-seller') u.role = 'seller';
      else if (a === 'delete') {
        for (const l of await Listing.find({ seller: u._id })) { for (const id of l.images) await deleteImage(id); await l.deleteOne(); }
        await Message.deleteMany({ $or: [{ from: u._id }, { to: u._id }] });
        await u.deleteOne();
        return res.redirect('/admin?tab=users&m=deleted');
      }
      await u.save();
    }
    res.redirect('/admin?tab=users');
  } catch (e) { next(e); }
});

module.exports = r;
