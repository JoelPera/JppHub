// JppHub - Home page logic
(function () {
    function fmtDate(s) { try { return new Date(s).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return ''; } }

    async function loadArticles() {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;
        try {
            const articles = await api.getPublishedArticles();
            if (!articles.length) {
                grid.innerHTML = '<div class="card"><p>Aún no hay artículos aprobados. ¡Sé el primero en enviar uno!</p></div>';
                return;
            }
            grid.innerHTML = articles.slice(0, 6).map(a => `
                <article class="card" data-testid="article-card-${a.id}">
                    <h3>${escapeHtml(a.title)}</h3>
                    <p>${escapeHtml(a.description || '').slice(0, 160)}</p>
                    <div style="margin-top:1rem; display:flex; gap:.6rem; align-items:center; color: var(--text-subtle); font-size:.82rem;">
                        <span class="badge badge-approved">${escapeHtml(a.category || 'General')}</span>
                        <span>${fmtDate(a.publishedAt || a.createdAt)}</span>
                        <span>· ${a.views || 0} vistas</span>
                    </div>
                </article>
            `).join('');
        } catch (e) {
            grid.innerHTML = `<div class="card"><p>No se pudieron cargar los artículos: ${escapeHtml(e.message)}</p></div>`;
        }
    }

    function escapeHtml(s) {
        return String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    function updateNavbar() {
        const container = document.getElementById('authButtons');
        if (!container) return;
        if (auth.isAuthenticated) {
            const u = auth.getUser() || {};
            const adminLink = u.role === 'admin'
                ? `<a href="/admin" class="btn-ghost btn-sm" data-testid="nav-admin-btn">Admin</a>` : '';
            container.innerHTML = `
                <span>Hola, ${escapeHtml(u.name || 'Usuario')}</span>
                ${adminLink}
                <a href="/dashboard" class="btn-secondary btn-sm" data-testid="nav-dashboard-btn">Dashboard</a>
                <button class="btn-danger btn-sm" onclick="auth.logout()" data-testid="nav-logout-btn">Salir</button>
            `;
        }
    }

    async function setupContact() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        const alert = document.getElementById('contact-alert');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            alert.className = 'alert';
            const payload = {
                name: document.getElementById('contact-name').value.trim(),
                email: document.getElementById('contact-email').value.trim(),
                message: document.getElementById('contact-message').value.trim()
            };
            try {
                await api.sendContact(payload);
                alert.className = 'alert alert-success show';
                alert.textContent = '¡Mensaje enviado! Te contactaremos pronto.';
                form.reset();
            } catch (err) {
                alert.className = 'alert alert-error show';
                alert.textContent = err.message;
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateNavbar();
        loadArticles();
        setupContact();
    });
})();
