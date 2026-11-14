"""`site watch`: crawl a site from its URL alone, keep its pages hashed and versioned, and say what changed."""

from __future__ import annotations

import csv
import hashlib
import shutil
from pathlib import Path
from urllib.parse import urlparse

from pydantic import BaseModel

from mzizi_engine.activity import open_activity
from mzizi_engine.layout import DevLayout, address_of
from mzizi_engine.web.crawl.service import extra_ca_bundle
from mzizi_engine.web.identity import user_agent
from mzizi_engine.sitestore import Outcome, SiteStore, Visit
from mzizi_engine.web.export import read_csv
from mzizi_engine.web.handlers.crawl import crawl_site
from mzizi_engine.web.requests import WatchRequest
from mzizi_fetch.web.urls import host_of

INVENTORY_TABLES = (
    "pages", "paths", "links", "internal_urls", "external_urls", "external_hosts", "images", "documents", "files", "media", "errors",
)
TRANSIENT = ("raw", "markdown", "screenshots")


class _Page(BaseModel):
    n: int
    final_url: str
    title: str = ""
    status: int = 200
    raw_file: str
    markdown_file: str = ""


class WatchReport(BaseModel):
    site: str
    host: str
    pages_visited: int
    new: int
    changed: int
    unchanged: int
    noise: int
    gone: int
    complete: bool
    changes: tuple[Outcome, ...] = ()


def _body(markdown: str) -> str:
    """The Markdown the crawler wrote, without its own front matter (the store writes the full one)."""
    if markdown.startswith("---\n"):
        end = markdown.find("\n---\n", 4)
        if end != -1:
            return markdown[end + 5 :].lstrip("\n")
    return markdown


def _copy_inventory(run: Path, target: Path) -> None:
    target.mkdir(parents=True, exist_ok=True)
    for name in INVENTORY_TABLES:
        source = run / f"{name}.csv"
        if source.is_file():
            shutil.copyfile(source, target / f"{name}.csv")


def _record_links(activity, host: str, run: Path) -> None:  # noqa: ANN001
    path = run / "links.csv"
    if not path.is_file():
        return
    existing = {row["_id"]: row for row in activity.get("site_links", {"host": host})}
    now = _now()
    fresh = []
    for row in read_csv(path):
        source, target = urlparse(row.get("source_page", "")).path or "/", row.get("normalized_url", "")
        key = hashlib.sha256(f"{host}|{source}|{target}|{row.get('anchor_text', '')}".encode()).hexdigest()[:24]
        first = existing.get(key, {}).get("first_seen", now)
        fresh.append(
            {
                "_id": key, "host": host, "from_path": source, "to": target, "anchor": row.get("anchor_text", ""),
                "kind": row.get("kind", ""), "scope": row.get("scope", ""), "first_seen": first, "last_seen": now,
            }
        )
    activity.put("site_links", fresh)


def _now() -> str:
    from datetime import UTC, datetime

    return datetime.now(UTC).isoformat(timespec="seconds")


def canonical_url(url: str, ca_bundle: Path | None = None) -> str:
    """Where a start URL really lands: follows redirects, but only to another host of the same registrable domain
    (`mombasa.go.ke` to `web.mombasa.go.ke`, an apex to `www`). Anything else, or any failure, leaves the URL alone."""
    import ssl

    import httpx

    verify: ssl.SSLContext | bool = True
    if ca_bundle is not None:
        verify = ssl.create_default_context()
        verify.load_verify_locations(cafile=str(ca_bundle))
    try:
        response = httpx.get(url, follow_redirects=True, timeout=15, verify=verify, headers={"User-Agent": user_agent()})
    except httpx.HTTPError:
        return url
    final = str(response.url)
    same = address_of(final).group == address_of(url).group
    return final if same and address_of(final).host != address_of(url).host else url


def watch_site(request: WatchRequest) -> WatchReport:
    layout = DevLayout.locate()
    start = request.starts[0] if request.starts else request.url
    landed = canonical_url(start, extra_ca_bundle(host_of(start)))
    if landed != start:  # the site really lives on another host of the same domain: crawl and save it there
        request = request.model_copy(update={"url": landed, "urls": ()})
    site = layout.website(landed)
    run = Path(request.out_dir)
    summary = crawl_site(request.model_copy(update={"record": False}))
    activity = open_activity()
    try:
        store = SiteStore(site, activity, layout.root)
        counts = {"new": 0, "changed": 0, "unchanged": 0, "noise": 0}
        changes: list[Outcome] = []
        for row in read_csv(run / "pages.csv"):
            page = _Page.model_validate(row, strict=False)
            raw = run / page.raw_file
            if not raw.is_file():
                continue
            parsed = urlparse(page.final_url)
            if host_of(page.final_url) != site.address.host:
                continue  # a redirect left the site: not this site's page
            markdown = run / page.markdown_file if page.markdown_file else None
            shot = run / "screenshots" / f"{page.n:04d}.png"
            path = (parsed.path or "/") + (f"?{parsed.query}" if parsed.query else "")
            outcome = store.record(
                Visit(
                    url=row.get("original_url", page.final_url),
                    final_url=page.final_url,
                    path=path,
                    query=parsed.query,
                    status=page.status,
                    title=page.title,
                    html=raw.read_bytes(),
                    markdown_body=_body(markdown.read_text(encoding="utf-8")) if markdown and markdown.is_file() else "",
                    screenshot=shot.read_bytes() if shot.is_file() else None,
                    slug=site.page_slug(path, parsed.query),
                )
            )
            counts[outcome.result if outcome.result != "new" else "new"] += 1
            if outcome.result in ("new", "changed"):
                changes.append(outcome)
        done = store.finish(summary.complete)
        _copy_inventory(run, site.inventory)
        if activity is not None:
            _record_links(activity, site.address.host, run)
    finally:
        if activity is not None:
            activity.close()
    for name in TRANSIENT:  # now in the site folder; the run folder keeps only its small result files
        shutil.rmtree(run / name, ignore_errors=True)
    for name in INVENTORY_TABLES:
        (run / f"{name}.csv").unlink(missing_ok=True)
    return WatchReport(
        site=str(site.root),
        host=site.address.host,
        pages_visited=sum(counts.values()),
        gone=done["gone"],
        complete=summary.complete,
        changes=tuple(changes),
        **counts,
    )
