"""Member lists on the Parliament of Kenya site (National Assembly and Senate) to one `record` segment per member.

Only what the list page publishes about a public office: name, county, constituency, party, how the seat was
filled, the member's page and official photo URL. Contact details, histories and personal pages are not read.
Rows with no name (the site publishes placeholders) are skipped and counted.
"""
from __future__ import annotations

import json
import re

from lxml import html

from . import Extractor, Output, register

HONORIFICS = {"HON", "HON.", "SEN", "SEN.", "SENATOR", "(DR.)", "(DR)", "DR.", "DR", "(AMB.)", "(AMB)", "(PROF.)", "(PROF)", "PROF.", "PROF", "(RTD)", "(RTD.)", "(ENG.)", "(ENG)", "ENG.", "(CPA)", "(MRS.)", "(MR.)", "(MS.)", "(JUSTICE)", "JUSTICE", "(SC)", "(AMB.)", "(MAJ.)", "(GEN.)", "(COL.)", "(CAPT.)", "(REV.)", "(BISHOP)", "(DR.).", "(ENG)", "(CPA.)", "AMB.", "(HON.)", "(ARCH.)", "(MRS)", "(MR)"}
POSTNOMINALS = {"CBS", "CS", "MP", "EGH", "OGW", "MBS", "HSC", "EBS", "MGH", "OGW.", "SC", "CBS.", "MP.", "EGH.", "SS", "EBS.", "MGH.", "SBS", "OBS", "CPA", "CPS", "FCPA"}


def _word(token: str) -> str:
    if token != token.upper():
        return token
    return "-".join(part[:1].upper() + part[1:].lower() for part in token.split("-"))


def clean_name(raw: str) -> dict:
    """{'display', 'family', 'given'} from a published name such as 'HON. (DR.) AMOLLO PAUL OTIENDE, CS, CBS'. Order is only claimed when a comma gives it."""
    parts = [p.strip() for p in raw.replace(" ", " ").split(",") if p.strip()]
    kept: list[str] = []
    for index, part in enumerate(parts):
        tokens = [t for t in part.split() if t.upper() not in HONORIFICS and not re.fullmatch(r"\([A-Za-z.]+\)", t)]
        if index > 0 and all(t.upper().strip(".") in {p.strip(".") for p in POSTNOMINALS} for t in tokens):
            continue
        if tokens:
            kept.append(" ".join(_word(t) for t in tokens))
    if len(kept) >= 2:
        return {"display": f"{kept[1]} {kept[0]}", "family": kept[0], "given": kept[1]}
    return {"display": kept[0] if kept else "", "family": None, "given": None}


def run(data: bytes, profile: str | None) -> Output:
    chamber = "senate" if profile == "senate" else "national-assembly"
    try:
        tree = html.fromstring(data)
    except Exception as error:  # noqa: BLE001
        return Output("failed", diagnostics=[{"level": "error", "code": "not_html", "message": str(error)[:200]}])
    segments, skipped = [], 0
    for table in tree.xpath('//table[contains(@class,"cols-")]'):
        heads = [" ".join(th.text_content().split()).lower() for th in table.xpath(".//thead//th")]
        if not any("senator" in h or "member of parliament" in h for h in heads):
            continue
        for index, row in enumerate(table.xpath(".//tbody/tr")):
            cells = [" ".join(td.text_content().split()) for td in row.xpath("./td")]
            link = (row.xpath(".//a/@href") or [None])[0]
            photo = (row.xpath(".//img/@src") or [None])[0]
            fields = dict(zip([h or f"col{i}" for i, h in enumerate(heads)], cells))
            raw = cells[0] if cells else ""
            if not raw:
                skipped += 1
                continue
            if chamber == "senate":
                county, constituency, party, status = fields.get("county", ""), "", fields.get("party", ""), fields.get("status", "")
                county, constituency = ("", "") if county.lower() == "nominated" else (county, "")
            else:
                county, constituency, party, status = fields.get("county", ""), fields.get("constituency", ""), fields.get("party", ""), fields.get("status", "")
            name = clean_name(raw)
            if not name["display"]:
                skipped += 1
                continue
            content = {"chamber": chamber, "nameRaw": raw, "displayName": name["display"], "familyName": name["family"], "givenName": name["given"], "county": county, "constituency": constituency, "party": party, "seatStatus": status, "detailPath": link, "photoPath": photo if photo and "default_images" not in photo else None}
            segments.append({"key": f"row-{index}", "kind": "record", "locator": json.dumps({"row": index}), "content": json.dumps(content, sort_keys=True), "confidence": 1})
    diagnostics = [{"level": "info", "code": "members_read", "message": f"{len(segments)} members read, {skipped} placeholder rows skipped"}]
    if not segments:
        return Output("failed", diagnostics=diagnostics)
    return Output("succeeded", segments, diagnostics)


EXTRACTOR = register(Extractor("parliament-members", "0.1.0", run))
