"""Collection names. One collection per (purpose, embedding model), so vectors of different sizes never share one."""

from __future__ import annotations

CHUNKS = "chunks"
LABELS = "labels"
SEPARATOR = "__"
MAX_SLUG = 40


def slug(model: str) -> str:
    cleaned = "".join(c if c.isalnum() else "_" for c in model.lower()).strip("_")
    return cleaned[-MAX_SLUG:]


def collection_for(purpose: str, model: str) -> str:
    return f"{purpose}{SEPARATOR}{slug(model)}"
