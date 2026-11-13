"""Layered PDF backend: pdfplumber words and tables, pdfium renders, Tesseract for pages without usable text.

Structure is inferred from typography (size, weight, position), not from the PDF's tags, so it works on untagged
files. The result is a typed `DocumentOutput`; Markdown, CSV and the wire form are produced from it elsewhere.
"""

from __future__ import annotations

import io
from dataclasses import dataclass, replace

import pdfplumber
import pypdfium2 as pdfium

from mzizi_extraction.core import Code, Diagnostic, Status, error, failed, info
from mzizi_extraction.document.captions import attach_captions
from mzizi_extraction.document.columns import reading_order
from mzizi_extraction.document.figures import Box, crop_png, render_image, render_page_png
from mzizi_extraction.document.furniture import find_furniture, is_furniture
from mzizi_extraction.document.lines import Line
from mzizi_extraction.document.models import Asset, BBox, Block, DocumentOutput, FigureBlock, Page, TableBlock
from mzizi_extraction.document.pdf_scan import PageScan, page_lines, scan_page
from mzizi_extraction.document.profile import DocumentProfile, OcrMode
from mzizi_extraction.document.structure import Typography, build_blocks, line_height_typography, typography
from mzizi_extraction.ocr import OcrUnavailable, check

PDF_MAGIC = b"%PDF"
PAGE_RENDER_SCALE = 1.5
ALT_TEXT_CHARS = 160
WIDE_SHARE = 0.6
FULL_WIDTH = -1


@dataclass(frozen=True)
class _TableItem:
    index: int
    rows: tuple[tuple[str, ...], ...]
    box: Box


@dataclass(frozen=True)
class _FigureItem:
    index: int
    box: Box


type _Item = Line | _TableItem | _FigureItem


def _bbox(box: Box) -> BBox:
    return (round(box.x0, 1), round(box.top, 1), round(box.x1, 1), round(box.bottom, 1))


def _column_of(box: Box, scan: PageScan, single_column: bool) -> int:
    if single_column or box.width > WIDE_SHARE * scan.width:
        return FULL_WIDTH
    return 0 if (box.x0 + box.x1) / 2 < scan.width / 2 else 1


def _build_page(
    scan: PageScan,
    lines: list[tuple[Line, int]],
    typ: Typography,
    profile: DocumentProfile,
    repeated: set[str],
    assets: list[Asset],
    pdf_page: pdfium.PdfPage,
) -> Page:
    items: list[tuple[float, float, int, _Item]] = []
    for line, column in lines:
        if not is_furniture(line, scan, repeated):
            items.append((line.top, line.bottom, column, line))
    single_column = all(column == FULL_WIDTH for _, column in lines)
    for index, (rows, box) in enumerate(scan.tables, start=1):
        items.append((box.top, box.bottom, _column_of(box, scan, single_column), _TableItem(index, rows, box)))
    figure_image = render_image(pdf_page) if scan.figures else None
    for index, box in enumerate(scan.figures, start=1):
        items.append((box.top, box.bottom, _column_of(box, scan, single_column), _FigureItem(index, box)))
    blocks: list[Block] = []
    buffer: list[Line] = []
    last_group = -1

    def flush() -> None:
        if buffer:
            blocks.extend(build_blocks(list(buffer), typ, scan.number))
            buffer.clear()

    for group, payload in reading_order(items):
        if isinstance(payload, Line):
            if group != last_group:
                flush()
            buffer.append(replace(payload, group=group))
            last_group = group
            continue
        flush()
        last_group = -1
        if isinstance(payload, _TableItem):
            blocks.append(
                TableBlock(
                    index=payload.index, rows=payload.rows, header_rows=1, page=scan.number, bbox=_bbox(payload.box)
                )
            )
        elif figure_image is not None:
            name = f"assets/page-{scan.number}-figure-{payload.index}.png"
            assets.append(Asset(name=name, media_type="image/png", data=crop_png(figure_image, payload.box)))
            labels = " ".join(t.split(":", 1)[1] for t in scan.figure_labels if t.startswith(f"{payload.index - 1}:"))
            blocks.append(
                FigureBlock(
                    asset=name,
                    figure_kind="image" if payload.box.has_image else "diagram",
                    alt=labels[:ALT_TEXT_CHARS],
                    page=scan.number,
                    bbox=_bbox(payload.box),
                )
            )
    flush()
    return Page(
        number=scan.number,
        width=round(scan.width, 1),
        height=round(scan.height, 1),
        blocks=tuple(attach_captions(blocks, typ, profile.caption_labels)),
        ocr=scan.ocr,
        ocr_confidence=scan.ocr_confidence,
    )


def extract_pdf_document(data: bytes, profile: DocumentProfile | None = None) -> DocumentOutput:
    profile = profile or DocumentProfile()
    limits = profile.limits
    if len(data) > limits.max_bytes:
        return _failed(error(Code.TOO_LARGE, f"{len(data)} bytes exceeds the {limits.max_bytes} byte limit"))
    if not data.startswith(PDF_MAGIC):
        return _failed(error(Code.NOT_PDF, "the file does not start with %PDF"))
    try:
        pdf = pdfium.PdfDocument(data)
        plumber = pdfplumber.open(io.BytesIO(data))
    except Exception as problem:
        return _failed(error(Code.UNREADABLE_PDF, f"{str(problem)[:200]} (encrypted or damaged files are not opened)"))
    with plumber:
        total = len(pdf)
        diagnostics: list[Diagnostic] = [info(Code.PAGES, f"{total} pages")]
        if total > limits.max_pages:
            diagnostics.append(error(Code.TOO_MANY_PAGES, f"{total} pages exceeds the limit of {limits.max_pages}"))
            return DocumentOutput(status=Status.FAILED, diagnostics=tuple(diagnostics))
        ocr_ready = _ocr_ready(profile, diagnostics)
        scans = [scan_page(i, plumber.pages[i], pdf[i], profile, diagnostics, ocr_ready) for i in range(total)]
        return _assemble(scans, pdf, profile, diagnostics)


def _ocr_ready(profile: DocumentProfile, diagnostics: list[Diagnostic]) -> bool:
    if profile.ocr is OcrMode.OFF:
        return False
    try:
        check(profile.languages)
    except OcrUnavailable as problem:
        diagnostics.append(error(Code.OCR_ENGINE_UNAVAILABLE, str(problem)))
        return False
    return True


def _assemble(
    scans: list[PageScan], pdf: pdfium.PdfDocument, profile: DocumentProfile, diagnostics: list[Diagnostic]
) -> DocumentOutput:
    sizes = [(w.size, len(w.text)) for s in scans if not s.ocr for w in s.words]
    typ = typography(sizes)
    lines = {s.number: page_lines(s) for s in scans}
    repeated = find_furniture(scans, {n: v[0] for n, v in lines.items()})
    assets: list[Asset] = []
    pages: list[Page] = []
    for scan in scans:
        page_typ = line_height_typography([line for line, _ in lines[scan.number][0]]) if scan.ocr else typ
        pages.append(
            _build_page(scan, lines[scan.number][0], page_typ, profile, repeated, assets, pdf[scan.number - 1])
        )
        if profile.page_renders:
            png = render_page_png(pdf[scan.number - 1], PAGE_RENDER_SCALE)
            assets.append(Asset(name=f"pages/page-{scan.number}.png", media_type="image/png", data=png))
    ocr_pages = [s.number for s in scans if s.ocr]
    if ocr_pages:
        diagnostics.append(info(Code.OCR, f"OCR ran on {len(ocr_pages)} pages: {_compact(ocr_pages)}"))
    if repeated:
        diagnostics.append(info(Code.PAGE_FURNITURE, f"{len(repeated)} repeating header/footer lines left out"))
    column_pages = [s.number for s in scans if lines[s.number][1]]
    if column_pages:
        diagnostics.append(info(Code.COLUMNS, f"two-column reading order on pages {_compact(column_pages)}"))
    counts = _counts(pages)
    diagnostics.append(info(Code.STRUCTURE, ", ".join(f"{n} {k}" for k, n in counts.items())))
    figures = counts.get("figure", 0)
    diagnostics.append(info(Code.FIGURES, f"{figures} figures and diagrams saved as images"))
    empty = counts == {}
    unread = any(d.code in (Code.OCR_REQUIRED, Code.OCR_FAILED) for d in diagnostics)
    status = Status.FAILED if empty else Status.PARTIAL if unread else Status.SUCCEEDED
    return DocumentOutput(status=status, pages=tuple(pages), assets=tuple(assets), diagnostics=tuple(diagnostics))


def _counts(pages: list[Page]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for page in pages:
        for block in page.blocks:
            counts[block.kind] = counts.get(block.kind, 0) + 1
    return counts


def _compact(numbers: list[int]) -> str:
    return ", ".join(map(str, numbers[:12])) + (" …" if len(numbers) > 12 else "")


def _failed(problem: Diagnostic) -> DocumentOutput:
    result = failed(problem)
    return DocumentOutput(status=result.status, diagnostics=result.diagnostics)
