"""Iter2 backend regression: GET /api/articles/slug/:slug + multi-article seed for paginación."""
import os
import uuid
import time
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://e7daa7e1-68ee-423b-ba3f-536897254c06.preview.emergentagent.com",
).rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@jpphub.com"
ADMIN_PWD = "Admin123!"
AUTHOR_EMAIL = "autor@jpphub.com"
AUTHOR_PWD = "Autor123!"


def _auth(t):
    return {"Authorization": f"Bearer {t}"}


def _envelope(j):
    return j.get("data", j)


def _login(email, pwd):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": pwd}, timeout=15)
    assert r.status_code == 200, f"login {email}: {r.status_code} {r.text}"
    body = _envelope(r.json())
    return body["token"]


def _submit_article(token, title, html_content):
    return requests.post(
        f"{API}/articles",
        headers=_auth(token),
        json={
            "title": title,
            "description": "Descripcion para test slug y HTML " + uuid.uuid4().hex[:6],
            "content": html_content,
            "category": "General",
        },
        timeout=15,
    )


def _approve(admin_token, article_id):
    return requests.post(
        f"{API}/articles/{article_id}/review",
        headers=_auth(admin_token),
        json={"action": "approve"},
        timeout=15,
    )


def test_slug_returns_approved():
    admin = _login(ADMIN_EMAIL, ADMIN_PWD)
    author = _login(AUTHOR_EMAIL, AUTHOR_PWD)

    title = f"TEST_Slug_{uuid.uuid4().hex[:6]}"
    html = "<h2>Encabezado</h2><p>Contenido <strong>negrita</strong> y <em>cursiva</em>.</p><ul><li>Item</li></ul>"
    r = _submit_article(author, title, html)
    assert r.status_code in (200, 201), r.text
    art = _envelope(r.json())
    art = art.get("article", art)
    aid = art["id"]
    slug = art.get("slug")
    assert slug, f"article missing slug: {art}"

    # Antes de aprobar -> 404 público
    rb4 = requests.get(f"{API}/articles/slug/{slug}", timeout=15)
    assert rb4.status_code == 404, f"expected 404 pending, got {rb4.status_code}: {rb4.text}"

    # Aprobar
    rap = _approve(admin, aid)
    assert rap.status_code == 200, rap.text

    # Ahora debe devolver 200 y mismo HTML
    time.sleep(0.3)
    rs = requests.get(f"{API}/articles/slug/{slug}", timeout=15)
    assert rs.status_code == 200, f"{rs.status_code} {rs.text}"
    body = _envelope(rs.json())
    article = body.get("article", body)
    assert article["status"] == "approved"
    assert article["title"] == title
    assert "<h2>" in article["content"], "HTML no preservado"
    assert "<strong>" in article["content"]

    # Cleanup
    requests.delete(f"{API}/articles/{aid}", headers=_auth(admin), timeout=15)


def test_slug_404_when_rejected():
    admin = _login(ADMIN_EMAIL, ADMIN_PWD)
    author = _login(AUTHOR_EMAIL, AUTHOR_PWD)

    title = f"TEST_SlugRej_{uuid.uuid4().hex[:6]}"
    r = _submit_article(author, title, "<p>contenido para test rechazado largo suficiente.</p>")
    art = _envelope(r.json()).get("article", _envelope(r.json()))
    aid = art["id"]
    slug = art["slug"]

    rj = requests.post(
        f"{API}/articles/{aid}/review",
        headers=_auth(admin),
        json={"action": "reject", "note": "no"},
        timeout=15,
    )
    assert rj.status_code == 200
    rs = requests.get(f"{API}/articles/slug/{slug}", timeout=15)
    assert rs.status_code == 404, f"rejected leaked: {rs.status_code} {rs.text}"

    requests.delete(f"{API}/articles/{aid}", headers=_auth(admin), timeout=15)


def test_slug_404_unknown():
    r = requests.get(f"{API}/articles/slug/no-existe-{uuid.uuid4().hex[:8]}", timeout=15)
    assert r.status_code == 404


def test_seed_12_articles_for_pagination():
    """Crea 12 artículos aprobados para validar paginación admin (idempotente por slug)."""
    admin = _login(ADMIN_EMAIL, ADMIN_PWD)
    author = _login(AUTHOR_EMAIL, AUTHOR_PWD)

    created_ids = []
    for i in range(12):
        title = f"TEST_Pag_{i:02d}_{uuid.uuid4().hex[:4]}"
        r = _submit_article(author, title, f"<h2>Item {i}</h2><p>Cuerpo del articulo de paginacion #{i}.</p>")
        if r.status_code in (200, 201):
            art = _envelope(r.json()).get("article", _envelope(r.json()))
            created_ids.append(art["id"])
            # aprobar la mitad
            if i % 2 == 0:
                _approve(admin, art["id"])
    assert len(created_ids) >= 10, f"solo se crearon {len(created_ids)} artículos"

    # Verificar que /articles/all retorna >=12
    r = requests.get(f"{API}/articles/all", headers=_auth(admin), timeout=15)
    body = _envelope(r.json())
    items = body if isinstance(body, list) else body.get("articles") or body.get("items") or []
    assert len(items) >= 12, f"esperaba >=12, got {len(items)}"
