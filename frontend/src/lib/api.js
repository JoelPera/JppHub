// JppHub API client – React version
// In the Emergent preview, frontend and backend share the same origin: /api proxies to backend.
// If REACT_APP_BACKEND_URL is provided (production), use it. Otherwise fall back to the current origin.

const ENV_URL =
  (import.meta.env && (import.meta.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_BACKEND_URL)) || ''

const API_BASE = `${(ENV_URL || window.location.origin).replace(/\/$/, '')}/api`

const TOKEN_KEY = 'jpphub_token'
const USER_KEY = 'jpphub_user'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const userStore = {
  get: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
  },
  set: (u) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  clear: () => localStorage.removeItem(USER_KEY),
}

async function request(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers }
  if (auth) {
    const t = tokenStore.get()
    if (t) h.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let payload = null
  try { payload = text ? JSON.parse(text) : null } catch { throw new Error('Respuesta inválida del servidor') }
  if (!res.ok) {
    if (res.status === 401) {
      tokenStore.clear()
      userStore.clear()
    }
    const msg = payload?.message || payload?.error || `Error ${res.status}`
    const details = Array.isArray(payload?.details) ? payload.details.join(', ') : null
    throw new Error(details ? `${msg}: ${details}` : msg)
  }
  return payload
}

export const api = {
  // Auth
  async login(email, password) {
    const r = await request('/auth/login', { method: 'POST', body: { email, password }, auth: false })
    const d = r.data || r
    if (d.token) tokenStore.set(d.token)
    if (d.user) userStore.set(d.user)
    return d
  },
  async register(data) {
    const r = await request('/auth/register', { method: 'POST', body: data, auth: false })
    const d = r.data || r
    if (d.token) tokenStore.set(d.token)
    if (d.user) userStore.set(d.user)
    return d
  },
  async me() {
    const r = await request('/auth/me')
    return r.data
  },
  logout() {
    tokenStore.clear()
    userStore.clear()
  },

  // Articles – public
  async getPublishedArticles() {
    return (await request('/articles', { auth: false })).data || []
  },
  async getArticleBySlug(slug) {
    return (await request(`/articles/slug/${encodeURIComponent(slug)}`, { auth: false })).data
  },
  async incrementViews(id) {
    return await request(`/articles/${id}/views`, { method: 'PATCH', auth: false })
  },

  // Articles – author
  async getMyArticles() {
    return (await request('/articles/mine')).data || []
  },
  async submitArticle(data) {
    return (await request('/articles', { method: 'POST', body: data })).data
  },
  async updateArticle(id, data) {
    return (await request(`/articles/${id}`, { method: 'PUT', body: data })).data
  },

  // Articles – admin
  async getAllArticles(status) {
    const q = status ? `?status=${status}` : ''
    return (await request(`/articles/all${q}`)).data || []
  },
  async reviewArticle(id, action, note = '') {
    return (await request(`/articles/${id}/review`, { method: 'POST', body: { action, note } })).data
  },
  async deleteArticle(id) {
    return await request(`/articles/${id}`, { method: 'DELETE' })
  },
  async getArticleStats() {
    return (await request('/articles/stats')).data || {}
  },

  // Admin
  async getAdminStats() {
    return (await request('/admin/stats')).data || {}
  },
  async getAllUsers() {
    return (await request('/admin/users')).data || []
  },
  async updateUserRole(id, role) {
    return (await request(`/admin/users/${id}/role`, { method: 'PATCH', body: { role } })).data
  },

  // Contact
  async sendContact(data) {
    return await request('/contact', { method: 'POST', body: data, auth: false })
  },
}

export default api
