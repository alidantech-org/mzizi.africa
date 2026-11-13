"""Ports for local files, manifests and the filesystem."""

from __future__ import annotations

from mzizi_engine.devcli.ports.models import Port, binary, declare

TESSERACT = binary("tesseract", hint="install Tesseract (e.g. `sudo dnf install tesseract`)")

CORE: tuple[Port, ...] = (
    declare("extraction.pdf", "mzizi-extraction", "PDF text, tables and OCR-needed report", 1),
    declare("extraction.markdown", "mzizi-extraction", "PDF to structured Markdown with figures, tables and OCR", 1),
    declare("extraction.csv", "mzizi-extraction", "CSV rows", 1),
    declare("extraction.json", "mzizi-extraction", "JSON records", 1),
    declare("extraction.geojson", "mzizi-extraction", "GeoJSON features with geometry diagnostics", 1),
    declare(
        "extraction.ocr",
        "mzizi-extraction",
        "OCR a scanned PDF or image",
        1,
        "Needs an OCR capability wrapper around the Tesseract extractor.",
        TESSERACT,
    ),
    declare(
        "extraction.auto",
        "mzizi-extraction",
        "Sniff file type and pick an extractor",
        1,
        "Type sniffing over `EXTRACTORS` is not written yet.",
    ),
    declare("manifest.check_seeds", "mzizi-manifest", "Validate the seed manifest, folders and lock", 2),
    declare("manifest.validate_structure", "mzizi-manifest", "Validate a site-structure bundle directory", 2),
    declare(
        "manifest.explain",
        "mzizi-manifest",
        "Show the effective manifest after folder inheritance",
        2,
        "Effective-manifest rendering is not exposed as a capability yet.",
    ),
    declare(
        "filesystem.hash",
        "mzizi-filesystem",
        "Content hash, size, type and dedup key",
        2,
        "Hashing is in the package but has no capability wrapper.",
    ),
    declare(
        "filesystem.put",
        "mzizi-filesystem",
        "Upload a folder to a local or S3 object store",
        2,
        "Needs a local-directory object store and a dry-run planner.",
    ),
    declare("scraping.links", "mzizi-scraping", "Absolute, de-duplicated links from HTML", 3),
    declare("scraping.extract", "mzizi-scraping", "Apply a site module to saved HTML", 3),
    declare("scraping.select", "mzizi-scraping", "Run a CSS selector on saved HTML", 3),
    declare(
        "fetch.policy",
        "mzizi-fetch",
        "Parse a manifest policy block into effective limits",
        3,
        "`parse_policy` is not exposed as a capability.",
    ),
)
