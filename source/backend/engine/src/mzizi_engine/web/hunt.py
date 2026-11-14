"""Hunting for files a link crawl does not list: links that probably serve a download, and a CMS's own media index.

A link counts as a probable download when its path, query or link text matches the vocabulary's `download_hints`; the
downloader decides from the response what it really is (an HTML page in disguise is discarded). WordPress sites list
every uploaded file at a known endpoint, so that index is read (politely, through the policy-checked client).
"""

from __future__ import annotations

import csv
import json
from collections.abc import Iterable
from pathlib import Path
from urllib.parse import parse_qsl, urlparse

from pydantic import BaseModel, ConfigDict

from mzizi_engine.web.export import read_csv
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.urls import UrlKind, classify
from mzizi_fetch.web.vocabulary import vocabulary

HUNTED_FILE = "hunted.csv"
HUNTED_COLUMNS = ("original_url", "normalized_url", "kind", "anchor_text", "source_page", "depth", "discovered_at", "mime")
MAX_MEDIA_PAGES = 20


def looks_like_download(url: str, anchor: str) -> bool:
    hints = vocabulary().download_hints
    parsed = urlparse(url)
    path = parsed.path.lower()
    keys = {key.lower() for key, _ in parse_qsl(parsed.query)}
    return (
        any(word in path for word in hints.path_words)
        or bool(keys & {k.lower() for k in hints.query_keys})
        or any(word in anchor.lower() for word in hints.anchor_words)
    )


def candidate_rows(links_csv: Path, known: set[str]) -> list[dict[str, str]]:
    """Internal links that are not obviously pages but probably serve a file (and are not already inventoried)."""
    rows: list[dict[str, str]] = []
    seen: set[str] = set(known)
    for row in read_csv(links_csv):
        url = row.get("original_url", "")
        if row.get("scope") != "internal" or not url.startswith("http") or url in seen:
            continue
        if classify(url, row.get("tag", "a")) is not UrlKind.PAGE:
            continue  # already classified as a file kind: it is in the normal inventory
        if looks_like_download(url, row.get("anchor_text", "")):
            seen.add(url)
            rows.append({**row, "kind": "candidate"})
    return rows


class _Media(BaseModel):
    model_config = ConfigDict(extra="ignore")

    source_url: str = ""
    mime_type: str = ""
    alt_text: str = ""
    link: str = ""
    title: dict[str, str] = {}


def _kind(mime: str, url: str) -> str:
    if mime.startswith("image/"):
        return "image"
    if mime.startswith(("audio/", "video/")):
        return "media"
    kind = classify(url, "a")
    return {UrlKind.DOCUMENT: "document", UrlKind.DATA: "file", UrlKind.ARCHIVE: "file"}.get(kind, "document")


def wordpress_media(client: WebClient, base_url: str, now: str) -> list[dict[str, str]]:
    """Every file in a WordPress media library, from its REST index; stops at the first empty or refused page."""
    templates = vocabulary().cms_media_paths
    origin = f"{urlparse(base_url).scheme}://{urlparse(base_url).netloc}"
    rows: list[dict[str, str]] = []
    for template in templates:
        for number in range(1, MAX_MEDIA_PAGES + 1):
            response = client.get(origin + template.format(n=number))
            if not response.usable or response.status >= 400:
                break
            try:
                items = [_Media.model_validate(item) for item in json.loads(response.body)]
            except (ValueError, TypeError):
                break
            if not items:
                break
            for item in items:
                if item.source_url:
                    title = item.title.get("rendered", "") or item.alt_text
                    rows.append(
                        {
                            "original_url": item.source_url, "normalized_url": item.source_url,
                            "kind": _kind(item.mime_type, item.source_url), "anchor_text": title,
                            "source_page": "wp-json media", "depth": "0", "discovered_at": now, "mime": item.mime_type,
                        }
                    )
    return rows


def write_hunted(path: Path, rows: Iterable[dict[str, str]]) -> int:
    """Adds newly hunted files to the list (earlier ones stay); returns how many rows the list holds."""
    merged: dict[str, dict[str, str]] = {row["original_url"]: row for row in read_csv(path)} if path.is_file() else {}
    for row in rows:
        merged.setdefault(row["original_url"], row)
    rows = list(merged.values())
    if not rows:
        return 0
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.tmp")
    with temporary.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(HUNTED_COLUMNS), extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    temporary.replace(path)
    return len(rows)
