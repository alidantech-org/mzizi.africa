"""Read OCR words into ruled cells when a PDF draws table borders as narrow filled rectangles."""

from __future__ import annotations

import io
from collections.abc import Callable
from dataclasses import dataclass
from typing import Literal, TypedDict

import pdfplumber.page
from pdfplumber.table import Table
from PIL import Image, ImageChops, ImageDraw

from mzizi_extraction.document.lines import Word, cluster_rows
from mzizi_extraction.document.table_models import (
    BBox,
    ReviewReason,
    TableCandidateReport,
    TableDecision,
    TableRows,
    TableSchema,
    TableStrategy,
)
from mzizi_extraction.document.table_quality import geometry, layout_score, table_metrics
from mzizi_extraction.ocr import RENDER_SCALE
from mzizi_extraction.ocr.tesseract import recognise_page

MAX_RULE_THICKNESS = 1.5
MIN_RULE_LENGTH = 8.0
MIN_GRID_ROWS = 3
MIN_GRID_COLUMNS = 2
MIN_CELL_TEXT_SHARE = 0.6
MIN_OUTLINE_CURVES = 200
MAX_NATIVE_CHARS = 1000
OUTLINES_PER_NATIVE_CHAR = 3
DARK_TEXT_CEILING = 128
ERASE_RULE_PIXELS = 6


class _Edge(TypedDict):
    x0: float
    x1: float
    top: float
    bottom: float
    width: float
    height: float
    orientation: Literal["h", "v"]
    object_type: str


@dataclass(frozen=True)
class OcrTable:
    rows: TableRows
    bbox: BBox
    review: TableDecision


@dataclass(frozen=True)
class OcrTableScan:
    tables: tuple[OcrTable, ...]
    unread_regions: tuple[BBox, ...]


def outlined_text(page: pdfplumber.page.Page, native_chars: int) -> bool:
    return native_chars < MAX_NATIVE_CHARS and len(page.curves) > max(
        MIN_OUTLINE_CURVES,
        native_chars * OUTLINES_PER_NATIVE_CHAR,
    )


def _grids(page: pdfplumber.page.Page) -> list[Table]:
    edges: list[_Edge] = []
    for rectangle in page.rects:
        width, height = float(rectangle["width"]), float(rectangle["height"])
        if min(width, height) > MAX_RULE_THICKNESS or max(width, height) < MIN_RULE_LENGTH:
            continue
        horizontal = width > height
        left, right = float(rectangle["x0"]), float(rectangle["x1"])
        top, bottom = float(rectangle["top"]), float(rectangle["bottom"])
        if horizontal:
            top = bottom = (top + bottom) / 2
        else:
            left = right = (left + right) / 2
        edges.append(
            _Edge(
                x0=left,
                x1=right,
                top=top,
                bottom=bottom,
                width=right - left,
                height=bottom - top,
                orientation="h" if horizontal else "v",
                object_type="line",
            )
        )
    vertical = [edge for edge in edges if edge["orientation"] == "v"]
    horizontal_edges = [edge for edge in edges if edge["orientation"] == "h"]
    if len(vertical) < MIN_GRID_COLUMNS + 1 or len(horizontal_edges) < MIN_GRID_ROWS + 1:
        return []
    return page.find_tables(
        {
            "vertical_strategy": "explicit",
            "horizontal_strategy": "explicit",
            "explicit_vertical_lines": vertical,
            "explicit_horizontal_lines": horizontal_edges,
        }
    )


def _cell(box: BBox | None, words: list[Word]) -> str:
    if box is None:
        return ""
    selected = [word for word in words if box[0] <= word.center[0] < box[2] and box[1] <= word.center[1] < box[3]]
    return " ".join(
        " ".join(word.text for word in sorted(row, key=lambda word: word.x0)) for row in cluster_rows(selected)
    )


def _recognise_grid(grid: Table, image: Image.Image, languages: str) -> list[Word]:
    left, top, _, _ = grid.bbox
    pixel_box = (
        round(grid.bbox[0] * RENDER_SCALE),
        round(grid.bbox[1] * RENDER_SCALE),
        round(grid.bbox[2] * RENDER_SCALE),
        round(grid.bbox[3] * RENDER_SCALE),
    )
    crop = image.crop(pixel_box).convert("RGB")
    red, green, blue = crop.split()
    # Colored cell backgrounds become light while near-black lettering stays dark.
    mask = ImageChops.lighter(ImageChops.lighter(red, green), blue).point(
        lambda value: 0 if value < DARK_TEXT_CEILING else 255
    )
    draw = ImageDraw.Draw(mask)
    for cell in grid.cells:
        rectangle = tuple(
            round((value - offset) * RENDER_SCALE) for value, offset in zip(cell, (left, top, left, top), strict=True)
        )
        draw.rectangle(rectangle, outline=255, width=ERASE_RULE_PIXELS)
    buffer = io.BytesIO()
    mask.save(buffer, format="PNG")
    result = recognise_page(buffer.getvalue(), languages, segmentation="6")
    return [
        Word(
            text=word.text,
            x0=left + word.x0 / RENDER_SCALE,
            x1=left + word.x1 / RENDER_SCALE,
            top=top + word.top / RENDER_SCALE,
            bottom=top + word.bottom / RENDER_SCALE,
            size=(word.bottom - word.top) / RENDER_SCALE,
        )
        for word in result.words
    ]


def ocr_tables(
    page: pdfplumber.page.Page,
    number: int,
    schema: TableSchema | None,
    render: Callable[[], Image.Image],
    languages: str,
) -> OcrTableScan:
    result: list[OcrTable] = []
    unread: list[BBox] = []
    image: Image.Image | None = None
    for grid in _grids(page):
        if len(grid.rows) < MIN_GRID_ROWS or len(grid.columns) < MIN_GRID_COLUMNS:
            continue
        if image is None:
            image = render()
        words = _recognise_grid(grid, image, languages)
        rows = tuple(tuple(_cell(box, words) for box in row.cells) for row in grid.rows)
        if sum(bool(cell) for row in rows for cell in row) / sum(map(len, rows)) < MIN_CELL_TEXT_SHARE:
            unread.append(grid.bbox)
            continue
        box: BBox = grid.bbox
        cells = tuple(tuple(cell for cell in row.cells if cell is not None) for row in grid.rows)
        coverage, split, duplicate = geometry(box, cells, words)
        metrics = table_metrics(rows, coverage, split, duplicate, schema)
        score = layout_score(metrics, len(rows[0]), len(rows) - 1, False)
        candidate = TableCandidateReport(
            strategy=TableStrategy.OCR_GRID,
            bbox=box,
            row_count=len(rows),
            column_count=len(rows[0]),
            score=score,
            metrics=metrics,
            rows=rows,
        )
        reasons: tuple[ReviewReason, ...] = (ReviewReason.OCR_TEXT,)
        if metrics.schema_headers_match is False:
            reasons += (ReviewReason.SCHEMA,)
        result.append(
            OcrTable(
                rows,
                box,
                TableDecision(
                    page=number,
                    table=len(result) + 1,
                    selected=TableStrategy.OCR_GRID,
                    review_required=True,
                    reasons=reasons,
                    candidates=(candidate,),
                ),
            )
        )
    return OcrTableScan(tuple(result), tuple(unread))
