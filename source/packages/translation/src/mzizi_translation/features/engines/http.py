"""Translation web services behind one adapter: LibreTranslate-compatible servers and Google Cloud Translation v2.

The caller supplies the endpoint, the key and the language codes the service expects; nothing is chosen here. A service
sends the text to a third party, so the caller decides whether a stream may use one.
"""

from __future__ import annotations

import json
import urllib.parse
import urllib.request
from collections.abc import Mapping, Sequence
from typing import Literal

from pydantic import BaseModel, ConfigDict

from mzizi_translation.shared.contracts import Tier


class _Libre(BaseModel):
    model_config = ConfigDict(extra="ignore")
    translatedText: str | list[str]


class _GoogleItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    translatedText: str


class _GoogleData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    translations: list[_GoogleItem]


class _Google(BaseModel):
    model_config = ConfigDict(extra="ignore")
    data: _GoogleData


class HttpEngine:
    tier = Tier.MACHINE

    def __init__(
        self,
        name: str,
        url: str,
        dialect: Literal["libretranslate", "google-v2"],
        codes: Mapping[str, str],
        api_key: str = "",
        timeout: float = 60.0,
    ) -> None:
        self.name: str = name
        self.version: str = dialect
        self._url, self._dialect, self._codes, self._key, self._timeout = url, dialect, dict(codes), api_key, timeout

    def supports(self, source_language: str, target_language: str) -> bool:
        return source_language in self._codes and target_language in self._codes

    def translate(self, texts: Sequence[str], source_language: str, target_language: str) -> list[str | None]:
        source, target = self._codes[source_language], self._codes[target_language]
        if self._dialect == "libretranslate":
            body = json.dumps(
                {"q": list(texts), "source": source, "target": target, "format": "text", "api_key": self._key}
            ).encode()
            parsed = _Libre.model_validate_json(self._post(self._url, body, {"Content-Type": "application/json"}))
            out = parsed.translatedText
            return list(out) if isinstance(out, list) else [out]
        query = urllib.parse.urlencode(
            [("q", t) for t in texts] + [("source", source), ("target", target), ("format", "text"), ("key", self._key)]
        )
        google = _Google.model_validate_json(
            self._post(self._url, query.encode(), {"Content-Type": "application/x-www-form-urlencoded"})
        )
        return [item.translatedText for item in google.data.translations]

    def _post(self, url: str, body: bytes, headers: Mapping[str, str]) -> bytes:
        request = urllib.request.Request(url, data=body, headers=dict(headers), method="POST")
        with urllib.request.urlopen(request, timeout=self._timeout) as response:
            data: bytes = response.read()
            return data
