"""Seed manifest validation: checks `seed/manifest.yaml` against its schema, the folder metadata and the files on disk."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from jsonschema import Draft202012Validator

from mzizi_manifest.paths import SCHEMA_ROOT, SEED_ROOT
from mzizi_manifest.seed_folders import (
    artifact_files,
    expand_entry,
    fixture_files,
    load_manifest,
    parse_csv,
    resolve_effective,
    validate_descriptors,
)
from mzizi_manifest.seed_vocabulary import LOADERS, LOCAL_ONLY_PREFIX, MAX_BYTES, SECRET


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
    except Exception as error:
        errors.append(f"manifest.yaml: {error}")
        return result
    schema = json.loads((SCHEMA_ROOT / "seed" / "manifest.schema.json").read_text(encoding="utf-8"))
    shape = sorted(Draft202012Validator(schema).iter_errors(manifest), key=lambda e: list(e.absolute_path))
    if shape:
        errors.extend(
            f"manifest.yaml: {'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message}" for e in shape[:20]
        )
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
        if bool(entry.get("path")) != bool(entry.get("glob")) and (entry.get("path") or entry["glob"]).split("/")[
            0
        ].startswith(LOCAL_ONLY_PREFIX):
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
                errors.append(
                    f"{file}: larger than {MAX_BYTES} bytes; large inputs are registered as collected artifacts, not seed files"
                )
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
            marker = (
                entry["path"].split("/")[-1]
                if entry.get("path")
                else re.sub(r"/?\*.*$", "", entry["glob"]).split("/")[-1]
            )
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
