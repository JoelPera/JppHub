// JppHub - API client
const API_BASE_URL = (() => {
    // En Emergent preview: frontend y backend comparten dominio, /api se enruta a puerto 8001
    return `${window.location.origin}/api`;
})();

class ApiClient {
    constructor() { this.baseURL = API_BASE_URL; }
    getToken() { return localStorage.getItem('jpphub_token'); }
    setToken(t) { localStorage.setItem('jpphub_token', t); }
    removeToken() { localStorage.removeItem('jpphub_token'); }

    async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${this.baseURL}${endpoint}`, { ...options, headers });
        const text = await res.text();
        let payload = null;
        try { payload = text ? JSON.parse(text) : null; }
        catch { throw new Error('Respuesta inválida del servidor'); }
        if (!res.ok) {
            if (res.status === 401) this.removeToken();
            const msg = payload?.message || payload?.error || `Error ${res.status}`;
            const details = payload?.details?.join?.(', ');
            throw new Error(details ? `${msg}: ${details}` : msg);
        }
        return payload;
    }

    // Auth
    async login(email, password) {
        const r = await this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        const data = r.data || r;
        if (data.token) this.setToken(data.token);
        return data;
    }
    async register(userData) {
        const r = await this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
        const data = r.data || r;
        if (data.token) this.setToken(data.token);
        return data;
    }
    async me() { return (await this.request('/auth/me')).data; }

    // Artículos
    async getPublishedArticles() { return (await this.request('/articles')).data || []; }
    async getAllArticles(status) { const q = status ? `?status=${status}` : ''; return (await this.request(`/articles/all${q}`)).data || []; }
    async getMyArticles() { return (await this.request('/articles/mine')).data || []; }
    async getArticle(id) { return (await this.request(`/articles/${id}`)).data; }
    async submitArticle(data) { return (await this.request('/articles', { method: 'POST', body: JSON.stringify(data) })).data; }
    async updateArticle(id, data) { return (await this.request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(data) })).data; }
    async reviewArticle(id, action, note) { return (await this.request(`/articles/${id}/review`, { method: 'POST', body: JSON.stringify({ action, note: note || '' }) })).data; }
    async deleteArticle(id) { return await this.request(`/articles/${id}`, { method: 'DELETE' }); }
    async getArticleStats() { return (await this.request('/articles/stats')).data || {}; }

    // Admin
    async getAllUsers() { return (await this.request('/admin/users')).data || []; }
    async updateUserRole(id, role) { return (await this.request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })).data; }
    async getAdminStats() { return (await this.request('/admin/stats')).data || {}; }

    // Contact
    async sendContact(data) { return await this.request('/contact', { method: 'POST', body: JSON.stringify(data) }); }
}

const api = new ApiClient();
window.api = api;
