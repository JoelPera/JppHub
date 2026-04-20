import { userRepository } from '../repositories/userRepository.js';

class UserService {
    static async getProfile(userId) {
        return userRepository.findById(userId);
    }

    static async listUsers() {
        return userRepository.findAll();
    }
}

export default UserService;
