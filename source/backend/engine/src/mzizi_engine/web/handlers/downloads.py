"""Download capabilities: one URL, many URLs, background runs and status."""

from __future__ import annotations

import csv
import hashlib
import json
import subprocess
import sys
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.web.handlers.common import out_dir
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.requests import DownloadRequest, Workspace
from mzizi_fetch.web.download import Downloader, DownloadFailure, DownloadPolicy, DownloadResult


class DownloadReport(BaseModel):
    folder: str
    downloaded: tuple[DownloadResult, ...] = ()
    failed: tuple[DownloadFailure, ...] = ()
    background_pids: tuple[int, ...] = ()


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


def _policy(request: DownloadRequest) -> DownloadPolicy:
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
    downloader = Downloader(destination, agent, _policy(request))
    try:
        done, failed = downloader.download_many(urls)
    finally:
        downloader.close()
    return DownloadReport(folder=str(destination), downloaded=tuple(done), failed=tuple(failed))


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
