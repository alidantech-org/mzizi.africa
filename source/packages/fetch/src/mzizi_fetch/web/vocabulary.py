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
    cms_media_paths: tuple[str, ...] = ()  # CMS endpoints that list every uploaded file, probed when the CMS is recognised
    noise_hosts: tuple[str, ...] = ()  # third-party analytics, ads and social widgets the browser never needs to load
    needs_javascript_phrases: tuple[str, ...] = ()  # text a static page shows when it only works with scripts
    generic_file_stems: tuple[str, ...] = ()  # file names too vague to label a file (`download`, `file`, `view`)
    risky_groups: tuple[str, ...]
    block_responses: dict[str, str]


def parse_vocabulary(text: str) -> Vocabulary:
    """The parsing boundary: YAML text in, a validated `Vocabulary` out."""
    return Vocabulary.model_validate(yaml.safe_load(text), strict=False)


@lru_cache(maxsize=1)
def vocabulary() -> Vocabulary:
    path = Path(os.environ.get(VOCABULARY_ENV) or DEFAULT_PATH)
    return parse_vocabulary(path.read_text(encoding="utf-8"))
