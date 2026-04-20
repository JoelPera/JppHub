// frontend/js/main.js

// Global articles data
let articlesDB = [];

// Load articles from backend API
async function loadArticles() {
    try {
        const response = await api.getArticles({ limit: 6 });
        articlesDB = response.articles || response;

        // Render articles if on homepage
        if (document.getElementById('blog')) {
            renderArticles();
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback to demo data
        articlesDB = [
            {
                id: "demo-1",
                title: "El impacto de la IA cuántica en 2026",
                excerpt: "Investigadores logran estabilizar qubits a temperatura ambiente, abriendo la puerta a una nueva era de computación...",
                created_at: "2026-03-26T00:00:00Z",
                views: 1250
            },
            {
                id: "demo-2",
                title: "Mercados globales responden a la nueva moneda digital",
                excerpt: "Los principales bancos centrales acuerdan un marco regulatorio unificado para las CBDCs globales...",
                created_at: "2026-03-25T00:00:00Z",
                views: 890
            },
            {
                id: "demo-3",
                title: "Descubren exoplaneta con océanos líquidos",
                excerpt: "El telescopio James Webb confirma la existencia de agua en estado líquido en Kepler-452c...",
                created_at: "2026-03-24T00:00:00Z",
                views: 2100
            }
        ];

        if (document.getElementById('blog')) {
            renderArticles();
        }
    }
}

// Render articles in the blog section
function renderArticles() {
    const blogSection = document.getElementById('blog');
    if (!blogSection) return;

    const grid = blogSection.querySelector('.grid');
    if (!grid) return;

    grid.innerHTML = '';

    articlesDB.forEach(article => {
        const articleCard = document.createElement('article');
        articleCard.className = 'card';

        const publishDate = new Date(article.created_at).toLocaleDateString('es-ES');
        const views = article.views || 0;

        articleCard.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-muted);">
                ${publishDate} • ${views} vistas
            </div>
        `;

        grid.appendChild(articleCard);
    });
}

// Handle authentication button clicks
function setupAuthButtons() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'pages/login.html';
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = 'pages/register.html';
        });
    }
}

// Update navbar based on authentication status
function updateNavbar() {
    const authButtons = document.querySelector('.auth-buttons');

    if (auth.isAuthenticated) {
        const user = auth.getUser();
        if (user) {
            authButtons.innerHTML = `
                <span style="color: var(--text); margin-right: 1rem;">
                    Hola, ${user.first_name}
                </span>
                <a href="pages/dashboard.html" class="btn-secondary" style="margin-right: 0.5rem;">Dashboard</a>
                <button class="btn-danger" onclick="auth.logout()" style="margin-right: 0.5rem;">Salir</button>
            `;

            // Add admin link if user is admin
            if (user.role === 'admin') {
                const adminLink = document.createElement('a');
                adminLink.href = 'pages/admin.html';
                adminLink.className = 'btn-secondary';
                adminLink.textContent = 'Admin';
                adminLink.style.marginRight = '0.5rem';
                authButtons.insertBefore(adminLink, authButtons.lastElementChild);
            }
        }
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupAuthButtons();
    updateNavbar();
    loadArticles();
});