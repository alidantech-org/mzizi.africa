"""Wire form of a structured document: Markdown, files as base64, tables as CSV, structure as JSON text."""

from __future__ import annotations

import base64

from mzizi_extraction.core import Frozen
from mzizi_extraction.document.markdown import render_markdown, table_csv
from mzizi_extraction.document.models import DocumentOutput, TableBlock
from mzizi_extraction.encode.wire import WireDiagnostic, _diagnostic


class WireAsset(Frozen):
    path: str
    media_type: str
    size: int
    content_base64: str


class WireTable(Frozen):
    path: str
    page: int
    rows: int
    csv: str


class DocumentWire(Frozen):
    status: str
    markdown: str
    pages: int
    counts: dict[str, int]
    assets: tuple[WireAsset, ...]
    tables: tuple[WireTable, ...]
    structure: str
    diagnostics: tuple[WireDiagnostic, ...]


def encode_document(output: DocumentOutput) -> DocumentWire:
    counts: dict[str, int] = {}
    tables: list[WireTable] = []
    for page in output.pages:
        for block in page.blocks:
            counts[block.kind] = counts.get(block.kind, 0) + 1
            if isinstance(block, TableBlock):
                path = f"tables/page-{page.number}-table-{block.index}.csv"
                tables.append(WireTable(path=path, page=page.number, rows=len(block.rows), csv=table_csv(block)))
    structure = "[" + ",".join(p.model_dump_json(exclude_none=True) for p in output.pages) + "]"
    return DocumentWire(
        status=output.status.value,
        markdown=render_markdown(output.pages),
        pages=len(output.pages),
        counts=counts,
        assets=tuple(
            WireAsset(
                path=a.name,
                media_type=a.media_type,
                size=len(a.data),
                content_base64=base64.b64encode(a.data).decode("ascii"),
            )
            for a in output.assets
        ),
        tables=tuple(tables),
        structure=structure,
        diagnostics=tuple(_diagnostic(d) for d in output.diagnostics),
    )
