"""Download capabilities: one URL, many URLs, background runs and status."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

from pydantic import BaseModel

from mzizi_engine.activity import open_activity
from mzizi_engine.web.export import read_csv
from mzizi_engine.web.handlers.common import out_dir
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.requests import DownloadRequest, FetchQueueRequest, Workspace
from mzizi_fetch.web.download import Downloader, DownloadFailure, DownloadPolicy, DownloadResult


class DownloadReport(BaseModel):
    folder: str
    downloaded: tuple[DownloadResult, ...] = ()
    catalog: tuple[CatalogEntry, ...] = ()
    failed: tuple[DownloadFailure, ...] = ()
    background_pids: tuple[int, ...] = ()


DOWNLOADS_COLLECTION = "downloads"


class FoundAt(BaseModel):
    """Where a file was found: the link context that later ranks and maps it before any extraction."""

    source_page: str = ""
    source_page_title: str = ""
    section: str = ""
    anchor_text: str = ""
    kind: str = ""
    depth: int = 0
    discovered_at: str = ""


class CatalogEntry(BaseModel):
    url: str
    file: str
    sha256: str
    size: int
    detected_type: str
    duplicate_of: str | None
    found_at: FoundAt


class _CrawlRow(BaseModel):
    original_url: str
    source_page: str = ""
    anchor_text: str = ""
    kind: str = ""
    depth: int = 0
    discovered_at: str = ""


class _TitleRow(BaseModel):
    final_url: str
    title: str = ""


def _contexts(request: DownloadRequest) -> dict[str, FoundAt]:
    """Link context from the crawl the list came from (`documents.json`/`files.json`/`images.json` beside it)."""
    if not request.from_file:
        return {}
    path = Path(request.from_file)
    table = path if path.suffix == ".csv" else path.with_suffix(".csv")
    if not table.is_file():
        return {}
    titles: dict[str, str] = {}
    pages = path.parent / "pages.csv"
    if pages.is_file():
        titles = {
            row.final_url: row.title
            for row in (_TitleRow.model_validate(item, strict=False) for item in read_csv(pages))
        }
    found: dict[str, FoundAt] = {}
    for item in read_csv(table):
        row = _CrawlRow.model_validate(item, strict=False)
        segments = [part for part in urlparse(row.source_page).path.split("/") if part]
        found[row.original_url] = FoundAt(
            source_page=row.source_page,
            source_page_title=titles.get(row.source_page, ""),
            section=segments[0] if segments else "",
            anchor_text=row.anchor_text,
            kind=row.kind,
            depth=row.depth,
            discovered_at=row.discovered_at,
        )
    return found


def _catalog(destination: Path, done: tuple[DownloadResult, ...], contexts: dict[str, FoundAt]) -> tuple[CatalogEntry, ...]:
    entries = tuple(
        CatalogEntry(
            url=item.url,
            file=item.file,
            sha256=item.sha256,
            size=item.size,
            detected_type=item.detected_type,
            duplicate_of=item.duplicate_of,
            found_at=contexts.get(item.url, FoundAt()),
        )
        for item in done
    )
    activity = open_activity()
    if activity is None:  # no activity store: the catalog and per-file records stay as files
        (destination / "catalog.json").write_text(
            json.dumps([entry.model_dump(mode="json") for entry in entries], indent=2), encoding="utf-8"
        )
        return entries
    try:
        by_url = {item.url: item for item in done}
        activity.put(
            DOWNLOADS_COLLECTION,
            [
                {
                    "_id": entry.sha256,
                    "folder": str(destination),
                    "path": str(destination / entry.file),
                    **entry.model_dump(mode="json"),
                    "headers": by_url[entry.url].headers,
                }
                for entry in entries
            ],
        )
    finally:
        activity.close()
    for entry in entries:  # the per-file sidecar is now a Mongo document
        (destination / f"{entry.file}.json").unlink(missing_ok=True)
    return entries


def _urls(request: DownloadRequest) -> list[str]:
    urls = [*([request.url] if request.url else []), *request.urls]
    if request.from_file:
        path = Path(request.from_file)
        if path.suffix == ".json":
            urls += [str(row["url"]) for row in json.loads(path.read_text(encoding="utf-8"))]
        else:
            with path.open(encoding="utf-8", newline="") as handle:
                urls += [row["original_url"] for row in csv.DictReader(handle) if row.get("original_url")]
    return list(dict.fromkeys(urls))


def _policy_for(request: DownloadRequest | FetchQueueRequest) -> DownloadPolicy:
    return DownloadPolicy(
        allowed_hosts=request.allowed_hosts,
        allow_private=request.allow_private,
        limit_rate=request.limit_rate * 1024,
        concurrency=request.concurrency,
    )


def download_files(request: DownloadRequest) -> DownloadReport:
    destination = Path(request.downloads_dir) if request.downloads_dir else out_dir(request)
    urls, agent = _urls(request), user_agent()
    if request.background:
        return DownloadReport(
            folder=str(destination), background_pids=tuple(_spawn(u, destination, agent, request) for u in urls)
        )
    downloader = Downloader(destination, agent, _policy_for(request))
    try:
        done, failed = downloader.download_many(urls)
    finally:
        downloader.close()
    catalog = _catalog(destination, tuple(done), _contexts(request))
    return DownloadReport(folder=str(destination), downloaded=tuple(done), catalog=catalog, failed=tuple(failed))


def _spawn(url: str, destination: Path, agent: str, request: DownloadRequest) -> int:
    command = [
        sys.executable,
        "-m",
        "mzizi_engine.web.worker",
        url,
        str(destination),
        agent,
        str(request.limit_rate * 1024),
        "1" if request.allow_private else "0",
    ]
    destination.mkdir(parents=True, exist_ok=True)
    with (destination / "background.log").open("ab") as log:
        return subprocess.Popen(command, stdout=log, stderr=log, stdin=subprocess.DEVNULL, start_new_session=True).pid


class DownloadStatus(BaseModel):
    folder: str
    items: tuple[str, ...]


def download_status(request: Workspace) -> DownloadStatus:
    folder = Path(request.downloads_dir) if request.downloads_dir else out_dir(request)
    items = [p.read_text(encoding="utf-8") for p in sorted(folder.glob("*.status.json"))] if folder.is_dir() else []
    return DownloadStatus(folder=str(folder), items=tuple(items))


def ident(url: str) -> str:
    return hashlib.sha256(url.encode()).hexdigest()[:12]
