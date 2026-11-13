"""The web vocabulary: typed classification data read from `source/schema/web/vocabulary.v1.yaml`.

URL kinds by extension, tracking parameters, challenge markers, file signatures and the default response to each block
kind are data, not code. This module holds the typed contract and the one parsing boundary that builds it.
"""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict

VOCABULARY_ENV = "MZIZI_WEB_VOCABULARY"
# .../source/packages/fetch/src/mzizi_fetch/web/vocabulary.py -> parents[5] is `source/`
DEFAULT_PATH = Path(__file__).resolve().parents[5] / "schema" / "web" / "vocabulary.v1.yaml"


class _Data(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class UrlKinds(_Data):
    image: tuple[str, ...]
    media: tuple[str, ...]
    document: tuple[str, ...]
    data: tuple[str, ...]
    archive: tuple[str, ...]
    program: tuple[str, ...]


class ChallengeMarkers(_Data):
    captcha: tuple[str, ...]
    challenge: tuple[str, ...]
    notice: tuple[str, ...]


class FileSignature(_Data):
    magic: str  # latin-1 text of the leading bytes
    name: str
    group: str
    text: bool = False  # compare case-insensitively after leading whitespace

    @property
    def magic_bytes(self) -> bytes:
        return self.magic.encode("latin-1")


class Vocabulary(_Data):
    version: int
    url_kinds: UrlKinds
    media_tags: tuple[str, ...]
    embed_tags: tuple[str, ...]
    tracking_parameters: tuple[str, ...]
    challenge_markers: ChallengeMarkers
    file_signatures: tuple[FileSignature, ...]
    zip_based_extensions: tuple[str, ...]
    jpeg_extensions: tuple[str, ...]
    risky_groups: tuple[str, ...]
    block_responses: dict[str, str]


def parse_vocabulary(text: str) -> Vocabulary:
    """The parsing boundary: YAML text in, a validated `Vocabulary` out."""
    return Vocabulary.model_validate(yaml.safe_load(text), strict=False)


@lru_cache(maxsize=1)
def vocabulary() -> Vocabulary:
    path = Path(os.environ.get(VOCABULARY_ENV) or DEFAULT_PATH)
    return parse_vocabulary(path.read_text(encoding="utf-8"))
