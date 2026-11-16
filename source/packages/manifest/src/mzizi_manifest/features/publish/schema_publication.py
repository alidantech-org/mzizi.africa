"""Where each schema is published: its object key, its public URL and the checks that its `$id` is that URL.

Schemas are served anonymously from the public prefix of the object store, so an editor or a `$ref` can fetch them. This
module only plans; uploading belongs to the caller (the engine's `publish-schemas` command).
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from pathlib import Path

#: Public origin of the bucket (S3_PUBLIC_ORIGIN) plus the public prefix every schema key sits under.
BASE_URL = "https://res.alidantech.org/mzizi/public/schemas"
KEY_PREFIX = "public/schemas"
FOLDERS = ("database", "engine", "extraction", "mapping", "seed", "sources", "vocabulary")
CONTENT_TYPE = "application/schema+json"


@dataclass(frozen=True)
class PublishedFile:
    path: Path
    key: str
    url: str
    sha256: str
    size: int
    content_type: str = CONTENT_TYPE


def url_for(relative: str) -> str:
    return f"{BASE_URL}/{relative}"


def plan(schema_root: Path) -> tuple[PublishedFile, ...]:
    """Every published schema file: `<folder>/<name>.schema.json`; `_example/` folders are not published."""
    files = []
    for folder in FOLDERS:
        for path in sorted((schema_root / folder).glob("*.schema.json")):
            data = path.read_bytes()
            relative = f"{folder}/{path.name}"
            files.append(
                PublishedFile(
                    path=path,
                    key=f"{KEY_PREFIX}/{relative}",
                    url=url_for(relative),
                    sha256=hashlib.sha256(data).hexdigest(),
                    size=len(data),
                )
            )
    return tuple(files)


def id_problems(schema_root: Path) -> list[str]:
    """Hand-written schemas must declare an `$id` equal to their public URL, so relative `$ref`s resolve there."""
    problems = []
    for item in plan(schema_root):
        document = json.loads(item.path.read_text(encoding="utf-8"))
        declared = document.get("$id")
        if declared is not None and declared != item.url:
            problems.append(f"{item.path.name}: $id {declared!r} is not its public URL {item.url!r}")
    return problems
