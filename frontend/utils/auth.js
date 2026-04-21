// frontend/utils/auth.js

class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        const token = api.getToken();
        if (token) {
            this.isAuthenticated = true;
            this.decodeUserFromToken(token);
        }
    }

    getToken() {
        return api.getToken();
    }

    setToken(token) {
        api.setToken(token);
    }

    removeToken() {
        api.removeToken();
    }

    async login(email, password) {
        const response = await api.login(email, password);
        if (response.token) {
            this.setToken(response.token);
        }
        if (response.user) {
            this.setUser(response.user);
        }
        this.isAuthenticated = true;
        return response;
    }

    async register(userData) {
        const response = await api.register(userData);
        if (response.token) {
            this.setToken(response.token);
        }
        if (response.user) {
            this.setUser(response.user);
        }
        this.isAuthenticated = true;
        return response;
    }

    logout() {
        this.removeToken();
        localStorage.removeItem('jpphub_user');
        this.user = null;
        this.isAuthenticated = false;
        window.location.href = this.getAppUrl('index.html');
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

    getBasePath() {
        const { origin, pathname } = window.location;
        let base = pathname;
        const pagesIndex = pathname.indexOf('/pages');

        if (pagesIndex !== -1) {
            base = pathname.substring(0, pagesIndex);
        } else {
            base = pathname.replace(/\/[^\/]*$/, '/');
        }

        if (!base.endsWith('/')) {
            base += '/';
        }

        return `${origin}${base}`;
    }

    getAppUrl(path) {
        return `${this.getBasePath()}${path}`;
    }

    requiresAuth() {
        const currentPath = window.location.pathname;
        return currentPath.endsWith('/dashboard.html') || currentPath.endsWith('/admin.html');
    }

    checkAuth() {
        if (this.requiresAuth() && !this.isAuthenticated) {
            window.location.href = this.getAppUrl('pages/login.html');
            return false;
        }
        return true;
    }

    checkAdmin() {
        if (!this.isAdmin()) {
            window.location.href = this.getAppUrl('pages/dashboard.html');
            return false;
        }
        return true;
    }
}

const auth = new AuthManager();
window.AuthManager = AuthManager;
window.auth = auth;