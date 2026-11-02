"""Loading a structure bundle from a directory (or from a mapping of path to text)."""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass
class Bundle:
    root: str
    files: dict[str, str]  # path inside the bundle -> text
    manifest: dict[str, Any] = field(default_factory=dict)
    modules: dict[str, dict] = field(default_factory=dict)
    mappings: dict[str, dict] = field(default_factory=dict)
    tags: dict[str, Any] = field(default_factory=dict)
    examples: dict[str, str] = field(default_factory=dict)
    notes: str = ""
    errors: list[str] = field(default_factory=list)

    def manifest_hash(self) -> str:
        """sha256 of the canonical manifest, as stored on structure versions."""
        return hashlib.sha256(json.dumps(self.manifest, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def _parse(path: str, text: str, errors: list[str]) -> Any:
    try:
        return yaml.safe_load(text)
    except yaml.YAMLError as error:
        errors.append(f"{path}: invalid YAML ({error})")
        return None


def from_files(root: str, files: dict[str, str]) -> Bundle:
    bundle = Bundle(root=root, files=files)
    if "manifest.yml" not in files:
        bundle.errors.append("manifest.yml is missing")
    for path, text in sorted(files.items()):
        if path == "manifest.yml":
            bundle.manifest = _parse(path, text, bundle.errors) or {}
        elif path.startswith("modules/") and path.endswith(".yml"):
            bundle.modules[Path(path).stem] = _parse(path, text, bundle.errors) or {}
        elif path.startswith("mappings/") and path.endswith(".yml"):
            bundle.mappings[Path(path).stem] = _parse(path, text, bundle.errors) or {}
        elif path == "tags.yml":
            bundle.tags = _parse(path, text, bundle.errors) or {}
        elif path == "NOTES.md":
            bundle.notes = text
        elif path.startswith("examples/"):
            bundle.examples[Path(path).name] = text
    return bundle


def load(directory: str | Path) -> Bundle:
    base = Path(directory)
    files = {str(p.relative_to(base)): p.read_text(encoding="utf-8") for p in sorted(base.rglob("*")) if p.is_file()}
    return from_files(str(base), files)
