import { v4 as uuidv4 } from 'uuid';

// ========== SERVICIO DE ARTÍCULOS ==========
// Nota: Actualmente almacena datos en memoria. Para producción, conectar a base de datos.

let articles = [
    {
        id: uuidv4(),
        title: 'Qué es la IA en 2026',
        description: 'Una guía clara con ejemplos prácticos para entender su impacto real.',
        content: 'La inteligencia artificial en 2026 ha revolucionado la forma en que trabajamos y creamos soluciones...',
        category: 'IA',
        author: 'JppHub Team',
        createdAt: new Date('2026-04-01'),
        updatedAt: new Date('2026-04-01')
    },
    {
        id: uuidv4(),
        title: 'Automatiza tu empresa',
        description: 'Flujos de trabajo eficientes con n8n para ahorrar tiempo y reducir errores.',
        content: 'La automatización es clave para mejorar la productividad de tu empresa. Con n8n puedes crear flujos...',
        category: 'Automatización',
        author: 'JppHub Team',
        createdAt: new Date('2026-04-05'),
        updatedAt: new Date('2026-04-05')
    },
    {
        id: uuidv4(),
        title: 'Gana dinero con IA',
        description: 'Modelos viables de monetización para productos y servicios inteligentes.',
        content: 'Descubre cómo monetizar proyectos de IA. Existen varias estrategias probadas...',
        category: 'Negocios',
        author: 'JppHub Team',
        createdAt: new Date('2026-04-10'),
        updatedAt: new Date('2026-04-10')
    }
];

export class ArticleService {
    // Obtener todos los artículos
    static getAllArticles() {
        return articles.map(article => ({
            ...article,
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString()
        }));
    }

    // Obtener artículo por ID
    static getArticleById(id) {
        const article = articles.find(a => a.id === id);
        if (!article) return null;

        return {
            ...article,
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString()
        };
    }

    // Obtener artículos por categoría
    static getArticlesByCategory(category) {
        return articles
            .filter(a => a.category === category)
            .map(article => ({
                ...article,
                createdAt: article.createdAt.toISOString(),
                updatedAt: article.updatedAt.toISOString()
            }));
    }

    // Crear nuevo artículo
    static createArticle(articleData) {
        const newArticle = {
            id: uuidv4(),
            ...articleData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        articles.push(newArticle);

        return {
            ...newArticle,
            createdAt: newArticle.createdAt.toISOString(),
            updatedAt: newArticle.updatedAt.toISOString()
        };
    }

    // Actualizar artículo
    static updateArticle(id, updates) {
        const index = articles.findIndex(a => a.id === id);
        if (index === -1) return null;

        articles[index] = {
            ...articles[index],
            ...updates,
            id: articles[index].id, // No permitir cambiar el ID
            createdAt: articles[index].createdAt, // No permitir cambiar fecha creación
            updatedAt: new Date()
        };

        return {
            ...articles[index],
            createdAt: articles[index].createdAt.toISOString(),
            updatedAt: articles[index].updatedAt.toISOString()
        };
    }

    // Eliminar artículo
    static deleteArticle(id) {
        const index = articles.findIndex(a => a.id === id);
        if (index === -1) return false;

        articles.splice(index, 1);
        return true;
    }

    // Buscar artículos
    static searchArticles(query) {
        const lowerQuery = query.toLowerCase();
        return articles
            .filter(a =>
                a.title.toLowerCase().includes(lowerQuery) ||
                a.description.toLowerCase().includes(lowerQuery) ||
                a.content.toLowerCase().includes(lowerQuery)
            )
            .map(article => ({
                ...article,
                createdAt: article.createdAt.toISOString(),
                updatedAt: article.updatedAt.toISOString()
            }));
    }
}

export default ArticleService;
