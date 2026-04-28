# JppHub Production Configuration Fix
## Nginx + Cloudflare + Docker Setup Guide

**Created:** April 28, 2026  
**Issue:** Website intermittent failures with "chrome-error://chromewebdata/" and HTTP 522 Cloudflare errors

---

## 🔴 ROOT CAUSES IDENTIFIED

### 1. **Hardcoded Docker Container Names** (CRITICAL)
**File:** `docker/nginx.conf` (lines 6, 12)
```nginx
# ❌ WRONG - depends on specific Docker project name
proxy_pass http://jpphub_frontend_1:80;
proxy_pass http://jpphub_backend_1:4000;
```
**Issue:** Docker Compose generates container names based on project directory. If run in a different environment, these names fail, causing 502 Bad Gateway errors.

**Fixed to:**
```nginx
# ✅ CORRECT - uses Docker service names
proxy_pass http://frontend:80;
proxy_pass http://backend:4000/;
```

### 2. **Missing Trailing Slash in API Proxy**
**File:** `docker/nginx.conf` line 12
```nginx
# ❌ WRONG
location /api/ {
    proxy_pass http://jpphub_backend_1:4000;  # Missing /
}
```
**Issue:** Without trailing slash on backend proxy, `/api/auth/login` becomes `http://backend:4000auth/login` (no slash between 4000 and auth), breaking all API requests.

**Fixed to:**
```nginx
# ✅ CORRECT
location /api/ {
    proxy_pass http://backend:4000/;
}
```

### 3. **Missing Cloudflare Headers**
**Issue:** Cloudflare sits in front of your server. Without proper `X-Forwarded-*` headers:
- Backend can't detect HTTPS (sees HTTP from nginx)
- CORS/redirects break
- CSP headers get mismatched origins

**Fixed by adding:**
```nginx
proxy_set_header X-Forwarded-Proto https;
proxy_set_header X-Forwarded-Host $host;
proxy_set_header CF-Connecting-IP $remote_addr;
```

### 4. **No www → non-www Canonicalization**
**Files:** All nginx configs
```nginx
# ❌ WRONG - accepts both without redirecting
server_name jpphub.com www.jpphub.com;
```
**Issue:** 
- Browser caches cookies for `www.jpphub.com` but makes requests to `jpphub.com`
- Mixed content warnings trigger security blocks
- Cloudflare can't properly cache (sees duplicate origins)

**Fixed by adding:**
```nginx
# ✅ CORRECT - enforces single canonical domain
if ($host = www.jpphub.com) {
    return 301 https://jpphub.com$request_uri;
}
```

### 5. **Missing SPA Routing Fallback**
**Issue:** React Router direct navigation to `/articulos/:slug` returns 404 because nginx looks for actual files.

**Fixed by:**
```nginx
location / {
    try_files $uri $uri/ /index.html;  # Falls back to index.html for SPA routing
}
```

### 6. **Multiple Conflicting Configurations**
- `/docker/nginx.conf` - Used by Dockerfile.nginx ← **USES THIS ONE FOR PRODUCTION**
- `/docker/default.conf` - Serves frontend files within nginx container
- `/nginx/conf/default.conf` - Alternative (but not used by Docker build)
- `/nginx/default.conf` - Uses localhost (not Docker)
- `/nginx/site.conf` - Uses localhost (not Docker)

**Production uses:** `Dockerfile.nginx` copies `docker/nginx.conf`

---

## ✅ PRODUCTION CONFIGURATION

### **Primary Config (Used by Docker)**
**File:** `docker/nginx.conf` - **NOW FIXED**

**Architecture:**
```
Browser (Cloudflare)
    ↓ 443 SSL/TLS (Cloudflare origin cert)
    ↓
nginx:443 (Let's Encrypt cert)
    ├─→ /api/ proxy to backend:4000 (Docker service)
    └─→ / proxy to frontend:80 (Docker service)
        ├─→ backend (Node.js on 4000)
        └─→ frontend (nginx serving React SPA on 80)
```

### **Docker Compose Services**
```yaml
nginx:          # docker/Dockerfile.nginx: Reverse proxy + SSL termination
  ├─ copies: docker/nginx.conf to /etc/nginx/conf.d/default.conf
  ├─ copies: frontend/dist to frontend service
  └─ mounts: /etc/letsencrypt for SSL certs

frontend:       # docker/Dockerfile.frontend: React SPA
  └─ nginx:alpine serving built React app

backend:        # docker/Dockerfile.backend: Node.js API
  └─ Node.js:4000 with Express + MySQL
```

---

## 🔧 DEPLOYMENT CHECKLIST

### **Step 1: Update Environment**

#### a. Cloudflare Settings
In your Cloudflare dashboard for `jpphub.com`:

1. **SSL/TLS → Mode:** `Full (strict)`
   - Only add your own origin certificate or Let's Encrypt

2. **SSL/TLS → Edge Certificates:**
   - ✅ Enable "Always use HTTPS"
   - ✅ Enable "HSTS" (minimum 6 months)

3. **Business Rules:**
   - ✅ Add redirect rule: `www.jpphub.com` → `jpphub.com` (if Cloudflare handles www)
   - OR: Let nginx handle it (recommended, already fixed)

4. **DNS Records:**
   ```
   jpphub.com          A  <YOUR_SERVER_IP>      (Orange cloud=proxied)
   www.jpphub.com      CNAME  jpphub.com         (Orange cloud=proxied)
   ```

#### b. Let's Encrypt Certificate
Ensure cert for `jpphub.com` exists (not `www.jpphub.com`):
```bash
# On your server:
ls -la /etc/letsencrypt/live/jpphub.com/
# Should show: fullchain.pem, privkey.pem
```

### **Step 2: Rebuild Docker Images**

```bash
cd /path/to/JppHub-main

# Pull latest base images
docker-compose pull

# Rebuild all services (will use updated docker/nginx.conf)
docker-compose build --no-cache

# Restart services
docker-compose down
docker-compose up -d

# Verify nginx is running
docker-compose logs nginx
```

### **Step 3: Verify Configuration**

```bash
# Test nginx configuration syntax inside container
docker-compose exec nginx nginx -t

# Check nginx is using correct config
docker-compose exec nginx cat /etc/nginx/conf.d/default.conf

# Verify API responds
curl -I http://localhost/api
# Should see: 200 or 404 (not 502/503)

# Verify proxy to frontend
curl -I http://localhost/
# Should see: 200 (proxy to frontend)
```

### **Step 4: Test Domain Resolution**

```bash
# From outside the network:
curl -I https://jpphub.com
# Expected: 200 OK with all pages

curl -I https://www.jpphub.com
# Expected: 301 redirect to https://jpphub.com

curl -I https://jpphub.com/api/health
# Expected: 200 OK with health status

curl -I https://jpphub.com/articulos
# Expected: 200 OK (SPA routing fallback)
```

### **Step 5: Cloudflare Cache Purge**

After deployment:
1. Go to Cloudflare dashboard → `jpphub.com`
2. Click **"Caching" → "Purge Cache" → "Purge Everything"**
3. Wait 30 seconds for cache to clear

---

## 📋 KEY FIXES APPLIED

| Issue | File | Before | After |
|-------|------|--------|-------|
| Hardcoded container names | docker/nginx.conf:6,12 | `jpphub_frontend_1:80` | `frontend:80` |
| Missing trailing slash | docker/nginx.conf:12 | `proxy_pass http://jpphub_backend_1:4000;` | `proxy_pass http://backend:4000/;` |
| Missing Cloudflare headers | docker/nginx.conf | None | `X-Forwarded-Proto`, `X-Forwarded-Host` |
| www not canonicalized | All nginx configs | Both accepted | www→non-www redirect |
| Missing SPA routing | docker/default.conf | None | `try_files $uri $uri/ /index.html` |
| SSL protocol version | docker/nginx.conf | Not specified | TLSv1.2+v1.3 |

---

## 🔍 CLOUDFLARE + NGINX INTERACTION

### **SSL Handshake Flow (With Fixes)**
```
1. Browser → Cloudflare: https://jpphub.com (TLS 1.3)
   ✅ Cloudflare has origin cert for jpphub.com

2. Cloudflare → Your nginx: https://jpphub.com (TLS 1.2+)
   ✅ nginx has Let's Encrypt cert for jpphub.com

3. nginx receives:
   - Host: jpphub.com
   - X-Forwarded-Proto: https (from Cloudflare)
   - CF-Connecting-IP: <browser_ip>
   ✅ nginx knows request is HTTPS (not fooled)

4. nginx → frontend/backend (internal Docker network)
   ✅ Plain HTTP (no TLS needed inside Docker)
```

### **Redirect Flow (www → non-www)**
```
Browser: GET https://www.jpphub.com/articulos
   ↓ (Cloudflare)
nginx receives: Host: www.jpphub.com
   ↓
if ($host = www.jpphub.com) { return 301 https://jpphub.com/articulos; }
   ↓
Browser redirected to: https://jpphub.com/articulos ✅
```

---

## 🚨 WHAT YOU WERE SEEING

### **HTTP 522 + "chrome-error://chromewebdata/"**
1. **Cause:** nginx couldn't reach `jpphub_frontend_1` or `jpphub_backend_1` (hardcoded names failed)
2. **Nginx returned:** 502 Bad Gateway
3. **Cloudflare saw 502:** `HTTP 522 (Connection Timeout)`
4. **Browser cached error:** `chrome-error://chromewebdata/` (error protocol)
5. **Result:** Page appeared broken even after restart (browser cache)

### **Why It Worked Locally**
- Your docker-compose.yml had project name `jpphub`, so containers named `jpphub_frontend_1`, `jpphub_backend_1`
- In production/different environments, container names were different → 502 errors

### **Why It Was Intermittent**
- Cloudflare cache sometimes had old 200 responses
- After cache refresh, saw new 502 errors
- Browser cache mixed with server responses
- Resulted in random success/failure

---

## 🔐 SECURITY IMPROVEMENTS

### **Before**
- Missing `X-Forwarded-Proto`: Backend saw HTTP instead of HTTPS
- Missing SSL protocols: Negotiated older, weaker TLS
- www/non-www mixed: CSP headers mismatched origins
- No canonical domain: Session cookies misaligned

### **After**
- ✅ Backend always knows request is HTTPS
- ✅ TLS 1.2+ enforced (no SSL 3.0/TLS 1.0)
- ✅ Single canonical domain enforces consistent cookies/CORS
- ✅ Cloudflare can properly cache (single origin)
- ✅ No mixed content warnings

---

## 📞 TROUBLESHOOTING

### **Still seeing 502 errors?**
```bash
# Check nginx logs
docker-compose logs -f nginx

# Check if services are running
docker-compose ps

# Test Docker networking
docker-compose exec nginx ping frontend
docker-compose exec nginx ping backend

# Verify backend is listening
docker-compose exec backend netstat -an | grep 4000
```

### **API requests failing?**
```bash
# Debug API proxy
curl -v https://jpphub.com/api/health

# Check Headers sent to backend
docker-compose exec nginx cat /var/log/nginx/access.log
```

### **Cloudflare still showing cached errors?**
```bash
# Clear Cloudflare cache via dashboard, then:
curl -I https://jpphub.com  # Force refresh
sleep 30
curl -I https://jpphub.com
```

---

## 📝 SUMMARY

**Problem:** Hardcoded Docker container names + missing headers + no domain canonicalization  
**Solution:** Use Docker service names + add proper proxy headers + enforce single domain  
**Impact:** Eliminates 502/522 errors, fixes intermittent failures, improves security & SEO  
**Files Changed:** `docker/nginx.conf`, `docker/default.conf`, `nginx/conf/default.conf`, `nginx/default.conf`, `nginx/site.conf`
