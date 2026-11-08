"""Gated harvest of county assembly member pages (lane P2). Data extraction only: raw pages are saved with a provenance file.

For each county assembly site the harvest starts at the home page, follows links that look like member lists (members, MCAs,
wards, elected, nominated, special seats, leadership) and their pagination, within a small page budget. Every request passes
the collection gate (assessment, robots.txt, 0.2 requests per second); a 401, 403, 429 or challenge ends that site for good.
"""
from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, urldefrag

from bs4 import BeautifulSoup

from .compliance import Denied, StopRun
from .fetch import PoliteFetcher, RobotsDisallowed, TooLarge, live_fetcher

WANT = re.compile(r"3rd|third|assembly-members|my-rep|member|mca|ward|elected|nominat|special|representativ|leadership|speaker|clerk|hon-", re.I)
AVOID = re.compile(r"tender|hansard|bill|career|gallery|download|news|press|vacanc|budget|petition|order-paper|motion|statement|committee|tour|procure|supplier|contract|calendar|schedule|login|\.(pdf|docx?|xlsx?|jpe?g|png|zip)(\?|$)", re.I)
PAGER = re.compile(r"[?&/](page|paged|pg|p)[=/]?\d+|/page/\d+", re.I)


def score(url: str, text: str) -> int:
    path = urlparse(url).path.lower()
    s = 0
    if re.search(r"/(members|mcas?|our-members|members-of|ward-rep|3rd-assembly|third-assembly|county-assembly-members)", path):
        s += 5
    if WANT.search(path):
        s += 2
    if WANT.search(text):
        s += 2
    if AVOID.search(path) or AVOID.search(text):
        s -= 6
    return s


def save(out: Path, site: str, url: str, result, agent: str) -> Path:
    digest = hashlib.sha256(result.body).hexdigest()
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", (urlparse(url).path.strip("/") + "_" + urlparse(url).query)[:80]) or "index"
    path = out / f"{digest[:12]}-{name}"
    if not path.exists():
        path.write_bytes(result.body)
    path.with_name(path.name + ".provenance.json").write_text(json.dumps({"url": url, "site": site, "status": result.status, "sha256": digest, "bytes": len(result.body), "content_type": result.headers.get("content-type"), "retrieved_at": datetime.now(timezone.utc).isoformat(), "assessment_id": result.assessment_id, "user_agent": agent}, indent=2))
    return path


def harvest_site(conn, site_code: str, out_dir: Path, max_pages: int = 14) -> dict:
    row = conn.execute("SELECT id::text AS id FROM website.sites WHERE code = %s", (site_code,)).fetchone()
    hosts = [r["hostname"] for r in conn.execute("SELECT hostname FROM website.domains WHERE site_id = %s AND status IN ('reachable','redirects','candidate') ORDER BY status", (row["id"],)).fetchall()]
    report = {"site": site_code, "pages": [], "error": None, "hosts": hosts}
    if not hosts:
        report["error"] = "no reachable domain"
        return report
    fetcher: PoliteFetcher = live_fetcher(conn, row["id"], {"rate": {"requests_per_second": 0.2}, "limits": {"timeout_seconds": 60, "max_response_bytes": 8_000_000}})
    out_dir.mkdir(parents=True, exist_ok=True)
    seen: set[str] = set()
    queue: list[tuple[int, str]] = []
    try:
        start = f"https://{hosts[0]}/"
        result = fetcher.get(start)
        for _ in range(3):
            if result.status in (301, 302, 307, 308):
                loc = next((v for k, v in result.headers.items() if k.lower() == "location"), None)
                if not loc:
                    break
                start = urljoin(start, loc)
                result = fetcher.get(start)
        if result.status != 200:
            report["error"] = f"home answered {result.status}"
            return report
        base_host = urlparse(start).netloc
        save(out_dir, site_code, start, result, fetcher.user_agent)
        report["pages"].append(start)
        seen.add(start)

        def links(html: bytes, base: str, pager_only=False):
            soup = BeautifulSoup(html, "html.parser")
            for a in soup.find_all("a", href=True):
                href = urldefrag(urljoin(base, a["href"].strip()))[0]
                p = urlparse(href)
                if p.scheme not in ("http", "https") or p.netloc.replace("www.", "") != base_host.replace("www.", ""):
                    continue
                yield href, a.get_text(" ", strip=True)

        for href, text in links(result.body, start):
            s = score(href, text)
            if s > 1:
                queue.append((s, href))
        while queue and len(report["pages"]) <= max_pages:
            queue.sort(key=lambda t: -t[0])
            s, url = queue.pop(0)
            if url in seen:
                continue
            seen.add(url)
            try:
                r = fetcher.get(url)
            except (RobotsDisallowed, TooLarge, Denied) as e:
                report.setdefault("skipped", []).append([url, type(e).__name__])
                continue
            if r.status != 200 or b"html" not in (r.headers.get("content-type", "html").lower().encode()):
                continue
            save(out_dir, site_code, url, r, fetcher.user_agent)
            report["pages"].append(url)
            parent = urlparse(url).path
            for href, text in links(r.body, url):
                if href in seen:
                    continue
                if PAGER.search(href) or text.strip().lower() in ("next", "next »", "»", "›", ">") or text.strip().isdigit():
                    if urlparse(href).path.rstrip("/").rsplit("/", 1)[0] == parent.rstrip("/").rsplit("/", 1)[0] or urlparse(href).path.startswith(parent.rstrip("/")) or PAGER.search(href):
                        queue.append((s + 1, href))
    except StopRun as e:
        report["error"] = f"stopped: {e}"
    except Denied as e:
        report["error"] = f"gate refused: {e}"
    except Exception as e:  # network trouble for one site must not end the others
        report["error"] = f"{type(e).__name__}: {e}"[:200]
    return report
