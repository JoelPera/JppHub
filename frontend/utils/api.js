// frontend/utils/api.js

const API_BASE_URL = (() => {
    if (typeof window === 'undefined') {
        return 'http://localhost:4000/api';
    }

    if (window.API_BASE_URL) {
        return window.API_BASE_URL;
    }

    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:4000/api';
    }

    return `${window.location.origin}/api`;
})();

// API utility functions for JppHub frontend
class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken() {
        return localStorage.getItem('jpphub_token');
    }

    setToken(token) {
        localStorage.setItem('jpphub_token', token);
    }

    removeToken() {
        localStorage.removeItem('jpphub_token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log('[API] request:', url, options);

        const token = this.getToken();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, config);
        const text = await response.text();
        let payload = null;

        try {
            payload = text ? JSON.parse(text) : null;
        } catch (error) {
            console.error('[API] invalid JSON response:', text);
            throw new Error('Respuesta inválida del servidor');
        }

        console.log('[API] response:', url, response.status, payload);

        if (!response.ok) {
            if (response.status === 401) {
                this.removeToken();
            }

            const message = payload?.message || payload?.error || `HTTP ${response.status}`;
            throw new Error(message || 'Error en la petición');
        }

        return payload;
    }

    async login(email, password) {
        const payload = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        const data = payload.data || payload;
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async register(userData) {
        const payload = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        const data = payload.data || payload;
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async refreshToken() {
        return this.request('/auth/refresh', { method: 'POST' });
    }

    async getCurrentUser() {
        return this.request('/users/profile');
    }

    async updateUser(userData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async getArticles(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/articles${queryString ? `?${queryString}` : ''}`);
    }

    async getArticle(id) {
        return this.request(`/articles/${id}`);
    }

    async createArticle(articleData) {
        return this.request('/articles', {
            method: 'POST',
            body: JSON.stringify(articleData)
        });
    }

    async updateArticle(id, articleData) {
        return this.request(`/articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(articleData)
        });
    }

    async deleteArticle(id) {
        return this.request(`/articles/${id}`, { method: 'DELETE' });
    }

    async incrementArticleViews(id) {
        return this.request(`/articles/${id}/view`, { method: 'PATCH' });
    }

    async getCategories() {
        return this.request('/categories');
    }

    async getSubscriptions() {
        return this.request('/subscriptions');
    }

    async createSubscription(subscriptionData) {
        return this.request('/subscriptions', {
            method: 'POST',
            body: JSON.stringify(subscriptionData)
        });
    }

    async getPayments() {
        return this.request('/payments');
    }

    async createPayment(paymentData) {
        return this.request('/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    async getAllUsers() {
        return this.request('/admin/users');
    }

    async getAllArticles() {
        return this.request('/admin/articles');
    }

    async getAllPayments() {
        return this.request('/admin/payments');
    }

    async getActivityLogs() {
        return this.request('/admin/activity');
    }

    async sendContactMessage(messageData) {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }

    async healthCheck() {
        return this.request('/health');
    }
}

const api = new ApiClient();
window.ApiClient = ApiClient;
window.api = api;