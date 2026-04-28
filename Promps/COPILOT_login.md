You are a senior fullstack developer.

Your task is to FIX and COMPLETE the frontend authentication system of my project "JppHub" so that login and register WORK end-to-end with my backend.

⚠️ CURRENT PROBLEM:
- Frontend UI exists but login/register do NOT work
- Forms do nothing or fail silently
- No proper connection with backend API

-----------------------------------

## 🎯 OBJECTIVE

Make a fully functional authentication system:

- Register user
- Login user
- Store JWT token
- Redirect after login
- Protect private pages
- Show error messages correctly

-----------------------------------

## ⚙️ BACKEND ASSUMPTIONS

- Backend runs on: http://localhost:3000
- Endpoints:
  POST /register
  POST /login

- Expected responses:

Register success:
{ "message": "User created" }

Login success:
{ "token": "JWT_TOKEN" }

Login error:
{ "message": "Invalid credentials" }

-----------------------------------

## 🧩 TASKS TO IMPLEMENT

### 1. API CONNECTION LAYER
Create a reusable api.js module that:
- Uses fetch
- Handles JSON
- Handles errors properly (try/catch)
- Returns parsed response

-----------------------------------

### 2. REGISTER SYSTEM
- Capture form data (username, email, password)
- Send POST /register
- Handle success → redirect to login
- Handle errors → show message in UI (not alert)

-----------------------------------

### 3. LOGIN SYSTEM
- Capture email and password
- Send POST /login
- Save token in localStorage
- Redirect to /dashboard.html
- Show error messages in UI

-----------------------------------

### 4. AUTH MANAGEMENT
- Create auth.js module:
  - saveToken()
  - getToken()
  - logout()

-----------------------------------

### 5. PROTECTED ROUTES
- In dashboard:
  - If no token → redirect to login
  - If token exists → allow access

-----------------------------------

### 6. UX IMPROVEMENTS
- Show loading state on buttons
- Show error messages inside the form
- Disable button while request is running

-----------------------------------

### 7. CODE QUALITY
- Use ES Modules
- Clean, readable code
- No duplicated logic
- Comment important parts

-----------------------------------

### 8. DEBUGGING (VERY IMPORTANT)
Add console logs:
- Request being sent
- Response received

-----------------------------------

### 9. OPTIONAL (IF EASY)
- Add basic CSS for clean UI
- Add success messages

-----------------------------------

## 📁 FILE STRUCTURE

frontend/
  index.html
  login.html
  register.html
  dashboard.html
  js/
    api.js
    auth.js
    main.js

-----------------------------------

## 🚨 IMPORTANT

- DO NOT assume anything works → verify everything
- DO NOT leave TODOs → implement fully
- MAKE IT WORK end-to-end
- If something fails → handle errors properly

-----------------------------------

## 🧪 FINAL CHECK

After implementation, the flow must work:

1. Register user → success
2. Login user → token saved
3. Redirect to dashboard
4. Refresh → still logged in
5. Logout → back to login

-----------------------------------

Now implement everything step by step and update files directly.