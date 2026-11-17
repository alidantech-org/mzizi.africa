"""Compare saved page captures with reviewed expectations without making network requests."""

from __future__ import annotations

from hashlib import sha256
from pathlib import Path
from typing import Literal, Self
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from pydantic import Field, TypeAdapter, model_validator
from soupsieve import SelectorSyntaxError

from mzizi_browser.shared.media import MediaInventory, render_media
from mzizi_crawler.shared.common import out_dir
from mzizi_crawler.shared.records import Record
from mzizi_crawler.shared.requests import Workspace
from mzizi_crawler.shared.scraping import detect_pagination, extract_references
from mzizi_extraction import DocumentProfile, OcrMode, extract_html_document, extract_pdf_document, render_markdown
from mzizi_extraction.document.models import FigureBlock, TableBlock
from mzizi_fetch.web.urls import extension_of


class ReplayRequest(Workspace):
    expectations: str


class SelectorCheck(Record):
    selector: str
    count: int = Field(ge=0)
    markdown_attribute: str = ""


class CellCheck(Record):
    table: int = Field(ge=1)
    row: int = Field(ge=0)
    column: int = Field(ge=0)
    text: str


type Terminal = Literal[
    "no_next_control",
    "next_available",
    "continuation_disabled",
    "last_advertised_numbered_page",
    "scroll_available",
    "ambiguous",
]


class ReplayView(Record):
    html: str
    url: str
    sha256: str = ""
    css_images: bool = False
    tables: int | None = Field(default=None, ge=0)
    table_rows: int | None = Field(default=None, ge=0)
    images: int | None = Field(default=None, ge=0)
    media: str = ""
    rendered_images: int | None = Field(default=None, ge=0)
    pdf_links: int | None = Field(default=None, ge=0)
    terminal: Terminal | None = None
    markdown_urls: tuple[str, ...] = ()
    selectors: tuple[SelectorCheck, ...] = ()
    cells: tuple[CellCheck, ...] = ()


class PdfReplay(Record):
    pdf: str
    url: str
    sha256: str = ""
    pages: int | None = Field(default=None, ge=0)
    table_pages: tuple[int, ...] | None = None
    table_rows: tuple[int, ...] | None = None
    cells: tuple[CellCheck, ...] = ()
    ocr: OcrMode = OcrMode.AUTO


class ReplaySuite(Record):
    version: Literal[1] = 1
    views: tuple[ReplayView, ...] = ()
    pdfs: tuple[PdfReplay, ...] = ()

    @model_validator(mode="after")
    def nonempty(self) -> Self:
        if not self.views and not self.pdfs:
            raise ValueError("the suite requires at least one HTML or PDF capture")
        return self


class ReplayMismatch(Record):
    check: str
    expected: str
    observed: str


class ReplayResult(Record):
    url: str
    sha256: str = ""
    mismatches: tuple[ReplayMismatch, ...]


class ReplayReport(Record):
    passed: bool
    views: tuple[ReplayResult, ...]
    files: tuple[str, ...] = ("coverage.json",)


def _terminal(html: str, url: str) -> Terminal:
    found = detect_pagination(html, url)
    controls = tuple(c for c in (found.next, found.load_more) if c is not None)
    if any(c.enabled for c in controls):
        return "next_available"
    if found.infinite_scroll:
        return "scroll_available"
    if controls:
        return "continuation_disabled"
    if found.current is not None and found.current == found.last:
        return "last_advertised_numbered_page"
    return "ambiguous" if found.numbered else "no_next_control"


def _linked(markdown: str, url: str) -> bool:
    return f"]({url})" in markdown or f"](<{url}>)" in markdown


def _cell(tables: tuple[TableBlock, ...], cell: CellCheck) -> str:
    try:
        return tables[cell.table - 1].rows[cell.row][cell.column]
    except IndexError:
        return "<missing cell>"


def _pdf_replay(spec: PdfReplay, base: Path) -> ReplayResult:
    try:
        data = (base / spec.pdf).read_bytes()
    except OSError as error:
        mismatch = ReplayMismatch(check="PDF capture", expected="readable PDF", observed=str(error))
        return ReplayResult(url=spec.url, mismatches=(mismatch,))
    digest = sha256(data).hexdigest()
    output = extract_pdf_document(data, DocumentProfile(auto_tables=True, figures=False, ocr=spec.ocr))
    tables = tuple(block for page in output.pages for block in page.blocks if isinstance(block, TableBlock))
    checks = [
        ("PDF hash", spec.sha256 or None, digest),
        ("PDF extraction", "succeeded", output.status.value),
        ("PDF pages", spec.pages, len(output.pages)),
        ("PDF table pages", spec.table_pages, tuple(table.page for table in tables)),
        ("PDF table rows", spec.table_rows, tuple(len(table.rows) for table in tables)),
    ]
    mismatches = [
        ReplayMismatch(check=label, expected=str(expected), observed=str(observed))
        for label, expected, observed in checks
        if expected is not None and expected != observed
    ]
    for expected_cell in spec.cells:
        observed = _cell(tables, expected_cell)
        if observed != expected_cell.text:
            mismatches.append(
                ReplayMismatch(
                    check=f"table {expected_cell.table}, row {expected_cell.row}, column {expected_cell.column}",
                    expected=expected_cell.text,
                    observed=observed,
                )
            )
    return ReplayResult(url=spec.url, sha256=digest, mismatches=tuple(mismatches))


def _replay(view: ReplayView, base: Path) -> ReplayResult:
    mismatches: list[ReplayMismatch] = []

    def check(label: str, expected: str | int | None, observed: str | int) -> None:
        if expected is not None and expected != observed:
            mismatches.append(ReplayMismatch(check=label, expected=str(expected), observed=str(observed)))

    try:
        source = (base / view.html).read_bytes()
    except OSError as error:
        check("capture", "readable HTML", str(error))
        return ReplayResult(url=view.url, mismatches=tuple(mismatches))
    digest = sha256(source).hexdigest()
    if view.sha256:
        check("source hash", view.sha256, digest)
    html = source.decode("utf-8", errors="replace")
    doc, _, _ = extract_html_document(html, view.url, include_css_images=view.css_images)
    markdown = render_markdown(doc.pages)
    blocks = tuple(block for page in doc.pages for block in page.blocks)
    tables = tuple(block for block in blocks if isinstance(block, TableBlock))
    check("tables", view.tables, len(tables))
    check("data rows", view.table_rows, sum(len(table.rows) - table.header_rows for table in tables))
    check("image occurrences", view.images, sum(isinstance(block, FigureBlock) for block in blocks))
    if view.media:
        try:
            data = (base / view.media).read_bytes()
            if data.lstrip().startswith(b"["):
                media = next(
                    record
                    for record in TypeAdapter(tuple[MediaInventory, ...]).validate_json(data)
                    if record.source_url == view.url
                )
            else:
                media = MediaInventory.model_validate_json(data)
            check("rendered inventory URL", view.url, media.source_url)
            check("rendered inventory scan", "complete", "truncated" if media.truncated else "complete")
            check("uninspected frame documents", 0, media.uninspected_frames)
            check("uninspected shadow trees", 0, media.shadow_roots)
            rendered = {
                (ref.selector, ref.url)
                for ref in media.references
                if ref.visible and ref.kind in ("background", "selected-image")
            }
            check("rendered image occurrences", view.rendered_images, len(rendered))
            soup = BeautifulSoup(html, "lxml")
            for selector, url in sorted(rendered):
                selector = selector.removesuffix("::before").removesuffix("::after")
                check(f"rendered image location {url}", 1, len(soup.select(selector)))
            markdown += render_media(media)
        except (OSError, ValueError, StopIteration, SelectorSyntaxError) as error:
            check("rendered inventory", "readable media for this capture", str(error))
    elif view.rendered_images is not None:
        check("rendered inventory", "capture path", "missing")
    if view.pdf_links is not None:
        links = {ref.url for ref in extract_references(html, view.url) if extension_of(ref.url) == "pdf"}
        check("PDF URLs retained in Markdown", view.pdf_links, sum(_linked(markdown, url) for url in links))
    if view.terminal is not None:
        check("pagination", view.terminal, _terminal(html, view.url))
    for url in view.markdown_urls:
        check(f"Markdown URL {url}", "present", "present" if _linked(markdown, url) else "missing")
    if view.selectors:
        soup = BeautifulSoup(html, "lxml")
        for item in view.selectors:
            try:
                elements = soup.select(item.selector)
            except SelectorSyntaxError as error:
                check("CSS selector", item.selector, str(error))
                continue
            check(item.selector, item.count, len(elements))
            if item.markdown_attribute:
                for element in elements:
                    target = element.get(item.markdown_attribute)
                    if isinstance(target, str) and target.strip():
                        url = urljoin(view.url, target)
                        check(f"{item.selector} {url}", "present", "present" if _linked(markdown, url) else "missing")
                    else:
                        check(item.selector, item.markdown_attribute, "missing attribute")
    for cell in view.cells:
        observed = _cell(tables, cell)
        check(f"table {cell.table}, row {cell.row}, column {cell.column}", cell.text, observed)
    return ReplayResult(url=view.url, sha256=digest, mismatches=tuple(mismatches))


def evaluate_replay(suite: ReplaySuite, base: Path) -> ReplayReport:
    """Evaluate the supplied captures and return results without writing files."""
    views = (
        *(_replay(view, base) for view in suite.views),
        *(_pdf_replay(spec, base) for spec in suite.pdfs),
    )
    return ReplayReport(passed=not any(view.mismatches for view in views), views=views, files=())


def replay(request: ReplayRequest) -> ReplayReport:
    manifest = Path(request.expectations).resolve()
    suite = ReplaySuite.model_validate_json(manifest.read_bytes())
    report = evaluate_replay(suite, manifest.parent).model_copy(update={"files": ("coverage.json",)})
    (out_dir(request) / "coverage.json").write_text(report.model_dump_json(indent=2) + "\n", encoding="utf-8")
    return report
