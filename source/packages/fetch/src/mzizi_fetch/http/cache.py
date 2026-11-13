"""Conditional-request cache keyed by URL hash. Only responses with validators (ETag / Last-Modified) are stored."""

from __future__ import annotations

import hashlib
from pathlib import Path

from mzizi_fetch.http.models import FetchResult
from mzizi_fetch.models import Frozen

VALIDATORS = ("etag", "last-modified")


class CachedResponse(Frozen):
    headers: dict[str, str]
    body: str  # hex

    @property
    def content(self) -> bytes:
        return bytes.fromhex(self.body)

    def validator(self, name: str) -> str | None:
        return next((v for k, v in self.headers.items() if k.lower() == name), None)


class ResponseCache:
    def __init__(self, directory: Path | None) -> None:
        self.directory = directory

    def _path(self, url: str) -> Path | None:
        if self.directory is None:
            return None
        return self.directory / (hashlib.sha256(url.encode()).hexdigest() + ".json")

    def load(self, url: str) -> CachedResponse | None:
        path = self._path(url)
        if path is None or not path.exists():
            return None
        return CachedResponse.model_validate_json(path.read_text())

    def store(self, url: str, result: FetchResult) -> None:
        path = self._path(url)
        validators = {k: v for k, v in result.headers.items() if k.lower() in VALIDATORS}
        if path is None or not validators:
            return
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(CachedResponse(headers=validators, body=result.body.hex()).model_dump_json())
