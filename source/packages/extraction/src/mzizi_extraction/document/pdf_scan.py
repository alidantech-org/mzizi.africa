"""One PDF page read into words, tables, figures, drawn bullets and (when the text layer is unusable) OCR lines."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field, replace
from subprocess import TimeoutExpired

import pdfplumber
import pypdfium2 as pdfium

from mzizi_extraction.core import Code, Diagnostic, warning
from mzizi_extraction.document.columns import build_lines, find_gutter
from mzizi_extraction.document.figures import Box, find_bullets, find_figures
from mzizi_extraction.document.lines import Line, Word, cluster_rows
from mzizi_extraction.document.models import Span
from mzizi_extraction.document.ocr_tables import ocr_tables, outlined_text
from mzizi_extraction.document.pdf_table_selection import select_pdf_tables
from mzizi_extraction.document.profile import DocumentProfile, OcrMode
from mzizi_extraction.document.style import is_bold, is_italic
from mzizi_extraction.document.table_models import TableDecision
from mzizi_extraction.ocr import RENDER_SCALE, OcrUnavailable
from mzizi_extraction.ocr.tesseract import png_for_ocr, recognise_page
from mzizi_extraction.pdf.tables import clean_table

GARBLED_SHARE = 0.15
CID_WEIGHT = 5  # one unmapped glyph reference counts as this many bad characters


@dataclass
class PageScan:
    number: int
    width: float
    height: float
    words: list[Word] = field(default_factory=list)
    tables: list[tuple[tuple[tuple[str, ...], ...], Box]] = field(default_factory=list)
    table_review: list[TableDecision] = field(default_factory=list)
    figures: list[Box] = field(default_factory=list)
    figure_labels: list[str] = field(default_factory=list)
    bullets: list[Box] = field(default_factory=list)
    ocr_lines: list[Line] = field(default_factory=list)
    ocr_confidence: float | None = None
    ocr: bool = False


def _words(page: pdfplumber.page.Page) -> list[Word]:
    result: list[Word] = []
    for w in page.extract_words(extra_attrs=["fontname", "size"], keep_blank_chars=False):
        result.append(
            Word(
                text=w["text"],
                x0=w["x0"],
                x1=w["x1"],
                top=w["top"],
                bottom=w["bottom"],
                size=float(w["size"]),
                bold=is_bold(w["fontname"]),
                italic=is_italic(w["fontname"]),
            )
        )
    return result


def _garbled(words: list[Word]) -> bool:
    text = "".join(w.text for w in words)
    bad = text.count("�") + 5 * text.count("(cid:")
    return bool(text) and bad / len(text) > GARBLED_SHARE


def _ocr_page(
    scan: PageScan,
    plumber_page: pdfplumber.page.Page,
    pdf_page: pdfium.PdfPage,
    profile: DocumentProfile,
    diagnostics: list[Diagnostic],
) -> None:
    image = pdf_page.render(scale=RENDER_SCALE).to_pil()
    recognized = recognise_page(png_for_ocr(image), profile.languages)
    raw = recognized.lines
    if profile.tables and not profile.strict_table_lines:
        try:
            detected = ocr_tables(
                plumber_page,
                scan.number,
                profile.table_schema,
                image,
                profile.languages,
            )
            if detected.unread_regions:
                diagnostics.append(
                    warning(
                        Code.TABLE_REVIEW,
                        f"page {scan.number}: {len(detected.unread_regions)} ruled regions had too little OCR text",
                    )
                )
            for table in detected.tables:
                scan.tables.append((table.rows, Box(*table.bbox)))
                scan.table_review.append(table.review)
        except Exception as problem:
            diagnostics.append(
                warning(
                    Code.TABLE_EXTRACTION_FAILED,
                    f"page {scan.number}: OCR grid detection failed: {str(problem)[:150]}",
                )
            )
    scan.ocr = True
    lines = [
        Line(
            spans=(Span(text=item.text),),
            x0=item.x0 / RENDER_SCALE,
            x1=item.x1 / RENDER_SCALE,
            top=item.top / RENDER_SCALE,
            bottom=item.bottom / RENDER_SCALE,
            size=(item.bottom - item.top) / RENDER_SCALE,
            group=item.block,
        )
        for item in raw
        if item.text.strip()
        and not any(
            box.contains_center((item.x0 + item.x1) / RENDER_SCALE / 2, (item.top + item.bottom) / RENDER_SCALE / 2)
            for _, box in scan.tables
        )
    ]
    scan.ocr_lines = lines
    scan.ocr_confidence = round(sum(i.confidence for i in raw) / len(raw), 3) if raw else None


def scan_page(
    index: int,
    plumber_page: pdfplumber.page.Page,
    pdf: pdfium.PdfDocument,
    profile: DocumentProfile,
    diagnostics: list[Diagnostic],
    ocr_ready: Callable[[], bool],
    *,
    page_offset: int = 0,
) -> PageScan:
    scan = PageScan(page_offset + index + 1, float(plumber_page.width), float(plumber_page.height))
    words = _words(plumber_page)
    chars = sum(len(w.text) for w in words)
    garbled = _garbled(words)
    outlined = outlined_text(plumber_page, chars)
    wants_ocr = profile.ocr is OcrMode.FORCE or (
        profile.ocr is OcrMode.AUTO and (chars < profile.limits.min_text_chars or garbled or outlined)
    )
    if profile.ocr is OcrMode.OFF and ((chars < profile.limits.min_text_chars and plumber_page.images) or outlined):
        diagnostics.append(warning(Code.OCR_REQUIRED, f"page {scan.number} has images and no text layer; OCR is off"))
    if garbled:
        diagnostics.append(warning(Code.GARBLED_TEXT, f"page {scan.number}: text layer is unreadable (encoding)"))
    if outlined:
        diagnostics.append(
            warning(
                Code.OCR_AUTO if wants_ocr else Code.OCR_REQUIRED,
                f"page {scan.number}: lettering drawn as vector outlines",
            )
        )
    if wants_ocr:
        if profile.compare_tables:
            diagnostics.append(
                warning(
                    Code.TABLE_TEXT_LAYER_REQUIRED,
                    f"page {scan.number}: OCR grid cells require review; native-text strategy comparison is unavailable",
                )
            )
        if not ocr_ready():
            diagnostics.append(
                warning(Code.OCR_REQUIRED, f"page {scan.number}: needs OCR but the engine is unavailable")
            )
            scan.words = words if not garbled else []
            return scan
        pdf_page = pdf[index]
        try:
            _ocr_page(scan, plumber_page, pdf_page, profile, diagnostics)
        except (OcrUnavailable, OSError, TimeoutExpired) as problem:
            diagnostics.append(warning(Code.OCR_FAILED, f"page {scan.number}: {str(problem)[:150]}"))
            scan.words = words if not garbled else []
        finally:
            pdf_page.close()
        return scan
    if profile.compare_tables:
        for selection in select_pdf_tables(plumber_page, words, profile.table_schema, scan.number, diagnostics):
            candidate = selection.candidate
            scan.tables.append((candidate.rows, Box(*candidate.box)))
            scan.table_review.append(selection.decision)
    elif profile.tables:
        try:
            settings = (
                {"vertical_strategy": "lines_strict", "horizontal_strategy": "lines_strict"}
                if profile.strict_table_lines
                else None
            )
            for table in plumber_page.find_tables(settings):
                rows = clean_table(table.extract())
                if len(rows) >= 2 and max(len(r) for r in rows) >= 2:
                    x0, top, x1, bottom = table.bbox
                    scan.tables.append((tuple(tuple(r) for r in rows), Box(x0, top, x1, bottom)))
        except Exception as problem:  # best effort; text is read regardless
            diagnostics.append(warning(Code.TABLE_EXTRACTION_FAILED, f"page {scan.number}: {str(problem)[:150]}"))
    scan.bullets = find_bullets(plumber_page)
    if profile.figures:
        scan.figures = find_figures(plumber_page, [box for _, box in scan.tables])
    kept: list[Word] = []
    regions = [b for _, b in scan.tables]
    for word in words:
        cx, cy = word.center
        if any(r.contains_center(cx, cy) for r in regions):
            continue
        inside = next((i for i, f in enumerate(scan.figures) if f.contains_center(cx, cy)), None)
        if inside is None:
            kept.append(word)
        else:
            scan.figure_labels.append(f"{inside}:{word.text}")
    scan.words = kept
    return scan


def page_lines(scan: PageScan) -> tuple[list[tuple[Line, int]], bool]:
    if scan.ocr:
        return [(line, -1) for line in scan.ocr_lines], False
    rows = cluster_rows(scan.words)
    gutter = find_gutter(rows, scan.width)
    lines = build_lines(scan.words, gutter)
    return [(_with_bullet(line, scan.bullets), column) for line, column in lines], gutter is not None


BULLET_REACH = 25.0


def _with_bullet(line: Line, bullets: list[Box]) -> Line:
    """A drawn bullet just left of a line becomes a typed one, so the line is recognised as a list item."""
    for mark in bullets:
        centre = (mark.top + mark.bottom) / 2
        if line.top - 1 <= centre <= line.bottom + 1 and 0 <= line.x0 - mark.x1 <= BULLET_REACH:
            return replace(line, spans=(Span(text="• "), *line.spans), x0=mark.x0)
    return line
