from __future__ import annotations

import pytest
from engine_helpers import settings
from fastapi.testclient import TestClient

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
