"""Seed registry vocabulary: the allowed values, recognized loaders and fixed names shared by the seed modules."""

from __future__ import annotations

import re

ACCESS_RANK = {"public": 0, "internal": 1, "restricted": 2, "private": 3}
ROLES = (
    "test_fixture",
    "seed_input",
    "pattern_definition",
    "site_structure",
    "import_mapping",
    "policy_definition",
    "pipeline_manifest",
    "research_registry",
    "generated_output",
    "evidence",
    "backup",
    "report",
    "log",
    "certificate",
    "object_store",
)
ACQUISITION = ("static_curated", "pattern_generated", "externally_collected", "internally_derived")
PREPARATION = ("human_prepared", "ai_prepared", "human_and_ai_assisted", "programmatically_generated", "unknown")

#: Loaders a manifest may name. A manifest can never make a tool run an arbitrary script or SQL.
LOADERS = frozenset(
    {
        "reference.foundation",
        "reference.countries",
        "auth.baseline",
        "fixtures.entities",
        "database.governance-catalogue",
        "database.expected-sites",
        "database.domain-zones",
        "database.statistical-catalogue",
        "database.office-patterns",
        "database.media-expectations",
        "database.assessment-policy",
        "database.pipeline-release",
        "engine.import-mappings",
        "engine.site-structure",
        "engine.landmark-places",
        "engine.crawl-sections",
        "engine.domain-spellings",
        "engine.office-holders",
        "engine.probe-policy",
        "engine.tag-vocabulary",
        "engine.crawl-policy",
        "engine.wikimedia-config",
        "engine.party-rules",
        "engine.census-order",
        "test.catalogue-checks",
        "none.unconsumed",
    }
)

INHERITED = ("role", "acquisition_class", "preparation", "access", "scope", "review", "seed")
OVERRIDABLE = {"role", "acquisition_class", "preparation", "access", "review"}
MANIFEST_NAME = "manifest.yaml"
LOCK_NAME = "manifest.lock.yaml"
NOT_ARTIFACTS = {
    "README.md",
    "_folder.yaml",
    MANIFEST_NAME,
    LOCK_NAME,
    ".gitignore",
}  # describe the tree; never uploaded
IGNORED_DIRS = {"generated", "local", "cache"}  # git-ignored working directories
LOCAL_ONLY_PREFIX = "_"  # top-level folders beginning with "_" stay local: never in the manifest, never uploaded
FIXTURES_DIR = "_fixtures"  # classified by folder metadata but not seeds
COUNTRIES_DIR = "countries"  # jurisdiction-scoped seeds live under countries/<code>/
VERSIONING = ("versioned", "current")
MEDIA_TYPES = {
    "json": "application/json",
    "geojson": "application/geo+json",
    "csv": "text/csv",
    "yaml": "application/yaml",
    "yml": "application/yaml",
    "html": "text/html",
    "md": "text/markdown",
    "txt": "text/plain",
    "log": "text/plain",
    "xml": "application/xml",
    "pdf": "application/pdf",
}
MAX_BYTES = 2 * 1024 * 1024
SECRET = re.compile(
    r"(BEGIN [A-Z ]*PRIVATE KEY|AKIA[0-9A-Z]{16}|aws_secret_access_key|password\s*[:=]\s*\S+|client_secret\s*[:=]\s*\S+)",
    re.I,
)
ACCESS_PREFIX = {"public": "public", "internal": "internal", "restricted": "restricted", "private": "private"}
