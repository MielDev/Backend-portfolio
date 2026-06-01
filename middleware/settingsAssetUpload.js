const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadRoot = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
const settingsAssetDir = path.join(uploadRoot, 'branding');

if (!fs.existsSync(settingsAssetDir)) {
  fs.mkdirSync(settingsAssetDir, { recursive: true });
}

const sanitizePart = (value) =>
  String(value || 'asset')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'asset';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, settingsAssetDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const prefix = sanitizePart(req.query.type || req.body.type || file.fieldname);
    const stamp = Date.now();
    const random = Math.round(Math.random() * 1e9);

    cb(null, `${prefix}-${stamp}-${random}${ext}`);
  },
});

module.exports = multer({ storage });
