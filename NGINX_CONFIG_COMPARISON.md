# NGINX Configuration Files - Complete Comparison & Usage Guide

**Purpose:** Clarify which nginx config is used in each deployment scenario

---

## 📋 CONFIGURATION FILES OVERVIEW

| File | Purpose | Used By | Environment | Status |
|------|---------|---------|-------------|--------|
| `docker/nginx.conf` | **PRIMARY:** Reverse proxy + SSL + canonicalization | `Dockerfile.nginx` | Docker production | ✅ FIXED |
| `docker/default.conf` | Frontend server inside nginx container | Manual nginx setup | Alternative | ✅ FIXED |
| `nginx/conf/default.conf` | **BACKUP:** Same as docker/nginx.conf | Manual deploy | Manual nginx | ✅ FIXED |
| `nginx/default.conf` | **LEGACY:** Old configuration | Manual deploy | Manual nginx | ✅ FIXED |
| `nginx/site.conf` | **LEGACY:** Old configuration | Manual deploy | Manual nginx | ✅ FIXED |

---

## 🐳 DOCKER PRODUCTION FLOW

```
Dockerfile.nginx
    │
    ├─ FROM nginx:alpine
    ├─ RUN rm /etc/nginx/conf.d/default.conf        (remove default)
    ├─ COPY frontend/dist/ /usr/share/nginx/html   (copy SPA app)
    └─ COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
          │
          └─ ✅ NOW CORRECTLY USES:
               - Docker service names (frontend, backend)
               - Proper Cloudflare headers
               - www → non-www redirect
               - Correct trailing slashes
```

### **Why This One?**
- Every `docker-compose up` rebuilds and uses this config
- Standard for production deployments
- All fixes are in this file
- No manual configuration needed

---

## 🔄 CONFIGURATION FILE CONTENTS AFTER FIXES

### **1. docker/nginx.conf** ← PRIMARY CONFIG

Key sections:
```nginx
# HTTP → HTTPS redirect with www → non-www canonicalization
server {
    listen 80;
    server_name jpphub.com www.jpphub.com;
    
    if ($host = www.jpphub.com) {
        return 301 https://jpphub.com$request_uri;
    }
    return 301 https://jpphub.com$request_uri;
}

# HTTPS with SSL certs
server {
    listen 443 ssl http2;
    server_name jpphub.com www.jpphub.com;
    
    ssl_certificate /etc/letsencrypt/live/jpphub.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jpphub.com/privkey.pem;
    
    # Redirect www to non-www
    if ($host = www.jpphub.com) {
        return 301 https://jpphub.com$request_uri;
    }
    
    # Frontend SPA (uses Docker service name)
    location / {
        proxy_pass http://frontend:80;  # ✅ Fixed: was jpphub_frontend_1:80
        
        # Cloudflare headers
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header CF-Connecting-IP $remote_addr;
    }
    
    # API - with trailing slash ✅ Fixed: was missing /
    location /api/ {
        proxy_pass http://backend:4000/;  # ✅ Fixed: was jpphub_backend_1:4000 (no slash)
        
        # Same Cloudflare headers
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
    }
}
```

**Changes Made:**
- ✅ `jpphub_frontend_1` → `frontend`
- ✅ `jpphub_backend_1` → `backend`
- ✅ `http://backend:4000` → `http://backend:4000/`
- ✅ Added X-Forwarded-Proto, X-Forwarded-Host, CF-Connecting-IP
- ✅ Added www → non-www redirect

---

### **2. docker/default.conf** ← ALTERNATIVE FRONTEND SERVER

Used when nginx is serving frontend files directly (not using main nginx container):

```nginx
server {
    listen 80;
    
    # SPA routing: fallback all non-files to index.html
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;  # ✅ Fixed: SPA support
    }
    
    # Static assets with caching
    location ~* \.(js|css|svg|png|jpg|jpeg|gif)$ {
        root /usr/share/nginx/html;
        expires 30d;
    }
    
    # API proxy to backend service
    location /api/ {
        proxy_pass http://backend:4000/;  # ✅ Fixed: with trailing slash
    }
}
```

**When Used:**
- Internal frontend server (not exposed externally)
- Used by main nginx to proxy requests

---

## 🔀 REQUEST FLOW DIAGRAM

### **Production (Docker)**

```
User Request:
https://jpphub.com/articulos

       ↓ Cloudflare intercepts ↓
       
Browser → Cloudflare → Your nginx:443 (docker/nginx.conf)
              │
              ├─ HTTP/2.0, X-Forwarded-Proto: https
              ├─ Host: jpphub.com
              └─ CF-Connecting-IP: <user_ip>
                      ↓
              
nginx:443 (/etc/nginx/conf.d/default.conf = docker/nginx.conf)
    │
    └─ Server on port 443 SSL ← ✅ This is being used
        │
        ├─ Check: $host = www.jpphub.com? NO
        ├─ Match: location / (not /api)
        │
        └─ proxy_pass http://frontend:80  ← ✅ Docker service name
                ↓
                
frontend:80 (uses docker/default.conf internally)
    └─ Serves /usr/share/nginx/html/index.html
       ├─ JavaScript loads /main.js
       ├─ React Router matches /articulos
       └─ Shows article list

User sees: ✅ Content loads correctly
```

### **If Running Manual nginx (Non-Docker)**

```
Alternative setup (not production):

nginx:443 (nginx/conf/default.conf or nginx/default.conf)
    └─ proxy_pass http://frontend:80
       │
       └─ Docker compose frontend service OR
          Linux server running frontend on 8080
```

---

## ⚠️ BEFORE VS AFTER (KEY DIFFERENCES)

### **Hardcoded Container Names**
```diff
- proxy_pass http://jpphub_frontend_1:80;
+ proxy_pass http://frontend:80;
```
**Impact:** Production now works in any environment

### **Missing Trailing Slash**
```diff
- location /api/ {
-     proxy_pass http://backend:4000;
- }
+ location /api/ {
+     proxy_pass http://backend:4000/;
+ }
```
**Impact:** API requests go to correct path (not broken)

### **Missing Headers**
```diff
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
+ proxy_set_header X-Forwarded-Proto https;
+ proxy_set_header X-Forwarded-Host $host;
+ proxy_set_header CF-Connecting-IP $remote_addr;
```
**Impact:** Backend knows request is HTTPS, Cloudflare works correctly

### **No Canonicalization**
```diff
- server_name jpphub.com www.jpphub.com;
- return 301 https://$host$request_uri;
+ server_name jpphub.com www.jpphub.com;
+ if ($host = www.jpphub.com) {
+     return 301 https://jpphub.com$request_uri;
+ }
+ return 301 https://jpphub.com$request_uri;
```
**Impact:** Only one domain used, no cookie/CORS issues

### **Missing SPA Support**
```diff
  location / {
      root /usr/share/nginx/html;
      index index.html;
-     try_files $uri /index.html;
+     try_files $uri $uri/ /index.html;
  }
```
**Impact:** React Router direct links now work

---

## 🚀 DEPLOYMENT SCENARIOS

### **Scenario 1: Docker Production (CURRENT)**
```bash
docker-compose build
docker-compose up -d

# Uses: docker/nginx.conf ✅
# Flow: nginx:443 → frontend:80 (docker/default.conf) → backend:4000
```

### **Scenario 2: Manual Server with nginx**
```bash
# Copy nginx/conf/default.conf or nginx/default.conf to:
# /etc/nginx/sites-available/jpphub
# /etc/nginx/sites-enabled/jpphub

nginx -t && systemctl restart nginx

# Uses: nginx/conf/default.conf ✅
```

### **Scenario 3: Manual Frontend Server**
```bash
# If running React dev server on 8080:
# Proxy through nginx on port 80/443
# Uses: docker/default.conf (adapted)
```

---

## ✅ WHICH CONFIG TO USE WHERE

| Deployment | Config File | Command |
|------------|-------------|---------|
| Docker Compose | `docker/nginx.conf` | `docker-compose up` |
| Manual nginx on Linux | `nginx/conf/default.conf` | `cp → /etc/nginx/sites-available/` |
| Local development | Development server | `npm run dev` |
| Preview/Staging | `docker/nginx.conf` | `docker-compose up` |
| Production | `docker/nginx.conf` | `docker-compose up -d` |

---

## 🔍 HOW TO VERIFY CORRECT CONFIG IS LOADED

```bash
# In Docker:
docker-compose exec nginx cat /etc/nginx/conf.d/default.conf

# Should show:
# - Backend proxy: proxy_pass http://backend:4000/;
# - Frontend proxy: proxy_pass http://frontend:80;
# - Headers: X-Forwarded-Proto, X-Forwarded-Host
# - Redirect: if ($host = www.jpphub.com) { return 301 ...

# On manual nginx:
cat /etc/nginx/sites-enabled/jpphub

# Test syntax:
nginx -t

# Reload config:
systemctl reload nginx
# OR in Docker:
docker-compose exec nginx nginx -s reload
```

---

## 🆘 TROUBLESHOOTING BY SYMPTOM

| Symptom | Cause | Solution |
|---------|-------|----------|
| 502 Bad Gateway | Docker names mismatch | Verify: `docker-compose ps` names match config |
| API returning 404 | Missing trailing slash | Check: `proxy_pass http://backend:4000/;` (with `/`) |
| www and non-www both work | No canonicalization | Check: `if ($host = www.jpphub.com) { return 301 ...` present |
| Frontend routes 404 | No SPA fallback | Check: `try_files $uri $uri/ /index.html;` |
| Cloudflare shows 522 | Missing X-Forwarded headers | Check: `X-Forwarded-Proto https;` present |

---

## 📌 SUMMARY

**All 5 nginx config files have been updated for consistency:**

1. ✅ `docker/nginx.conf` - PRIMARY (used by Docker production)
2. ✅ `docker/default.conf` - FRONTEND INTERNAL SERVER
3. ✅ `nginx/conf/default.conf` - BACKUP (manual deploy)
4. ✅ `nginx/default.conf` - LEGACY (manual deploy)
5. ✅ `nginx/site.conf` - LEGACY (manual deploy)

**All contain:**
- Docker service names (not hardcoded container names)
- Proper trailing slashes
- Cloudflare headers
- www → non-www canonicalization
- SPA routing support (where applicable)

**Result:** No matter which file is used, behavior is consistent and correct. 🎉
