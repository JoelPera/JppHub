"""Backend regression tests for JppHub SaaS API (Node/Express + MariaDB)."""
import os
import time
import uuid
import requests
import pytest

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://e7daa7e1-68ee-423b-ba3f-536897254c06.preview.emergentagent.com",
).rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@jpphub.com"
ADMIN_PWD = "Admin123!"
AUTHOR_EMAIL = "autor@jpphub.com"
AUTHOR_PWD = "Autor123!"


# --------------------- Fixtures ---------------------
@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PWD}, timeout=15)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["data"]["token"] if "data" in r.json() else r.json()["token"]


@pytest.fixture(scope="session")
def author_token():
    r = requests.post(f"{API}/auth/login", json={"email": AUTHOR_EMAIL, "password": AUTHOR_PWD}, timeout=15)
    assert r.status_code == 200, f"Author login failed: {r.status_code} {r.text}"
    body = r.json()
    return body["data"]["token"] if "data" in body else body["token"]


def _auth(t):
    return {"Authorization": f"Bearer {t}"}


def _payload_envelope(j):
    """Backend may return {status:'ok',data:{...}} or just {...}"""
    return j.get("data", j)


# --------------------- Health/root ---------------------
def test_api_root():
    r = requests.get(f"{API}", timeout=15)
    assert r.status_code == 200
    assert "JppHub" in r.text or "online" in r.text


# --------------------- Auth ---------------------
class TestAuth:
    def test_register_validation_missing_fields(self):
        r = requests.post(f"{API}/auth/register", json={"email": "x"}, timeout=15)
        assert r.status_code in (400, 422)

    def test_register_and_login_new_user(self):
        email = f"TEST_user_{uuid.uuid4().hex[:8]}@example.com"
        r = requests.post(f"{API}/auth/register", json={
            "name": "Test User", "email": email, "password": "Passw0rd!"
        }, timeout=15)
        assert r.status_code in (200, 201), f"register failed: {r.status_code} {r.text}"
        body = _payload_envelope(r.json())
        assert "token" in body
        assert body["user"]["email"] == email

        # duplicate should 409
        r2 = requests.post(f"{API}/auth/register", json={
            "name": "Test User", "email": email, "password": "Passw0rd!"
        }, timeout=15)
        assert r2.status_code == 409

        # login
        r3 = requests.post(f"{API}/auth/login", json={"email": email, "password": "Passw0rd!"}, timeout=15)
        assert r3.status_code == 200
        body3 = _payload_envelope(r3.json())
        assert "token" in body3

        # /me with token
        token = body3["token"]
        rme = requests.get(f"{API}/auth/me", headers=_auth(token), timeout=15)
        assert rme.status_code == 200
        me = _payload_envelope(rme.json())
        # user might be nested as data.user or just data
        u = me.get("user", me)
        assert u["email"] == email

    def test_login_invalid_credentials(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WRONG"}, timeout=15)
        assert r.status_code == 401

    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_google_session_invalid(self):
        r = requests.post(f"{API}/auth/google/session", json={"session_id": "invalid_xyz"}, timeout=20)
        assert r.status_code == 401, f"expected 401, got {r.status_code}: {r.text}"


# --------------------- Articles public ---------------------
class TestArticlesPublic:
    def test_get_published_articles(self):
        r = requests.get(f"{API}/articles", timeout=15)
        assert r.status_code == 200
        body = _payload_envelope(r.json())
        items = body if isinstance(body, list) else body.get("articles") or body.get("items") or []
        assert isinstance(items, list)
        # all returned must be approved
        for a in items:
            assert a.get("status") == "approved", f"non-approved leaked: {a.get('status')}"

    def test_get_article_by_id_404(self):
        r = requests.get(f"{API}/articles/nonexistent-id-xyz", timeout=15)
        assert r.status_code in (404, 400)


# --------------------- Articles author + admin flow ---------------------
class TestArticleFlow:
    def test_full_submit_review_publish_flow(self, admin_token, author_token):
        # 1. Author submits
        title = f"TEST_Article_{uuid.uuid4().hex[:6]}"
        r = requests.post(f"{API}/articles", headers=_auth(author_token), json={
            "title": title,
            "description": "Descripcion de prueba para flujo completo",
            "content": "Contenido de prueba largo para validar el flujo completo.",
            "category": "General"
        }, timeout=15)
        assert r.status_code in (200, 201), f"submit failed: {r.status_code} {r.text}"
        body = _payload_envelope(r.json())
        article = body.get("article", body)
        article_id = article["id"]
        assert article["status"] == "pending"

        # 2. /articles/mine includes it
        rm = requests.get(f"{API}/articles/mine", headers=_auth(author_token), timeout=15)
        assert rm.status_code == 200
        mine = _payload_envelope(rm.json())
        items = mine if isinstance(mine, list) else mine.get("articles") or mine.get("items") or []
        ids = [a["id"] for a in items]
        assert article_id in ids

        # 3. Public list does NOT include pending
        rp = requests.get(f"{API}/articles", timeout=15)
        pub = _payload_envelope(rp.json())
        pub_items = pub if isinstance(pub, list) else pub.get("articles") or pub.get("items") or []
        assert article_id not in [a["id"] for a in pub_items]

        # 4. Author cannot access /articles/all
        rdeny = requests.get(f"{API}/articles/all", headers=_auth(author_token), timeout=15)
        assert rdeny.status_code in (401, 403)

        # 5. Admin can list all
        ra = requests.get(f"{API}/articles/all?status=pending", headers=_auth(admin_token), timeout=15)
        assert ra.status_code == 200

        # 6. Admin sets in_review
        rrev = requests.post(f"{API}/articles/{article_id}/review",
                             headers=_auth(admin_token),
                             json={"action": "review", "note": "Pls add more"}, timeout=15)
        assert rrev.status_code == 200, f"review action failed: {rrev.status_code} {rrev.text}"

        # 7. Admin approves
        rap = requests.post(f"{API}/articles/{article_id}/review",
                            headers=_auth(admin_token),
                            json={"action": "approve"}, timeout=15)
        assert rap.status_code == 200

        # 8. Now appears in public list
        time.sleep(0.5)
        rp2 = requests.get(f"{API}/articles", timeout=15)
        pub2 = _payload_envelope(rp2.json())
        pub_items2 = pub2 if isinstance(pub2, list) else pub2.get("articles") or pub2.get("items") or []
        assert article_id in [a["id"] for a in pub_items2], "Approved article not in public list"

        # 9. Author edits → returns to pending
        re = requests.put(f"{API}/articles/{article_id}", headers=_auth(author_token),
                          json={"title": title + "_EDIT", "description": "Descripcion editada del articulo",
                                "content": "Contenido editado por autor.", "category": "General"}, timeout=15)
        assert re.status_code == 200, f"author edit: {re.status_code} {re.text}"

        # confirm status reverted
        rg = requests.get(f"{API}/articles/all?status=pending", headers=_auth(admin_token), timeout=15)
        all_items = _payload_envelope(rg.json())
        items_a = all_items if isinstance(all_items, list) else all_items.get("articles") or all_items.get("items") or []
        ids2 = [a["id"] for a in items_a]
        assert article_id in ids2, "Article should be back to pending after author edit"

        # 10. Reject and verify
        rj = requests.post(f"{API}/articles/{article_id}/review",
                           headers=_auth(admin_token),
                           json={"action": "reject", "note": "no"}, timeout=15)
        assert rj.status_code == 200

        # 11. Admin deletes
        rd = requests.delete(f"{API}/articles/{article_id}", headers=_auth(admin_token), timeout=15)
        assert rd.status_code in (200, 204)

        # 12. confirm deleted
        rgone = requests.get(f"{API}/articles/{article_id}", timeout=15)
        assert rgone.status_code in (404, 400)


# --------------------- Admin endpoints ---------------------
class TestAdmin:
    def test_admin_stats(self, admin_token):
        r = requests.get(f"{API}/admin/stats", headers=_auth(admin_token), timeout=15)
        assert r.status_code == 200, f"{r.status_code} {r.text}"
        data = _payload_envelope(r.json())
        # should contain something about users / articles
        s = str(data).lower()
        assert "user" in s or "total" in s or "approved" in s or "pending" in s

    def test_admin_users(self, admin_token):
        r = requests.get(f"{API}/admin/users", headers=_auth(admin_token), timeout=15)
        assert r.status_code == 200
        data = _payload_envelope(r.json())
        users = data if isinstance(data, list) else data.get("users") or data.get("items") or []
        assert any(u.get("email") == ADMIN_EMAIL for u in users)

    def test_admin_users_forbidden_for_user(self, author_token):
        r = requests.get(f"{API}/admin/users", headers=_auth(author_token), timeout=15)
        assert r.status_code == 403

    def test_admin_change_user_role(self, admin_token):
        # find author user id
        r = requests.get(f"{API}/admin/users", headers=_auth(admin_token), timeout=15)
        data = _payload_envelope(r.json())
        users = data if isinstance(data, list) else data.get("users") or data.get("items") or []
        author = next((u for u in users if u.get("email") == AUTHOR_EMAIL), None)
        assert author is not None
        uid = author["id"]
        # promote to admin then back
        rp = requests.patch(f"{API}/admin/users/{uid}/role", headers=_auth(admin_token),
                            json={"role": "admin"}, timeout=15)
        assert rp.status_code == 200, f"{rp.status_code} {rp.text}"
        rb = requests.patch(f"{API}/admin/users/{uid}/role", headers=_auth(admin_token),
                            json={"role": "user"}, timeout=15)
        assert rb.status_code == 200
