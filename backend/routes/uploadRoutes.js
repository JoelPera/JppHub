import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = (path.extname(file.originalname) || '.bin').toLowerCase();
        const name = crypto.randomBytes(12).toString('hex') + ext;
        cb(null, name);
    }
});

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED.has(file.mimetype)) {
            return cb(new Error('Formato no soportado (usa JPG, PNG, WEBP, GIF o AVIF)'));
        }
        cb(null, true);
    }
});

// POST /api/uploads - Upload a single image (auth required)
router.post('/', authenticate, (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ status: 'error', message: err.message || 'Error al subir archivo' });
        }
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No se recibió archivo' });
        }
        // URL path goes through /api/* ingress so it reaches backend static handler
        const url = `/api/uploads/files/${req.file.filename}`;
        res.json({
            status: 'success',
            data: {
                url,
                filename: req.file.filename,
                size: req.file.size,
                mime: req.file.mimetype
            }
        });
    });
});

// Serve the actual files
import expressModule from 'express';
router.use('/files', expressModule.static(UPLOAD_DIR, { maxAge: '30d' }));

export default router;
