import { ContactService } from '../services/contactService.js';

// ========== CONTROLADOR DE CONTACTO ==========
export class ContactController {
    static async sendMessage(req, res, next) {
        try {
            const { name, email, message } = req.body;
            const contactMessage = await ContactService.saveMessage({ name, email, message });

            res.status(201).json({
                status: 'success',
                message: 'Mensaje enviado exitosamente. Te contactaremos pronto.',
                data: contactMessage
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllMessages(req, res, next) {
        try {
            const messages = await ContactService.getAllMessages();
            res.json({
                status: 'success',
                data: messages,
                count: messages.length
            });
        } catch (error) {
            next(error);
        }
    }

    static async getMessageById(req, res, next) {
        try {
            const { id } = req.params;
            const message = await ContactService.getMessageById(id);

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
