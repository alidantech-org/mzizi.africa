"""MongoDB-tracked downloads: crawl resources are queued, then fetched and tracked per file until done or failed.

Any file type is queued (documents, images, media, data, archives, other files). Executable-looking files are
downloaded and flagged by the downloader, never opened. Each queue item records its status, attempts and result.
"""

from __future__ import annotations

import hashlib
import shutil
from datetime import UTC, datetime
from email.message import Message
from enum import StrEnum
from pathlib import Path
from urllib.parse import urlparse

from pydantic import BaseModel

from mzizi_engine.activity import open_activity
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
from mzizi_engine.web.requests import EnqueueRequest, FetchQueueRequest, QueueStatusRequest
from mzizi_fetch.web.download import Downloader
from mzizi_fetch.web.vocabulary import vocabulary

QUEUE = "download_queue"
RESOURCE_TABLES = {"document": "documents", "image": "images", "media": "media", "file": "files"}
MAX_ATTEMPTS = 3


class State(StrEnum):
    QUEUED = "queued"
    DOWNLOADING = "downloading"
    DONE = "done"
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
        for kind in request.kinds:
            table = site.inventory / f"{RESOURCE_TABLES[kind]}.csv"
            if not table.is_file():
                continue
            for row in read_csv(table):
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


def fetch_queue(request: FetchQueueRequest) -> FetchReport:
    """Downloads queued (or retryable) items into the site's `scraped/files/<type>/` under readable names."""
    activity = open_activity()
    if activity is None:
        raise RuntimeError("the download queue needs the MongoDB activity store (is it running?)")
    layout = DevLayout.locate()
    site = layout.website(request.site)
    host = site.address.host
    stage = site.root / "scraped" / ".incoming"
    stage.mkdir(parents=True, exist_ok=True)
    downloader = Downloader(stage, user_agent(), _policy_for(request))
    done = failed = 0
    try:
        query = {"host": host, "state": {"$in": [State.QUEUED.value, State.FAILED.value]}, "attempts": {"$lt": MAX_ATTEMPTS}}
        for item in activity.get(QUEUE, query, request.limit):
            url = str(item["url"])
            activity.put(QUEUE, [{**item, "state": State.DOWNLOADING.value, "updated_at": _now()}])
            try:
                result = downloader.download(url)
            except Exception as problem:  # recorded on the item; the queue continues
                failed += 1
                activity.put(
                    QUEUE,
                    [{**item, "state": State.FAILED.value, "attempts": int(item["attempts"]) + 1,
                      "error": f"{type(problem).__name__}: {str(problem)[:200]}", "updated_at": _now()}],
                )
                continue
            found = FoundAt.model_validate(item["found_at"])
            kind_text = str(item["kind"])
            extension = Path(urlparse(url).path).suffix.lstrip(".").lower() or result.detected_type
            labels = Labels(
                content_disposition=_disposition_name(result.headers),
                anchor_text=found.anchor_text if kind_text != "image" else "",
                alt_text=found.anchor_text if kind_text == "image" else "",
                title=found.source_page_title,
            )
            final_name = file_name(url, result.sha256, labels, extension)
            target = site.files(bucket(extension, kind_text))
            target.mkdir(parents=True, exist_ok=True)
            shutil.move(str(stage / result.file), target / final_name)
            (stage / f"{result.file}.json").unlink(missing_ok=True)
            (stage / f"{ident(url)}.status.json").unlink(missing_ok=True)
            done += 1
            relative = str((target / final_name).relative_to(layout.root))
            entry = CatalogEntry(
                url=result.url, file=relative, sha256=result.sha256, size=result.size,
                detected_type=result.detected_type, duplicate_of=result.duplicate_of, found_at=found,
            )
            activity.put(
                DOWNLOADS_COLLECTION,
                [{"_id": result.sha256, "host": host, "path": relative, **entry.model_dump(mode="json"),
                  "headers": result.headers, "flags": list(result.flags)}],
            )
            activity.put(
                QUEUE,
                [{**item, "state": State.DONE.value, "attempts": int(item["attempts"]) + 1, "error": "",
                  "file": relative, "sha256": result.sha256, "size": result.size,
                  "detected_type": result.detected_type, "flags": list(result.flags), "updated_at": _now()}],
            )
    finally:
        downloader.close()
        activity.close()
        try:
            stage.rmdir()
        except OSError:
            pass
    return FetchReport(attempted=done + failed, done=done, failed=failed, folder=str(site.root / "scraped" / "files"))


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
