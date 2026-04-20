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

    // Get stored JWT token
    getToken() {
        return localStorage.getItem('jpphub_token');
    }

    // Set JWT token
    setToken(token) {
        localStorage.setItem('jpphub_token', token);
    }

    // Remove JWT token
    removeToken() {
        localStorage.removeItem('jpphub_token');
    }

    // Generic fetch wrapper with auth headers
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
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

        try {
            const response = await fetch(url, config);

            // Handle unauthorized (token expired)
            if (response.status === 401) {
                this.removeToken();
                window.location.href = '/frontend/pages/login.html';
                throw new Error('Token expired');
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Network error' }));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        const response = await fetch(`${this.baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(error.message);
        }

        const payload = await response.json();
        const data = payload.data || payload;
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async register(userData) {
        const response = await fetch(`${this.baseURL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Registration failed' }));
            throw new Error(error.message);
        }

        const payload = await response.json();
        const data = payload.data || payload;
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    async refreshToken() {
        return this.request('/auth/refresh', { method: 'POST' });
    }

    // User endpoints
    async getCurrentUser() {
        return this.request('/users/profile');
    }

    async updateUser(userData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    // Article/Post endpoints
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

    // Category endpoints
    async getCategories() {
        return this.request('/categories');
    }

    // Subscription endpoints
    async getSubscriptions() {
        return this.request('/subscriptions');
    }

    async createSubscription(subscriptionData) {
        return this.request('/subscriptions', {
            method: 'POST',
            body: JSON.stringify(subscriptionData)
        });
    }

    // Payment endpoints
    async getPayments() {
        return this.request('/payments');
    }

    async createPayment(paymentData) {
        return this.request('/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    // Admin endpoints
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

    // Contact endpoint
    async sendContactMessage(messageData) {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create singleton instance
const api = new ApiClient();

// Export for use in other files
window.ApiClient = ApiClient;
window.api = api;