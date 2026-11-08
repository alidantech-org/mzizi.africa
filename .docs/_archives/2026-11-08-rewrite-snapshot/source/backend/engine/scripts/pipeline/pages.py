import sys, json, hashlib, datetime
from pathlib import Path
from mzizi_data.db import connect
from mzizi_data.fetch import live_fetcher
site, base, last, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), Path(sys.argv[4])
out.mkdir(parents=True, exist_ok=True)
done = {json.loads(p.read_text())["url"] for p in out.glob("*.provenance.json")}
with connect() as conn:
    sid = conn.execute("select id from website.sites where code=%s", (site,)).fetchone()["id"]
    f = live_fetcher(conn, str(sid), {"rate": {"requests_per_second": 0.2}})
    for n in range(1, last + 1):
        url = f"{base}{'&' if '?' in base else '?'}page={n}"
        if url in done: continue
        try:
            r = f.get(url)
        except Exception as e:
            print("FAIL", url, type(e).__name__, str(e)[:80], flush=True)
            if getattr(f, "tripped", None): break
            continue
        if r.status != 200: print("STATUS", r.status, url, flush=True); continue
        name = f"{hashlib.sha256(r.body).hexdigest()[:12]}-p{n}.json"
        (out / name).write_bytes(r.body)
        (out / (name + ".provenance.json")).write_text(json.dumps({"url": url, "status": 200, "sha256": hashlib.sha256(r.body).hexdigest(), "bytes": len(r.body), "retrieved_at": datetime.datetime.now(datetime.timezone.utc).isoformat(), "assessment_id": r.assessment_id, "user_agent": f.user_agent}))
        if n % 20 == 0: print("page", n, flush=True)
print("PAGES-DONE", flush=True)
