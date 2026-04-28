import { v4 as uuidv4 } from 'uuid';
import { contactRepository } from '../repositories/contactRepository.js';

export class ContactService {
    static async saveMessage(messageData) {
        const payload = {
            id: uuidv4(),
            name: messageData.name,
            email: messageData.email,
            message: messageData.message
        };

        const result = await contactRepository.create(payload);
        return result;
    }

    static async getAllMessages() {
        return contactRepository.findAll();
    }

    static async getMessageById(id) {
        return contactRepository.findById(id);
    }
}

export default ContactService;
