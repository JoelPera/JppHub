import { userRepository } from '../repositories/userRepository.js';
import { postRepository } from '../repositories/postRepository.js';
import { activityLogRepository } from '../repositories/activityLogRepository.js';
import pool from '../database/db.js';

class AdminService {
    static async listUsers() {
        return userRepository.findAll();
    }

    static async updateUserRole(id, role) {
        return userRepository.updateRole(id, role);
    }

    static async listActivityLogs() {
        return activityLogRepository.findAll();
    }

    static async getDashboardStats() {
        const articleStats = await postRepository.countByStatus();
        const [[userCount]] = await pool.query('SELECT COUNT(*) AS count FROM users');
        const [[pendingCount]] = await pool.query(
            "SELECT COUNT(*) AS count FROM posts WHERE status IN ('pending','in_review')"
        );
        const [[approvedCount]] = await pool.query(
            "SELECT COUNT(*) AS count FROM posts WHERE status = 'approved'"
        );
        return {
            totalUsers: Number(userCount.count),
            totalPending: Number(pendingCount.count),
            totalApproved: Number(approvedCount.count),
            byStatus: articleStats
        };
    }
}

export default AdminService;
