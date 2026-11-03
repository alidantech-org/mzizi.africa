"""Raw wikitext of Wikipedia pages about county governments, fetched through the gate with the MediaWiki API (action=parse)."""
from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode

API = "https://en.wikipedia.org/w/api.php"
PAGES = ["Counties of Kenya", "2022 Kenyan general election", "2017 Kenyan general election", "2013 Kenyan general election"]


def fetch_pages(get, out: Path, pages: list[str] = PAGES) -> list[str]:
    out.mkdir(parents=True, exist_ok=True)
    done = []
    for title in pages:
        path = out / (title.replace(" ", "_").replace("/", "_") + ".json")
        if path.exists():
            continue
        res = get(f"{API}?{urlencode({'action': 'parse', 'page': title, 'prop': 'wikitext', 'redirects': 1, 'format': 'json', 'formatversion': 2, 'maxlag': 5})}")
        if res.status != 200:
            raise RuntimeError(f"{title}: {res.status}")
        data = json.loads(res.body)
        if "error" in data:
            raise RuntimeError(f"{title}: {data['error'].get('code')}")
        path.write_text(json.dumps({"title": data["parse"]["title"], "url": "https://en.wikipedia.org/wiki/" + data["parse"]["title"].replace(" ", "_"), "retrieved_at": datetime.now(timezone.utc).isoformat(), "wikitext": data["parse"]["wikitext"]}))
        done.append(title)
    return done
