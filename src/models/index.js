const mongoose = require('mongoose');
const { SLUGS } = require('../lib/categories');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  banned: { type: Boolean, default: false },
  // Fase 2: Stripe Connect
  stripeAccountId: { type: String, default: null },
}, { timestamps: true });

const listingSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  price: { type: Number, required: true, min: 0, max: 100000000 },
  currency: { type: String, enum: ['USD', 'EUR', 'MXN', 'DOP', 'HTG', 'CAD'], default: 'USD' },
  category: { type: String, enum: SLUGS, required: true, index: true },
  stock: { type: Number, min: 0, max: 100000, default: 1 },
  condition: { type: String, enum: ['new', 'used', 'refurbished'], default: 'new' },
  images: [{ type: mongoose.Schema.Types.ObjectId }],
  status: { type: String, enum: ['active', 'paused'], default: 'active', index: true },
  moderation: { type: String, enum: ['approved', 'pending', 'removed'], default: 'approved', index: true },
  featured: { type: Boolean, default: false },
  isDemo: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, { timestamps: true });
listingSchema.index({ title: 'text', description: 'text' });
listingSchema.index({ createdAt: -1 });

const messageSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Listing: mongoose.model('Listing', listingSchema),
  Message: mongoose.model('Message', messageSchema),
};
