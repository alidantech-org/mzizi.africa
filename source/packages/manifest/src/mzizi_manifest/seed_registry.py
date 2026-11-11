"""Seed registry: folder metadata resolution, manifest validation and the manifest lock.

`seed/manifest.yaml` (authored) and `seed/manifest.lock.yaml` (generated) are the only seed manifests; per-folder facts live in
`_folder.yaml`. Layout: `global/`, `system/`, `countries/<code>/`; top-level names beginning with `_` are local-only (fixtures,
examples) and are never uploaded. This module only reads and validates; it never uploads, applies or deletes anything. The object
keys it computes are the readable registry paths (`<access><logical_root>/<path>`), a plan, not a claim of publication.
"""
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath
from typing import Any

import yaml

from jsonschema import Draft202012Validator

from .paths import SCHEMA_ROOT, SEED_ROOT

ACCESS_RANK = {"public": 0, "internal": 1, "restricted": 2, "private": 3}
ROLES = ("test_fixture", "seed_input", "pattern_definition", "site_structure", "import_mapping", "policy_definition", "research_registry", "generated_output", "evidence", "backup", "report", "log", "certificate", "object_store")
ACQUISITION = ("static_curated", "pattern_generated", "externally_collected", "internally_derived")
PREPARATION = ("human_prepared", "ai_prepared", "human_and_ai_assisted", "programmatically_generated", "unknown")

#: Loaders a manifest may name. A manifest can never make a tool run an arbitrary script or SQL.
LOADERS = frozenset({
    "reference.foundation",
    "reference.countries",
    "auth.baseline", "fixtures.entities", "database.governance-catalogue", "database.expected-sites", "database.domain-zones",
    "database.statistical-catalogue", "database.office-patterns", "database.media-expectations", "database.assessment-policy",
    "engine.import-mappings", "engine.site-structure", "engine.landmark-places", "engine.crawl-sections", "engine.domain-spellings",
    "engine.office-holders", "engine.probe-policy", "engine.tag-vocabulary", "engine.crawl-policy", "engine.wikimedia-config",
    "engine.party-rules", "engine.census-order", "test.catalogue-checks", "none.unconsumed",
})

INHERITED = ("role", "acquisition_class", "preparation", "access", "scope", "review", "seed")
OVERRIDABLE = {"role", "acquisition_class", "preparation", "access", "review"}
MANIFEST_NAME, LOCK_NAME = "manifest.yaml", "manifest.lock.yaml"
NOT_ARTIFACTS = {"README.md", "_folder.yaml", MANIFEST_NAME, LOCK_NAME, ".gitignore"}  # describe the tree; never uploaded
IGNORED_DIRS = {"generated", "local", "cache"}  # git-ignored working directories
LOCAL_ONLY_PREFIX = "_"  # top-level folders beginning with "_" stay local: never in the manifest, never uploaded
FIXTURES_DIR = "_fixtures"  # classified by folder metadata but not seeds
COUNTRIES_DIR = "countries"  # jurisdiction-scoped seeds live under countries/<code>/
VERSIONING = ("versioned", "current")
MEDIA_TYPES = {"json": "application/json", "geojson": "application/geo+json", "csv": "text/csv", "yaml": "application/yaml", "yml": "application/yaml", "html": "text/html",
               "md": "text/markdown", "txt": "text/plain", "log": "text/plain", "xml": "application/xml", "pdf": "application/pdf"}
MAX_BYTES = 2 * 1024 * 1024
SECRET = re.compile(r"(BEGIN [A-Z ]*PRIVATE KEY|AKIA[0-9A-Z]{16}|aws_secret_access_key|password\s*[:=]\s*\S+|client_secret\s*[:=]\s*\S+)", re.I)
ACCESS_PREFIX = {"public": "public", "internal": "internal", "restricted": "restricted", "private": "private"}


def _load_yaml(path: Path) -> Any:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def read_descriptor(directory: str, root: Path = SEED_ROOT) -> dict | None:
    file = root / directory / "_folder.yaml"
    return (_load_yaml(file) or {}) if file.exists() else None


def _folder_chain(path: str) -> list[str]:
    parts = [p for p in PurePosixPath(path).parent.parts if p and p != "."]
    return ["", *["/".join(parts[: i + 1]) for i in range(len(parts))]]


def validate_descriptors(root: Path = SEED_ROOT) -> list[str]:
    """Descriptor-level validation independent of any file: enumerations, access rules, public authorization."""
    errors: list[str] = []

    def walk(directory: str) -> None:
        descriptor = read_descriptor(directory, root)
        where = f"{directory or '.'}/_folder.yaml"
        if descriptor:
            if descriptor.get("access") and descriptor["access"] not in ACCESS_RANK:
                errors.append(f"{where}: unknown access {descriptor['access']}")
            if descriptor.get("role") and descriptor["role"] not in ROLES:
                errors.append(f"{where}: unknown role {descriptor['role']}")
            if descriptor.get("acquisition_class") and descriptor["acquisition_class"] not in ACQUISITION:
                errors.append(f"{where}: unknown acquisition_class {descriptor['acquisition_class']}")
            if descriptor.get("preparation") and descriptor["preparation"] not in PREPARATION:
                errors.append(f"{where}: unknown preparation {descriptor['preparation']}")
            auth = descriptor.get("authorization") or {}
            if descriptor.get("access") == "public" and not (auth.get("by") and auth.get("date") and auth.get("reference")):
                errors.append(f"{where}: public access needs an authorization block (by, date, reference)")
            scope = descriptor.get("scope") or {}
            if scope.get("kind") == "jurisdiction" and not scope.get("code"):
                errors.append(f"{where}: jurisdiction scope needs a code")
            for name, override in (descriptor.get("overrides") or {}).items():
                if not override.get("reason"):
                    errors.append(f"{where}: override for {name} needs a reason")
                if not (root / directory / name).exists():
                    errors.append(f"{where}: override names a file that does not exist: {name}")
                for key in override:
                    if key != "reason" and key not in OVERRIDABLE:
                        errors.append(f"{where}: override of {key} is not allowed")
                if override.get("access") == "public":
                    errors.append(f"{where}: a per-file override cannot make a file public; use a small authorized folder")
        base = root / directory
        for entry in sorted(base.iterdir()):
            if entry.is_dir() and not (directory == "" and entry.name in IGNORED_DIRS):
                walk(f"{directory}/{entry.name}" if directory else entry.name)

    walk("")
    return errors


def resolve_effective(path: str, root: Path = SEED_ROOT) -> tuple[dict | None, list[str]]:
    """Effective metadata of one artifact: nearest explicit folder value per field, then an explicit file override."""
    errors: list[str] = []
    chain = _folder_chain(path)
    resolved_from: dict[str, str] = {}
    values: dict[str, Any] = {}
    floor: dict | None = None
    for directory in chain:
        descriptor = read_descriptor(directory, root)
        if not descriptor:
            continue
        for field_name in INHERITED:
            if descriptor.get(field_name) is None:
                continue
            if field_name == "access":
                rank = ACCESS_RANK[descriptor["access"]]
                if floor and rank < floor["rank"] and not floor["weaker_ok"]:
                    errors.append(f"{path}: {directory or '.'} weakens access set by {floor['dir'] or '.'}, which does not allow weaker children")
                floor = {"rank": rank, "dir": directory, "weaker_ok": descriptor.get("allow_weaker_children") is True}
            values[field_name] = descriptor[field_name]
            resolved_from[field_name] = f"{directory + '/' if directory else ''}_folder.yaml"
    containing = chain[-1]
    name = path.split("/")[-1]
    override = ((read_descriptor(containing, root) or {}).get("overrides") or {}).get(name)
    file_override: list[str] | None = None
    if override:
        file_override = [k for k in override if k != "reason"]
        for key in file_override:
            if key == "access" and ACCESS_RANK[override["access"]] < (floor["rank"] if floor else 0):
                errors.append(f"{path}: file override weakens access")
            values[key] = override[key]
            resolved_from[key] = f"{containing + '/' if containing else ''}_folder.yaml#overrides/{name}"
    for field_name in ("role", "acquisition_class", "preparation", "scope"):
        if values.get(field_name) is None:
            errors.append(f"{path}: no {field_name} resolved from any folder; classify it before registration")
    scope = values.get("scope")
    parts = path.split("/")
    top = parts[0]
    if scope:
        kind = scope.get("kind")
        if kind == "jurisdiction":
            matches = top == COUNTRIES_DIR and len(parts) > 2 and parts[1] == scope.get("code")
        else:
            matches = top == kind or (kind == "system" and top.startswith(LOCAL_ONLY_PREFIX))
        if not matches:
            errors.append(f"{path}: scope {kind}{':' + scope['code'] if scope.get('code') else ''} does not match its location (global/, system/ or countries/<code>/)")
    if errors:
        return None, errors
    access = values.get("access") or "internal"
    return {
        "role": values["role"], "acquisition_class": values["acquisition_class"], "preparation": values["preparation"], "access": access,
        "access_defaulted": values.get("access") is None, "seed": values.get("seed", True) is not False, "scope": scope, "review": values.get("review"), "resolved_from": resolved_from, "file_override": file_override,
    }, errors


# ---------------------------------------------------------------------- manifest
def load_manifest(root: Path = SEED_ROOT) -> dict:
    return _load_yaml(root / MANIFEST_NAME)


def _all_files(root: Path) -> list[str]:
    """Every file under the seed root except the files that describe it. Git-ignored working directories are never entered."""
    import os

    out = []
    for current, dirs, files in os.walk(root):
        here = Path(current)
        if here == root:
            dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]
        for name in files:
            if name in NOT_ARTIFACTS:
                continue
            path = here / name
            if path.is_file():
                out.append(path.relative_to(root).as_posix())
    return sorted(out)


def artifact_files(root: Path = SEED_ROOT) -> list[str]:
    """Files that are uploaded: everything outside the local-only top-level folders."""
    return [p for p in _all_files(root) if not p.split("/")[0].startswith(LOCAL_ONLY_PREFIX)]


def fixture_files(root: Path = SEED_ROOT) -> list[str]:
    return [p for p in _all_files(root) if p.split("/")[0] == FIXTURES_DIR]


def expand_entry(entry: dict, root: Path = SEED_ROOT) -> list[str]:
    if entry.get("path"):
        return [entry["path"]]
    glob = entry["glob"]
    base = re.sub(r"\*.*$", "", glob)
    pattern = re.compile("^" + re.escape(glob).replace(r"\*\*", "\0").replace(r"\*", "[^/]*").replace("\0", ".*") + "$")
    return [f for f in artifact_files(root) if f.startswith(base) and pattern.match(f)]


def media_type_of(path: str, entry: dict) -> str:
    return entry.get("media_type") or MEDIA_TYPES.get(Path(path).suffix[1:].lower(), "application/octet-stream")


def entry_versioning(entry: dict, manifest: dict) -> str:
    return entry.get("versioning") or (manifest.get("defaults") or {}).get("versioning") or "versioned"


def entry_pinned(entry: dict, manifest: dict) -> bool:
    """A versioned entry pins its revisions to the manifest release unless it says otherwise; a current-only entry is never pinned."""
    if entry_versioning(entry, manifest) == "current":
        return False
    return entry["pin"] if "pin" in entry else (manifest.get("defaults") or {}).get("pin", True)


def object_key(manifest: dict, access: str, path: str) -> str:
    """The readable object key of a seed file: <access><logical_root>/<path under seed/>."""
    return f"{access}{manifest['logical_root']}/{path}"


def _sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def parse_csv(text: str) -> list[list[str]]:
    import csv
    import io

    return [row for row in csv.reader(io.StringIO(text)) if any(cell != "" for cell in row)]


@dataclass
class Validation:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    manifest: dict | None = None


def validate_manifest(root: Path = SEED_ROOT, repo_root: Path | None = None) -> Validation:
    repo_root = repo_root or root.parent
    result = Validation(errors=validate_descriptors(root))
    errors, warnings = result.errors, result.warnings
    try:
        manifest = load_manifest(root)
    except Exception as error:  # noqa: BLE001 - report any unreadable manifest
        errors.append(f"manifest.yaml: {error}")
        return result
    schema = json.loads((SCHEMA_ROOT / "seed" / "manifest.schema.json").read_text(encoding="utf-8"))
    shape = sorted(Draft202012Validator(schema).iter_errors(manifest), key=lambda e: list(e.absolute_path))
    if shape:
        errors.extend(f"manifest.yaml: {'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message}" for e in shape[:20])
        return result
    result.manifest = manifest
    for stray in ("manifests", "manifest.lock.json"):
        if (root / stray).exists():
            errors.append(f"{stray}: only manifest.yaml and manifest.lock.yaml may exist; remove it")
    ids: set[str] = set()
    covered: dict[str, str] = {}
    entries = manifest.get("entries") or []
    for entry in entries:
        eid = entry["id"]
        if not re.fullmatch(r"[a-z0-9][a-z0-9._-]*", eid):
            errors.append(f"{eid}: invalid id")
        if eid in ids:
            errors.append(f"{eid}: duplicate id")
        ids.add(eid)
        if bool(entry.get("path")) == bool(entry.get("glob")):
            errors.append(f"{eid}: needs exactly one of path or glob")
        if bool(entry.get("path")) != bool(entry.get("glob")) and (entry.get("path") or entry["glob"]).split("/")[0].startswith(LOCAL_ONLY_PREFIX):
            errors.append(f"{eid}: local-only folders (names beginning with _) are never manifest entries")
        if entry.get("loader") not in LOADERS:
            errors.append(f"{eid}: loader {entry.get('loader')} is not allowlisted")
        escapes = False
        for target in (entry.get("path"), entry.get("glob")):
            if target and (target.startswith("/") or ".." in target.split("/")):
                errors.append(f"{eid}: path escapes the seed root")
                escapes = True
        files = [] if escapes else expand_entry(entry, root)
        if not files and not escapes:
            errors.append(f"{eid}: matches no files")
        for file in files:
            absolute = root / file
            if not absolute.exists():
                errors.append(f"{eid}: {file} does not exist")
                continue
            if file in covered:
                errors.append(f"{file}: covered by both {covered[file]} and {eid}")
            covered[file] = eid
            if absolute.stat().st_size > MAX_BYTES:
                errors.append(f"{file}: larger than {MAX_BYTES} bytes; large inputs are registered as collected artifacts, not seed files")
            if SECRET.search(absolute.read_text(encoding="utf-8", errors="replace")):
                errors.append(f"{file}: looks like it contains a secret")
            effective, meta_errors = resolve_effective(file, root)
            errors.extend(meta_errors)
            if effective and (effective.get("review") or {}).get("status") == "needs_review":
                warnings.append(f"{file}: classification needs review ({effective['review']['note']})")
            if effective and effective["access_defaulted"]:
                warnings.append(f"{file}: no access policy found; defaulted to internal")
            keys = entry.get("key_columns") or []
            if keys and file.endswith(".csv"):
                header, *rows = parse_csv(absolute.read_text(encoding="utf-8"))
                idx = [header.index(k) if k in header else -1 for k in keys]
                if -1 in idx:
                    errors.append(f"{file}: key column missing from header")
                else:
                    seen: set[tuple] = set()
                    for row in rows:
                        key = tuple(row[i] for i in idx)
                        if key in seen:
                            errors.append(f"{file}: duplicate natural key {'/'.join(key)}")
                        seen.add(key)
            if keys[:1] == ["key"] and file.endswith(".json"):
                row_keys = [r["key"] for r in (json.loads(absolute.read_text(encoding="utf-8")).get("rows") or [])]
                if len(set(row_keys)) != len(row_keys):
                    errors.append(f"{file}: duplicate row keys")
        for consumer in entry.get("consumers") or []:
            cpath = repo_root / consumer
            if not cpath.exists():
                errors.append(f"{eid}: consumer {consumer} does not exist")
                continue
            marker = entry["path"].split("/")[-1] if entry.get("path") else re.sub(r"/?\*.*$", "", entry["glob"]).split("/")[-1]
            if marker not in cpath.read_text(encoding="utf-8", errors="replace"):
                errors.append(f"{eid}: consumer {consumer} does not reference {marker}")
    for entry in entries:
        for dep in entry.get("depends_on") or []:
            if dep not in ids:
                errors.append(f"{entry['id']}: depends on unknown entry {dep}")
    state: dict[str, int] = {}
    by_id = {e["id"]: e for e in entries}

    def visit(eid: str, trail: list[str]) -> None:
        if state.get(eid) == 2:
            return
        if state.get(eid) == 1:
            errors.append(f"dependency cycle: {' -> '.join([*trail, eid])}")
            return
        state[eid] = 1
        for dep in by_id[eid].get("depends_on") or []:
            if dep in by_id:
                visit(dep, [*trail, eid])
        state[eid] = 2

    for eid in ids:
        visit(eid, [])
    for file in artifact_files(root):
        if file not in covered:
            errors.append(f"{file}: not covered by any manifest entry")
    for file in fixture_files(root):
        if file in covered:
            errors.append(f"{file}: test fixtures must not be manifest entries")
        errors.extend(resolve_effective(file, root)[1])
        if SECRET.search((root / file).read_text(encoding="utf-8", errors="replace")):
            errors.append(f"{file}: looks like it contains a secret")
    return result


def resolve_files(manifest: dict, root: Path = SEED_ROOT) -> list[dict]:
    """Every uploadable file of the manifest with its identity, effective folder metadata, versioning and readable object key."""
    out = []
    for entry in manifest["entries"]:
        versioning, pinned, origin = entry_versioning(entry, manifest), entry_pinned(entry, manifest), entry.get("origin")
        for file in expand_entry(entry, root):
            effective, _ = resolve_effective(file, root)
            out.append({
                "path": file, "entry": entry["id"], "loader": entry["loader"], "sha256": _sha256(root / file), "bytes": (root / file).stat().st_size,
                "media_type": media_type_of(file, entry), "effective": effective, "versioning": versioning, "pin": pinned,
                "origin": origin if isinstance(origin, str) else (origin or {}).get(file),
                "key": object_key(manifest, effective["access"], file),
            })
    return sorted(out, key=lambda f: f["path"])


def manifest_sha256(root: Path = SEED_ROOT) -> str:
    return hashlib.sha256((root / MANIFEST_NAME).read_bytes()).hexdigest()


def build_lock(manifest: dict, root: Path = SEED_ROOT) -> dict:
    """The lock: one line of identity per file. It records no upload state; publication state lives in the filesystem registry."""
    return {
        "schema_version": 2, "release": manifest["release"], "manifest_sha256": manifest_sha256(root), "bucket": manifest["bucket"], "region": manifest["region"],
        "logical_root": manifest["logical_root"],
        "files": {f["path"]: {"entry": f["entry"], "sha256": f["sha256"], "bytes": f["bytes"], "media_type": f["media_type"], "access": f["effective"]["access"],
                              "versioning": f["versioning"], "key": f["key"]} for f in resolve_files(manifest, root)},
    }


def dump_lock(lock: dict) -> str:
    """YAML with one flow-style line per file, so a changed file is a one-line diff."""
    head = {k: v for k, v in lock.items() if k != "files"}
    lines = ["# Generated by `uv run mzizi-manifest lock` from manifest.yaml, the _folder.yaml descriptors and the files. Do not edit.",
             "# It plans identities and readable object keys; it records no upload state (that lives in the filesystem registry).",
             yaml.safe_dump(head, sort_keys=False, default_flow_style=False).rstrip(), "files:"]
    lines += [f"  {json.dumps(path, ensure_ascii=False)}: {json.dumps(value, ensure_ascii=False)}" for path, value in lock["files"].items()]
    return "\n".join(lines) + "\n"
