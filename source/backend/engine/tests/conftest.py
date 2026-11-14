from __future__ import annotations

import threading
from collections.abc import Iterator
from http.server import ThreadingHTTPServer

import pytest
from engine_helpers import settings
from fastapi.testclient import TestClient
from web_site import Handler, pages

from mzizi_engine.app import create_app
from mzizi_engine.capabilities import CapabilityRegistry, build_default_registry
from mzizi_engine.store import MemoryStore


@pytest.fixture
def make_client():
    clients = []

    def factory(registry: CapabilityRegistry | None = None, store=None, **kwargs):
        app = create_app(
            kwargs.pop("settings", None) or settings(),
            store=store or MemoryStore(),
            registry=registry or build_default_registry(),
            **kwargs,
        )
        client = TestClient(app)
        client.__enter__()
        clients.append(client)
        return client

    yield factory
    for client in clients:
        client.__exit__(None, None, None)


@pytest.fixture
def site() -> Iterator[str]:
    """A loopback website (see web_site.py) served for the duration of one test."""
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    Handler.site = pages(server.server_port)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{server.server_port}"
    server.shutdown()


@pytest.fixture(autouse=True)
def identity(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MZIZI_USER_AGENT", "MziziTest/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)")


@pytest.fixture(autouse=True)
def no_dev_browser_windows(monkeypatch: pytest.MonkeyPatch) -> None:
    """Tests never open the shared dev browser window."""
    monkeypatch.setenv("MZIZI_DEV_BROWSER", "headless")


@pytest.fixture(autouse=True)
def activity_store_off(monkeypatch: pytest.MonkeyPatch) -> None:
    """Tests write files; they never touch the developer's MongoDB."""
    monkeypatch.setenv("ENGINE_ACTIVITY_STORE", "files")
