"""Every CLI command, declared as data: arguments, the port it drives and how its payload is built."""

from __future__ import annotations

import base64
from collections.abc import Callable
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

from mzizi_engine.devcli.errors import CliError
from mzizi_engine.devcli.types import ArgValues, Payload
from mzizi_engine.devcli.workspace import Workspace


class ArgKind(str, Enum):
    FILE = "file"
    FOLDER = "folder"
    URL = "url"
    TEXT = "text"
    CHOICE = "choice"
    INT = "int"
    RUN = "run"
    FLAG = "flag"


@dataclass(frozen=True)
class Arg:
    name: str
    kind: ArgKind
    help: str
    choices: tuple[str, ...] = ()
    optional: bool = False
    positional: bool = False
    suffixes: tuple[str, ...] = ()
    default: str | int | None = None


type PayloadBuilder = Callable[[ArgValues, Workspace], Payload]


@dataclass(frozen=True)
class Command:
    group: str
    name: str
    help: str
    port: str | None
    args: tuple[Arg, ...] = ()
    builder: PayloadBuilder | None = None
    artifacts: bool = False

    @property
    def path(self) -> str:
        return f"{self.group} {self.name}"


GROUP_HELP: dict[str, str] = {
    "extract": "Extract text, tables and records from local files (mzizi-extraction)",
    "fetch": "Polite, identified HTTP fetching (mzizi-fetch)",
    "scrape": "Selectors, links and site structures on pages (mzizi-scraping)",
    "browser": "Drive a real browser to see rendered pages",
    "manifest": "Validate and explain manifests and site structures (mzizi-manifest)",
    "fs": "Hash and upload files (mzizi-filesystem)",
    "mongo": "Dev-only MongoDB sandbox",
    "vector": "Dev-only vector database sandbox",
    "dev": "Workspace, runs and dev services",
}

_PDF = (".pdf",)
_HTML = (".html", ".htm")
_DATA = (".csv", ".json", ".geojson")


def _file_payload(values: ArgValues, ws: Workspace, key: str = "input") -> Payload:
    """A file inside the workspace inputs is passed by path; any other file is read here and passed as bytes."""
    raw = values.get(key)
    if not isinstance(raw, str):
        raise CliError(f"--{key} is required")
    path = Path(raw).expanduser().resolve()
    if ws.contains(path):
        return {"path": str(path.relative_to(ws.inputs.resolve()))}
    return {"content_base64": base64.b64encode(path.read_bytes()).decode("ascii")}


def _links_payload(values: ArgValues, ws: Workspace) -> Payload:
    raw = values.get("input")
    base = values.get("base-url")
    if not isinstance(raw, str) or not isinstance(base, str):
        raise CliError("--input and --base-url are required")
    return {"html": Path(raw).expanduser().read_text(encoding="utf-8", errors="replace"), "base_url": base}


def _directory_payload(values: ArgValues, ws: Workspace) -> Payload:
    raw = values.get("directory")
    if not isinstance(raw, str):
        raise CliError("--directory is required")
    return {"directory": str(Path(raw).expanduser().resolve())}


def _markdown_payload(values: ArgValues, ws: Workspace) -> Payload:
    payload = _file_payload(values, ws)
    for key in ("ocr", "languages"):
        if values.get(key):
            payload[key] = values[key]
    if values.get("page-renders"):
        payload["page_renders"] = True
    return payload


def _no_payload(values: ArgValues, ws: Workspace) -> Payload:
    return {}


def _passthrough(values: ArgValues, ws: Workspace) -> Payload:
    return {k: v for k, v in values.items() if v is not None}


_INPUT = Arg("input", ArgKind.FILE, "File to process", positional=True)
_URL = Arg("url", ArgKind.URL, "Page or endpoint URL", positional=True)
_RUN = Arg("run", ArgKind.RUN, "Run folder name, or `last`", default="last")
_MANIFEST = Arg(
    "manifest", ArgKind.FILE, "Site/API structure or fetch policy YAML", suffixes=(".yaml", ".yml"), optional=True
)


def _extract(kind: str, help_text: str, suffixes: tuple[str, ...]) -> Command:
    return Command(
        "extract",
        kind,
        help_text,
        f"extraction.{kind}",
        (Arg("input", ArgKind.FILE, "File to extract", positional=True, suffixes=suffixes),),
        _file_payload,
    )


COMMANDS: tuple[Command, ...] = (
    _extract("pdf", "PDF text, tables and OCR-needed report", _PDF),
    Command(
        "extract",
        "markdown",
        "PDF to Markdown with structure, tables, figures and per-page OCR",
        "extraction.markdown",
        (
            Arg("input", ArgKind.FILE, "PDF to convert", positional=True, suffixes=_PDF),
            Arg("ocr", ArgKind.CHOICE, "OCR mode", choices=("auto", "off", "force"), optional=True, default="auto"),
            Arg("languages", ArgKind.TEXT, "Tesseract languages, e.g. eng+swa", optional=True, default="eng"),
            Arg("page-renders", ArgKind.FLAG, "Also save a PNG of every page"),
        ),
        _markdown_payload,
        artifacts=True,
    ),
    Command(
        "extract",
        "ocr",
        "OCR a scanned PDF or image",
        "extraction.ocr",
        (Arg("input", ArgKind.FILE, "Scan to read", positional=True, suffixes=(*_PDF, ".png", ".jpg", ".tif")),),
        _file_payload,
    ),
    _extract("csv", "CSV rows", (".csv",)),
    _extract("json", "JSON records", (".json",)),
    _extract("geojson", "GeoJSON features and geometry diagnostics", (".geojson", ".json")),
    Command(
        "extract",
        "auto",
        "Sniff the file type and extract",
        "extraction.auto",
        (Arg("input", ArgKind.FILE, "File to extract", positional=True, suffixes=(*_PDF, *_DATA)),),
        _file_payload,
    ),
    Command("fetch", "url", "Fetch one URL politely and save bytes and headers", "fetch.url", (_URL,), _passthrough),
    Command("fetch", "robots", "Show the robots decision for a URL", "fetch.robots", (_URL,), _passthrough),
    Command(
        "fetch",
        "policy",
        "Show the effective fetch policy of a manifest",
        "fetch.policy",
        (Arg("manifest", ArgKind.FILE, "Manifest with a policy block", suffixes=(".yaml", ".yml")),),
        _passthrough,
    ),
    Command("fetch", "replay", "Re-serve a previous fetch from the cache", "fetch.replay", (_RUN,), _passthrough),
    Command(
        "scrape",
        "links",
        "Discover links in a saved HTML page",
        "scraping.links",
        (
            Arg("input", ArgKind.FILE, "Saved HTML page", positional=True, suffixes=_HTML),
            Arg("base-url", ArgKind.URL, "URL the page came from, to resolve relative links"),
        ),
        _links_payload,
    ),
    Command(
        "scrape",
        "file",
        "Apply a manifest to a saved HTML page (offline)",
        "scraping.extract",
        (
            Arg("input", ArgKind.FILE, "Saved HTML page", positional=True, suffixes=_HTML),
            Arg("manifest", ArgKind.FILE, "Site structure YAML", suffixes=(".yaml", ".yml")),
        ),
        _passthrough,
    ),
    Command(
        "scrape",
        "url",
        "Fetch a URL and apply a manifest",
        "scraping.extract",
        (
            _URL,
            _MANIFEST,
            Arg("render", ArgKind.CHOICE, "How to load the page", choices=("http", "browser"), default="http"),
        ),
        _passthrough,
    ),
    Command(
        "scrape",
        "select",
        "Run one CSS selector chain on a page",
        "scraping.select",
        (
            Arg("input", ArgKind.FILE, "Saved HTML page", positional=True, suffixes=_HTML),
            Arg("css", ArgKind.TEXT, "CSS selector"),
        ),
        _passthrough,
    ),
    Command(
        "scrape",
        "challenge",
        "Detect challenge or bot-wall pages",
        "scraping.challenge",
        (Arg("input", ArgKind.FILE, "Saved HTML page", positional=True, suffixes=_HTML),),
        _passthrough,
    ),
    Command("scrape", "markdown", "Readable Markdown from a page", "scraping.markdown", (_URL,), _passthrough),
    Command(
        "scrape",
        "crawl",
        "Bounded discovery of pages and links",
        "scraping.crawl",
        (_URL, Arg("max-pages", ArgKind.INT, "Page budget", default=10)),
        _passthrough,
    ),
    Command(
        "browser",
        "open",
        "Open a URL in a real browser window",
        "browser.open",
        (_URL, Arg("headed", ArgKind.FLAG, "Show the window")),
        _passthrough,
    ),
    Command("browser", "snapshot", "Save rendered HTML and a screenshot", "browser.snapshot", (_URL,), _passthrough),
    Command(
        "browser",
        "navigate",
        "Click through a page sequence",
        "browser.navigate",
        (_URL, Arg("click", ArgKind.TEXT, "CSS selector to click each step")),
        _passthrough,
    ),
    Command("browser", "compare", "Raw HTML versus rendered HTML", "browser.compare", (_URL,), _passthrough),
    Command("manifest", "check", "Validate the seed manifest and lock", "manifest.check_seeds", (), _no_payload),
    Command(
        "manifest",
        "validate-structure",
        "Validate a site-structure bundle",
        "manifest.validate_structure",
        (Arg("directory", ArgKind.FOLDER, "Folder holding the structure bundle", positional=True),),
        _directory_payload,
    ),
    Command(
        "manifest",
        "explain",
        "Show the resolved manifest",
        "manifest.explain",
        (Arg("manifest", ArgKind.FILE, "Manifest file", positional=True, suffixes=(".yaml", ".yml")),),
        _passthrough,
    ),
    Command(
        "fs",
        "hash",
        "Hash a file and show its dedup key",
        "filesystem.hash",
        (Arg("path", ArgKind.FILE, "File to hash", positional=True),),
        _passthrough,
    ),
    Command(
        "fs",
        "put",
        "Plan or run an upload of a folder",
        "filesystem.put",
        (
            Arg("path", ArgKind.FOLDER, "Folder to upload", positional=True),
            Arg("dry-run", ArgKind.FLAG, "Only show the plan"),
        ),
        _passthrough,
    ),
    Command("mongo", "test", "Check the Mongo sandbox works", "mongo.test", (), _no_payload),
    Command("mongo", "load", "Load a run's records into Mongo", "mongo.load", (_RUN,), _passthrough),
    Command(
        "mongo",
        "find",
        "Query dev documents",
        "mongo.find",
        (Arg("query", ArgKind.TEXT, "JSON filter", default="{}"),),
        _passthrough,
    ),
    Command("mongo", "drop-dev", "Drop the dev Mongo database", "mongo.drop", (), _no_payload),
    Command("vector", "test", "Check the vector sandbox works", "vector.test", (), _no_payload),
    Command("vector", "index", "Embed and index a run's Markdown", "vector.index", (_RUN,), _passthrough),
    Command(
        "vector",
        "search",
        "Semantic search over indexed chunks",
        "vector.search",
        (Arg("query", ArgKind.TEXT, "What to look for", positional=True),),
        _passthrough,
    ),
    Command(
        "vector",
        "classify",
        "Propose a class for a text or file",
        "vector.classify",
        (Arg("input", ArgKind.FILE, "Text or Markdown file", positional=True),),
        _passthrough,
    ),
    Command("vector", "drop-dev", "Delete dev vector collections", "vector.drop", (), _no_payload),
    Command(
        "dev",
        "serve",
        "Serve saved fixtures over loopback HTTP",
        "devservice.serve",
        (Arg("dir", ArgKind.FOLDER, "Fixture folder", positional=True),),
        _passthrough,
    ),
    Command(
        "dev",
        "services",
        "Start, stop or inspect the dev containers",
        "devservice.compose",
        (
            Arg(
                "action",
                ArgKind.CHOICE,
                "What to do",
                choices=("up", "down", "status"),
                positional=True,
                default="status",
            ),
        ),
        _passthrough,
    ),
)
