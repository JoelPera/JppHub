import { ContactService } from '../services/contactService.js';

// ========== CONTROLADOR DE CONTACTO ==========
export class ContactController {
    // Enviar mensaje de contacto
    static async sendMessage(req, res, next) {
        try {
            const { name, email, message } = req.body;

            // Validaciones
            if (!name || !email || !message) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Campos requeridos: name, email, message'
                });
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email inválido'
                });
            }

            const contactMessage = await ContactService.saveMessage({
                name,
                email,
                message
            });

            res.status(201).json({
                status: 'success',
                message: 'Mensaje enviado exitosamente. Te contactaremos pronto.',
                data: contactMessage
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener todos los mensajes
    static async getAllMessages(req, res, next) {
        try {
            const messages = ContactService.getAllMessages();
            res.json({
                status: 'success',
                data: messages,
                count: messages.length
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener mensaje por ID
    static async getMessageById(req, res, next) {
        try {
            const { id } = req.params;
            const message = ContactService.getMessageById(id);

            if (!message) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Mensaje no encontrado'
                });
            }

            res.json({
                status: 'success',
                data: message
            });
        } catch (error) {
            next(error);
        }
    }
}

export default ContactController;
