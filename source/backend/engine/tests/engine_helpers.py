"""Importable helpers for the engine tests (conftest.py holds only fixtures)."""

from __future__ import annotations

import time

from mzizi_engine.config import Settings


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
