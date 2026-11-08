"""Run: python scripts/mca_harvest_run.py OUT_DIR SHARD NSHARDS [site-code ...]"""
import json, sys
from pathlib import Path
from mzizi_data.db import connect
from mzizi_data.mca_harvest import harvest_site
out, shard, n = Path(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3])
with connect() as conn:
    sites = sys.argv[4:] or [r["code"] for r in conn.execute("SELECT DISTINCT code FROM website.sites WHERE code LIKE 'ke/county-assembly/%' ORDER BY 1").fetchall()]
    for i, code in enumerate(sites):
        if i % n != shard:
            continue
        rep = harvest_site(conn, code, out / code.rsplit("/", 1)[1])
        print(json.dumps({k: (v if k != "pages" else len(v)) for k, v in rep.items()}), flush=True)
