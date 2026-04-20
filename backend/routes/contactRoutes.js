import express from 'express';
import ContactController from '../controllers/contactController.js';

const router = express.Router();

// ========== RUTAS DE CONTACTO ==========

// POST /api/contact - Enviar mensaje de contacto
router.post('/', ContactController.sendMessage);

// GET /api/contact - Obtener todos los mensajes (admin)
router.get('/', ContactController.getAllMessages);

// GET /api/contact/:id - Obtener mensaje específico
router.get('/:id', ContactController.getMessageById);

export default router;
