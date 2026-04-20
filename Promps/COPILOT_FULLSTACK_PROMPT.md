
# 🚀 FULLSTACK TASK: BUILD JPPHUB (PRODUCTION READY SAAS)

You are a Senior Fullstack Engineer (Node.js + MySQL + Vanilla/React frontend optional).

You are working inside an existing project called "JppHub".

---

# 🎯 OBJECTIVE

Transform this project into a FULLSTACK SaaS platform:

- Backend: Node.js + Express + MySQL
- Frontend: Simple clean UI (or React if already present)
- Authentication: JWT
- Roles: user / admin
- Monetization system: subscriptions + payments
- Blog system
- Admin dashboard

---

# ⚠️ CRITICAL RULES

- DO NOT break existing folder structure
- DO NOT remove MVC architecture
- DO NOT use in-memory arrays anymore
- EVERYTHING must use MySQL
- Keep code clean and modular
- Use ES Modules (import/export)
- Use environment variables
- Every change MUST be documented in README.md

---

# 🧠 ARCHITECTURE (MANDATORY)

Backend must follow:

Controller → Service → Repository → MySQL

Frontend must call API via HTTP only.

---

# 🧱 BACKEND REQUIREMENTS

## 1. DATABASE LAYER

Create:
- /database/db.js (MySQL pool using mysql2/promise)

---

## 2. REPOSITORIES (MANDATORY)

Create /repositories:

- userRepository.js
- postRepository.js
- sessionRepository.js
- paymentRepository.js

Each repository:
- ONLY SQL queries
- NO business logic

---

## 3. AUTH SYSTEM

Implement full JWT authentication:

- Register user (bcrypt password hash)
- Login user
- JWT token generation
- Auth middleware
- Role middleware (admin/user)

---

## 4. CORE FEATURES

### USERS
- register/login
- profile
- role system

### POSTS (BLOG)
- CRUD posts
- slug support
- views counter
- published/draft system

### CATEGORIES
- list categories
- assign to posts

### SUBSCRIPTIONS
- free / premium / student
- active / cancelled / expired

### PAYMENTS
- simulate payments (Stripe-ready structure)
- store transactions

### LOGS
- activity_logs table usage
- track user actions

---

## 5. SECURITY

Add:
- helmet
- cors strict config
- rate limiting
- input validation (Joi)
- password hashing (bcrypt)

---

## 6. API ROUTES

Must include:

/api/auth
/api/users
/api/posts
/api/categories
/api/subscriptions
/api/payments
/api/admin

---

# 💻 FRONTEND REQUIREMENTS

Create a SIMPLE frontend (vanilla JS or React if project supports it):

## Pages:

### 1. Home
- list posts
- categories filter

### 2. Login/Register
- JWT login system

### 3. Dashboard
- user profile
- subscription status

### 4. Admin Panel
- create/edit/delete posts
- view users
- view payments

---

# 🔌 FRONTEND ↔ BACKEND

Frontend must use fetch():

- store JWT in localStorage
- attach token in headers:
  Authorization: Bearer <token>

---

# 🧾 README.MD AUTO UPDATE RULE

⚠️ IMPORTANT: Every time you create or modify something:

YOU MUST UPDATE README.md automatically.

---

## README MUST CONTAIN:

### 1. Project Overview
- what is JppHub

### 2. Tech Stack
- backend
- frontend
- database

### 3. Architecture
Controller → Service → Repository → DB

### 4. Folder structure (auto updated)

### 5. API endpoints documentation

### 6. Setup instructions

### 7. Environment variables

### 8. Features implemented (auto updated list)

### 9. Future improvements

---

# 📦 DATABASE TABLES (REFERENCE ONLY)

Use existing MySQL tables:

- users
- posts
- categories
- sessions
- subscriptions
- payments
- activity_logs

---

# 🚀 FINAL GOAL

At the end:

✔ Full working SaaS backend  
✔ Functional frontend  
✔ Auth system working  
✔ Admin panel working  
✔ Payments structure ready  
✔ Clean architecture  
✔ Fully documented README.md  

---

# ⚡ OUTPUT STYLE

- Clean production code
- Modular structure
- No duplicated logic
- No hardcoded secrets
- Professional naming