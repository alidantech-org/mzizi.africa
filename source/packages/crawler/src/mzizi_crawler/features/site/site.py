"""`site watch`: crawl a site from its URL alone, keep its pages hashed and versioned, and say what changed."""

from __future__ import annotations

import faulthandler
import shutil
import signal
import threading
from pathlib import Path
from urllib.parse import urlparse

from mzizi_crawler.features.crawl_site.crawl_site import crawl_site
from mzizi_crawler.features.downloads.downloads import FoundAt
from mzizi_crawler.features.site.models import INVENTORY_TABLES, WatchReport
from mzizi_crawler.features.site.steps import (
    FILE_KINDS,
    build_markdown,
    canonical_url,
    copy_inventory,
    download,
    hunt,
    record_links,
    timestamp,
    write_discovered,
)
from mzizi_crawler.shared.activity import open_activity
from mzizi_crawler.shared.engine.cancel import CANCEL
from mzizi_crawler.shared.engine.service import client_for, extra_ca_bundle
from mzizi_crawler.shared.hunt import (
    looks_like_download,
    wordpress_media,
)
from mzizi_crawler.shared.identity import user_agent
from mzizi_crawler.shared.layout import DevLayout
from mzizi_crawler.shared.pipeline import DownloadPool, MarkdownPool
from mzizi_crawler.shared.records import LinkRecord, PageRecord
from mzizi_crawler.shared.requests import FetchQueueRequest, WatchRequest
from mzizi_crawler.shared.settings import crawler_settings
from mzizi_crawler.shared.sitestore import (
    Outcome,
    SiteStore,
    SiteWriter,
    Visit,
)
from mzizi_fetch.web.client import WebResponse
from mzizi_fetch.web.urls import host_of


def watch_site(request: WatchRequest) -> WatchReport:
    """Crawls a site, saving pages as they arrive; Markdown conversion, file hunting and downloads run beside it."""
    layout = DevLayout.locate()
    debug_stack_seconds = crawler_settings().debug_stack_seconds
    if debug_stack_seconds is not None:
        faulthandler.dump_traceback_later(debug_stack_seconds, repeat=True)
    CANCEL.clear()
    if threading.current_thread() is threading.main_thread():  # a stop signal ends fetching, then everything is saved
        for signum in (signal.SIGTERM, signal.SIGINT):
            signal.signal(signum, lambda *_: CANCEL.set())
    start = request.starts[0] if request.starts else request.url
    activity = open_activity()
    landed = canonical_url(start, extra_ca_bundle(host_of(start)))
    if (
        activity is not None
    ):  # remember where a start URL lands, so a slow answer later cannot send us to the wrong host
        alias_id = host_of(start)
        if landed != start:
            activity.put("site_aliases", [{"_id": alias_id, "from": alias_id, "canonical": landed}])
        else:
            known = activity.get("site_aliases", {"_id": alias_id}, 1)
            landed = str(known[0]["canonical"]) if known else start
    if landed != start:  # the site really lives on another host of the same domain: crawl and save it there
        request = request.model_copy(update={"url": landed, "urls": ()})
    site = layout.website(landed)
    run = Path(request.out_dir)
    store = SiteStore(site, activity, layout.root)
    host = site.address.host
    site_url = f"https://{host}/"

    markdown = MarkdownPool(store)
    downloads = (
        DownloadPool(
            FetchQueueRequest(out_dir=request.out_dir, site=site_url), activity, layout, request.download_limit
        )
        if request.download and activity is not None
        else None
    )

    def saved(outcome: Outcome, visit: Visit) -> None:
        state = store.states.get(outcome.path)
        if outcome.result in ("new", "changed") and state is not None:
            markdown.add(
                outcome.path, visit.html.decode("utf-8", errors="replace"), visit.final_url, state.fingerprint.raw
            )

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
            url=url,
            final_url=state.url,
            status=state.status,
            headers={"content-type": "text/html", "x-mzizi-via": "cache"},
            body=(layout.root / state.html_file).read_bytes(),
        )

    hunters: list[threading.Thread] = []
    wordpress = {"seen": False}

    def hunt_media() -> None:  # a WordPress media library lists every uploaded file: offer them all while crawling
        client = client_for(request, user_agent())
        try:
            for row in wordpress_media(client, site_url, timestamp()):
                if downloads is not None:
                    downloads.offer(
                        row["original_url"],
                        row["kind"],
                        FoundAt(source_page="wp-json media", anchor_text=row["anchor_text"], kind=row["kind"]),
                    )
        finally:
            client.close()

    def on_reference(link: LinkRecord) -> None:
        if downloads is None or link.scope.value != "internal":
            return
        kind = FILE_KINDS.get(link.kind)
        if (
            kind is None
            and request.hunt
            and link.kind == "page"
            and looks_like_download(link.original_url, link.anchor_text)
        ):
            kind = "candidate"
        if kind is not None:
            segments = [part for part in urlparse(link.source_page).path.split("/") if part]
            downloads.offer(
                link.original_url,
                kind,
                FoundAt(
                    source_page=link.source_page,
                    section=segments[0] if segments else "",
                    anchor_text=link.anchor_text,
                    kind=kind,
                    depth=link.depth,
                    discovered_at=link.discovered_at,
                ),
            )

    def on_page(page: PageRecord, body: bytes) -> None:
        parsed = urlparse(page.final_url)
        if page.fetched_via == "cache":
            writer.submit_cached(key_of(page.final_url))
            return
        if (
            request.hunt
            and downloads is not None
            and not wordpress["seen"]
            and (b"wp-content" in body[:300_000] or b"wp-json" in body[:300_000])
        ):
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
                url=page.original_url,
                final_url=page.final_url,
                path=path,
                query=parsed.query,
                status=page.status,
                title=page.title,
                html=body,
                screenshot=shot.read_bytes() if shot.is_file() else None,
                slug=site.page_slug(base, parsed.query, parsed.fragment),
            )
        )
        shot.unlink(missing_ok=True)

    crawl_request = request.model_copy(update={"record": False, "markdown": False})
    complete, stopped, done, hunted, fetched = False, "", {"gone": 0}, 0, (0, 0)
    try:
        try:
            summary = crawl_site(crawl_request, on_page, lookup, on_reference)
            complete, stopped = summary.complete, summary.stopped
        finally:  # whatever was fetched is saved, converted and downloaded, even if the crawl stopped early or failed
            outcomes = writer.close()
            for thread in hunters:
                thread.join(timeout=300)
            markdown.close()
            if downloads is not None:
                downloads.close()
            done = store.finish(complete)
        build_markdown(store, layout)  # repairs: pages whose Markdown is missing or older than their HTML
        copy_inventory(run, site.inventory)
        if activity is not None:
            record_links(activity, host, run)
        hunted = hunt(request, site, run, False) if request.hunt else 0
        write_discovered(site, run, store)
        if request.download and activity is not None and downloads is not None:
            left = max(0, request.download_limit - downloads.counts["done"])
            fetched = (downloads.counts["done"], downloads.counts["failed"])
            if left:  # anything the live pass left queued (past its limit or discovered late)
                extra = download(request, site, left)
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
        site=str(site.root),
        host=host,
        pages_visited=len(outcomes),
        gone=done["gone"],
        complete=complete,
        stopped=stopped,
        changes=tuple(o for o in outcomes if o.result in ("new", "changed")),
        files_hunted=hunted,
        files_downloaded=fetched[0],
        downloads_failed=fetched[1],
        markdown_converted=markdown.converted,
        **counts,
    )
