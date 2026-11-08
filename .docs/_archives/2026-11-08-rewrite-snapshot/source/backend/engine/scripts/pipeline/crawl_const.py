import json, re, sys
from pathlib import Path
from urllib.parse import urljoin
from mzizi_data.db import connect
from mzizi_data.fetch import live_fetcher
import hashlib
OUT = Path("../../../../.data/raw/constitution")
PREFIX = "/index.php/constitution-of-kenya/"
def links(body: bytes):
    return {m for m in re.findall(rb'href="(/index\.php/constitution-of-kenya/[^"#?]+)"', body)}
seen = {}
for f in OUT.glob("*.provenance.json"):
    u = json.loads(f.read_text())["url"]
    seen[u] = Path(str(f)[:-len(".provenance.json")])
with connect() as conn:
    sid = conn.execute("select id from website.sites where code='ke/klrc'").fetchone()["id"]
    fetcher = live_fetcher(conn, str(sid), {"rate": {"requests_per_second": 0.2}})
    queue = []
    for p in seen.values():
        queue += [urljoin("https://www.klrc.go.ke", l.decode()) for l in links(p.read_bytes())]
    done = set(seen)
    n = 0
    while queue:
        url = queue.pop(0)
        if url in done: continue
        done.add(url)
        try:
            r = fetcher.get(url)
            for _ in range(3):
                if r.status in (301, 302, 307, 308):
                    loc = next((v for k, v in r.headers.items() if k.lower() == "location"), None)
                    if not loc: break
                    r = fetcher.get(urljoin(url, loc))
                else: break
        except Exception as e:
            print("FAIL", url, type(e).__name__, str(e)[:80], flush=True)
            if getattr(fetcher, "tripped", None): break
            continue
        if r.status != 200: print("STATUS", r.status, url, flush=True); continue
        name = hashlib.sha256(r.body).hexdigest()[:12] + "-" + url.rstrip("/").rsplit("/", 1)[-1]
        (OUT / name).write_bytes(r.body)
        (OUT / (name + ".provenance.json")).write_text(json.dumps({"url": url, "status": 200, "sha256": hashlib.sha256(r.body).hexdigest(), "bytes": len(r.body), "retrieved_at": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(), "assessment_id": r.assessment_id, "user_agent": fetcher.user_agent}))
        n += 1
        queue += [urljoin("https://www.klrc.go.ke", l.decode()) for l in links(r.body)]
        if n % 20 == 0: print("fetched", n, "queue", len(queue), flush=True)
print("CRAWL-DONE", n, flush=True)
