"""Read a tree of manifests into a registry.

A file is classified by its top-level keys, not its folder, so the same scan works on `seed/` and on the `_example/`
folders under `source/schema/`:

- a source has `code` and `kind` (`website` or `api`);
- a mapping has `code` and `yields`;
- a term list has `code` and `terms`;
- engine data has `code` and `url_kinds` (the web classification the fetch package reads);
- a job spec has `code`, `spec_version` and `stages`;
- a module has `module`; its `mapping` is checked in the scope of the source folder that owns it.

Anything else (the seed manifest, folder descriptors, schemas, CSV, notes) is not a manifest with a code and is skipped.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from mzizi_manifest.features.registry.areas import Areas, load_areas
from mzizi_manifest.features.registry.registry import Entry, Kind, Reference, Registry, check

SUFFIXES = {".yml", ".yaml", ".json"}
SKIPPED_NAMES = {"manifest.lock.yaml", "_folder.yaml"}
SOURCE_KINDS = {"website", "api"}


@dataclass
class Scan:
    registry: Registry
    problems: list[str] = field(default_factory=list)


def _documents(root: Path) -> list[tuple[Path, dict]]:
    found: list[tuple[Path, dict]] = []
    for path in sorted(root.rglob("*")):
        if path.suffix not in SUFFIXES or path.name in SKIPPED_NAMES or path.name.endswith(".schema.json"):
            continue
        if not path.is_file():
            continue
        try:
            text = path.read_text(encoding="utf-8")
            document = json.loads(text) if path.suffix == ".json" else yaml.safe_load(text)
        except (OSError, ValueError, yaml.YAMLError) as problem:
            found.append((path, {"__error__": str(problem).splitlines()[0]}))
            continue
        if isinstance(document, dict):
            found.append((path, document))
    return found


def _codes(document: dict, key: str) -> list[str]:
    value = (document.get("uses") or {}).get(key) or []
    return [item for item in value if isinstance(item, str)]


def _kind(document: dict) -> Kind | None:
    if not isinstance(document.get("code"), str):
        return None
    if document.get("kind") in SOURCE_KINDS:
        return Kind.SOURCE
    if "yields" in document:
        return Kind.MAPPING
    if "terms" in document:
        return Kind.TERMS
    if "url_kinds" in document:
        return Kind.ENGINE
    if "stages" in document and "spec_version" in document:
        return Kind.JOB
    return None


def _references(document: dict, kind: Kind) -> list[Reference]:
    if kind is not Kind.SOURCE:
        return []
    references = [
        Reference(f"uses.mappings[{i}]", code, Kind.MAPPING) for i, code in enumerate(_codes(document, "mappings"))
    ]
    references += [Reference(f"uses.terms[{i}]", code, Kind.TERMS) for i, code in enumerate(_codes(document, "terms"))]
    if isinstance(document.get("extends"), str):
        references.append(Reference("extends", document["extends"], Kind.SOURCE))
    return references


def _owner(path: Path, sources: dict[Path, str], root: Path) -> tuple[str | None, str | None]:
    """The source that owns a module: the only source file in the nearest ancestor folder that has one."""
    for folder in path.parents:
        here = [code for file, code in sources.items() if file.parent == folder]
        if len(here) == 1:
            return here[0], None
        if len(here) > 1:
            return None, f"{len(here)} sources share the folder {folder}"
        if folder == root:
            break
    return None, "no source manifest in a folder above it"


KIND_FOLDERS = {
    Kind.SOURCE: "sources",
    Kind.MAPPING: "mappings",
    Kind.TERMS: "terms",
    Kind.JOB: "engine",
    Kind.ENGINE: "engine",
}


def mirror_problems(entry: Entry) -> list[str]:
    """A file's folder path mirrors its code: `mappings/ke/governance/holders/office-holders.yml`.

    A source's code is the folder that holds its manifest (`sources/ke/source/websites/iebc/manifest.yml`). Engine data and
    job specs are flat: `<scope>.engine.<rest>` lives at `engine/<rest>`, with a `<scope>/` folder only when the scope is not
    `global` (`engine/web/classification.yaml`, `engine/jobs/<name>.json`, `engine/sw/web/classification.yaml`).
    """
    parts, segments = entry.path.parts, entry.code.split(".")
    expected_folder = KIND_FOLDERS[entry.kind]
    if entry.kind is Kind.SOURCE:
        mirrored = list(parts[1:-1]) == segments
        shown = "/".join([expected_folder, *segments, "<manifest>"])
    elif entry.kind in (Kind.ENGINE, Kind.JOB):
        rest = segments[2:] or segments[-1:]
        folders = ([] if segments[0] == "global" else [segments[0]]) + rest[:-1]
        mirrored = list(parts[1:-1]) == folders and Path(parts[-1]).stem == rest[-1]
        shown = "/".join([expected_folder, *folders, f"{rest[-1]}.<ext>"])
    else:
        mirrored = list(parts[1:-1]) == segments[:-1] and Path(parts[-1]).stem == segments[-1]
        shown = "/".join([expected_folder, *segments[:-1], f"{segments[-1]}.yml"])
    if parts[:1] == (expected_folder,) and mirrored:
        return []
    return [f"{entry.path}: the path must mirror the code {entry.code!r}: {shown}"]


def _detail(document: dict, kind: Kind) -> str | None:
    if kind is Kind.SOURCE:
        return document.get("kind")
    if kind is Kind.MAPPING:
        yields = document.get("yields")
        first = yields[0] if isinstance(yields, list) and yields and isinstance(yields[0], dict) else {}
        return first.get("table") if isinstance(first.get("table"), str) else None
    return None


def scan(root: Path, *, mirror_paths: bool = True, areas: Areas | None = None) -> Scan:
    """Build the registry of `root` and collect every problem, including the registry checks.

    `mirror_paths` also requires each file's folder path to mirror its code; the `_example/` folders are flat and turn it off.
    """
    result = Scan(Registry({}))
    entries: dict[str, Entry] = {}
    sources: dict[Path, str] = {}
    modules: list[tuple[Path, dict]] = []
    for path, document in _documents(root):
        shown = path.relative_to(root) if path.is_relative_to(root) else path
        if "__error__" in document:
            result.problems.append(f"{shown}: unreadable ({document['__error__']})")
            continue
        if "module" in document and "code" not in document:
            modules.append((path, document))
            continue
        kind = _kind(document)
        if kind is None:
            continue
        code = document["code"]
        if code in entries:
            result.problems.append(f"{shown}: duplicate code {code!r}, already declared in {entries[code].path}")
            continue
        entries[code] = Entry(code, kind, shown, tuple(_references(document, kind)), _detail(document, kind))
        if kind is Kind.SOURCE:
            sources[path] = code
    for path, document in modules:
        shown = path.relative_to(root) if path.is_relative_to(root) else path
        named = document.get("mapping")
        if not isinstance(named, str):
            continue
        owner, why = _owner(path, sources, root)
        if owner is None:
            result.problems.append(f"{shown}: mapping {named!r} cannot be checked: {why}")
            continue
        owning = entries[owner]
        entries[owner] = Entry(
            owning.code,
            owning.kind,
            owning.path,
            (*owning.references, Reference(f"module {shown}: mapping", named, Kind.MAPPING)),
            owning.detail,
        )
    result.registry = Registry(entries)
    result.problems += check(result.registry, areas or load_areas())
    if mirror_paths:
        for entry in entries.values():
            result.problems += mirror_problems(entry)
    return result
