"""
FastAPI ASGI wrapper for JppHub Node.js backend.

Supervisor is hard-coded to run:
  /root/.venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001

Our real backend is Node.js (server.js). This module:
  1. Starts the Node.js backend on an internal port (NODE_BACKEND_PORT=8002) on startup.
  2. Proxies every HTTP request (including /api/*) to that Node.js backend.
  3. Shuts Node.js down cleanly on exit.
"""

import asyncio
import os
import signal
import subprocess
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request, Response

NODE_PORT = int(os.environ.get("NODE_BACKEND_PORT", "8002"))
NODE_HOST = "127.0.0.1"
NODE_URL = f"http://{NODE_HOST}:{NODE_PORT}"
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

_node_proc: subprocess.Popen | None = None
_client: httpx.AsyncClient | None = None


async def _wait_for_node(timeout: float = 30.0) -> bool:
    """Poll Node backend until it accepts connections or timeout."""
    deadline = asyncio.get_event_loop().time() + timeout
    async with httpx.AsyncClient(timeout=2.0) as c:
        while asyncio.get_event_loop().time() < deadline:
            try:
                r = await c.get(f"{NODE_URL}/api/health")
                if r.status_code < 500:
                    return True
            except Exception:
                pass
            await asyncio.sleep(0.5)
    return False


@asynccontextmanager
async def lifespan(_: FastAPI):
    global _node_proc, _client
    env = os.environ.copy()
    env["PORT"] = str(NODE_PORT)
    env["HOST"] = NODE_HOST
    env["NODE_ENV"] = env.get("NODE_ENV", "development")
    _node_proc = subprocess.Popen(
        ["node", "server.js"],
        cwd=BACKEND_DIR,
        env=env,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        preexec_fn=os.setsid,
    )
    ok = await _wait_for_node()
    if not ok:
        print(f"[wrapper] Node.js backend did not start on {NODE_URL}")
    _client = httpx.AsyncClient(base_url=NODE_URL, timeout=60.0)
    try:
        yield
    finally:
        if _client is not None:
            await _client.aclose()
        if _node_proc is not None and _node_proc.poll() is None:
            try:
                os.killpg(os.getpgid(_node_proc.pid), signal.SIGTERM)
                _node_proc.wait(timeout=10)
            except Exception:
                try:
                    os.killpg(os.getpgid(_node_proc.pid), signal.SIGKILL)
                except Exception:
                    pass


app = FastAPI(lifespan=lifespan)


@app.api_route(
    "/{full_path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def proxy(full_path: str, request: Request) -> Response:
    assert _client is not None
    url = "/" + full_path
    if request.url.query:
        url += "?" + request.url.query

    hop_by_hop = {
        "host",
        "content-length",
        "connection",
        "keep-alive",
        "transfer-encoding",
        "upgrade",
        "proxy-authenticate",
        "proxy-authorization",
        "te",
        "trailers",
    }
    headers = {k: v for k, v in request.headers.items() if k.lower() not in hop_by_hop}
    body = await request.body()

    try:
        r = await _client.request(request.method, url, content=body, headers=headers)
    except httpx.ConnectError:
        return Response(
            content='{"status":"error","message":"Backend Node.js no disponible"}',
            status_code=502,
            media_type="application/json",
        )

    resp_headers = {
        k: v for k, v in r.headers.items() if k.lower() not in hop_by_hop and k.lower() != "content-encoding"
    }
    return Response(content=r.content, status_code=r.status_code, headers=resp_headers)
