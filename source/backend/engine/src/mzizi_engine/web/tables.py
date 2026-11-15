"""Save reconstructed HTML tables beside their Markdown evidence."""

from __future__ import annotations

from pathlib import Path

from pydantic import TypeAdapter

from mzizi_extraction.document.models import DocumentOutput, TableBlock

TABLES = TypeAdapter(tuple[TableBlock, ...])


def save_tables(document: DocumentOutput, path: Path) -> bool:
    tables = tuple(block for page in document.pages for block in page.blocks if isinstance(block, TableBlock))
    if tables:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(TABLES.dump_json(tables, indent=2) + b"\n")
    return bool(tables)
