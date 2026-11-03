"""Fetch the leadership pages of reachable ministry, commission and agency sites (bounded, gated).

For each site that serves a governance institution and has a reachable domain: the home page, then links whose text or path says
about, leadership, management, board, team, commissioners, principal secretary, cabinet secretary, chief executive or director.
At most `max_pages` pages per host (well under the 60-request cap); every request goes through the collection gate
(identified, 0.2 requests per second, robots.txt, stop on a challenge or refusal). Raw HTML is kept with a provenance file.
"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

from lxml import html

KEYWORDS = re.compile(r"leadership|management|our[- ]team|board|commissioner|principal[- ]secretar|cabinet[- ]secretar|chief[- ]executive|ceo|director|about|who[- ]we[- ]are|executive|council|directorate", re.I)
SKIP = re.compile(r"\.(pdf|docx?|xlsx?|zip|jpg|jpeg|png|gif)(\?|$)|/(wp-content|tag|category|news|tender|vacanc|career|download)", re.I)


def candidate_links(base: str, tree) -> list[str]:
    host = urlparse(base).netloc
    scored: dict[str, int] = {}
    for a in tree.xpath("//a[@href]"):
        url = urljoin(base, a.get("href").split("#")[0])
        p = urlparse(url)
        if p.scheme not in ("http", "https") or p.netloc.replace("www.", "") != host.replace("www.", "") or SKIP.search(url) or url.rstrip("/") == base.rstrip("/"):
            continue
        text = " ".join(a.text_content().split())
        score = (3 if re.search(r"leadership|management|principal secretar|cabinet secretar|board|commissioner|our team", text + p.path, re.I) else 0) + (1 if KEYWORDS.search(text + p.path) else 0)
        if score:
            scored[url] = max(scored.get(url, 0), score)
    return [u for u, _ in sorted(scored.items(), key=lambda kv: -kv[1])]


def fetch_site(fetcher, host: str, out_dir: Path, site_code: str, institution: str, max_pages: int = 6, log=print) -> int:
    out_dir.mkdir(parents=True, exist_ok=True)
    saved = 0
    queue = [f"https://{host}/"]
    seen: set[str] = set()
    while queue and len(seen) < max_pages:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        try:
            res = fetcher.get(url)
        except Exception as error:  # noqa: BLE001  (a refusal or stop is reported and ends this host)
            log(f"{host}: {type(error).__name__}: {str(error)[:100]}")
            break
        hops = 0
        while res.status in (301, 302, 303, 307, 308) and hops < 2:  # follow a redirect only within the same registrable site
            target = urljoin(url, {k.lower(): v for k, v in res.headers.items()}.get("location", ""))
            tp = urlparse(target)
            if tp.scheme not in ("http", "https") or tp.netloc.replace("www.", "") != host.replace("www.", ""):
                break
            url = target
            seen.add(url)
            try:
                res = fetcher.get(url)
            except Exception as error:  # noqa: BLE001  (a host outside the approved scope is not contacted)
                log(f"{host}: redirect to {url} not followed: {str(error)[:80]}")
                break
            hops += 1
        if res.status != 200 or b"<" not in res.body[:2000]:
            log(f"{host}: {url} -> {res.status}")
            continue
        n = len(list(out_dir.glob("*.html")))
        path = out_dir / f"{n:02d}.html"
        path.write_bytes(res.body)
        Path(str(path) + ".provenance.json").write_text(json.dumps({"url": url, "requested": url, "retrieved_at": datetime.now(timezone.utc).isoformat(), "site": site_code, "institution": institution, "host": host}))
        saved += 1
        if len(seen) == 1:
            try:
                queue = candidate_links(url, html.fromstring(res.body))[: max_pages - 1]
            except Exception:  # noqa: BLE001
                queue = []
    return saved


def run(conn, out_root: Path, rate: float = 0.2, max_pages: int = 6, only: list[str] | None = None, log=print) -> dict:
    from .fetch import live_fetcher

    rows = conn.execute(
        """SELECT DISTINCT ON (s.code) s.id::text AS site_id, s.code, i.code AS institution, d.hostname
             FROM website.sites s JOIN website.subjects su ON su.site_id = s.id AND su.target_kind = 'governance.institutions'
             JOIN governance.institutions i ON i.id = su.target_id
             JOIN website.domains d ON d.site_id = s.id AND d.status IN ('reachable', 'redirects')
            WHERE s.code NOT LIKE 'ke/county%' AND s.code NOT LIKE '%ngcdf%'
            ORDER BY s.code, (d.status <> 'reachable'), d.hostname"""
    ).fetchall()
    report = {"sites": 0, "pages": 0, "hosts": []}
    for r in rows:
        if only and r["code"] not in only:
            continue
        host = r["hostname"]
        fetcher = live_fetcher(conn, r["site_id"], {"rate": {"requests_per_second": rate}, "limits": {"max_response_bytes": 3_000_000}})
        n = fetch_site(fetcher, host, out_root / host, r["code"], r["institution"], max_pages, log)
        report["sites"] += 1
        report["pages"] += n
        report["hosts"].append({"host": host, "site": r["code"], "institution": r["institution"], "pages": n})
        log(f"{host}: {n} pages")
    return report
