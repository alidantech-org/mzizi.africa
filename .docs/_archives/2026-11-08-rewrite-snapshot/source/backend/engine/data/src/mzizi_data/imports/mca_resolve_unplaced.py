"""Second chance for MCAs whose ward could not be matched (`mca-unplaced` posts): looser ward matching with scores and reasons.

The first pass (`Geo.match_ward`) links only exact or clearly separated matches. Here the ward text is normalised harder (spaces and
punctuation removed, stray words such as 'ward', OCR splits like 'Embolo t'), the pool is narrowed to the constituency when the tree has it,
and a match at 0.80 or more with a 0.05 margin is accepted. The holder is moved to the ward post; any match below 0.95 is recorded in the
verification ledger as `under_review` with the score and the text that matched. A ward post that already has a current holder is not given a
second one (the person is listed as a probable duplicate). Wards with no candidate in the county are reported as missing from the tree.
The old unplaced post is retired (`is_current = false`), never deleted.
"""
from __future__ import annotations

import json
import re
from difflib import SequenceMatcher
from pathlib import Path

from .county_assembly_members import Geo, tokens

AGENT = "00000000-0000-4000-8000-0000000000a3"


def squash(text: str) -> str:
    return re.sub(r"[^a-z0-9]", "", re.sub(r"\b(ward|mca|rep|county)\b", " ", text.lower().replace("’", "").replace("'", "")))


def wardtext(description: str) -> tuple[str | None, str | None]:
    m = re.search(r"Elected 2022 for (.+?) \((.+?)\), IEBC", description or "")
    if m:
        return m.group(1), m.group(2)
    m = re.search(r"(?:Ward:\s*|MCA[ ,.\-]*|Rep[; ]+)([A-Za-z’' /\-]+?)(?:\s+Ward|\s*[,|]|$)", description or "")
    if m:
        return m.group(1), None
    m = re.search(r"\|\s*([A-Za-z’' /\-]+?)(?:\s+Ward)*(?:\s*\||\s*$)", description or "")
    return (m.group(1), None) if m else (None, None)


def score(a: str, b: str) -> float:
    sa, sb = squash(a), squash(b)
    if not sa or not sb:
        return 0.0
    if sa == sb:
        return 1.0
    ratio = SequenceMatcher(None, sa, sb).ratio()
    parts = [squash(p) for p in re.split(r"[/,]| and ", a) if squash(p)]
    if any(p == sb for p in parts) or (len(sb) >= 5 and sb in sa):
        ratio = max(ratio, 0.92)
    ta, tb = tokens(a), tokens(b)
    if ta and tb and (ta <= tb or tb <= ta) and max(len(t) for t in (ta if len(ta) < len(tb) else tb)) >= 4:
        ratio = max(ratio, 0.9)
    return ratio


def run(conn, report_path: Path | None = None) -> dict:
    geo = Geo.load(conn)
    rows = conn.execute("""SELECT o.id::text AS office_id, o.code, o.description, h.id::text AS holder_id, p.display_name FROM governance.offices o
        JOIN governance.holders h ON h.office_id = o.id AND h.is_current JOIN person.individuals p ON p.id = h.person_id WHERE o.code LIKE '%%/mca-unplaced/%%' AND o.is_current""").fetchall()
    number_to_county = {n: c for c, n in geo.numbers.items()}
    occupied = {r["code"] for r in conn.execute("SELECT o.code FROM governance.holders h JOIN governance.offices o ON o.id = h.office_id WHERE h.is_current AND o.code LIKE 'ke/ward/%%/mca'").fetchall()}
    out = {"resolved": [], "underReview": [], "duplicateOfHolder": [], "missingFromTree": [], "notAWard": []}
    for r in rows:
        county = number_to_county[r["code"].split("/")[2]]
        text, const = wardtext(r["description"])
        if not text or len(squash(text)) < 3 or re.search(r"nomi|special|ethnic|stay tuned|recent posts", r["description"] or "", re.I) and not const:
            out["notAWard"].append({"person": r["display_name"], "text": (r["description"] or "")[:80]})
            continue
        pool = list(geo.wards.get(county, {}))
        if const:
            ct = tokens(const)
            narrowed = [p for p in pool if tokens(p.split("/")[3].replace("-", " ")) & ct]
            pool = narrowed or pool
        ranked = sorted(((score(text, geo.ward_names[p]), p) for p in pool), reverse=True)
        best = ranked[0] if ranked else (0.0, None)
        margin = best[0] - (ranked[1][0] if len(ranked) > 1 else 0)
        if best[0] < 0.80 or margin < 0.05:
            out["missingFromTree"].append({"person": r["display_name"], "county": county, "ward": text, "constituency": const, "bestScore": round(best[0], 3), "bestCandidate": geo.ward_names.get(best[1])})
            continue
        post = best[1]
        if post in occupied:
            out["duplicateOfHolder"].append({"person": r["display_name"], "ward": post, "score": round(best[0], 3)})
            continue
        office_id = conn.execute("SELECT id::text AS id FROM governance.offices WHERE code = %s", (post,)).fetchone()["id"]
        conn.execute("UPDATE governance.holders SET office_id = %s, updated_at = now(), version = version + 1 WHERE id = %s", (office_id, r["holder_id"]))
        conn.execute("UPDATE governance.offices SET is_current = false, valid_to = current_date, updated_at = now() WHERE id = %s", (r["office_id"],))
        occupied.add(post)
        entry = {"person": r["display_name"], "ward": post, "score": round(best[0], 3), "text": text}
        out["resolved"].append(entry)
        if best[0] < 0.95:
            conn.execute("UPDATE source.verifications SET is_current = false WHERE target_kind = 'governance.holders' AND target_id = %s AND is_current", (r["holder_id"],))
            conn.execute("INSERT INTO source.verifications (target_kind, target_id, state, rationale, decided_by, is_current, created_at, updated_at, version) VALUES ('governance.holders', %s, 'under_review', %s, %s, true, now(), now(), 1)",
                         (r["holder_id"], f"Ward alias match: '{text}' to {geo.ward_names[post]} at score {best[0]:.2f} (margin {margin:.2f}); linked by lane P2 second pass, a reviewer should confirm.", AGENT))
            out["underReview"].append(entry)
    conn.commit()
    if report_path:
        report_path.write_text(json.dumps(out, indent=1))
    return out


if __name__ == "__main__":
    from ..db import connect

    with connect() as conn:
        res = run(conn, Path(".data/reports/mca-unplaced-resolution.json"))
    print({k: len(v) for k, v in res.items()})
