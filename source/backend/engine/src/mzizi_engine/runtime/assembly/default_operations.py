"""The default operations the engine registers: handlers over package capabilities, with version and input contract.

An operation (see `runtime.operations`) is a named, versioned function of a package. Handlers take and return JSON-able dicts and live at module
level so they can run in worker processes. Source, country and publisher knowledge never appears here: callers pass it
as data (manifests, inputs). Registering a capability is code; a request can only name one that is registered.
"""

from __future__ import annotations

import base64
from collections.abc import Callable

from mzizi_engine import __version__
from mzizi_engine.config import EngineConfig
from mzizi_engine.jsonvalue import Payload
from mzizi_engine.runtime.assembly.crawler_settings import configure_acquisition
from mzizi_engine.runtime.assembly.seed_catalog import SEED_CATALOG_OPERATION, seed_catalog
from mzizi_engine.runtime.assembly.specs import register_specs
from mzizi_engine.runtime.contracts.seed_catalog import SeedCatalogRequest
from mzizi_engine.runtime.operations import Operation, OperationRegistry, Requirement, operation


def _bytes_input(payload: dict) -> bytes:
    """`content_base64` or a `path` below the configured input root (default: the repository seed folder)."""
    if "content_base64" in payload:
        return base64.b64decode(payload["content_base64"])
    from mzizi_manifest.shared.paths import SEED_ROOT

    root = (EngineConfig.load().crawler.input_root or SEED_ROOT).resolve()
    target = (root / payload["path"]).resolve()
    if root not in target.parents and target != root:
        raise ValueError("path escapes the engine input root")
    return target.read_bytes()


_SOURCE: Payload = {
    "type": "object",
    "properties": {"content_base64": {"type": "string"}, "path": {"type": "string"}, "profile": {"type": "string"}},
    "anyOf": [{"required": ["content_base64"]}, {"required": ["path"]}],
}


_MARKDOWN_SCHEMA: Payload = {
    "type": "object",
    "properties": {
        "content_base64": {"type": "string"},
        "path": {"type": "string"},
        "profile": {"type": "string"},
        "ocr": {"enum": ["auto", "off", "force"]},
        "languages": {"type": "string"},
        "page_renders": {"type": "boolean"},
        "strict_table_lines": {"type": "boolean"},
        "auto_tables": {"type": "boolean"},
        "first_page": {"type": "integer", "minimum": 1},
        "last_page": {"type": "integer", "minimum": 1},
        "table_schema_json": {"type": "string"},
        "caption_labels": {"type": "array", "items": {"type": "string"}},
    },
    "anyOf": [{"required": ["content_base64"]}, {"required": ["path"]}],
}

# Feature-name property keys, until profiles carry them from manifests (tracked in the patterns task).
_INPUT = frozenset({Requirement.INPUT_ROOT})

_NAME_KEYS = ("shapeName", "name", "NAME", "NAME_1", "NAME_2", "ADM1_EN", "ADM2_EN", "COUNTY", "county")


def _extract(name: str) -> Callable[[dict], dict]:
    def run(payload: dict) -> dict:
        from mzizi_extraction import EXTRACTORS, encode_output, parse_profile

        out = EXTRACTORS[name](_bytes_input(payload), parse_profile(payload.get("profile"), _NAME_KEYS))
        return encode_output(out).model_dump(mode="json")

    run.__name__ = f"extract_{name}"
    return run


def extract_markdown(payload: dict) -> dict:
    """Structured PDF extraction: Markdown, figures and page renders as files, tables as CSV, a typed structure tree."""
    from mzizi_extraction import DocumentProfile, TableSchema, encode_document, extract_pdf_document

    options = {
        k: payload[k]
        for k in (
            "ocr",
            "languages",
            "tables",
            "figures",
            "page_renders",
            "strict_table_lines",
            "caption_labels",
            "auto_tables",
            "first_page",
            "last_page",
        )
        if k in payload
    }
    if "caption_labels" in options:
        options["caption_labels"] = tuple(options["caption_labels"])
    if "table_schema_json" in payload:
        options["table_schema"] = TableSchema.model_validate_json(payload["table_schema_json"])
    profile = DocumentProfile.model_validate(options, strict=False)
    wire = encode_document(extract_pdf_document(_bytes_input(payload), profile))
    return wire.model_dump(mode="json", exclude={"table_review"} if wire.table_review is None else None)


def extract_pdf(payload: dict) -> dict:
    return _extract("pdf")(payload)


def extract_geojson(payload: dict) -> dict:
    return _extract("geojson")(payload)


def extract_csv(payload: dict) -> dict:
    return _extract("csv")(payload)


def extract_json(payload: dict) -> dict:
    return _extract("json")(payload)


def scraping_links(payload: dict) -> dict:
    from mzizi_crawler.shared.scraping import extract_links

    return {
        "links": [{"url": link.url, "text": link.text} for link in extract_links(payload["html"], payload["base_url"])]
    }


def manifest_check_seeds(payload: dict) -> dict:
    from mzizi_manifest.features.seeds import seed_registry as seeds

    result = seeds.validate_manifest()
    entries = len((result.manifest or {}).get("entries", []))
    return {"ok": not result.errors, "entries": entries, "errors": result.errors, "warnings": len(result.warnings)}


def manifest_validate_structure(payload: dict) -> dict:
    from mzizi_crawler.shared.bundles import bundle
    from mzizi_crawler.shared.bundles.validate import validate

    return validate(bundle.load(payload["directory"])).to_json()


def source_gate(payload: dict) -> dict:
    from mzizi_engine.runtime.policy import decide

    decision = decide(payload.get("assessment"), payload.get("dossier_stage"), payload["request"])
    return decision.model_dump(mode="json")


def process_info(payload: dict) -> dict:
    """Diagnostic: which process ran this capability (shows CPU-bound work leaving the API process)."""
    import os

    return {"pid": os.getpid()}


def build_default_registry(config: EngineConfig | None = None) -> OperationRegistry:
    from mzizi_crawler import configure_activity
    from mzizi_engine.persistence.mongo.activity import activity_opener

    config = config or EngineConfig.load()
    configure_activity(activity_opener(config))
    configure_acquisition(config.crawler)
    return build_operation_registry()


def build_operation_registry() -> OperationRegistry:
    """Describe the operations without configuring or opening acquisition services."""
    from mzizi_engine.runtime.assembly.crawler_operations import register_crawler

    reg = OperationRegistry()
    register_crawler(reg)
    register_specs(
        reg,
        (operation(SEED_CATALOG_OPERATION, "Read seed contracts generated by Dryv", SeedCatalogRequest, seed_catalog),),
        "mzizi-engine",
        __version__,
    )
    from mzizi_engine.runtime.assembly.filesystem_operations import register_filesystem

    register_filesystem(reg)
    from mzizi_engine.runtime.assembly.search_operations import register_search

    register_search(reg)
    for kind, fn, desc, cpu in [
        ("pdf", extract_pdf, "PDF text, tables and OCR-needed report", True),
        ("geojson", extract_geojson, "GeoJSON features with geometry diagnostics", True),
        ("csv", extract_csv, "CSV rows", False),
        ("json", extract_json, "JSON records", False),
    ]:
        reg.register(
            Operation(
                f"extraction.{kind}", "0.1.0", "mzizi-extraction", desc, fn, _SOURCE, cpu_bound=cpu, requires=_INPUT
            )
        )
    reg.register(
        Operation(
            "extraction.markdown",
            "0.1.0",
            "mzizi-extraction",
            "PDF to structured Markdown: headings, bold/italic, lists, tables, figures, per-page OCR",
            extract_markdown,
            _MARKDOWN_SCHEMA,
            cpu_bound=True,
            requires=_INPUT,
        )
    )
    reg.register(
        Operation(
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
        Operation(
            "scraping.links",
            "0.1.0",
            "mzizi-crawler",
            "Absolute de-duplicated links from HTML",
            scraping_links,
            {"type": "object", "required": ["html", "base_url"]},
        )
    )
    reg.register(
        Operation(
            "manifest.check_seeds",
            "0.1.0",
            "mzizi-manifest",
            "Validate seed manifest, folder metadata and lock",
            manifest_check_seeds,
            {"type": "object"},
        )
    )
    reg.register(
        Operation(
            "manifest.validate_structure",
            "0.1.0",
            "mzizi-manifest",
            "Validate a site-structure bundle directory",
            manifest_validate_structure,
            {"type": "object", "required": ["directory"]},
        )
    )
    reg.register(
        Operation(
            "source.gate",
            "0.1.0",
            "mzizi-engine",
            "Collection-gate decision for a request and assessment",
            source_gate,
            {"type": "object", "required": ["request"]},
        )
    )
    return reg
