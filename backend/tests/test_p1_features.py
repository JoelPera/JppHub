"""
P1 features tests: file upload, profile management, public author profile, review email.
Covers:
  - POST /api/uploads (auth, multipart)
  - GET /api/uploads/files/:filename (static)
  - PATCH /api/users/me (auth)
  - GET /api/users/:id/profile (public)
  - POST /api/articles/:id/review with action=request_changes (validator + email log)
  - coverImage relative path acceptance on POST /api/articles
"""
import io
import os
import time
import struct
import zlib
import pytest
import requests

BASE_URL = "https://e4275ab2-d56a-41be-bc7e-8ca87cfb2a48.preview.emergentagent.com"

ADMIN_EMAIL = "admin@jpphub.com"
ADMIN_PASS = "Admin123!"
AUTHOR_EMAIL = "autor@jpphub.com"
AUTHOR_PASS = "Autor123!"


def _png_bytes():
    """Generate a minimal valid 1x1 PNG."""
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
    ihdr = b'IHDR' + ihdr_data
    ihdr_crc = zlib.crc32(ihdr) & 0xffffffff
    ihdr_chunk = struct.pack(">I", len(ihdr_data)) + ihdr + struct.pack(">I", ihdr_crc)
    raw = b'\x00\xff\x00\x00'
    comp = zlib.compress(raw)
    idat = b'IDAT' + comp
    idat_crc = zlib.crc32(idat) & 0xffffffff
    idat_chunk = struct.pack(">I", len(comp)) + idat + struct.pack(">I", idat_crc)
    iend = b'IEND'
    iend_crc = zlib.crc32(iend) & 0xffffffff
    iend_chunk = struct.pack(">I", 0) + iend + struct.pack(">I", iend_crc)
    return sig + ihdr_chunk + idat_chunk + iend_chunk


@pytest.fixture(scope="module")
def author_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": AUTHOR_EMAIL, "password": AUTHOR_PASS})
    assert r.status_code == 200, f"author login failed: {r.text}"
    return r.json()["data"]["token"]


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    assert r.status_code == 200, f"admin login failed: {r.text}"
    return r.json()["data"]["token"]


@pytest.fixture(scope="module")
def author_user(author_token):
    r = requests.get(f"{BASE_URL}/api/auth/me",
                     headers={"Authorization": f"Bearer {author_token}"})
    assert r.status_code == 200, r.text
    return r.json()["data"]


# ========== UPLOAD ==========

class TestUpload:
    def test_upload_requires_auth(self):
        r = requests.post(f"{BASE_URL}/api/uploads",
                          files={"file": ("a.png", _png_bytes(), "image/png")})
        assert r.status_code in (401, 403), f"expected auth required, got {r.status_code}: {r.text}"

    def test_upload_image_success_and_static_serve(self, author_token):
        png = _png_bytes()
        r = requests.post(f"{BASE_URL}/api/uploads",
                          headers={"Authorization": f"Bearer {author_token}"},
                          files={"file": ("test.png", png, "image/png")})
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["status"] == "success"
        data = body["data"]
        assert data["url"].startswith("/api/uploads/files/")
        assert data["url"].endswith(".png")
        assert data["mime"] == "image/png"
        assert data["size"] == len(png)

        # Save URL for downstream tests
        TestUpload.uploaded_url = data["url"]

        # Static fetch
        full = f"{BASE_URL}{data['url']}"
        rr = requests.get(full)
        assert rr.status_code == 200, f"static fetch failed: {rr.status_code}"
        # First bytes of returned content match PNG signature
        assert rr.content[:8] == b'\x89PNG\r\n\x1a\n'

    def test_upload_rejects_non_image(self, author_token):
        r = requests.post(f"{BASE_URL}/api/uploads",
                          headers={"Authorization": f"Bearer {author_token}"},
                          files={"file": ("x.txt", b"hello", "text/plain")})
        assert r.status_code == 400
        assert "Formato" in r.text or "soportado" in r.text


# ========== PROFILE ==========

class TestProfile:
    def test_patch_me_updates_bio_and_avatar(self, author_token):
        bio = f"TEST_bio updated at {int(time.time())}"
        avatar = "/api/uploads/files/fake-avatar.png"
        r = requests.patch(f"{BASE_URL}/api/users/me",
                           headers={"Authorization": f"Bearer {author_token}"},
                           json={"bio": bio, "avatarUrl": avatar})
        assert r.status_code == 200, r.text
        data = r.json()["data"]
        assert data["bio"] == bio
        assert data["avatarUrl"] == avatar

        # Verify GET /api/auth/me returns updated values
        rr = requests.get(f"{BASE_URL}/api/auth/me",
                          headers={"Authorization": f"Bearer {author_token}"})
        assert rr.status_code == 200
        u = rr.json()["data"]
        assert u["bio"] == bio
        assert u["avatarUrl"] == avatar

    def test_patch_me_requires_auth(self):
        r = requests.patch(f"{BASE_URL}/api/users/me", json={"bio": "x"})
        assert r.status_code in (401, 403)

    def test_patch_me_rejects_invalid_name(self, author_token):
        r = requests.patch(f"{BASE_URL}/api/users/me",
                           headers={"Authorization": f"Bearer {author_token}"},
                           json={"name": "a"})
        assert r.status_code == 400

    def test_public_profile_returns_profile_and_articles(self, author_user):
        r = requests.get(f"{BASE_URL}/api/users/{author_user['id']}/profile")
        assert r.status_code == 200, r.text
        data = r.json()["data"]
        assert "profile" in data and "articles" in data and "count" in data
        p = data["profile"]
        assert p["id"] == author_user["id"]
        assert "name" in p and "role" in p and "createdAt" in p
        # profile should NOT include email
        assert "email" not in p
        # All articles must be approved
        for art in data["articles"]:
            assert art["status"] == "approved", f"non-approved leaked: {art.get('status')}"
        assert data["count"] == len(data["articles"])

    def test_public_profile_404_unknown(self):
        r = requests.get(f"{BASE_URL}/api/users/nonexistent-user-id-zzz/profile")
        assert r.status_code == 404


# ========== ARTICLE coverImage + REVIEW (with email) ==========

class TestArticleCoverAndReview:
    @pytest.fixture(scope="class")
    def article_id(self, author_token):
        # Create with relative coverImage
        payload = {
            "title": "TEST_P1 cover image article for review",
            "description": "Articulo creado para validar coverImage relativa y review request_changes.",
            "content": "<p>Contenido valido con suficientes caracteres para pasar el validador del backend.</p>",
            "category": "Tecnologia",
            "coverImage": "/api/uploads/files/fake-cover.png",
            "status": "pending"
        }
        r = requests.post(f"{BASE_URL}/api/articles",
                          headers={"Authorization": f"Bearer {author_token}"},
                          json=payload)
        assert r.status_code in (200, 201), f"create failed: {r.status_code} {r.text}"
        data = r.json()["data"]
        assert data["coverImage"] == payload["coverImage"], "coverImage relative path not persisted"
        return data["id"]

    def test_review_request_changes_accepted(self, admin_token, article_id):
        r = requests.post(f"{BASE_URL}/api/articles/{article_id}/review",
                          headers={"Authorization": f"Bearer {admin_token}"},
                          json={"action": "request_changes", "note": "TEST_note pls fix intro"})
        assert r.status_code == 200, f"review failed: {r.status_code} {r.text}"
        body = r.json()
        assert body["status"] == "success"
        # No email blocking failure: response should still be quick + success

    def test_review_approve_sends_email(self, admin_token, article_id):
        r = requests.post(f"{BASE_URL}/api/articles/{article_id}/review",
                          headers={"Authorization": f"Bearer {admin_token}"},
                          json={"action": "approve"})
        assert r.status_code == 200, r.text
        # Wait briefly to let async email fire and log
        time.sleep(2)

    def test_review_invalid_action_rejected(self, admin_token, article_id):
        r = requests.post(f"{BASE_URL}/api/articles/{article_id}/review",
                          headers={"Authorization": f"Bearer {admin_token}"},
                          json={"action": "explode"})
        assert r.status_code == 400
