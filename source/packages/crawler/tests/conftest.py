"""Fixtures for these tests: a loopback website and safe environment defaults."""

from __future__ import annotations

import threading
from collections.abc import Iterator
from http.server import ThreadingHTTPServer

import pytest
from web_site import Handler, pages

from mzizi_crawler import configure_user_agent


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
    identity = "MziziTest/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)"
    configure_user_agent(identity)
    monkeypatch.setenv("MZIZI_USER_AGENT", identity)


@pytest.fixture(autouse=True)
def no_dev_browser_windows(monkeypatch: pytest.MonkeyPatch) -> None:
    """Tests never open the shared dev browser window."""
    monkeypatch.setenv("MZIZI_DEV_BROWSER", "headless")


@pytest.fixture(autouse=True)
def activity_store_off(monkeypatch: pytest.MonkeyPatch) -> None:
    """Tests write files; they never touch a MongoDB."""
    monkeypatch.setenv("ENGINE_ACTIVITY_STORE", "files")
