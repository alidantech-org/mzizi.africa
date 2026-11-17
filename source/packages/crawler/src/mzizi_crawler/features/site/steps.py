"""The steps of a site watch: markdown, links, hunting, downloads and inventory copies."""

from __future__ import annotations

import hashlib
from pathlib import Path
from urllib.parse import urlparse

from mzizi_crawler.features.site.models import INVENTORY_TABLES
from mzizi_crawler.shared.activity import Activity
from mzizi_crawler.shared.engine.service import client_for
from mzizi_crawler.shared.export import read_csv
from mzizi_crawler.shared.hunt import (
    HUNTED_FILE,
    candidate_rows,
    wordpress_media,
    write_hunted,
)
from mzizi_crawler.shared.identity import user_agent
from mzizi_crawler.shared.layout import DevLayout, SiteFolder, address_of
from mzizi_crawler.shared.requests import FetchQueueRequest, WatchRequest
from mzizi_crawler.shared.sitestore import (
    SiteStore,
    Visit,
    atomic_write,
)


def page_body(markdown: str) -> str:
    """The Markdown the crawler wrote, without its own front matter (the store writes the full one)."""
    if markdown.startswith("---\n"):
        end = markdown.find("\n---\n", 4)
        if end != -1:
            return markdown[end + 5 :].lstrip("\n")
    return markdown


def copy_inventory(run: Path, target: Path) -> None:
    target.mkdir(parents=True, exist_ok=True)
    for name in INVENTORY_TABLES:
        source = run / f"{name}.csv"
        if source.is_file():
            atomic_write(target / f"{name}.csv", source.read_bytes())


def record_links(activity: Activity, host: str, run: Path) -> None:
    path = run / "links.csv"
    if not path.is_file():
        return
    existing = {row["_id"]: row for row in activity.get("site_links", {"host": host})}
    now = timestamp()
    fresh = []
    for row in read_csv(path):
        source, target = urlparse(row.get("source_page", "")).path or "/", row.get("normalized_url", "")
        key = hashlib.sha256(f"{host}|{source}|{target}|{row.get('anchor_text', '')}".encode()).hexdigest()[:24]
        first = existing.get(key, {}).get("first_seen", now)
        fresh.append(
            {
                "_id": key,
                "host": host,
                "from_path": source,
                "to": target,
                "anchor": row.get("anchor_text", ""),
                "kind": row.get("kind", ""),
                "scope": row.get("scope", ""),
                "first_seen": first,
                "last_seen": now,
            }
        )
    activity.put("site_links", fresh)


def timestamp() -> str:
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
    response = None
    for _attempt in range(3):  # a busy site can be slow to answer: ask again before giving up
        try:
            response = httpx.get(
                url, follow_redirects=True, timeout=30, verify=verify, headers={"User-Agent": user_agent()}
            )
            break
        except httpx.HTTPError:
            continue
    if response is None:
        return url
    final = str(response.url)
    same = address_of(final).group == address_of(url).group
    return final if same and address_of(final).host != address_of(url).host else url


def build_markdown(store: SiteStore, layout: DevLayout) -> int:
    """Makes the Markdown for every page whose file is missing or was built from older HTML (repairs interrupted runs)."""
    from mzizi_crawler.shared.markdown_repair import needs_markdown_repair
    from mzizi_extraction import extract_html_document, learn_boilerplate, render_markdown

    todo = []
    for state in store.states.values():
        html_file, md_file = layout.root / state.html_file, layout.root / state.md_file
        if state.gone or not html_file.is_file():
            continue
        if needs_markdown_repair(md_file, state.fingerprint.raw):
            todo.append((state, html_file.read_text(encoding="utf-8", errors="replace")))
    if not todo:
        return 0
    boilerplate = learn_boilerplate([html for _state, html in todo] or [])
    for state, html in todo:
        output, _title, _removed = extract_html_document(html, state.url, boilerplate)
        body = render_markdown(output.pages).replace("<!-- page 1 -->\n\n", "", 1)
        visit = Visit(
            url=state.url,
            final_url=state.url,
            path=state.path,
            status=state.status,
            title=state.title,
            html=b"",
            slug="",
            markdown_body=body,
        )
        store.write_markdown(visit, state, body)
    return len(todo)


def known_urls(site: SiteFolder) -> set[str]:
    known: set[str] = set()
    for name in ("documents", "images", "media", "files"):
        table = site.inventory / f"{name}.csv"
        if table.is_file():
            known.update(row.get("original_url", "") for row in read_csv(table))
    return known


def hunt(request: WatchRequest, site: SiteFolder, run: Path, wordpress: bool) -> int:
    """Probable downloads among the links, plus a WordPress site's whole media library."""
    rows = candidate_rows(run / "links.csv", known_urls(site)) if (run / "links.csv").is_file() else []
    if wordpress:
        client = client_for(request, user_agent())
        try:
            rows += wordpress_media(client, f"https://{site.address.host}/", timestamp())
        finally:
            client.close()
    return write_hunted(site.inventory / HUNTED_FILE, rows)


def write_discovered(site: SiteFolder, run: Path, store: SiteStore) -> None:
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


def download(request: WatchRequest, site: SiteFolder, limit: int) -> tuple[int, int]:
    from mzizi_crawler.features.queue.queue import enqueue, fetch_queue
    from mzizi_crawler.shared.requests import EnqueueRequest

    enqueue(EnqueueRequest(out_dir=request.out_dir, site=f"https://{site.address.host}/", kinds=request.download_kinds))
    report = fetch_queue(FetchQueueRequest(
            out_dir=request.out_dir, site=f"https://{site.address.host}/", limit=limit, kinds=request.download_kinds
        ))
    return report.done, report.failed


FILE_KINDS = {
    "image": "image",
    "media": "media",
    "embed": "media",
    "document": "document",
    "data": "file",
    "archive": "file",
    "program": "file",
}
