"""Ports for local files, manifests and the filesystem."""

from __future__ import annotations

from mzizi_cli.features.ports.models import Port, binary, declare

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
    declare("filesystem.register", "mzizi-filesystem", "Register bytes at a caller-chosen placement", 2),
    declare("filesystem.sync_directory", "mzizi-filesystem", "Register a directory tree under caller-named folders", 2),
    declare("filesystem.upload_begin", "mzizi-filesystem", "Presigned upload URL to a temporary key", 2),
    declare("filesystem.upload_finish", "mzizi-filesystem", "Register uploaded bytes", 2),
    declare("filesystem.download", "mzizi-filesystem", "Presigned download link for a version", 2),
    declare("filesystem.relate", "mzizi-filesystem", "Record that one version was derived from another", 2),
    declare("filesystem.lineage", "mzizi-filesystem", "Ancestry and derivatives of a version", 2),
    declare("filesystem.change_access", "mzizi-filesystem", "Change a folder subtree's access class", 2),
    declare("filesystem.move_folder", "mzizi-filesystem", "Move or rename a folder", 2),
    declare("filesystem.move_file", "mzizi-filesystem", "Move or rename a file", 2),
    declare("scraping.links", "mzizi-crawler", "Absolute, de-duplicated links from HTML", 3),
    declare("scraping.extract", "mzizi-crawler", "Apply a site module to saved HTML", 3),
    declare("scraping.select", "mzizi-crawler", "Run a CSS selector on saved HTML", 3),
    declare(
        "fetch.policy",
        "mzizi-fetch",
        "Parse a manifest policy block into effective limits",
        3,
        "`parse_policy` is not exposed as a capability.",
    ),
)
