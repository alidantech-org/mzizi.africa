"""Layered PDF backend: pdfplumber words and tables, pdfium renders, Tesseract for pages without usable text.

Structure is inferred from typography (size, weight, position), not from the PDF's tags, so it works on untagged
files. The result is a typed `DocumentOutput`; Markdown, CSV and the wire form are produced from it elsewhere.
"""

from __future__ import annotations

import io
from dataclasses import dataclass, field, replace

import pdfplumber
import pypdfium2 as pdfium

from mzizi_extraction.core import (
    Code,
    Diagnostic,
    Status,
    error,
    failed,
    info,
    warning,
)
from mzizi_extraction.document.columns import build_lines, find_gutter, reading_order
from mzizi_extraction.document.figures import Box, crop_png, find_bullets, find_figures, render_image, render_page_png
from mzizi_extraction.document.lines import Line, Word, cluster_rows
from mzizi_extraction.document.models import (
    Asset,
    Block,
    DocumentOutput,
    FigureBlock,
    Page,
    Paragraph,
    Span,
    TableBlock,
)
from mzizi_extraction.document.profile import DocumentProfile, OcrMode
from mzizi_extraction.document.structure import Typography, build_blocks, line_height_typography, typography
from mzizi_extraction.document.style import is_bold, is_italic
from mzizi_extraction.ocr import RENDER_SCALE, OcrLine, OcrUnavailable, check, recognise_lines, render_png
from mzizi_extraction.pdf.tables import clean_table
from mzizi_extraction.text.patterns import starts_with_label

PDF_MAGIC = b"%PDF"
FURNITURE_ZONE = 0.08
MIN_FURNITURE_PAGES = 3
FURNITURE_SHARE = 0.4
GARBLED_SHARE = 0.15
CAPTION_MAX_CHARS = 250
PAGE_RENDER_SCALE = 1.5
ALT_TEXT_CHARS = 160
WIDE_SHARE = 0.6


@dataclass
class _Scan:
    number: int
    width: float
    height: float
    words: list[Word] = field(default_factory=list)
    tables: list[tuple[tuple[tuple[str, ...], ...], Box]] = field(default_factory=list)
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


def _ocr_page(scan: _Scan, pdf_page: pdfium.PdfPage, profile: DocumentProfile) -> None:
    raw: list[OcrLine] = recognise_lines(render_png(pdf_page), profile.languages)
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
    ]
    scan.ocr_lines = lines
    scan.ocr_confidence = round(sum(i.confidence for i in raw) / len(raw), 3) if raw else None


def _scan_page(
    index: int,
    plumber_page: pdfplumber.page.Page,
    pdf_page: pdfium.PdfPage,
    profile: DocumentProfile,
    diagnostics: list[Diagnostic],
    ocr_ready: bool,
) -> _Scan:
    scan = _Scan(index + 1, float(plumber_page.width), float(plumber_page.height))
    words = _words(plumber_page)
    chars = sum(len(w.text) for w in words)
    garbled = _garbled(words)
    wants_ocr = profile.ocr is OcrMode.FORCE or (
        profile.ocr is OcrMode.AUTO and (chars < profile.limits.min_text_chars or garbled)
    )
    if profile.ocr is OcrMode.OFF and chars < profile.limits.min_text_chars and plumber_page.images:
        diagnostics.append(warning(Code.OCR_REQUIRED, f"page {scan.number} has images and no text layer; OCR is off"))
    if garbled:
        diagnostics.append(warning(Code.GARBLED_TEXT, f"page {scan.number}: text layer is unreadable (encoding)"))
    if wants_ocr:
        if not ocr_ready:
            diagnostics.append(
                warning(Code.OCR_REQUIRED, f"page {scan.number}: needs OCR but the engine is unavailable")
            )
            scan.words = words if not garbled else []
            return scan
        try:
            _ocr_page(scan, pdf_page, profile)
        except (OcrUnavailable, OSError) as problem:
            diagnostics.append(warning(Code.OCR_FAILED, f"page {scan.number}: {str(problem)[:150]}"))
        return scan
    if profile.tables:
        try:
            for table in plumber_page.find_tables():
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


def _page_lines(scan: _Scan) -> tuple[list[tuple[Line, int]], bool]:
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


ROMAN_DIGITS = frozenset("ivxlcdm")
MAX_ROMAN_CHARS = 7


def _normalised(text: str) -> str:
    """Page numbers (arabic or roman) become `#`, so "Report iv" and "Report xxxix" count as the same running header."""
    tokens = [
        "#" if token and len(token) <= MAX_ROMAN_CHARS and set(token) <= ROMAN_DIGITS else token
        for token in text.translate(str.maketrans("0123456789", "##########")).strip().lower().split()
    ]
    return " ".join(tokens)


def _furniture(scans: list[_Scan], lines: dict[int, list[tuple[Line, int]]]) -> set[str]:
    """Texts repeating in the top or bottom band of many pages (running headers, footers, page numbers)."""
    pages = [s for s in scans if not s.ocr]
    if len(pages) < MIN_FURNITURE_PAGES:
        return set()
    counts: dict[str, int] = {}
    for scan in pages:
        seen: set[str] = set()
        for line, _ in lines[scan.number]:
            if line.top < FURNITURE_ZONE * scan.height or line.bottom > (1 - FURNITURE_ZONE) * scan.height:
                seen.add(_normalised(line.text))
        for key in seen:
            counts[key] = counts.get(key, 0) + 1
    need = max(MIN_FURNITURE_PAGES, FURNITURE_SHARE * len(pages))
    return {k for k, n in counts.items() if n >= need and k}


def _is_furniture(line: Line, scan: _Scan, repeated: set[str]) -> bool:
    in_band = line.top < FURNITURE_ZONE * scan.height or line.bottom > (1 - FURNITURE_ZONE) * scan.height
    return in_band and _normalised(line.text) in repeated


def _caption_for(
    block: TableBlock | FigureBlock, paragraphs: list[Paragraph], typ: Typography, labels: tuple[str, ...]
) -> Paragraph | None:
    best: Paragraph | None = None
    reach = 1.5 * typ.body
    for paragraph in paragraphs:
        above = block.bbox[1] - paragraph.bbox[3]
        below = paragraph.bbox[1] - block.bbox[3]
        if not (0 <= above <= reach or 0 <= below <= reach):
            continue
        text = "".join(s.text for s in paragraph.spans).strip()
        if len(text) > CAPTION_MAX_CHARS:
            continue
        styled = (labels and starts_with_label(text, labels)) or all(
            s.italic for s in paragraph.spans if s.text.strip()
        )
        if styled:
            best = paragraph
            break
    return best


def _build_page(
    scan: _Scan,
    lines: list[tuple[Line, int]],
    typ: Typography,
    profile: DocumentProfile,
    repeated: set[str],
    assets: list[Asset],
    pdf_page: pdfium.PdfPage,
) -> Page:
    items: list[tuple[float, float, int, object]] = []
    for line, column in lines:
        if not _is_furniture(line, scan, repeated):
            items.append((line.top, line.bottom, column, line))

    def column_of(box):
        return (
            -1
            if box.width > WIDE_SHARE * scan.width or all(c == -1 for _, c in lines)
            else (0 if (box.x0 + box.x1) / 2 < scan.width / 2 else 1)
        )

    for index, (rows, box) in enumerate(scan.tables, start=1):
        items.append((box.top, box.bottom, column_of(box), ("table", index, rows, box)))
    figure_image = render_image(pdf_page) if scan.figures else None
    for index, box in enumerate(scan.figures, start=1):
        items.append((box.top, box.bottom, column_of(box), ("figure", index, box)))
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
        if payload[0] == "table":
            _, index, rows, box = payload
            blocks.append(TableBlock(index=index, rows=rows, header_rows=1, page=scan.number, bbox=_bbox(box)))
        else:
            _, index, box = payload
            name = f"assets/page-{scan.number}-figure-{index}.png"
            assert figure_image is not None
            assets.append(Asset(name=name, media_type="image/png", data=crop_png(figure_image, box)))
            labels = " ".join(t.split(":", 1)[1] for t in scan.figure_labels if t.startswith(f"{index - 1}:"))
            blocks.append(
                FigureBlock(
                    asset=name,
                    figure_kind="image" if box.has_image else "diagram",
                    alt=labels[:ALT_TEXT_CHARS],
                    page=scan.number,
                    bbox=_bbox(box),
                )
            )
    flush()
    return Page(
        number=scan.number,
        width=round(scan.width, 1),
        height=round(scan.height, 1),
        blocks=tuple(_attach_captions(blocks, typ, profile.caption_labels)),
        ocr=scan.ocr,
        ocr_confidence=scan.ocr_confidence,
    )


def _bbox(box: Box) -> tuple[float, float, float, float]:
    return (round(box.x0, 1), round(box.top, 1), round(box.x1, 1), round(box.bottom, 1))


def _attach_captions(blocks: list[Block], typ: Typography, labels: tuple[str, ...]) -> list[Block]:
    paragraphs = [b for b in blocks if isinstance(b, Paragraph)]
    used: set[int] = set()
    result: list[Block] = []
    for block in blocks:
        if isinstance(block, TableBlock | FigureBlock):
            candidates = [p for p in paragraphs if id(p) not in used]
            caption = _caption_for(block, candidates, typ, labels)
            if caption is not None:
                used.add(id(caption))
                text = "".join(s.text for s in caption.spans).strip()
                block = block.model_copy(update={"caption": text})
        result.append(block)
    return [b for b in result if id(b) not in used]


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
        scans = [_scan_page(i, plumber.pages[i], pdf[i], profile, diagnostics, ocr_ready) for i in range(total)]
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
    scans: list[_Scan], pdf: pdfium.PdfDocument, profile: DocumentProfile, diagnostics: list[Diagnostic]
) -> DocumentOutput:
    sizes = [(w.size, len(w.text)) for s in scans if not s.ocr for w in s.words]
    typ = typography(sizes)
    lines = {s.number: _page_lines(s) for s in scans}
    repeated = _furniture(scans, {n: v[0] for n, v in lines.items()})
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
