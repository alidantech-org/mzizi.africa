"""Parsing boundary: a raw manifest policy block becomes a typed FetchPolicy."""

from __future__ import annotations

from pydantic import TypeAdapter

from ..policy import FetchPolicy

_ADAPTER: TypeAdapter[FetchPolicy] = TypeAdapter(FetchPolicy)


def parse_policy(raw: object) -> FetchPolicy:
    return _ADAPTER.validate_python(raw)
