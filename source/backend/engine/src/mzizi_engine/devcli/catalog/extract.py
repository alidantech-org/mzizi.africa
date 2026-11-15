"""Commands for local files: extraction, saved-page links and the file helpers."""

from __future__ import annotations

from mzizi_engine.devcli.catalog.builders import (
    file_payload,
    links_payload,
    markdown_payload,
    passthrough,
    scrape_payload,
)
from mzizi_engine.devcli.catalog.models import Arg, ArgKind, Command
from mzizi_engine.devcli.stream_extract import extract_stream

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
            Arg("strict-table-lines", ArgKind.FLAG, "Ignore rectangle edges when detecting ruled tables"),
            Arg("first-page", ArgKind.INT, "First source page to extract (one-based)", optional=True),
            Arg("last-page", ArgKind.INT, "Last source page to extract (inclusive)", optional=True),
            Arg("auto-tables", ArgKind.FLAG, "Compare table detectors and flag uncertain layouts"),
            Arg(
                "table-schema",
                ArgKind.FILE,
                "Expected columns as JSON; enables auto tables",
                optional=True,
                suffixes=(".json",),
            ),
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
    Command(
        "extract",
        "stream",
        "Write bounded PDF, CSV, TSV, JSON, JSONL or XLSX extraction chunks to a local run",
        None,
        (
            Arg(
                "input",
                ArgKind.FILE,
                "Local source",
                positional=True,
                suffixes=(*PDF, *DATA, ".tsv", ".jsonl", ".ndjson", ".xlsx"),
            ),
            Arg("chunk-size", ArgKind.INT, "Pages or records per output chunk", optional=True),
            Arg("first-page", ArgKind.INT, "First PDF page to process", optional=True),
            Arg("last-page", ArgKind.INT, "Last PDF page to process", optional=True),
            Arg("ocr", ArgKind.CHOICE, "PDF OCR mode", choices=("auto", "off", "force"), optional=True),
            Arg("languages", ArgKind.TEXT, "PDF OCR languages", optional=True),
            Arg("json-array", ArgKind.TEXT, "Top-level JSON key containing the array", optional=True),
            Arg("gzip", ArgKind.FLAG, "Compress record chunks as .jsonl.gz"),
        ),
        passthrough,
        run_folder=True,
        failure_field="complete",
        local_handler=extract_stream,
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
            Arg("manifest", ArgKind.FILE, "Site module YAML", suffixes=(".yaml", ".yml")),
        ),
        scrape_payload,
    ),
    Command(
        "scrape",
        "select",
        "Run a CSS selector on a saved HTML page",
        "scraping.select",
        (
            Arg("input", ArgKind.FILE, "Saved HTML page", positional=True, suffixes=HTML),
            Arg("css", ArgKind.TEXT, "CSS selector"),
        ),
        scrape_payload,
    ),
)
