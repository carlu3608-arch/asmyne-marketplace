const mongoose = require('mongoose');
const sharp = require('sharp');
const multer = require('multer');

const MAX_FILES = 6;
const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: MAX_FILES, fields: 30 },
  fileFilter: (req, file, cb) => cb(null, OK_TYPES.includes(file.mimetype)),
});

let bucket;
function getBucket() {
  if (!bucket) bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'images' });
  return bucket;
}

// Re-encode every upload (validates it is a real image, strips metadata, normalizes size).
async function saveImage(buffer, meta = {}) {
  let out;
  try {
    out = await sharp(buffer, { limitInputPixels: 40e6 }).rotate()
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 }).toBuffer();
  } catch (_) { const e = new Error('Invalid image'); e.code = 'BAD_IMAGE'; throw e; }
  return new Promise((resolve, reject) => {
    const stream = getBucket().openUploadStream('img.webp', { contentType: 'image/webp', metadata: meta });
    stream.on('error', reject);
    stream.on('finish', () => resolve(stream.id));
    stream.end(out);
  });
}

async function deleteImage(id) {
  try { await getBucket().delete(new mongoose.Types.ObjectId(id)); } catch (_) { /* ignore missing */ }
}

function streamImage(req, res) {
  let id;
  try { id = new mongoose.Types.ObjectId(req.params.id); } catch { return res.sendStatus(404); }
  const dl = getBucket().openDownloadStream(id);
  dl.on('file', () => {
    res.set('Content-Type', 'image/webp');
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  });
  dl.on('error', () => { if (!res.headersSent) res.sendStatus(404); });
  dl.pipe(res);
}

module.exports = { upload, saveImage, deleteImage, streamImage, MAX_FILES };
