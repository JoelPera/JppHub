import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import articleRoutes from './routes/articleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { seedAdmin } from './database/seed.js';

const app = express();
app.set('trust proxy', 1);

// ========== MIDDLEWARE ==========
app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Demasiadas solicitudes, intenta en unos minutos.' }
}));

// ========== RUTAS ==========
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api', (req, res) => {
    res.json({
        message: 'JppHub SaaS API',
        version: '2.0.0',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Ruta no encontrada', path: req.path });
});

app.use(errorHandler);

// ========== START ==========
const PORT = config.PORT;
const HOST = config.HOST;

app.listen(PORT, HOST, async () => {
    console.log(`🚀 JppHub API en http://${HOST}:${PORT}`);
    try {
        await seedAdmin();
    } catch (err) {
        console.error('[seed] error:', err.message);
    }
});

export default app;
