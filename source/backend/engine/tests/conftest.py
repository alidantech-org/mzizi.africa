from __future__ import annotations

import time

import pytest
from fastapi.testclient import TestClient

from mzizi_engine.app import create_app
from mzizi_engine.capabilities import CapabilityRegistry, build_default_registry
from mzizi_engine.config import Settings
from mzizi_engine.store import MemoryStore


def settings(**overrides) -> Settings:
    base = dict(auth="off", store="memory", retry_base_seconds=0.01, process_workers=1)
    base.update(overrides)
    return Settings(**base)


def wait_for(predicate, timeout=10.0, interval=0.02):
    deadline = time.time() + timeout
    while time.time() < deadline:
        value = predicate()
        if value:
            return value
        time.sleep(interval)
    raise AssertionError("condition not met in time")


@pytest.fixture
def make_client():
    clients = []

    def factory(registry: CapabilityRegistry | None = None, store=None, **kwargs):
        app = create_app(kwargs.pop("settings", None) or settings(), store=store or MemoryStore(), registry=registry or build_default_registry(), **kwargs)
        client = TestClient(app)
        client.__enter__()
        clients.append(client)
        return client

    yield factory
    for client in clients:
        client.__exit__(None, None, None)
