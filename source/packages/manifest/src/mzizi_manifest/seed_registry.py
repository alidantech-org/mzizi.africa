"""Seed registry: folder metadata resolution, manifest validation and the manifest lock.

Folder metadata (`_folder.yaml`) and `manifest.yaml` are described in seed/README.md. This module only reads and
validates; it never uploads, applies or deletes anything. Object keys it computes are mappings, not claims.
"""
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath
from typing import Any

import yaml

from .paths import SEED_ROOT

ACCESS_RANK = {"public": 0, "internal": 1, "restricted": 2, "private": 3}
ROLES = ("test_fixture", "seed_input", "pattern_definition", "site_structure", "import_mapping", "policy_definition", "research_registry", "generated_output")
ACQUISITION = ("static_curated", "pattern_generated", "externally_collected", "internally_derived")
PREPARATION = ("human_prepared", "ai_prepared", "human_and_ai_assisted", "programmatically_generated", "unknown")

#: Loaders a manifest may name. A manifest can never make a tool run an arbitrary script or SQL.
LOADERS = frozenset({
    "auth.baseline", "fixtures.entities", "database.governance-catalogue", "database.expected-sites", "database.domain-zones",
    "database.statistical-catalogue", "database.office-patterns", "database.media-expectations", "database.assessment-policy",
    "engine.import-mappings", "engine.site-structure", "engine.landmark-places", "engine.crawl-sections", "engine.domain-spellings",
    "engine.office-holders", "engine.probe-policy", "engine.tag-vocabulary", "engine.crawl-policy", "engine.wikimedia-config",
    "engine.party-rules", "engine.census-order", "test.catalogue-checks", "none.unconsumed",
})

INHERITED = ("role", "acquisition_class", "preparation", "access", "scope", "review")
OVERRIDABLE = {"role", "acquisition_class", "preparation", "access", "review"}
NOT_ARTIFACTS = {"README.md", "_folder.yaml", "manifest.yaml", "manifest.lock.json", ".gitignore"}
IGNORED_DIRS = {"generated", "local", "cache", "examples"}
FIXTURES_DIR = "fixtures"  # classified by folder metadata but not seeds: no manifest entry, never registered
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
    top = path.split("/")[0]
    if scope:
        kind = scope.get("kind")
        expected = "global" if kind == "global" else "system" if kind == "system" else scope.get("code")
        if top != expected and not (top == FIXTURES_DIR and kind == "system"):
            errors.append(f"{path}: scope {kind}{':' + scope['code'] if scope.get('code') else ''} does not match its top-level folder {top}")
    if errors:
        return None, errors
    access = values.get("access") or "internal"
    return {
        "role": values["role"], "acquisition_class": values["acquisition_class"], "preparation": values["preparation"], "access": access,
        "access_defaulted": values.get("access") is None, "scope": scope, "review": values.get("review"), "resolved_from": resolved_from, "file_override": file_override,
    }, errors


# ---------------------------------------------------------------------- manifest
def load_manifest(root: Path = SEED_ROOT) -> dict:
    return _load_yaml(root / "manifest.yaml")


def _all_files(root: Path) -> list[str]:
    out = []
    for file in sorted(root.rglob("*")):
        if not file.is_file():
            continue
        rel = file.relative_to(root).as_posix()
        if rel.split("/")[0] in IGNORED_DIRS or file.name in NOT_ARTIFACTS:
            continue
        out.append(rel)
    return sorted(out)


def artifact_files(root: Path = SEED_ROOT) -> list[str]:
    return [p for p in _all_files(root) if p.split("/")[0] != FIXTURES_DIR]


def fixture_files(root: Path = SEED_ROOT) -> list[str]:
    return [p for p in _all_files(root) if p.split("/")[0] == FIXTURES_DIR]


def expand_entry(entry: dict, root: Path = SEED_ROOT) -> list[str]:
    if entry.get("path"):
        return [entry["path"]]
    glob = entry["glob"]
    base = re.sub(r"\*.*$", "", glob)
    pattern = re.compile("^" + re.escape(glob).replace(r"\*\*", "\0").replace(r"\*", "[^/]*").replace("\0", ".*") + "$")
    return [f for f in artifact_files(root) if f.startswith(base) and pattern.match(f)]


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
    result.manifest = manifest
    if manifest.get("schema_version") != 1:
        errors.append("manifest.yaml: schema_version must be 1")
    if manifest.get("bucket") != "mzizi":
        errors.append("manifest.yaml: bucket must be mzizi (no new buckets)")
    if manifest.get("region") != "us-east-1":
        errors.append("manifest.yaml: region must be us-east-1")
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
                errors.append(f"{file}: larger than {MAX_BYTES} bytes; large inputs belong in generated/ with a regeneration recipe")
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


def build_lock(manifest: dict, root: Path = SEED_ROOT) -> dict:
    manifest_text = (root / "manifest.yaml").read_text(encoding="utf-8")
    entries = []
    for entry in manifest["entries"]:
        files = []
        for file in expand_entry(entry, root):
            effective, _ = resolve_effective(file, root)
            digest = _sha256(root / file)
            if entry.get("path"):
                base = re.sub(r"\.[^.]+$", "", file.split("/")[-1])
            else:
                glob_base = re.sub(r"[^/]*\*.*$", "", entry["glob"])
                base = re.sub(r"\.[^./]+$", "", file[len(glob_base):])
            ext = Path(file).suffix[1:]
            reloc = entry.get("relocated_from")
            files.append({
                "path": file, "sha256": digest, "bytes": (root / file).stat().st_size, "media_type": entry["media_type"],
                "relocated_from": reloc if isinstance(reloc, str) else (reloc or {}).get(file),
                "effective": effective, "bucket": manifest["bucket"],
                "object_key": f"{ACCESS_PREFIX[effective['access']]}/seeds/{entry['id'].replace('.', '/')}/{manifest['release']}/{base}.{digest[:16]}.{ext}",
                "upload_status": "not_uploaded",
            })
        entries.append({"id": entry["id"], "loader": entry["loader"], "target": entry["target"], "database_target_state": entry["database_target_state"], "depends_on": entry["depends_on"], "sync_policy": entry["sync_policy"], "files": files})
    return {
        "release": manifest["release"], "manifest_sha256": hashlib.sha256(manifest_text.encode()).hexdigest(),
        "generated_by": "mzizi-manifest lock (source/packages/manifest); programmatic, no model involved",
        "bucket": manifest["bucket"], "region": manifest["region"],
        "note": "upload_status is always not_uploaded here: no artifact has been uploaded or verified in S3 by this lock. Object keys are mappings only.",
        "entries": entries,
    }


def dump_lock(lock: dict) -> str:
    return json.dumps(lock, indent=2, ensure_ascii=False) + "\n"
