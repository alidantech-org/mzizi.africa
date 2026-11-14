"""`site watch`: crawl a site from its URL alone, keep its pages hashed and versioned, and say what changed."""

from __future__ import annotations

import csv
import hashlib
import shutil
import signal
import threading
from pathlib import Path
from urllib.parse import urlparse

from pydantic import BaseModel

from mzizi_engine.activity import open_activity
from mzizi_engine.layout import DevLayout, address_of
from mzizi_engine.web.crawl.cancel import CANCEL
from mzizi_engine.web.crawl.service import extra_ca_bundle
from mzizi_engine.web.identity import user_agent
from mzizi_engine.sitestore import atomic_write, Outcome, SiteStore, SiteWriter, Visit
from mzizi_engine.web.records import PageRecord
from mzizi_fetch.web.client import WebResponse
from mzizi_engine.web.export import read_csv
from mzizi_engine.web.handlers.crawl import crawl_site
from mzizi_engine.web.crawl.service import client_for
from mzizi_engine.web.handlers.downloads import FoundAt
from mzizi_engine.web.hunt import HUNTED_FILE, candidate_rows, looks_like_download, wordpress_media, write_hunted
from mzizi_engine.web.pipeline import DownloadPool, MarkdownPool
from mzizi_engine.web.records import LinkRecord
from mzizi_engine.web.requests import FetchQueueRequest, WatchRequest
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
    fresh: int  # served from the saved copy (fetched recently), not fetched again
    gone: int
    complete: bool
    files_hunted: int = 0
    files_downloaded: int = 0
    markdown_converted: int = 0
    downloads_failed: int = 0
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
            atomic_write(target / f"{name}.csv", source.read_bytes())


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


def _build_markdown(store: SiteStore, layout: DevLayout) -> int:
    """Makes the Markdown for every page whose file is missing or was built from older HTML (repairs interrupted runs)."""
    from mzizi_extraction import extract_html_document, learn_boilerplate
    from mzizi_extraction.document import render_markdown

    todo = []
    for state in store.states.values():
        html_file, md_file = layout.root / state.html_file, layout.root / state.md_file
        if state.gone or not html_file.is_file():
            continue
        current = md_file.is_file() and f"html_sha256: {state.fingerprint.raw}" in md_file.read_text(encoding="utf-8")[:800]
        if not current:
            todo.append((state, html_file.read_text(encoding="utf-8", errors="replace")))
    if not todo:
        return 0
    boilerplate = learn_boilerplate([html for _state, html in todo] or [])
    for state, html in todo:
        output, _title, _removed = extract_html_document(html, state.url, boilerplate)
        body = render_markdown(output.pages).replace("<!-- page 1 -->\n\n", "", 1)
        visit = Visit(
            url=state.url, final_url=state.url, path=state.path, status=state.status, title=state.title,
            html=b"", slug="", markdown_body=body,
        )
        store.write_markdown(visit, state, body)
    return len(todo)


def _known_urls(site) -> set[str]:  # noqa: ANN001
    known: set[str] = set()
    for name in ("documents", "images", "media", "files"):
        table = site.inventory / f"{name}.csv"
        if table.is_file():
            known.update(row.get("original_url", "") for row in read_csv(table))
    return known


def _hunt(request: WatchRequest, site, run: Path, wordpress: bool) -> int:  # noqa: ANN001
    """Probable downloads among the links, plus a WordPress site's whole media library."""
    rows = candidate_rows(run / "links.csv", _known_urls(site)) if (run / "links.csv").is_file() else []
    if wordpress:
        client = client_for(request, user_agent())
        try:
            rows += wordpress_media(client, f"https://{site.address.host}/", _now())
        finally:
            client.close()
    return write_hunted(site.inventory / HUNTED_FILE, rows)


def _write_discovered(site, run: Path, store: SiteStore) -> None:  # noqa: ANN001
    """Every internal page address seen on any page, marked visited or not: the full link map of the site."""
    def key(url: str) -> str:
        return url.split("#")[0].rstrip("/")

    seen: dict[str, str] = {}
    table = run / "internal_urls.csv"
    if table.is_file():
        for row in read_csv(table):
            if row.get("kind", "page") == "page" and row.get("normalized_url"):
                seen.setdefault(key(row["normalized_url"]), "queued")
    for state in store.states.values():
        if not state.gone:
            seen[key(state.url)] = "visited"
    lines = ["# status | url (every internal page link found, from the index onward)"]
    lines += [f"{status} | {url}" for url, status in sorted(seen.items()) if url]
    atomic_write(site.root / "discovered.txt", ("\n".join(lines) + "\n").encode("utf-8"))


def _download(request: WatchRequest, site, limit: int) -> tuple[int, int]:  # noqa: ANN001
    from mzizi_engine.web.handlers.queue import enqueue, fetch_queue
    from mzizi_engine.web.requests import EnqueueRequest, FetchQueueRequest

    enqueue(EnqueueRequest(out_dir=request.out_dir, site=f"https://{site.address.host}/"))
    report = fetch_queue(
        FetchQueueRequest(out_dir=request.out_dir, site=f"https://{site.address.host}/", limit=limit)
    )
    return report.done, report.failed


FILE_KINDS = {"image": "image", "media": "media", "embed": "media", "document": "document", "data": "file", "archive": "file", "program": "file"}


def watch_site(request: WatchRequest) -> WatchReport:
    """Crawls a site, saving pages as they arrive; Markdown conversion, file hunting and downloads run beside it."""
    layout = DevLayout.locate()
    CANCEL.clear()
    if threading.current_thread() is threading.main_thread():  # a stop signal ends fetching, then everything is saved
        for signum in (signal.SIGTERM, signal.SIGINT):
            signal.signal(signum, lambda *_: CANCEL.set())
    start = request.starts[0] if request.starts else request.url
    landed = canonical_url(start, extra_ca_bundle(host_of(start)))
    if landed != start:  # the site really lives on another host of the same domain: crawl and save it there
        request = request.model_copy(update={"url": landed, "urls": ()})
    site = layout.website(landed)
    run = Path(request.out_dir)
    activity = open_activity()
    store = SiteStore(site, activity, layout.root)
    host = site.address.host
    site_url = f"https://{host}/"

    markdown = MarkdownPool(store)
    downloads = (
        DownloadPool(FetchQueueRequest(out_dir=request.out_dir, site=site_url), activity, layout, request.download_limit)
        if request.download and activity is not None
        else None
    )

    def saved(outcome: Outcome, visit: Visit) -> None:
        state = store.states.get(outcome.path)
        if outcome.result in ("new", "changed") and state is not None:
            markdown.add(outcome.path, visit.html.decode("utf-8", errors="replace"), visit.final_url, state.fingerprint.raw)

    writer = SiteWriter(store, on_saved=saved)

    def key_of(url: str) -> str:
        parsed = urlparse(url)
        base = (parsed.path.rstrip("/") or "/") if parsed.path else "/"
        return base + (f"?{parsed.query}" if parsed.query else "")

    def lookup(url: str) -> WebResponse | None:
        state = store.is_fresh(key_of(url), request.min_age_hours)
        if state is None:
            return None
        return WebResponse(
            url=url, final_url=state.url, status=state.status,
            headers={"content-type": "text/html", "x-mzizi-via": "cache"},
            body=(layout.root / state.html_file).read_bytes(),
        )

    hunters: list[threading.Thread] = []
    wordpress = {"seen": False}

    def hunt_media() -> None:  # a WordPress media library lists every uploaded file: offer them all while crawling
        client = client_for(request, user_agent())
        try:
            for row in wordpress_media(client, site_url, _now()):
                if downloads is not None:
                    downloads.offer(row["original_url"], row["kind"], FoundAt(source_page="wp-json media", anchor_text=row["anchor_text"], kind=row["kind"]))
        finally:
            client.close()

    def on_reference(link: LinkRecord) -> None:
        if downloads is None or link.scope.value != "internal":
            return
        kind = FILE_KINDS.get(link.kind)
        if kind is None and request.hunt and link.kind == "page" and looks_like_download(link.original_url, link.anchor_text):
            kind = "candidate"
        if kind is not None:
            segments = [part for part in urlparse(link.source_page).path.split("/") if part]
            downloads.offer(
                link.original_url, kind,
                FoundAt(source_page=link.source_page, section=segments[0] if segments else "", anchor_text=link.anchor_text,
                        kind=kind, depth=link.depth, discovered_at=link.discovered_at),
            )

    def on_page(page: PageRecord, body: bytes) -> None:
        parsed = urlparse(page.final_url)
        if page.fetched_via == "cache":
            writer.submit_cached(key_of(page.final_url))
            return
        if request.hunt and downloads is not None and not wordpress["seen"] and (b"wp-content" in body[:300_000] or b"wp-json" in body[:300_000]):
            wordpress["seen"] = True
            thread = threading.Thread(target=hunt_media, name="wordpress-media", daemon=True)
            thread.start()
            hunters.append(thread)
        if host_of(page.final_url) != host:
            return  # a redirect left the site: not this site's page
        shot = run / "screenshots" / f"{page.n:04d}.png"
        base = (parsed.path.rstrip("/") or "/") if parsed.path else "/"
        path = base + (f"?{parsed.query}" if parsed.query else "") + (f"#{parsed.fragment}" if parsed.fragment else "")
        writer.submit(
            Visit(
                url=page.original_url, final_url=page.final_url, path=path, query=parsed.query, status=page.status,
                title=page.title, html=body, screenshot=shot.read_bytes() if shot.is_file() else None,
                slug=site.page_slug(base, parsed.query, parsed.fragment),
            )
        )
        shot.unlink(missing_ok=True)

    crawl_request = request.model_copy(update={"record": False, "markdown": False})
    complete, done, hunted, fetched = False, {"gone": 0}, 0, (0, 0)
    try:
        try:
            summary = crawl_site(crawl_request, on_page, lookup, on_reference)
            complete = summary.complete
        finally:  # whatever was fetched is saved, converted and downloaded, even if the crawl stopped early or failed
            outcomes = writer.close()
            for thread in hunters:
                thread.join(timeout=300)
            markdown.close()
            if downloads is not None:
                downloads.close()
            done = store.finish(complete)
        _build_markdown(store, layout)  # repairs: pages whose Markdown is missing or older than their HTML
        _copy_inventory(run, site.inventory)
        if activity is not None:
            _record_links(activity, host, run)
        hunted = _hunt(request, site, run, False) if request.hunt else 0
        _write_discovered(site, run, store)
        if request.download and activity is not None and downloads is not None:
            left = max(0, request.download_limit - downloads.counts["done"])
            fetched = (downloads.counts["done"], downloads.counts["failed"])
            if left:  # anything the live pass left queued (past its limit or discovered late)
                extra = _download(request, site, left)
                fetched = (fetched[0] + extra[0], fetched[1] + extra[1])
    finally:
        if activity is not None:
            activity.close()
    shutil.rmtree(run / "screenshots", ignore_errors=True)
    for name in INVENTORY_TABLES:
        (run / f"{name}.csv").unlink(missing_ok=True)
    counts = {"new": 0, "changed": 0, "unchanged": 0, "noise": 0, "fresh": 0}
    for outcome in outcomes:
        counts[outcome.result] += 1
    return WatchReport(
        site=str(site.root), host=host, pages_visited=len(outcomes), gone=done["gone"], complete=complete,
        changes=tuple(o for o in outcomes if o.result in ("new", "changed")),
        files_hunted=hunted, files_downloaded=fetched[0], downloads_failed=fetched[1],
        markdown_converted=markdown.converted, **counts,
    )
