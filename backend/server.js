import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import articleRoutes from './routes/articleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.set('trust proxy', 1);

// ========== MIDDLEWARE ==========
app.use(helmet());
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(xssClean());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.'
}));

// ========== RUTAS ==========
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a JppHub Backend API',
        version: '1.0.0',
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

// Ruta 404
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada',
        path: req.path
    });
});

// ========== ERROR HANDLER ==========
app.use(errorHandler);

// ========== INICIAR SERVIDOR ==========
const PORT = config.PORT;
const HOST = config.HOST;

app.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════╗
║    🚀 JppHub Backend iniciado          ║
╠════════════════════════════════════════╣
║  🌐 URL: http://${HOST}:${PORT}        ║
║  📝 Docs: http://${HOST}:${PORT}/docs  ║
║  🏥 Health: http://${HOST}:${PORT}/api/health ║
╚════════════════════════════════════════╝
  `);
});

export default app;
