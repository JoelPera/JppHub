"""Tests for new endpoints used by React frontend: contact form + view count."""
import os, uuid, requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://e4275ab2-d56a-41be-bc7e-8ca87cfb2a48.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


def test_contact_send_ok():
    payload = {
        "name": f"TEST_{uuid.uuid4().hex[:6]}",
        "email": "test_contact@example.com",
        "subject": "Mensaje de prueba",
        "message": "Hola, este es un mensaje de prueba con suficiente longitud."
    }
    r = requests.post(f"{API}/contact", json=payload, timeout=15)
    assert r.status_code in (200, 201), f"contact failed: {r.status_code} {r.text}"


def test_contact_validation_missing_fields():
    r = requests.post(f"{API}/contact", json={"email": "x@y.com"}, timeout=15)
    assert r.status_code in (400, 422)


def test_increment_views_on_published_article():
    arts = requests.get(f"{API}/articles", timeout=15).json()
    items = arts.get("data", arts) if isinstance(arts, dict) else arts
    if not items:
        return
    art = items[0]
    art_id = art["id"]
    before = art.get("views", 0)
    r = requests.patch(f"{API}/articles/{art_id}/views", timeout=15)
    assert r.status_code == 200, f"views: {r.status_code} {r.text}"
    # confirm via GET by id
    r2 = requests.get(f"{API}/articles/{art_id}", timeout=15)
    assert r2.status_code == 200
    body = r2.json().get("data", r2.json())
    after = (body.get("article") or body).get("views", 0)
    assert after >= before + 1
