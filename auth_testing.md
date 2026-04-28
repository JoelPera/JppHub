# Auth Testing Playbook - Emergent Google Auth

## Setup
- Google Auth URL: `https://auth.emergentagent.com/?redirect={redirect_url}`
- Redirect returns with `#session_id={id}` in URL fragment
- Backend exchanges via GET `https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data` with header `X-Session-ID`
- Response: `{id, email, name, picture, session_token}`

## JppHub Flow
1. User clicks "Entrar con Google" → redirects to `https://auth.emergentagent.com/?redirect=<origin>/dashboard`
2. User returns to `/dashboard#session_id=xxxxx`
3. Frontend detects fragment, calls `POST /api/auth/google/session` with body `{session_id}`
4. Backend calls Emergent session-data, upserts user in MySQL (`provider='google'`), issues our own JWT, returns `{token, user}`
5. Frontend stores token in localStorage (same as JWT login), removes fragment, redirects to `/dashboard`

## Test
```bash
# Seed a test user (email already exists in DB)
mysql jpphub -e "SELECT id, email, role, provider FROM users WHERE email='admin@jpphub.com';"

# For full E2E test, navigate to /login, click "Entrar con Google" in browser
```

## Checklist
- [ ] Google login button redirects to auth.emergentagent.com
- [ ] After Google login, frontend detects `#session_id=` fragment
- [ ] Backend exchanges session_id and upserts user (provider='google')
- [ ] JWT token stored in localStorage (`jpphub_token`)
- [ ] User redirected to /dashboard without fragment
- [ ] Subsequent API calls work with Bearer token
