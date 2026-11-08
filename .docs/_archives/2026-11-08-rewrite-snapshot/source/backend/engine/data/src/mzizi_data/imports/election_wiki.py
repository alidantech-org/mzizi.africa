"""Gated reads of English Wikipedia through the MediaWiki action API (DEC-WIKIMEDIA-API-ACCESS): page HTML for election articles.

Each response is saved beside a provenance record (page title, revision id, URL) under `.data/raw/wiki-elections`, so the raw page is
preserved before any table is read. Only `/w/api.php` is used; nothing is scraped.
"""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

from ..fetch import live_fetcher
from ..wikimedia import API_PATHS, SITE_CODE

OUT = Path(__file__).resolve().parents[7] / ".data/raw/wiki-elections"


def fetch_page(conn, title: str, section: str | None = None, rate: float = 0.2) -> Path:
    """Saves the parsed HTML of a Wikipedia page (or one section index) and returns the file."""
    site = conn.execute("SELECT id FROM website.sites WHERE code = %s", (SITE_CODE,)).fetchone()
    fetcher = live_fetcher(conn, str(site["id"]), {"rate": {"requests_per_second": rate}, "limits": {"max_response_bytes": 8_000_000}}, robots_exempt_paths=API_PATHS)
    url = f"https://en.wikipedia.org/w/api.php?action=parse&page={quote(title)}&prop=text%7Crevid&format=json&formatversion=2&maxlag=5&redirects=1"
    if section:
        url += f"&section={section}"
    result = fetcher.get(url)
    if result.status != 200:
        raise RuntimeError(f"{url} answered {result.status}")
    data = json.loads(result.body)
    if "error" in data:
        raise RuntimeError(f"{title}: {data['error'].get('info')}")
    OUT.mkdir(parents=True, exist_ok=True)
    name = f"{hashlib.sha256(result.body).hexdigest()[:12]}-{title.replace('/', '_')}{'-s' + section if section else ''}.json"
    path = OUT / name
    path.write_bytes(result.body)
    Path(str(path) + ".provenance.json").write_text(json.dumps({
        "url": url, "site": SITE_CODE, "title": data["parse"]["title"], "revid": data["parse"]["revid"], "status": 200, "sha256": hashlib.sha256(result.body).hexdigest(),
        "bytes": len(result.body), "content_type": "application/json", "licence": "CC BY-SA 4.0 (Wikipedia text)", "retrieved_at": datetime.now(timezone.utc).isoformat(), "assessment_id": result.assessment_id, "user_agent": fetcher.user_agent,
    }, indent=2))
    return path
