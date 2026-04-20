# 🚀 TASK: UPGRADE BACKEND JPPHUB TO PRODUCTION LEVEL

You are a senior backend engineer.

We already have a Node.js + Express backend using MVC architecture.

## 🎯 GOAL
Upgrade this backend into a production-ready SaaS backend using MySQL.

You MUST NOT break existing structure. You must extend it.

---

# 🧠 CURRENT STATE

- Express backend (working)
- MVC structure already implemented
- Controllers, services, routes exist
- Data currently in memory (arrays)
- MySQL database already exists with tables:
  - users
  - posts
  - categories
  - sessions
  - subscriptions
  - payments
  - activity_logs

---

# 🚨 REQUIRED IMPROVEMENTS

## 1. DATABASE LAYER (CRITICAL)
Create a proper MySQL connection layer:

- /database/db.js
- Use mysql2/promise
- Use connection pool
- Use environment variables

---

## 2. REPOSITORY PATTERN (NEW LAYER REQUIRED)

Add a repository layer between services and database:

Create:
/repositories/

Implement:
- userRepository.js
- articleRepository.js (posts)
- sessionRepository.js

Each repository MUST:
- Use SQL queries
- Never contain business logic
- Return clean data

---

## 3. MIGRATE FROM MEMORY TO MYSQL

Replace ALL in-memory arrays with database queries:

- articles → posts table
- users → users table
- sessions → sessions table

No arrays allowed anymore.

---

## 4. AUTH SYSTEM (JWT)

Implement full authentication system:

- bcrypt password hashing
- JWT token generation
- login/register endpoints
- middleware auth.js

Add:
- role-based access control (user/admin)
- protect admin routes

---

## 5. MIDDLEWARES (PRODUCTION LEVEL)

Create:

- authMiddleware (JWT verification)
- roleMiddleware (admin/user check)
- validationMiddleware (Joi)

---

## 6. VALIDATION SYSTEM

Use Joi for:

- user registration
- login
- article creation/update
- contact messages

Reject invalid requests with proper HTTP errors.

---

## 7. SECURITY IMPROVEMENTS

Add:

- helmet
- cors configuration strict
- rate limiting (express-rate-limit)
- sanitize inputs

---

## 8. UPDATE SERVICES LAYER

Services must:

- NOT use arrays
- ONLY use repositories
- contain business logic only

---

## 9. ENV VARIABLES REQUIRED

Create/update .env.example:

DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=

---

## 10. ERROR HANDLING

Create global error handler middleware:

- structured JSON errors
- no stack traces in production
- proper HTTP status codes

---

# 🧱 FINAL ARCHITECTURE

Must follow:

Controller → Service → Repository → MySQL

---

# ⚠️ RULES

- Do NOT delete existing routes unless necessary
- Do NOT remove MVC structure
- Do NOT use in-memory arrays anymore
- Keep code clean and modular
- Use ES Modules (import/export)

---

# 🚀 OUTPUT EXPECTED

After completion:

- Fully working MySQL backend
- JWT authentication working
- Clean architecture (production level)
- Secure API
- Ready for deployment on Linux server