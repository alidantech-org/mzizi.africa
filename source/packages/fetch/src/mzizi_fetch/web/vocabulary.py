"""The web vocabulary: typed classification data read from `seed/vocabularies/global/web/classification.yaml`.

URL kinds by extension, tracking parameters, challenge markers, file signatures and the default response to each block
kind are data, not code. This module holds the typed contract and the one parsing boundary that builds it.
"""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict

# .../source/packages/fetch/src/mzizi_fetch/web/vocabulary.py -> parents[6] is the repository root
DEFAULT_PATH = Path(__file__).resolve().parents[6] / "seed" / "vocabularies" / "global" / "web" / "classification.yaml"
SCHEMA_ID = "https://res.alidantech.org/mzizi/public/schemas/engine/web.schema.json"


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


class PaginationLabels(_Data):
    next: tuple[str, ...] = ()
    previous: tuple[str, ...] = ()
    last: tuple[str, ...] = ()
    load_more: tuple[str, ...] = ()
    container_words: tuple[str, ...] = ()  # class, id or aria-label words that mark a pagination widget
    disabled_words: tuple[str, ...] = ()  # class words that mark a control as unusable
    infinite_scroll_words: tuple[str, ...] = ()
    carousel_words: tuple[str, ...] = ()  # class words of sliders: their next/previous buttons are not pagination


class DownloadHints(_Data):
    path_words: tuple[str, ...] = ()  # path pieces that usually serve a file
    query_keys: tuple[str, ...] = ()  # query parameters that usually name a file or attachment
    anchor_words: tuple[str, ...] = ()  # link texts that promise a file


class Vocabulary(_Data):
    code: str
    version: int
    url_kinds: UrlKinds
    media_tags: tuple[str, ...]
    embed_tags: tuple[str, ...]
    tracking_parameters: tuple[str, ...]
    challenge_markers: ChallengeMarkers
    file_signatures: tuple[FileSignature, ...]
    zip_based_extensions: tuple[str, ...]
    jpeg_extensions: tuple[str, ...]
    tabular_extensions: tuple[str, ...] = ()  # spreadsheet and table files, stored under `data`
    captcha_page_max_links: int = 8  # a captcha marker blocks only a page this bare (a real page with a form is usable)
    captcha_blocking_statuses: tuple[int, ...] = (401, 403, 429, 503)
    spa_root_selectors: tuple[str, ...] = ()  # app mount points that stay empty until a client-side framework renders
    busy_selectors: tuple[str, ...] = ()  # markers a page leaves while it is still loading content
    pagination: PaginationLabels = PaginationLabels()
    download_hints: DownloadHints = DownloadHints()
    cms_media_paths: tuple[
        str, ...
    ] = ()  # CMS endpoints that list every uploaded file, probed when the CMS is recognised
    noise_hosts: tuple[str, ...] = ()  # third-party analytics, ads and social widgets the browser never needs to load
    needs_javascript_phrases: tuple[str, ...] = ()  # text a static page shows when it only works with scripts
    api_path_segments: tuple[str, ...] = ()  # path segments that mark a data endpoint (JSON), not a page
    content_query_keys: tuple[
        str, ...
    ] = ()  # query parameters that name one distinct page (`?page_id=12`), never a filter or a trap
    generic_file_stems: tuple[str, ...] = ()  # file names too vague to label a file (`download`, `file`, `view`)
    risky_groups: tuple[str, ...]
    block_responses: dict[str, str]


def schema_text() -> str:
    """The canonical text of `source/schema/engine/web.schema.json`, generated from the typed model."""
    document = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": SCHEMA_ID,
        **Vocabulary.model_json_schema(),
    }
    return json.dumps(document, indent=2, sort_keys=True, ensure_ascii=False) + "\n"


def parse_vocabulary(text: str) -> Vocabulary:
    """The parsing boundary: YAML text in, a validated `Vocabulary` out."""
    return Vocabulary.model_validate(yaml.safe_load(text), strict=False)


_path = DEFAULT_PATH


def configure_vocabulary(path: Path | None) -> None:
    global _path
    _path = path or DEFAULT_PATH


def vocabulary() -> Vocabulary:
    return _load(_path)


@lru_cache(maxsize=1)
def _load(path: Path) -> Vocabulary:
    return parse_vocabulary(path.read_text(encoding="utf-8"))
