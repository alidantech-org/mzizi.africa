"""Commands for local files: extraction, saved-page links and the file helpers."""

from __future__ import annotations

from mzizi_engine.devcli.catalog.builders import file_payload, links_payload, markdown_payload, passthrough
from mzizi_engine.devcli.catalog.models import Arg, ArgKind, Command

PDF = (".pdf",)
HTML = (".html", ".htm")
DATA = (".csv", ".json", ".geojson")


def _extract(kind: str, help_text: str, suffixes: tuple[str, ...]) -> Command:
    return Command(
        "extract",
        kind,
        help_text,
        f"extraction.{kind}",
        (Arg("input", ArgKind.FILE, "File to extract", positional=True, suffixes=suffixes),),
        file_payload,
    )


COMMANDS: tuple[Command, ...] = (
    _extract("pdf", "PDF text, tables and OCR-needed report", PDF),
    Command(
        "extract",
        "markdown",
        "PDF to Markdown with structure, tables, figures and per-page OCR",
        "extraction.markdown",
        (
            Arg("input", ArgKind.FILE, "PDF to convert", positional=True, suffixes=PDF),
            Arg("ocr", ArgKind.CHOICE, "OCR mode", choices=("auto", "off", "force"), optional=True, default="auto"),
            Arg("languages", ArgKind.TEXT, "Tesseract languages, e.g. eng+swa", optional=True, default="eng"),
            Arg("page-renders", ArgKind.FLAG, "Also save a PNG of every page"),
        ),
        markdown_payload,
        artifacts=True,
    ),
    Command(
        "extract",
        "ocr",
        "OCR a scanned PDF or image",
        "extraction.ocr",
        (Arg("input", ArgKind.FILE, "Scan to read", positional=True, suffixes=(*PDF, ".png", ".jpg", ".tif")),),
        file_payload,
    ),
    _extract("csv", "CSV rows", (".csv",)),
    _extract("json", "JSON records", (".json",)),
    _extract("geojson", "GeoJSON features and geometry diagnostics", (".geojson", ".json")),
    Command(
        "extract",
        "auto",
        "Sniff the file type and extract",
        "extraction.auto",
        (Arg("input", ArgKind.FILE, "File to extract", positional=True, suffixes=(*PDF, *DATA)),),
        file_payload,
    ),
    Command(
        "scrape",
        "links",
        "Discover links in a saved HTML page",
        "scraping.links",
        (
            Arg("input", ArgKind.FILE, "Saved HTML page", positional=True, suffixes=HTML),
            Arg("base-url", ArgKind.URL, "URL the page came from, to resolve relative links"),
        ),
        links_payload,
    ),
    Command(
        "scrape",
        "file",
        "Apply a manifest to a saved HTML page (offline)",
        "scraping.extract",
        (
            Arg("input", ArgKind.FILE, "Saved HTML page", positional=True, suffixes=HTML),
            Arg("manifest", ArgKind.FILE, "Site structure YAML", suffixes=(".yaml", ".yml")),
        ),
        passthrough,
    ),
    Command(
        "scrape",
        "select",
        "Run one CSS selector chain on a page",
        "scraping.select",
        (
            Arg("input", ArgKind.FILE, "Saved HTML page", positional=True, suffixes=HTML),
            Arg("css", ArgKind.TEXT, "CSS selector"),
        ),
        passthrough,
    ),
)
