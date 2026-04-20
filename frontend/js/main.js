// js/main.js

// 1. CARGA DE ARTÍCULOS DESDE EL BACKEND
let articlesDB = [];

async function loadArticles() {
    try {
        const response = await fetch('http://localhost:5000/api/articles');
        if (!response.ok) {
            throw new Error('Error al cargar artículos');
        }
        articlesDB = await response.json();
        // Si estamos en la página principal, renderizar artículos
        if (document.getElementById('article-grid')) {
            renderArticles();
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        // Fallback a datos simulados si falla la API
        articlesDB = [
            {
                id: "art-1",
                title: "El impacto de la IA cuántica en 2026",
                excerpt: "Investigadores logran estabilizar qubits a temperatura ambiente, abriendo la puerta a una nueva era de computación...",
                author: "Tech Bot",
                date: "2026-03-26",
                category: "Tecnología",
                url: "articles/articulo-1.html"
            },
            {
                id: "art-2",
                title: "Mercados globales responden a la nueva moneda digital",
                excerpt: "Los principales bancos centrales acuerdan un marco regulatorio unificado para las CBDCs globales...",
                author: "Finance Bot",
                date: "2026-03-25",
                category: "Economía",
                url: "articles/articulo-2.html"
            },
            {
                id: "art-3",
                title: "Descubren exoplaneta con océanos líquidos",
                excerpt: "El telescopio James Webb confirma la existencia de agua en estado líquido en Kepler-452c...",
                author: "Science Bot",
                date: "2026-03-24",
                category: "Ciencia",
                url: "articles/articulo-3.html"
            }
        ];
        if (document.getElementById('article-grid')) {
            renderArticles();
        }
    }
}

// 2. INYECCIÓN DE HEADER Y FOOTER
function loadComponents(basePath = '') {
    const header = `
        <header>
            <div class="container header-flex">
                <div class="logo">
                    <a href="${basePath}index.html">SBS News Hub</a>
                </div>
                <nav>
                    <ul>
                        <li><a href="${basePath}index.html">Home</a></li>
                        <li><a href="#">Trending</a></li>
                        <li><a href="#">Videos</a></li>
                        <li><a href="${basePath}admin/index.html">Admin</a></li>
                    </ul>
                </nav>
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Buscar noticias...">
                    <button onclick="handleSearch('${basePath}')">Buscar</button>
                </div>
            </div>
        </header>
    `;

    const footer = `
        <footer>
            <div class="container">
                <div class="footer-grid">
                    <div>
                        <h3>SBS News Hub</h3>
                        <p style="color:#cbd5e1; margin-top:10px;">Noticias automatizadas de última generación.</p>
                    </div>
                    <div>
                        <h3>Legal</h3>
                        <ul class="footer-links">
                            <li><a href="#">Política de Privacidad</a></li>
                            <li><a href="#">Política de Cookies</a></li>
                        </ul>
                    </div>
                </div>
                <div style="text-align: center; border-top: 1px solid #334155; padding-top: 1rem; color: #cbd5e1; font-size: 0.9rem;">
                    &copy; ${new Date().getFullYear()} SBS News Hub. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    `;

    if(document.getElementById('header-placeholder')) document.getElementById('header-placeholder').innerHTML = header;
    if(document.getElementById('footer-placeholder')) document.getElementById('footer-placeholder').innerHTML = footer;
}

// 3. RENDERIZADO Y BÚSQUEDA DE ARTÍCULOS
function renderArticles(filterText = '') {
    const grid = document.getElementById('article-grid');
    if (!grid) return; // Si no estamos en index.html, salimos.

    grid.innerHTML = '';
    const filtered = articlesDB.filter(art => 
        art.title.toLowerCase().includes(filterText.toLowerCase()) || 
        art.excerpt.toLowerCase().includes(filterText.toLowerCase())
    );

    if(filtered.length === 0) {
        grid.innerHTML = '<p>No se encontraron artículos.</p>';
        return;
    }

    filtered.forEach(art => {
        grid.innerHTML += `
            <article class="card">
                <span class="badge">${art.category}</span>
                <h2 style="margin-top: 10px;">
                    <a href="${art.url}" style="color: inherit; text-decoration: none;">${art.title}</a>
                </h2>
                <div class="meta">
                    <span>📅 ${art.date}</span> | <span>✍️ ${art.author}</span>
                </div>
                <p>${art.excerpt}</p>
                <a href="${art.url}" class="btn">Leer completo</a>
            </article>
        `;
    });
}

function handleSearch(basePath) {
    const query = document.getElementById('searchInput').value;
    // Si estamos en un artículo, redirigimos a index.html con un parámetro de query (simulado)
    if (!document.getElementById('article-grid')) {
        window.location.href = `${basePath}index.html?search=${encodeURIComponent(query)}`;
    } else {
        renderArticles(query);
    }
}

// Auto-ejecutar render si hay parámetros en la URL (ej. al volver de buscar en otra página)
window.addEventListener('DOMContentLoaded', () => {
    loadComponents(); // Asegurar que los componentes se carguen primero
    loadArticles(); // Cargar artículos desde el backend

    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && document.getElementById('article-grid')) {
        setTimeout(() => { // Pequeño delay para asegurar que el DOM del componente esté inyectado
            document.getElementById('searchInput').value = searchParam;
            renderArticles(searchParam);
        }, 100);
    }
});