import fetch from 'node-fetch';

// ========== EJEMPLOS DE USO DE LA API ==========

const BASE_URL = 'http://localhost:4000/api';

// Función auxiliar para hacer requests
async function makeRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return response.json();
}

// ========== EJEMPLOS DE ARTÍCULOS ==========

console.log('📚 === EJEMPLOS DE ARTÍCULOS ===\n');

// Obtener todos los artículos
console.log('1. Obtener todos los artículos:');
const articles = await makeRequest('/articles');
console.log(JSON.stringify(articles, null, 2));
console.log('\n');

// Crear nuevo artículo
console.log('2. Crear nuevo artículo:');
const newArticle = await makeRequest('/articles', 'POST', {
    title: 'Introducción a n8n',
    description: 'Aprende a automatizar con n8n sin código',
    content: 'n8n es una plataforma poderosa para crear automatizaciones...',
    category: 'Automatización',
    author: 'Tu nombre'
});
console.log(JSON.stringify(newArticle, null, 2));
const articleId = newArticle.data.id;
console.log('\n');

// Obtener artículo específico
console.log('3. Obtener artículo específico:');
const singleArticle = await makeRequest(`/articles/${articleId}`);
console.log(JSON.stringify(singleArticle, null, 2));
console.log('\n');

// Actualizar artículo
console.log('4. Actualizar artículo:');
const updatedArticle = await makeRequest(`/articles/${articleId}`, 'PUT', {
    title: 'Introducción a n8n - Guía Completa'
});
console.log(JSON.stringify(updatedArticle, null, 2));
console.log('\n');

// ========== EJEMPLOS DE CONTACTO ==========

console.log('📧 === EJEMPLOS DE CONTACTO ===\n');

// Enviar mensaje de contacto
console.log('1. Enviar mensaje de contacto:');
const contactMessage = await makeRequest('/contact', 'POST', {
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    message: 'Me gustaría aprender más sobre IA y automatización'
});
console.log(JSON.stringify(contactMessage, null, 2));
console.log('\n');

// Obtener todos los mensajes
console.log('2. Obtener todos los mensajes:');
const messages = await makeRequest('/contact');
console.log(JSON.stringify(messages, null, 2));
console.log('\n');

// ========== HEALTH CHECK ==========

console.log('🏥 === HEALTH CHECK ===\n');
const health = await makeRequest('/health');
console.log(JSON.stringify(health, null, 2));
