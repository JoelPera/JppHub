import express from 'express';
import HealthController from '../controllers/healthController.js';

const router = express.Router();

// ========== RUTA DE HEALTH CHECK ==========

// GET /api/health - Verificar estado del servidor
router.get('/', HealthController.checkHealth);

export default router;
