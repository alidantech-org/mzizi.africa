"""One gated live fetch for a registered site, saved as raw bytes next to a small provenance record."""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse


def fetch_to_directory(conn, make_fetcher, site_code: str, url: str, out_dir: str) -> str:
    """Fetches `url` for `site_code` through the collection gate, robots.txt and the rate limit; never overwrites a saved file."""
    row = conn.execute("SELECT id FROM website.sites WHERE code = %s", (site_code,)).fetchone()
    if not row:
        raise SystemExit(f"unknown site {site_code}")
    fetcher = make_fetcher(conn, str(row["id"]), {"rate": {"requests_per_second": 0.2}})
    result = fetcher.get(url)
    for _hop in range(3):  # a redirect is followed only through the gate again, so a hop to a host outside the approved scope is refused
        if result.status not in (301, 302, 307, 308):
            break
        location = next((v for k, v in result.headers.items() if k.lower() == "location"), None)
        if not location:
            break
        url = urljoin(url, location)
        result = fetcher.get(url)
    if result.status != 200:
        raise SystemExit(f"{url} answered {result.status}; nothing saved")
    digest = hashlib.sha256(result.body).hexdigest()
    name = Path(urlparse(url).path).name or "index"
    target = Path(out_dir)
    target.mkdir(parents=True, exist_ok=True)
    saved = target / f"{digest[:12]}-{name}"
    if not saved.exists():
        saved.write_bytes(result.body)
    saved.with_suffix(saved.suffix + ".provenance.json").write_text(json.dumps({
        "url": url, "site": site_code, "status": result.status, "sha256": digest, "bytes": len(result.body),
        "content_type": result.headers.get("content-type"), "retrieved_at": datetime.now(timezone.utc).isoformat(),
        "assessment_id": result.assessment_id, "user_agent": fetcher.user_agent,
    }, indent=2))
    return str(saved)
