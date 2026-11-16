"""Decide whether a saved Markdown derivative contains extracted page content."""

from __future__ import annotations

from pathlib import Path


def needs_markdown_repair(path: Path, source_sha: str) -> bool:
    if not path.is_file():
        return True
    text = path.read_text(encoding="utf-8")
    if f"html_sha256: {source_sha}" not in text[:800]:
        return True
    _, boundary, body = text.partition("\n---\n")
    if not boundary:
        return True
    return not body.replace("<!-- page 1 -->", "").strip()
