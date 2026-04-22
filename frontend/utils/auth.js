// JppHub - Auth manager
class AuthManager {
    constructor() {
        this.user = this.loadUser();
        this.isAuthenticated = !!api.getToken();
    }
    loadUser() {
        const raw = localStorage.getItem('jpphub_user');
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
    }
    setUser(u) {
        this.user = u;
        localStorage.setItem('jpphub_user', JSON.stringify(u));
    }
    getUser() { return this.user || this.loadUser(); }
    async login(email, password) {
        const r = await api.login(email, password);
        if (r.user) this.setUser(r.user);
        this.isAuthenticated = true;
        return r;
    }
    async register(data) {
        const r = await api.register(data);
        if (r.user) this.setUser(r.user);
        this.isAuthenticated = true;
        return r;
    }
    logout() {
        api.removeToken();
        localStorage.removeItem('jpphub_user');
        this.user = null; this.isAuthenticated = false;
        window.location.href = '/';
    }
    isAdmin() { const u = this.getUser(); return u?.role === 'admin'; }
    requireAuth() {
        if (!this.isAuthenticated) { window.location.href = '/login'; return false; }
        return true;
    }
    requireAdmin() {
        if (!this.requireAuth()) return false;
        if (!this.isAdmin()) { window.location.href = '/dashboard'; return false; }
        return true;
    }
}
const auth = new AuthManager();
window.auth = auth;
