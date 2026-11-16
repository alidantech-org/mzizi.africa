"""The parsing boundary of the media catalog: a JSON reference file becomes an extension-to-type mapping."""

from __future__ import annotations

import json
from pathlib import Path

from pydantic import BaseModel, ConfigDict


class _Values(BaseModel):
    model_config = ConfigDict(extra="ignore")

    extension: str
    mimeType: str


class _Row(BaseModel):
    model_config = ConfigDict(extra="ignore")

    values: _Values


class _File(BaseModel):
    model_config = ConfigDict(extra="ignore")

    rows: tuple[_Row, ...]


def load_media_formats(path: Path) -> dict[str, str]:
    """Extension to media type from a reference file shaped `{"rows": [{"values": {"extension", "mimeType"}}]}`."""
    parsed = _File.model_validate(json.loads(path.read_text(encoding="utf-8")))
    mapping: dict[str, str] = {}
    for row in parsed.rows:
        mapping.setdefault(row.values.extension.lstrip(".").lower(), row.values.mimeType)
    return mapping
