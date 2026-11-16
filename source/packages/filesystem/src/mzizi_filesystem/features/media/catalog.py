"""Content-type and extension validation against a media catalog the caller supplies.

There are no file-type or extension tables: the normalized extension and the verified content type are stored on each
version. The catalog is reference data passed in (extension to media type); this module reads no file and names no path.
Signatures are checked for formats that have a reliable one.
"""

from __future__ import annotations

import re
from collections.abc import Mapping
from pathlib import Path

EXT = re.compile(r"^[a-z0-9]{1,16}$")
SIGNATURES = {
    "application/pdf": (b"%PDF-",),
    "image/png": (b"\x89PNG\r\n\x1a\n",),
    "image/jpeg": (b"\xff\xd8\xff",),
    "image/gif": (b"GIF87a", b"GIF89a"),
    "application/zip": (b"PK\x03\x04", b"PK\x05\x06"),
    "application/gzip": (b"\x1f\x8b",),
}
ZIP_BASED = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
}
#: Formats true of the protocol world, not of any source: always known, overridden by the caller's catalog.
BASE_TYPES = {
    "json": "application/json",
    "csv": "text/csv",
    "md": "text/markdown",
    "yaml": "application/yaml",
    "yml": "application/yaml",
    "txt": "text/plain",
    "html": "text/html",
    "geojson": "application/geo+json",
    "log": "text/plain",
    "xml": "application/xml",
}


class ContentTypeError(ValueError):
    pass


def normalize_extension(filename: str) -> str | None:
    suffix = Path(filename).suffix.lstrip(".").lower()
    return suffix if EXT.match(suffix) else None


class MediaCatalog:
    def __init__(self, extensions: Mapping[str, str]) -> None:
        self._types = {**BASE_TYPES, **{key.lstrip(".").lower(): value for key, value in extensions.items()}}

    def resolve(self, filename: str, head: bytes, declared: str | None = None) -> tuple[str | None, str]:
        """(extension, verified content type) for these bytes. A declared type must agree with the catalog and any signature."""
        ext = normalize_extension(filename)
        cataloged = self._types.get(ext or "")
        content_type = (declared or cataloged or "application/octet-stream").lower().split(";")[0].strip()
        if declared and cataloged and declared.lower() != cataloged and cataloged != "application/octet-stream":
            raise ContentTypeError(f"declared {declared!r} contradicts the catalog type {cataloged!r} for .{ext}")
        signature = SIGNATURES["application/zip"] if content_type in ZIP_BASED else SIGNATURES.get(content_type)
        if signature and not head.startswith(signature):
            raise ContentTypeError(f"bytes do not look like {content_type} (missing signature)")
        return ext, content_type
