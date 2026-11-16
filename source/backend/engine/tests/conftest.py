from __future__ import annotations

import pytest
from engine_helpers import settings
from fastapi.testclient import TestClient

from mzizi_engine.runtime.assembly.default_operations import build_default_registry
from mzizi_engine.runtime.executor.memory_store import MemoryStore
from mzizi_engine.runtime.http.app import create_app
from mzizi_engine.runtime.operations import OperationRegistry


@pytest.fixture
def make_client():
    clients = []

    def factory(registry: OperationRegistry | None = None, store=None, **kwargs):
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


@pytest.fixture(autouse=True)
def identity(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MZIZI_USER_AGENT", "MziziTest/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)")


@pytest.fixture(autouse=True)
def activity_store_off(monkeypatch: pytest.MonkeyPatch) -> None:
    """Tests write files; they never touch a MongoDB."""
    monkeypatch.setenv("ENGINE_ACTIVITY_STORE", "files")
