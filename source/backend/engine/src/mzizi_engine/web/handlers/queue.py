"""MongoDB-tracked downloads: crawl resources are queued, then fetched and tracked per file until done or failed.

Any file type is queued (documents, images, media, data, archives, other files). Executable-looking files are
downloaded and flagged by the downloader, never opened. Each queue item records its status, attempts and result.
"""

from __future__ import annotations

import hashlib
import shutil
import time
from datetime import UTC, datetime
from email.message import Message
from enum import StrEnum
from pathlib import Path
from urllib.parse import urlparse

from pydantic import BaseModel

from mzizi_engine.activity import Activity, open_activity
from mzizi_engine.layout import DevLayout
from mzizi_engine.names import Labels, file_name
from mzizi_engine.web.handlers.common import out_dir
from mzizi_engine.web.handlers.downloads import (
    DOWNLOADS_COLLECTION,
    CatalogEntry,
    FoundAt,
    _catalog,
    _policy_for,
    ident,
)
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.export import read_csv
from mzizi_engine.web.crawl.service import client_for
from mzizi_engine.web.requests import CrawlRequest, EnqueueRequest, FetchQueueRequest, QueueStatusRequest
from mzizi_fetch.web.download import Downloader
from mzizi_fetch.web.vocabulary import vocabulary

QUEUE = "download_queue"
RESOURCE_TABLES = {  # inventory table of each kind (`candidate` rows come from hunted.csv)
   "document": "documents", "image": "images", "media": "media", "file": "files"}
MAX_ATTEMPTS = 3


class State(StrEnum):
    QUEUED = "queued"
    DOWNLOADING = "downloading"
    DONE = "done"
    SKIPPED = "skipped"
    MISSING = "missing"  # the server says the file does not exist (404, 410)
    FAILED = "failed"


class EnqueueReport(BaseModel):
    host: str
    queued: int
    already_tracked: int


class QueueCounts(BaseModel):
    counts: dict[str, int]
    failed: tuple[str, ...] = ()


class FetchReport(BaseModel):
    attempted: int
    done: int
    failed: int
    folder: str


def _now() -> str:
    return datetime.now(UTC).isoformat()


def bucket(extension: str, kind: str) -> str:
    """The files/ folder for a downloaded file: by what it is, using the vocabulary's extension lists."""
    kinds = vocabulary().url_kinds
    if extension == "pdf":
        return "pdf"
    if kind == "image" or extension in kinds.image:
        return "image"
    if kind == "media" or extension in kinds.media:
        return "media"
    if extension in kinds.archive:
        return "archive"
    if extension in kinds.data or extension in vocabulary().tabular_extensions:
        return "data"
    return "document" if extension in kinds.document else "other"


def _section(page: str) -> str:
    parts = [p for p in urlparse(page).path.split("/") if p]
    return parts[0] if parts else ""


MIME_EXTENSIONS = {  # protocol facts: a data response without a file extension is named by its media type
    "application/json": "json", "application/ld+json": "json", "application/xml": "xml", "text/xml": "xml",
    "text/csv": "csv", "application/geo+json": "geojson", "application/vnd.ms-excel": "xls",
}
RATE_LIMIT_PAUSE = 20.0  # seconds to wait once before retrying a file the server rate-limited


def extension_for(url: str, detected_type: str, declared_type: str) -> str:
    """The file extension: the URL's own, else one implied by the response's media type, else the detected type."""
    own = Path(urlparse(url).path).suffix.lstrip(".").lower()
    return own or MIME_EXTENSIONS.get(declared_type.split(";")[0].strip().lower(), detected_type)


def _disposition_name(headers: dict[str, str]) -> str:
    value = next((v for k, v in headers.items() if k.lower() == "content-disposition"), "")
    if not value:
        return ""
    message = Message()
    message["content-disposition"] = value
    return message.get_filename() or ""


def enqueue(request: EnqueueRequest) -> EnqueueReport:
    """Queues every file, image and media item in a site's current inventory that is not tracked yet."""
    activity = open_activity()
    if activity is None:
        raise RuntimeError("the download queue needs the MongoDB activity store (is it running?)")
    layout = DevLayout.locate()
    site = layout.website(request.site)
    host = site.address.host
    try:
        existing = {row["_id"] for row in activity.get(QUEUE, {"host": host})}
        fresh = []
        sources: list[tuple[str, list[dict[str, str]]]] = []
        for kind in request.kinds:
            table = site.inventory / f"{RESOURCE_TABLES[kind]}.csv" if kind in RESOURCE_TABLES else None
            if table is not None and table.is_file():
                sources.append((kind, read_csv(table)))
        hunted = site.inventory / "hunted.csv"
        if hunted.is_file():  # files found by the hunt: probable downloads and a CMS media index
            for row in read_csv(hunted):
                if row.get("kind", "candidate") in request.kinds:
                    sources.append((row.get("kind", "candidate"), [row]))
        for kind, rows in sources:
            for row in rows:
                url = row.get("original_url", "")
                key = hashlib.sha256(url.encode()).hexdigest()[:24]
                if not url or key in existing:
                    continue
                existing.add(key)
                fresh.append(
                    {
                        "_id": key,
                        "host": host,
                        "url": url,
                        "kind": kind,
                        "state": State.QUEUED.value,
                        "attempts": 0,
                        "error": "",
                        "found_at": FoundAt(
                            source_page=row.get("source_page", ""),
                            anchor_text=row.get("anchor_text", ""),
                            kind=kind,
                            section=_section(row.get("source_page", "")),
                            depth=int(row.get("depth") or 0),
                            discovered_at=row.get("discovered_at", ""),
                        ).model_dump(mode="json"),
                        "queued_at": _now(),
                    }
                )
        activity.put(QUEUE, fresh)
        return EnqueueReport(host=host, queued=len(fresh), already_tracked=len(existing) - len(fresh))
    finally:
        activity.close()


class FileFetcher:
    """Downloads queue items one at a time into the site's files folder; one instance per worker (not shared)."""

    def __init__(self, activity: Activity, site, layout: DevLayout, stage_name: str, request: FetchQueueRequest) -> None:  # noqa: ANN001
        self.activity, self.site, self.layout = activity, site, layout
        self.host = site.address.host
        self.stage = site.root / "scraped" / ".incoming" / stage_name
        self.stage.mkdir(parents=True, exist_ok=True)
        self.downloader = Downloader(self.stage, user_agent(), _policy_for(request))
        self.gate = client_for(CrawlRequest(out_dir=str(self.stage), url=f"https://{self.host}/"), user_agent())

    def close(self) -> None:
        self.downloader.close()
        self.gate.close()
        try:
            self.stage.rmdir()
            self.stage.parent.rmdir()
        except OSError:
            pass

    def _clean(self, result_file: str, url: str) -> None:
        (self.stage / result_file).unlink(missing_ok=True)
        (self.stage / f"{result_file}.json").unlink(missing_ok=True)
        (self.stage / f"{ident(url)}.status.json").unlink(missing_ok=True)

    def process(self, item: dict) -> str:  # noqa: ANN001 - a queue document (the Mongo parsing boundary)
        """Downloads one queue item; returns `done`, `failed` or `skipped`. Every outcome is recorded on the item."""
        put, url = self.activity.put, str(item["url"])
        put(QUEUE, [{**item, "state": State.DOWNLOADING.value, "updated_at": _now()}])
        refusal = self.gate.preflight(url)  # robots.txt and scope apply to files too
        if refusal is not None:
            reason = refusal.refused.reason if refusal.refused else "refused"
            put(QUEUE, [{**item, "state": State.SKIPPED.value, "error": reason, "updated_at": _now()}])
            return "skipped"
        try:
            try:
                result = self.downloader.download(url)
            except Exception as first:
                if "HTTP 429" not in str(first):
                    raise
                time.sleep(RATE_LIMIT_PAUSE)  # the server asked us to slow down: wait once, then try again
                result = self.downloader.download(url)
        except Exception as problem:  # recorded on the item; the queue continues
            message = f"{type(problem).__name__}: {str(problem)[:200]}"
            if "HTTP 404" in message or "HTTP 410" in message:  # the file is gone: final, not worth retrying
                put(QUEUE, [{**item, "state": State.MISSING.value, "error": message, "updated_at": _now()}])
                return "skipped"
            put(
                QUEUE,
                [{**item, "state": State.FAILED.value, "attempts": int(item["attempts"]) + 1,
                  "error": message, "updated_at": _now()}],
            )
            return "failed"
        found = FoundAt.model_validate(item["found_at"])
        kind_text = str(item["kind"])
        if kind_text == "candidate" and result.detected_type == "html":  # a page in disguise, not a file
            self._clean(result.file, url)
            put(QUEUE, [{**item, "state": State.SKIPPED.value, "error": "not a file (HTML)", "updated_at": _now()}])
            return "skipped"
        extension = extension_for(url, result.detected_type, result.declared_type)
        labels = Labels(
            content_disposition=_disposition_name(result.headers),
            anchor_text=found.anchor_text if kind_text != "image" else "",
            alt_text=found.anchor_text if kind_text == "image" else "",
            title=found.source_page_title,
        )
        final_name = file_name(url, result.sha256, labels, extension)
        target = self.site.files(bucket(extension, kind_text))
        target.mkdir(parents=True, exist_ok=True)
        shutil.move(str(self.stage / result.file), target / final_name)
        self._clean(result.file, url)
        relative = str((target / final_name).relative_to(self.layout.root))
        entry = CatalogEntry(
            url=result.url, file=relative, sha256=result.sha256, size=result.size,
            detected_type=result.detected_type, duplicate_of=result.duplicate_of, found_at=found,
        )
        put(
            DOWNLOADS_COLLECTION,
            [{"_id": result.sha256, "host": self.host, "path": relative, **entry.model_dump(mode="json"),
              "headers": result.headers, "flags": list(result.flags)}],
        )
        put(
            QUEUE,
            [{**item, "state": State.DONE.value, "attempts": int(item["attempts"]) + 1, "error": "",
              "file": relative, "sha256": result.sha256, "size": result.size,
              "detected_type": result.detected_type, "flags": list(result.flags), "updated_at": _now()}],
        )
        return "done"


def queue_item(host: str, url: str, kind: str, found: FoundAt) -> dict:
    """A new queue document (the Mongo boundary), keyed by the URL so a file is queued once however often it is seen."""
    return {
        "_id": hashlib.sha256(url.encode()).hexdigest()[:24], "host": host, "url": url, "kind": kind,
        "state": State.QUEUED.value, "attempts": 0, "error": "", "found_at": found.model_dump(mode="json"),
        "queued_at": _now(),
    }


def fetch_queue(request: FetchQueueRequest) -> FetchReport:
    """Downloads queued (or retryable) items into the site's `scraped/files/<type>/` under readable names."""
    activity = open_activity()
    if activity is None:
        raise RuntimeError("the download queue needs the MongoDB activity store (is it running?)")
    layout = DevLayout.locate()
    site = layout.website(request.site)
    fetcher = FileFetcher(activity, site, layout, "queue", request)
    counts = {"done": 0, "failed": 0, "skipped": 0}
    try:
        query = {"host": site.address.host, "state": {"$in": [State.QUEUED.value, State.FAILED.value]}, "attempts": {"$lt": MAX_ATTEMPTS}}
        for item in activity.get(QUEUE, query, request.limit):
            counts[fetcher.process(item)] += 1
    finally:
        fetcher.close()
        activity.close()
    return FetchReport(
        attempted=counts["done"] + counts["failed"], done=counts["done"], failed=counts["failed"],
        folder=str(site.root / "scraped" / "files"),
    )


def queue_status(request: QueueStatusRequest) -> QueueCounts:
    activity = open_activity()
    if activity is None:
        raise RuntimeError("the download queue needs the MongoDB activity store (is it running?)")
    try:
        rows = activity.get(QUEUE, {"host": DevLayout.locate().website(request.site).address.host} if request.site else {})
    finally:
        activity.close()
    counts: dict[str, int] = {}
    for row in rows:
        counts[str(row["state"])] = counts.get(str(row["state"]), 0) + 1
    return QueueCounts(counts=counts, failed=tuple(f"{r['url']}: {r['error']}" for r in rows if r["state"] == "failed")[:20])
