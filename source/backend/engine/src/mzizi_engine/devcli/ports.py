"""Ports: every capability the CLI will drive, with its requirements and honest implementation state.

A port is *declared* here and *connected* when a capability of the same name is registered in the engine registry
(`mzizi_engine.capabilities`). Registering the capability is all it takes to turn a "not yet added" command live.
"""

from __future__ import annotations

import importlib.util
import os
import shutil
import socket
from dataclasses import dataclass
from enum import Enum
from urllib.parse import urlparse

from mzizi_engine.capabilities import CapabilityRegistry, build_default_registry

PLAN_DOC = ".docs/_plan/mzizi-engine/06-phased-delivery.md"


class RequirementKind(str, Enum):
    MODULE = "python module"
    BINARY = "program"
    ENV = "setting"
    SERVICE = "service"


@dataclass(frozen=True)
class Requirement:
    kind: RequirementKind
    names: tuple[str, ...]
    hint: str

    @property
    def label(self) -> str:
        return " | ".join(self.names)


class PortState(str, Enum):
    READY = "ready"
    UNAVAILABLE = "needs setup"
    NOT_YET_ADDED = "not yet added"


@dataclass(frozen=True)
class Port:
    capability: str
    package: str
    summary: str
    phase: int
    reason: str
    requires: tuple[Requirement, ...] = ()


@dataclass(frozen=True)
class RequirementCheck:
    requirement: Requirement
    satisfied: bool
    detail: str


@dataclass(frozen=True)
class PortStatus:
    port: Port
    registered: bool
    state: PortState
    checks: tuple[RequirementCheck, ...]

    @property
    def missing(self) -> tuple[RequirementCheck, ...]:
        return tuple(c for c in self.checks if not c.satisfied)


def _module(name: str, hint: str) -> Requirement:
    return Requirement(RequirementKind.MODULE, (name,), hint)


def _binary(*names: str, hint: str) -> Requirement:
    return Requirement(RequirementKind.BINARY, names, hint)


def _env(name: str, hint: str) -> Requirement:
    return Requirement(RequirementKind.ENV, (name,), hint)


def _service(env_name: str, hint: str) -> Requirement:
    return Requirement(RequirementKind.SERVICE, (env_name,), hint)


_TESSERACT = _binary("tesseract", hint="install Tesseract (e.g. `sudo dnf install tesseract`)")
_BROWSER_LIB = _module("playwright", "add the optional browser group: `uv sync --extra browser` (not yet defined)")
_CHROME = _binary("google-chrome", "google-chrome-stable", "chromium", hint="install Google Chrome or Chromium")
_DOCKER = _binary("docker", hint="install Docker to run the dev services")
_MONGO_LIB = _module("pymongo", "add the optional dev-services group (not yet defined)")
_MONGO_URL = _service(
    "DEV_MONGO_URL", "start `mzizi dev services up` or export DEV_MONGO_URL=mongodb://127.0.0.1:27018"
)
_VECTOR_LIB = _module("qdrant_client", "add the optional dev-services group (not yet defined)")
_VECTOR_URL = _service("DEV_VECTOR_URL", "start `mzizi dev services up` or export DEV_VECTOR_URL=http://127.0.0.1:6334")

_PENDING = "No handler is registered for this capability yet."


def _p(capability: str, package: str, summary: str, phase: int, reason: str = _PENDING, *requires: Requirement) -> Port:
    return Port(capability, package, summary, phase, reason, requires)


PORTS: tuple[Port, ...] = (
    _p("extraction.pdf", "mzizi-extraction", "PDF text, tables and OCR-needed report", 1),
    _p("extraction.markdown", "mzizi-extraction", "PDF to structured Markdown with figures, tables and OCR", 1),
    _p("extraction.csv", "mzizi-extraction", "CSV rows", 1),
    _p("extraction.json", "mzizi-extraction", "JSON records", 1),
    _p("extraction.geojson", "mzizi-extraction", "GeoJSON features with geometry diagnostics", 1),
    _p(
        "extraction.ocr",
        "mzizi-extraction",
        "OCR a scanned PDF or image",
        1,
        "Needs an OCR capability wrapper around the Tesseract extractor.",
        _TESSERACT,
    ),
    _p(
        "extraction.auto",
        "mzizi-extraction",
        "Sniff file type and pick an extractor",
        1,
        "Type sniffing over `EXTRACTORS` is not written yet.",
    ),
    _p("manifest.check_seeds", "mzizi-manifest", "Validate the seed manifest, folders and lock", 2),
    _p("manifest.validate_structure", "mzizi-manifest", "Validate a site-structure bundle directory", 2),
    _p(
        "manifest.explain",
        "mzizi-manifest",
        "Show the effective manifest after folder inheritance",
        2,
        "Effective-manifest rendering is not exposed as a capability yet.",
    ),
    _p(
        "filesystem.hash",
        "mzizi-filesystem",
        "Content hash, size, type and dedup key",
        2,
        "Hashing is in the package but has no capability wrapper.",
    ),
    _p(
        "filesystem.put",
        "mzizi-filesystem",
        "Upload a folder to a local or S3 object store",
        2,
        "Needs a local-directory object store and a dry-run planner.",
    ),
    _p(
        "fetch.url",
        "mzizi-fetch",
        "Polite, identified, cached HTTP fetch",
        3,
        "`PoliteFetcher` exists, but the engine has no capability that injects the gate and challenge callbacks.",
    ),
    _p(
        "fetch.robots",
        "mzizi-fetch",
        "Robots decision for a URL and user agent",
        3,
        "Robots handling is not exposed as a capability.",
    ),
    _p(
        "fetch.policy",
        "mzizi-fetch",
        "Parse a manifest policy block into effective limits",
        3,
        "`parse_policy` is not exposed as a capability.",
    ),
    _p(
        "fetch.replay",
        "mzizi-fetch",
        "Serve a previous run from the fetch cache",
        3,
        "Needs the fetch capability and a dev cache directory.",
    ),
    _p("scraping.links", "mzizi-scraping", "Absolute, de-duplicated links from HTML", 3),
    _p(
        "scraping.extract",
        "mzizi-scraping",
        "Apply a site structure to a document",
        3,
        "Selector, field and transform engines are packaged but no capability applies a manifest to a document.",
    ),
    _p(
        "scraping.select",
        "mzizi-scraping",
        "Run one selector chain with fallback trace",
        3,
        "Needs a capability that returns the per-fallback trace.",
    ),
    _p(
        "scraping.challenge",
        "mzizi-scraping",
        "Detect challenge, CAPTCHA and bot-wall pages",
        3,
        "`detect_challenge` is not exposed as a capability.",
    ),
    _p(
        "scraping.markdown",
        "mzizi-scraping",
        "Readable Markdown from main content",
        5,
        "Main-content to Markdown conversion is a design proposal (source-redesign 04), not code.",
    ),
    _p(
        "scraping.crawl",
        "mzizi-scraping",
        "Bounded discovery with budgets and a link graph",
        5,
        "Crawl budgets and the page inventory are design only (source-redesign 03).",
    ),
    _p(
        "browser.open",
        "mzizi-engine",
        "Open a URL in a real browser",
        4,
        "No browser adapter exists yet.",
        _BROWSER_LIB,
        _CHROME,
    ),
    _p(
        "browser.snapshot",
        "mzizi-engine",
        "Rendered HTML, screenshot, redirects and network summary",
        4,
        "No browser adapter exists yet.",
        _BROWSER_LIB,
        _CHROME,
    ),
    _p(
        "browser.navigate",
        "mzizi-engine",
        "Scripted clicks and pagination",
        4,
        "No browser adapter exists yet.",
        _BROWSER_LIB,
        _CHROME,
    ),
    _p(
        "browser.compare",
        "mzizi-engine",
        "Raw HTTP HTML versus rendered HTML",
        4,
        "Needs both the fetch capability and the browser adapter.",
        _BROWSER_LIB,
        _CHROME,
    ),
    _p(
        "devservice.compose",
        "mzizi-engine",
        "Start and stop the dev Mongo and vector containers",
        6,
        "No compose generator exists yet.",
        _DOCKER,
    ),
    _p(
        "devservice.serve", "mzizi-engine", "Serve fixtures over loopback HTTP", 3, "Fixture server is not written yet."
    ),
    _p(
        "mongo.test",
        "mzizi-engine",
        "Connect, write, read and delete one document",
        6,
        "No Mongo port adapter exists yet.",
        _MONGO_LIB,
        _MONGO_URL,
    ),
    _p(
        "mongo.load",
        "mzizi-engine",
        "Load a run's records into Mongo",
        6,
        "No Mongo port adapter exists yet.",
        _MONGO_LIB,
        _MONGO_URL,
    ),
    _p(
        "mongo.find",
        "mzizi-engine",
        "Query dev documents",
        6,
        "No Mongo port adapter exists yet.",
        _MONGO_LIB,
        _MONGO_URL,
    ),
    _p(
        "mongo.drop",
        "mzizi-engine",
        "Drop the dev database",
        6,
        "No Mongo port adapter exists yet.",
        _MONGO_LIB,
        _MONGO_URL,
    ),
    _p(
        "vector.test",
        "mzizi-engine",
        "Create a throwaway collection and search it",
        6,
        "No vector port adapter exists yet.",
        _VECTOR_LIB,
        _VECTOR_URL,
    ),
    _p(
        "vector.index",
        "mzizi-engine",
        "Chunk, embed and upsert a run's Markdown",
        6,
        "No vector port adapter or embedding model is chosen yet.",
        _VECTOR_LIB,
        _VECTOR_URL,
    ),
    _p(
        "vector.search",
        "mzizi-engine",
        "Semantic search over indexed chunks",
        6,
        "No vector port adapter exists yet.",
        _VECTOR_LIB,
        _VECTOR_URL,
    ),
    _p(
        "vector.classify",
        "mzizi-engine",
        "Propose a class from nearest labelled examples",
        6,
        "No vector port adapter exists yet.",
        _VECTOR_LIB,
        _VECTOR_URL,
    ),
    _p(
        "vector.drop",
        "mzizi-engine",
        "Delete dev collections",
        6,
        "No vector port adapter exists yet.",
        _VECTOR_LIB,
        _VECTOR_URL,
    ),
)

_BY_NAME = {p.capability: p for p in PORTS}


def get_port(capability: str) -> Port:
    return _BY_NAME[capability]


def check_requirement(requirement: Requirement, *, probe: bool = False) -> RequirementCheck:
    match requirement.kind:
        case RequirementKind.MODULE:
            found = importlib.util.find_spec(requirement.names[0]) is not None
            return RequirementCheck(requirement, found, "installed" if found else "not installed")
        case RequirementKind.BINARY:
            for name in requirement.names:
                path = shutil.which(name)
                if path:
                    return RequirementCheck(requirement, True, path)
            return RequirementCheck(requirement, False, "not on PATH")
        case RequirementKind.ENV:
            present = bool(os.environ.get(requirement.names[0]))
            return RequirementCheck(requirement, present, "set" if present else "not set")
        case RequirementKind.SERVICE:
            value = os.environ.get(requirement.names[0])
            if not value:
                return RequirementCheck(requirement, False, f"{requirement.names[0]} not set")
            if not probe:
                return RequirementCheck(requirement, True, f"{value} (not probed)")
            return RequirementCheck(requirement, *_probe_tcp(value))


def _probe_tcp(url: str) -> tuple[bool, str]:
    parsed = urlparse(url)
    if not parsed.hostname or not parsed.port:
        return False, f"{url}: needs host and port"
    try:
        with socket.create_connection((parsed.hostname, parsed.port), timeout=0.4):
            return True, f"{url} reachable"
    except OSError as exc:
        return False, f"{url} unreachable ({exc.__class__.__name__})"


def port_status(port: Port, registry: CapabilityRegistry, *, probe: bool = False) -> PortStatus:
    registered = port.capability in registry.names()
    checks = tuple(check_requirement(r, probe=probe) for r in port.requires)
    if not registered:
        state = PortState.NOT_YET_ADDED
    elif any(not c.satisfied for c in checks):
        state = PortState.UNAVAILABLE
    else:
        state = PortState.READY
    return PortStatus(port, registered, state, checks)


def all_statuses(*, probe: bool = False) -> list[PortStatus]:
    registry = build_default_registry()
    return [port_status(p, registry, probe=probe) for p in PORTS]
