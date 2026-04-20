#!/bin/bash

# ========== SCRIPT DE PRUEBAS DE LA API ==========
# Ejecutar: bash test-api.sh

echo "🧪 Iniciando pruebas de la API JppHub..."
echo ""

# Base URL
API="http://localhost:4000/api"

# 1. Health Check
echo "1️⃣  Health Check"
echo "   GET $API/health"
curl -s "$API/health" | jq . 2>/dev/null || curl -s "$API/health"
echo -e "\n"

# 2. Obtener todos los artículos
echo "2️⃣  Obtener todos los artículos"
echo "   GET $API/articles"
curl -s "$API/articles" | jq . 2>/dev/null || curl -s "$API/articles"
echo -e "\n"

# 3. Crear un nuevo artículo
echo "3️⃣  Crear nuevo artículo"
echo "   POST $API/articles"
ARTICLE=$(curl -s -X POST "$API/articles" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Artículo",
    "description": "Descripción de prueba",
    "content": "Este es un artículo de prueba para verificar que el backend funciona correctamente",
    "category": "Test",
    "author": "Test User"
  }')
echo "$ARTICLE" | jq . 2>/dev/null || echo "$ARTICLE"
ARTICLE_ID=$(echo "$ARTICLE" | jq -r '.data.id' 2>/dev/null)
echo -e "\n"

# 4. Obtener artículo creado
if [ -n "$ARTICLE_ID" ] && [ "$ARTICLE_ID" != "null" ]; then
  echo "4️⃣  Obtener artículo específico (ID: $ARTICLE_ID)"
  echo "   GET $API/articles/$ARTICLE_ID"
  curl -s "$API/articles/$ARTICLE_ID" | jq . 2>/dev/null || curl -s "$API/articles/$ARTICLE_ID"
  echo -e "\n"

  # 5. Actualizar artículo
  echo "5️⃣  Actualizar artículo"
  echo "   PUT $API/articles/$ARTICLE_ID"
  curl -s -X PUT "$API/articles/$ARTICLE_ID" \
    -H "Content-Type: application/json" \
    -d '{"title": "Test Artículo Actualizado"}' | jq . 2>/dev/null || \
    curl -s -X PUT "$API/articles/$ARTICLE_ID" \
    -H "Content-Type: application/json" \
    -d '{"title": "Test Artículo Actualizado"}'
  echo -e "\n"
fi

# 6. Enviar mensaje de contacto
echo "6️⃣  Enviar mensaje de contacto"
echo "   POST $API/contact"
CONTACT=$(curl -s -X POST "$API/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario Test",
    "email": "test@ejemplo.com",
    "message": "Este es un mensaje de prueba"
  }')
echo "$CONTACT" | jq . 2>/dev/null || echo "$CONTACT"
CONTACT_ID=$(echo "$CONTACT" | jq -r '.data.id' 2>/dev/null)
echo -e "\n"

# 7. Obtener todos los mensajes
echo "7️⃣  Obtener todos los mensajes de contacto"
echo "   GET $API/contact"
curl -s "$API/contact" | jq . 2>/dev/null || curl -s "$API/contact"
echo -e "\n"

# 8. Obtener mensaje específico
if [ -n "$CONTACT_ID" ] && [ "$CONTACT_ID" != "null" ]; then
  echo "8️⃣  Obtener mensaje específico (ID: $CONTACT_ID)"
  echo "   GET $API/contact/$CONTACT_ID"
  curl -s "$API/contact/$CONTACT_ID" | jq . 2>/dev/null || curl -s "$API/contact/$CONTACT_ID"
  echo -e "\n"
fi

echo "✅ Pruebas completadas!"
