"""Seed folder metadata and file discovery: `_folder.yaml` descriptors, inherited effective facts and manifest entry expansion.

Read-only: nothing here uploads, applies or deletes.
"""

from __future__ import annotations

import hashlib
import re
from pathlib import Path, PurePosixPath
from typing import Any

import yaml

from mzizi_manifest.paths import SEED_ROOT
from mzizi_manifest.seed_vocabulary import (
    ACCESS_RANK,
    ACQUISITION,
    COUNTRIES_DIR,
    FIXTURES_DIR,
    IGNORED_DIRS,
    INHERITED,
    LOCAL_ONLY_PREFIX,
    MANIFEST_NAME,
    MEDIA_TYPES,
    NOT_ARTIFACTS,
    OVERRIDABLE,
    PREPARATION,
    ROLES,
)


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
            if descriptor.get("access") == "public" and not (
                auth.get("by") and auth.get("date") and auth.get("reference")
            ):
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
                    errors.append(
                        f"{where}: a per-file override cannot make a file public; use a small authorized folder"
                    )
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
                    errors.append(
                        f"{path}: {directory or '.'} weakens access set by {floor['dir'] or '.'}, which does not allow weaker children"
                    )
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
            errors.append(
                f"{path}: scope {kind}{':' + scope['code'] if scope.get('code') else ''} does not match its location (global/, system/ or countries/<code>/)"
            )
    if errors:
        return None, errors
    access = values.get("access") or "internal"
    return {
        "role": values["role"],
        "acquisition_class": values["acquisition_class"],
        "preparation": values["preparation"],
        "access": access,
        "access_defaulted": values.get("access") is None,
        "seed": values.get("seed", True) is not False,
        "scope": scope,
        "review": values.get("review"),
        "resolved_from": resolved_from,
        "file_override": file_override,
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
