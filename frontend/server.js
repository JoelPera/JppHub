// Servidor estático simple para el frontend
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Sirve todo el directorio actual como estático
app.use(express.static(__dirname, { extensions: ['html'] }));

// Rutas "bonitas"
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'dashboard.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'pages', 'admin.html')));

// Fallback a index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`🌐 Frontend estático en http://${HOST}:${PORT}`);
});
