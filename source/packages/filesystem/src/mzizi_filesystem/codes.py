"""Codes follow `.docs/rules/code-columns.md`: dot-separated lowercase segments, hierarchical by prefix, reproducible from names."""

from __future__ import annotations

import re

CODE_SHAPE = re.compile(r"^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$")
MAX_LENGTH, MAX_SEGMENTS = 255, 16


def code_segment(text: str) -> str:
    """Mirror of SQL `filesystem.code_segment`: lowercase, runs outside a-z0-9 become one underscore, outer underscores removed."""
    return re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")


def is_code(value: str) -> bool:
    return bool(CODE_SHAPE.match(value)) and len(value) <= MAX_LENGTH and value.count(".") + 1 <= MAX_SEGMENTS


def child_code(parent: str | None, name: str) -> str | None:
    """The code of a child named `name` under a coded parent; None when the parent has no code or the name yields no segment."""
    segment = code_segment(name)
    if parent is None or not segment:
        return None
    return f"{parent}.{segment}"
