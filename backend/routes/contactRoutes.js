import express from 'express';
import ContactController from '../controllers/contactController.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { permit } from '../middleware/roleMiddleware.js';
import { contactSchema } from '../validators/contactValidators.js';

const router = express.Router();

// ========== RUTAS DE CONTACTO ==========

router.post('/', validateRequest(contactSchema), ContactController.sendMessage);
router.get('/', authenticate, permit('admin'), ContactController.getAllMessages);
router.get('/:id', authenticate, permit('admin'), ContactController.getMessageById);

export default router;
