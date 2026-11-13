"""Writing a structured-document result to its run folder: Markdown, figures, tables, structure and a summary."""

from __future__ import annotations

import base64
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from mzizi_extraction import DocumentWire

PREVIEW_LINES = 28


class DiagnosticLine(BaseModel):
    model_config = ConfigDict(frozen=True)

    level: str
    code: str
    message: str


class DocumentSummary(BaseModel):
    model_config = ConfigDict(frozen=True)

    status: str
    pages: int
    counts: dict[str, int]
    files: tuple[str, ...]
    diagnostics: tuple[DiagnosticLine, ...]
    preview: str


def write_document_artifacts(folder: Path, result: object) -> DocumentSummary:
    wire = DocumentWire.model_validate(result, strict=False)
    files: list[str] = []

    def put(relative: str, data: bytes) -> None:
        target = folder / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        files.append(relative)

    put("document.md", wire.markdown.encode("utf-8"))
    put("structure.json", wire.structure.encode("utf-8"))
    for asset in wire.assets:
        put(asset.path, base64.b64decode(asset.content_base64))
    for table in wire.tables:
        put(table.path, table.csv.encode("utf-8"))
    return DocumentSummary(
        status=wire.status,
        pages=wire.pages,
        counts=wire.counts,
        files=tuple(files),
        diagnostics=tuple(DiagnosticLine(level=d.level, code=d.code, message=d.message) for d in wire.diagnostics),
        preview="\n".join(wire.markdown.splitlines()[:PREVIEW_LINES]),
    )
