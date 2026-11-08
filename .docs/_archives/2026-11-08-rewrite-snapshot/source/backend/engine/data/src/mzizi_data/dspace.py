"""Harvest files from a DSpace 7 repository through its public REST API (no JavaScript), through the same gate and registry as the section crawler.

Used for the Parliament library repository (`libraryir.parliament.go.ke`), which holds Kenya Gazette issues, Acts, Bills and Auditor-General
reports that the HTML sites render with a client-side app. Requests per item: one bundles call with the bitstreams embedded, one content download.
Bounded by `max_requests`; every request is made by the gated fetcher (robots.txt, 0.2 req/s, stop on refusal).
"""
from __future__ import annotations

import json
from urllib.parse import quote

from .crawl import CrawlConfig, SectionCrawler, _Task, load_seed_sections


def harvest(conn, store, make_fetcher, site_code: str, query: str, family: str, max_requests: int = 120, page_size: int = 20, max_file_mb: int = 60, log=print) -> dict:
    from . import registry

    cfg = CrawlConfig(max_requests=max_requests, max_file_bytes=max_file_mb * 1024 * 1024)
    site = registry.site_by_code(conn, site_code)
    fetcher = make_fetcher(conn, site["id"], {"rate": {"requests_per_second": 0.2}, "limits": {"max_response_bytes": cfg.max_file_bytes}})
    crawler = SectionCrawler(conn, store, fetcher, site_code, load_seed_sections(family), None, cfg, log=log)
    base = f"https://{next(iter(crawler.domain_ids))}"
    seen_items = 0
    page = 0
    while not crawler.report.stop and crawler.report.requests < max_requests:
        res = crawler._get(f"{base}/server/api/discover/search/objects?query={quote(query)}&dsoType=ITEM&size={page_size}&page={page}&sort=dc.date.issued,DESC")
        if res is None or res.status != 200:
            break
        objects = json.loads(res.body)["_embedded"]["searchResult"]["_embedded"]["objects"]
        if not objects:
            break
        for obj in objects:
            item = obj["_embedded"]["indexableObject"]
            if crawler.report.stop or crawler.report.requests >= max_requests:
                break
            bundles = crawler._get(f"{base}/server/api/core/items/{item['uuid']}/bundles?embed=bitstreams")
            if bundles is None or bundles.status != 200:
                continue
            seen_items += 1
            for bundle in json.loads(bundles.body)["_embedded"]["bundles"]:
                if bundle.get("name") != "ORIGINAL":
                    continue
                for bs in (bundle.get("_embedded", {}).get("bitstreams", {}).get("_embedded", {}).get("bitstreams", [])):
                    if (bs.get("name") or "").lower().endswith(".pdf"):
                        crawler._take_document(_Task(f"{base}/server/api/core/bitstreams/{bs['uuid']}/content", 2, "gazettes", 0, 1, f"{base}/items/{item['uuid']}", item["name"]))
        page += 1
    crawler.conn.commit()
    return {**crawler.report.to_json(), "items_seen": seen_items, "skipped_sample": crawler.report.skipped[:10]}
