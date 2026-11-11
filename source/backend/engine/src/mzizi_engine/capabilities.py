"""Registered capabilities: what the engine can run, with their package, version and input contract.

A capability is a named, versioned function of a package. Handlers take and return JSON-able dicts and live at module
level so they can run in worker processes. Source, country and publisher knowledge never appears here: callers pass it
as data (manifests, inputs). Registering a capability is code; a request can only name one that is registered.
"""

from __future__ import annotations

import base64
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class Capability:
    name: str
    version: str
    package: str
    description: str
    handler: Callable[[dict], dict]
    input_schema: dict
    cpu_bound: bool = False
    concurrency: int | None = None

    def describe(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "version": self.version,
            "package": self.package,
            "description": self.description,
            "cpu_bound": self.cpu_bound,
            "input_schema": self.input_schema,
        }


class CapabilityRegistry:
    def __init__(self) -> None:
        self._items: dict[str, Capability] = {}

    def register(self, capability: Capability) -> Capability:
        if capability.name in self._items:
            raise ValueError(f"capability {capability.name!r} is already registered")
        self._items[capability.name] = capability
        return capability

    def get(self, name: str) -> Capability:
        if name not in self._items:
            raise KeyError(name)
        return self._items[name]

    def names(self) -> list[str]:
        return sorted(self._items)

    def describe(self) -> list[dict]:
        return [self._items[n].describe() for n in self.names()]


def _bytes_input(payload: dict) -> bytes:
    """`content_base64` or a `path` below the configured input root (default: the repository seed folder)."""
    if "content_base64" in payload:
        return base64.b64decode(payload["content_base64"])
    import os

    from mzizi_manifest.paths import SEED_ROOT

    root = Path(os.environ.get("ENGINE_INPUT_ROOT") or SEED_ROOT).resolve()
    target = (root / payload["path"]).resolve()
    if root not in target.parents and target != root:
        raise ValueError("path escapes the engine input root")
    return target.read_bytes()


_SOURCE = {
    "type": "object",
    "properties": {"content_base64": {"type": "string"}, "path": {"type": "string"}, "profile": {"type": "string"}},
    "anyOf": [{"required": ["content_base64"]}, {"required": ["path"]}],
}


def _extract(name: str) -> Callable[[dict], dict]:
    def run(payload: dict) -> dict:
        from mzizi_extraction import EXTRACTORS

        out = EXTRACTORS[name](_bytes_input(payload), payload.get("profile"))
        return {"status": out.status, "segments": out.segments, "diagnostics": out.diagnostics}

    run.__name__ = f"extract_{name}"
    return run


def extract_pdf(payload: dict) -> dict:
    return _extract("pdf")(payload)


def extract_geojson(payload: dict) -> dict:
    return _extract("geojson")(payload)


def extract_csv(payload: dict) -> dict:
    return _extract("csv")(payload)


def extract_json(payload: dict) -> dict:
    return _extract("json")(payload)


def scraping_links(payload: dict) -> dict:
    from mzizi_scraping import extract_links

    return {
        "links": [{"url": link.url, "text": link.text} for link in extract_links(payload["html"], payload["base_url"])]
    }


def manifest_check_seeds(payload: dict) -> dict:
    from mzizi_manifest import seed_registry as seeds

    result = seeds.validate_manifest()
    entries = len((result.manifest or {}).get("entries", []))
    return {"ok": not result.errors, "entries": entries, "errors": result.errors, "warnings": len(result.warnings)}


def manifest_validate_structure(payload: dict) -> dict:
    from mzizi_manifest import bundle, validate

    return validate(bundle.load(payload["directory"])).to_json()


def source_gate(payload: dict) -> dict:
    from mzizi_source import evaluate

    decision = evaluate(payload.get("assessment"), payload.get("dossier_stage"), payload["request"])
    return {
        "allowed": decision.allowed,
        "reasons": decision.reasons,
        "assessment_id": decision.assessment_id,
        "requests_per_second": decision.requests_per_second,
    }


def filesystem_sync(payload: dict) -> dict:
    """Plan (default) or apply a manifest sync. The actor is set by the engine from the authenticated principal. Needs DATABASE_URL and S3 settings."""
    import os

    from mzizi_database import connect
    from mzizi_filesystem import (
        DatabaseAuthorizer,
        FilesystemService,
        MemoryObjectStore,
        OperatorAuthorizer,
        Repository,
        S3ObjectStore,
        load_plan,
        run_sync,
    )

    have_s3 = all(os.environ.get(k) for k in ("S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY"))
    if payload.get("apply") and not have_s3 and os.environ.get("ENGINE_STORE_MEMORY") != "1":
        raise ValueError("object storage is not configured: refusing to apply a sync without S3 credentials")
    store = S3ObjectStore() if have_s3 else MemoryObjectStore()
    plan = load_plan(Path(payload["manifest"]), entry_ids=set(payload.get("entries") or []) or None)
    with connect(payload.get("database_url") or os.environ.get("DATABASE_URL"), autocommit=True) as conn:
        actor = payload.get("actor")
        service = FilesystemService(
            Repository(conn), store, DatabaseAuthorizer(conn) if actor else OperatorAuthorizer()
        )
        report = run_sync(plan, service, actor=actor, dry_run=not payload.get("apply"))
    return {
        "manifest": plan.name,
        "dry_run": report.dry_run,
        "ok": report.ok,
        "folders": report.summary("folder"),
        "files": report.summary("file"),
        "problems": [{"path": i.path, "outcome": i.outcome, "detail": i.detail} for i in report.problems()[:50]],
    }


def process_info(payload: dict) -> dict:
    """Diagnostic: which process ran this capability (shows CPU-bound work leaving the API process)."""
    import os

    return {"pid": os.getpid()}


def build_default_registry() -> CapabilityRegistry:
    reg = CapabilityRegistry()
    for kind, fn, desc, cpu in [
        ("pdf", extract_pdf, "PDF text, tables and OCR-needed report", True),
        ("geojson", extract_geojson, "GeoJSON features with geometry diagnostics", True),
        ("csv", extract_csv, "CSV rows", False),
        ("json", extract_json, "JSON records", False),
    ]:
        reg.register(Capability(f"extraction.{kind}", "0.1.0", "mzizi-extraction", desc, fn, _SOURCE, cpu_bound=cpu))
    reg.register(
        Capability(
            "engine.process_info",
            "0.1.0",
            "mzizi-engine",
            "Diagnostic: the worker process that ran the job",
            process_info,
            {"type": "object"},
            cpu_bound=True,
        )
    )
    reg.register(
        Capability(
            "scraping.links",
            "0.1.0",
            "mzizi-scraping",
            "Absolute de-duplicated links from HTML",
            scraping_links,
            {"type": "object", "required": ["html", "base_url"]},
        )
    )
    reg.register(
        Capability(
            "manifest.check_seeds",
            "0.1.0",
            "mzizi-manifest",
            "Validate seed manifest, folder metadata and lock",
            manifest_check_seeds,
            {"type": "object"},
        )
    )
    reg.register(
        Capability(
            "manifest.validate_structure",
            "0.1.0",
            "mzizi-manifest",
            "Validate a site-structure bundle directory",
            manifest_validate_structure,
            {"type": "object", "required": ["directory"]},
        )
    )
    reg.register(
        Capability(
            "source.gate",
            "0.1.0",
            "mzizi-source",
            "Collection-gate decision for a request and assessment",
            source_gate,
            {"type": "object", "required": ["request"]},
        )
    )
    reg.register(
        Capability(
            "filesystem.sync",
            "0.2.0",
            "mzizi-filesystem",
            "Plan or apply a manifest sync into the filesystem registry (dry run by default)",
            filesystem_sync,
            {"type": "object", "required": ["manifest"]},
            concurrency=1,
        )
    )
    return reg
