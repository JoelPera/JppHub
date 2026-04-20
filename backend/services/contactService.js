import { v4 as uuidv4 } from 'uuid';

// ========== SERVICIO DE CONTACTO ==========
// Nota: Actualmente almacena datos en memoria. Para producción, conectar a base de datos o enviar emails.

let contactMessages = [];

export class ContactService {
    // Guardar mensaje de contacto
    static async saveMessage(messageData) {
        const newMessage = {
            id: uuidv4(),
            ...messageData,
            read: false,
            createdAt: new Date()
        };

        contactMessages.push(newMessage);

        // TODO: Aquí puedes agregar:
        // - Enviar email al admin
        // - Enviar email de confirmación al usuario
        // - Guardar en base de datos

        console.log(`📧 Nuevo mensaje de contacto de ${messageData.email}`);

        return {
            ...newMessage,
            createdAt: newMessage.createdAt.toISOString()
        };
    }

    // Obtener todos los mensajes
    static getAllMessages() {
        return contactMessages.map(msg => ({
            ...msg,
            createdAt: msg.createdAt.toISOString()
        }));
    }

    // Obtener mensaje por ID
    static getMessageById(id) {
        const message = contactMessages.find(m => m.id === id);
        if (!message) return null;

        return {
            ...message,
            createdAt: message.createdAt.toISOString()
        };
    }

    // Marcar mensaje como leído
    static markAsRead(id) {
        const message = contactMessages.find(m => m.id === id);
        if (!message) return null;

        message.read = true;
        return {
            ...message,
            createdAt: message.createdAt.toISOString()
        };
    }

    // Eliminar mensaje
    static deleteMessage(id) {
        const index = contactMessages.findIndex(m => m.id === id);
        if (index === -1) return false;

        contactMessages.splice(index, 1);
        return true;
    }

    // Obtener mensajes no leídos
    static getUnreadMessages() {
        return contactMessages
            .filter(m => !m.read)
            .map(msg => ({
                ...msg,
                createdAt: msg.createdAt.toISOString()
            }));
    }
}

export default ContactService;
