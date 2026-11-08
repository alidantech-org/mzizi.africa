"""Promote the staged election runs in order (classification, election, party, person, seat, candidate, result, electorate, ...) through validate, review (agent account) and promote.
Usage: promote_elections.py ENVFILE [source ...]   (sources: 2013 2017 2022 referendums). Completion first: DEC-COMPLETION-FIRST."""
import sys
import psycopg
from mzizi_data import statload

env = sys.argv[1]
sources = sys.argv[2:] or ["2013", "2017", "2022", "referendums"]
RATIONALE = ("Election results from the IEBC books and Wikipedia tables; completion-first approval (DEC-COMPLETION-FIRST). Soft warnings promote as unverified: "
             "seats whose candidate votes do not equal the published total (7 MP constituencies and a few counties in 2013, listed in the run diagnostics), "
             "winners computed as the highest valid vote, party text as printed, people linked only by name score with the same seat or county and party.")
with psycopg.connect(__import__("os").environ["DATABASE_URL"]) as conn:
    for s in sources:
        runs = conn.execute("SELECT id::text, dataset FROM staging.runs WHERE dataset LIKE %s ORDER BY created_at", (f"electoral/ke/results-{s}/%",)).fetchall()
        for rid, ds in runs:
            out = statload.promote_run(rid, RATIONALE + f" Run {ds}.", env)
            print(ds, "|", out["promote"][-250:].replace("\n", " "), flush=True)
