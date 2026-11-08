"""Content-type and extension validation against the shared media catalog (seed/global/reference/media-formats.json).

There are no file-type or extension tables: the normalized extension and the verified content type are stored on each
version. The catalog is read-only reference data; signatures are checked for formats that have a reliable one.
"""
from __future__ import annotations

import json
import re
from functools import lru_cache
from pathlib import Path

from mzizi_manifest.paths import SEED_ROOT

EXT = re.compile(r"^[a-z0-9]{1,16}$")
SIGNATURES = {
    "application/pdf": (b"%PDF-",), "image/png": (b"\x89PNG\r\n\x1a\n",), "image/jpeg": (b"\xff\xd8\xff",), "image/gif": (b"GIF87a", b"GIF89a"),
    "application/zip": (b"PK\x03\x04", b"PK\x05\x06"), "application/gzip": (b"\x1f\x8b",),
}
ZIP_BASED = {"application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation"}
EXTRA = {"json": "application/json", "csv": "text/csv", "md": "text/markdown", "yaml": "application/yaml", "yml": "application/yaml", "txt": "text/plain", "html": "text/html", "geojson": "application/geo+json",
         "log": "text/plain", "dump": "application/octet-stream", "pem": "application/x-pem-file", "sql": "application/sql", "xml": "application/xml"}


class ContentTypeError(ValueError):
    pass


@lru_cache(maxsize=1)
def _catalog() -> dict[str, str]:
    path = SEED_ROOT / "global" / "reference" / "media-formats.json"
    mapping: dict[str, str] = {}
    if path.exists():
        for row in json.loads(path.read_text(encoding="utf-8"))["rows"]:
            values = row["values"]
            mapping.setdefault(values["extension"].lstrip(".").lower(), values["mimeType"])
    return {**EXTRA, **mapping}


def normalize_extension(filename: str) -> str | None:
    suffix = Path(filename).suffix.lstrip(".").lower()
    return suffix if EXT.match(suffix) else None


def resolve(filename: str, head: bytes, declared: str | None = None) -> tuple[str | None, str]:
    """(extension, verified content type) for these bytes. A declared type must agree with the catalog and any signature."""
    ext = normalize_extension(filename)
    cataloged = _catalog().get(ext or "")
    content_type = (declared or cataloged or "application/octet-stream").lower().split(";")[0].strip()
    if declared and cataloged and declared.lower() != cataloged and cataloged != "application/octet-stream":
        raise ContentTypeError(f"declared {declared!r} contradicts the catalog type {cataloged!r} for .{ext}")
    if content_type in ZIP_BASED:
        signature = SIGNATURES["application/zip"]
    else:
        signature = SIGNATURES.get(content_type)
    if signature and not head.startswith(signature):
        raise ContentTypeError(f"bytes do not look like {content_type} (missing signature)")
    return ext, content_type
