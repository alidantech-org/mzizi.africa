"""Typed records the crawler writes: one model per inventory, with stable field order for exports."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict


class Record(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class Scope(StrEnum):
    INTERNAL = "internal"
    EXTERNAL = "external"


class DownloadStatus(StrEnum):
    NOT_DOWNLOADED = "not_downloaded"
    DOWNLOADED = "downloaded"
    FAILED = "failed"
    SKIPPED = "skipped"


class PageRecord(Record):
    n: int
    original_url: str
    normalized_url: str
    final_url: str
    canonical_url: str
    source_page: str
    anchor_text: str
    title: str
    status: int
    content_type: str
    extension: str
    depth: int
    scope: Scope
    discovered_at: str
    path: str
    bytes: int
    redirects: int
    links: int
    chrome_removed: int
    fetched_via: str
    raw_file: str
    markdown_file: str


class PathRecord(Record):
    path: str
    pages: int
    first_seen_on: str


class LinkRecord(Record):
    original_url: str
    normalized_url: str
    source_page: str
    anchor_text: str
    tag: str
    kind: str
    scope: Scope
    host: str
    path: str
    extension: str
    depth: int
    discovered_at: str


class ResourceRecord(Record):
    original_url: str
    normalized_url: str
    final_url: str
    kind: str
    scope: Scope
    extension: str
    host: str
    path: str
    source_page: str
    anchor_text: str
    content_type: str
    status: int
    depth: int
    discovered_at: str
    download_status: DownloadStatus


class ExternalRecord(Record):
    host: str
    links: int
    pages: int
    sample_url: str


class ErrorRecord(Record):
    url: str
    stage: str
    kind: str
    detail: str
    response: str
    attempt: int
    at: str


class FrontierItem(Record):
    url: str
    depth: int
    source_page: str
    anchor_text: str
