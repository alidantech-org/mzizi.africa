"""Wire form of a structured document: Markdown, files as base64, tables as CSV, structure as JSON text."""

from __future__ import annotations

import base64
import csv
import io

from mzizi_extraction.core import Frozen
from mzizi_extraction.document.markdown import render_markdown, table_csv, table_path
from mzizi_extraction.document.models import DocumentOutput, TableBlock
from mzizi_extraction.document.table_models import TableReviewReport
from mzizi_extraction.document.table_stitch import stitch_tables
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
    table_review: TableReviewReport | None = None


def encode_document(output: DocumentOutput) -> DocumentWire:
    counts: dict[str, int] = {}
    tables: list[WireTable] = []
    alternates = _alternates(output)
    for page in output.pages:
        for block in page.blocks:
            counts[block.kind] = counts.get(block.kind, 0) + 1
            if isinstance(block, TableBlock):
                path = f"tables/page-{page.number}-table-{block.index}.csv"
                tables.append(WireTable(path=path, page=page.number, rows=len(block.rows), csv=table_csv(block)))
    for (page_number, index), variants in alternates.items():
        for path, rows in variants:
            tables.append(WireTable(path=path, page=page_number, rows=len(rows), csv=_csv(rows)))
    for logical in stitch_tables(output.pages):
        tables.append(
            WireTable(
                path=f"tables/merged-{logical.index}-pages-{logical.pages[0]}-{logical.pages[-1]}.csv",
                page=logical.pages[0],
                rows=len(logical.rows),
                csv=_csv(logical.rows),
            )
        )
    structure = "[" + ",".join(p.model_dump_json(exclude_none=True) for p in output.pages) + "]"
    return DocumentWire(
        status=output.status.value,
        markdown=render_markdown(
            output.pages, {key: tuple(path for path, _ in value) for key, value in alternates.items()}
        ),
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
        table_review=output.table_review,
    )


def _csv(rows: tuple[tuple[str, ...], ...]) -> str:
    buffer = io.StringIO()
    csv.writer(buffer, lineterminator="\n").writerows(rows)
    return buffer.getvalue()


def _alternates(output: DocumentOutput) -> dict[tuple[int, int], list[tuple[str, tuple[tuple[str, ...], ...]]]]:
    """Other readings of tables that need review: every competing detector's rows, saved beside the chosen table."""
    found: dict[tuple[int, int], list[tuple[str, tuple[tuple[str, ...], ...]]]] = {}
    if output.table_review is None:
        return found
    for decision in output.table_review.tables:
        if not decision.review_required:
            continue
        for number, candidate in enumerate(c for c in decision.candidates if c.rows is not None):
            if candidate.strategy is decision.selected and number == 0:
                continue  # the chosen reading is already the main CSV
            assert candidate.rows is not None
            path = table_path(decision.page, decision.table, f".alt-{candidate.strategy.value}")
            found.setdefault((decision.page, decision.table), []).append((path, candidate.rows))
    return found
