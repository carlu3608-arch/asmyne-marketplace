const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { User, Listing } = require('./models');
const { saveImage } = require('./lib/images');

const DEMO = [
  ['watch', 'Reloj clásico de oro con correa de piel azul', 'Reloj de pulsera minimalista con caja dorada, esfera azul medianoche y correa de piel cosida a mano. Producto de demostración.', 289, 'relojes-joyeria', 'new', 5],
  ['bag', 'Bolso de piel color coñac con broche dorado', 'Bolso estructurado de piel genuina con herrajes dorados y asa superior. Ideal para el día a día o eventos. Producto de demostración.', 349, 'bolsos-equipaje', 'new', 3],
  ['headphones', 'Audífonos inalámbricos con detalles dorados', 'Audífonos over-ear con cancelación de ruido, 30 h de batería y acabados en oro cepillado. Producto de demostración.', 199, 'electronica', 'refurbished', 8],
  ['perfume', 'Perfume en frasco de cristal tallado, 100 ml', 'Eau de parfum de notas amaderadas y ámbar en frasco de cristal facetado con tapa dorada. Producto de demostración.', 129, 'perfumes', 'new', 12],
  ['armchair', 'Sillón de terciopelo azul con patas de latón', 'Sillón tapizado en terciopelo azul noche con patas de latón. Perfecto para salas y estudios. Producto de demostración.', 640, 'muebles', 'used', 1],
  ['laptop', 'Laptop ultradelgada 14" color champán', 'Portátil ultraligera de 14 pulgadas, 16 GB RAM, 512 GB SSD, acabado aluminio champán. Producto de demostración.', 899, 'informatica', 'used', 2],
];

async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const pw = process.env.ADMIN_PASSWORD;
  if (!email || !pw) return;
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name: 'Admin Asmyne', email, role: 'admin', passwordHash: await bcrypt.hash(pw, 12) });
    console.log('Admin created');
  } else if (existing.role !== 'admin') {
    existing.role = 'admin'; await existing.save();
  }
}

async function seedDemo() {
  if (process.env.SEED_DEMO === 'false') return;
  if (await Listing.exists({ isDemo: true })) return;
  let seller = await User.findOne({ email: 'demo-seller@market.asmynegroup.com' });
  if (!seller) {
    seller = await User.create({ name: 'Tienda Demo Asmyne', email: 'demo-seller@market.asmynegroup.com', role: 'seller',
      passwordHash: await bcrypt.hash(crypto.randomBytes(24).toString('hex'), 12) });
  }
  for (const [img, title, description, price, category, condition, stock] of DEMO) {
    const buf = fs.readFileSync(path.join(__dirname, '..', 'seed', 'images', img + '.jpg'));
    const id = await saveImage(buf, { demo: true });
    await Listing.create({ seller: seller._id, title: '[Demo] ' + title, description, price, currency: 'USD', category, condition, stock,
      images: [id], featured: true, isDemo: true });
  }
  console.log('Demo listings seeded');
}

async function bootstrap() { await ensureAdmin(); await seedDemo(); }
module.exports = { bootstrap };
