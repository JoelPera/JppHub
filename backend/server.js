import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import articleRoutes from './routes/articleRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();

// ========== MIDDLEWARE ==========
// CORS - Permitir solicitudes desde el frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use(requestLogger);

// ========== RUTAS ==========
app.use('/api/health', healthRoutes);
app.use('/api/articles', articleRoutes);
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
