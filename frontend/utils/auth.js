// frontend/utils/auth.js

class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check if user is logged in on page load
        const token = localStorage.getItem('jpphub_token');
        if (token) {
            this.isAuthenticated = true;
            this.decodeUserFromToken(token);
        }
    }

    async login(email, password) {
        try {
            const response = await api.login(email, password);
            this.setUser(response.user);
            this.isAuthenticated = true;
            return response;
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await api.register(userData);
            this.setUser(response.user);
            this.isAuthenticated = true;
            return response;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('jpphub_token');
        this.user = null;
        this.isAuthenticated = false;
        window.location.href = '/frontend/index.html';
    }

    setUser(user) {
        this.user = user;
        localStorage.setItem('jpphub_user', JSON.stringify(user));
    }

    getUser() {
        if (!this.user) {
            const stored = localStorage.getItem('jpphub_user');
            if (stored) {
                this.user = JSON.parse(stored);
            }
        }
        return this.user;
    }

    decodeUserFromToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.user = payload.user || payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            this.logout();
        }
    }

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    }

    isPremium() {
        const user = this.getUser();
        return user && (user.role === 'admin' || user.subscription_status === 'premium');
    }

    // Check if current page requires authentication
    requiresAuth() {
        const protectedPaths = ['/dashboard.html', '/admin.html'];
        const currentPath = window.location.pathname;
        return protectedPaths.some(path => currentPath.includes(path));
    }

    // Redirect if not authenticated
    checkAuth() {
        if (this.requiresAuth() && !this.isAuthenticated) {
            window.location.href = '/frontend/pages/login.html';
            return false;
        }
        return true;
    }

    // Redirect if not admin
    checkAdmin() {
        if (!this.isAdmin()) {
            window.location.href = '/frontend/pages/dashboard.html';
            return false;
        }
        return true;
    }
}

// Create singleton instance
const auth = new AuthManager();

// Export for use in other files
window.AuthManager = AuthManager;
window.auth = auth;