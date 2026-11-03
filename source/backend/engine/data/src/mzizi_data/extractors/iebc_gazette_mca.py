"""IEBC gazette notices on the 2022 county assemblies to one `record` segment per elected or nominated member.

Two layouts, one extractor, chosen by `profile`:

* `elected` - Gazette Notice 9956 (Kenya Gazette Vol. CXXIV No. 170, 24 August 2022), "Declaration of persons elected as members of the
  county assemblies": a fixed-column table (county, constituency, ward with IEBC codes, surname, other names, party, abbreviation,
  votes). Columns are read by x position, a row runs from its county-code cell to the next one, so wrapped cells stay with their row.
* `nominated` - Gazette Notice 10712 (Vol. CXXIV No. 186, 9 September 2022), "Nominated members to the county assemblies": per county a
  marginalised list (Schedule I) and a gender top-up list (Schedule II) with name, gender, masked ID, nature of special interest and party.

Public-office facts only. The gazette also prints a masked ID number, a gender and (for marginalised seats) the nature of each nominee's
special interest, which can reveal a disability or an ethnic group: none of these is kept. Only the kind of seat (marginalised group or gender
top-up) is recorded. Votes are left to the election-results loader.
"""
from __future__ import annotations

import io
import json
import re

from . import Extractor, Output, register

COLS = [("county", 80), ("constCode", 128), ("const", 148), ("cawCode", 203), ("caw", 227), ("surname", 281), ("other", 331), ("party", 393), ("abbr", 470), ("votes", 505)]
CAPS = {"Mc", "Mac", "Mba"}


def col_of(x: float) -> str:
    name = "countyCode"
    for key, start in COLS:
        if x >= start - 1:
            name = key
    return name


def title(text: str) -> str:
    out = []
    for token in text.replace("’", "'").split():
        out.append(token if token != token.upper() or len(token) <= 2 and "." in token else "-".join(p[:1].upper() + p[1:].lower() for p in token.split("-")))
    return " ".join(out)


def parse_elected(data: bytes) -> tuple[list[dict], list[dict]]:
    import pdfplumber

    rows, diagnostics = [], []
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        for number, page in enumerate(pdf.pages, 1):
            words = page.extract_words()
            header = [w for w in words if w["text"] == "Garnered" and w["x0"] > 480]
            if not header or not any(w["text"] == "Surname" and 270 < w["x0"] < 300 for w in words):
                continue
            floor = max(w["top"] for w in header) + 4
            end = min((w["top"] for w in words if w["text"] in ("Dated", "PRINTED") and w["top"] > 100), default=page.height)
            body = [w for w in words if floor < w["top"] < end]
            anchors = sorted((w for w in body if w["x0"] < 80 and re.fullmatch(r"\d{3}", w["text"])), key=lambda w: w["top"])
            for index, anchor in enumerate(anchors):
                top = anchor["top"] - 2
                bottom = anchors[index + 1]["top"] - 2 if index + 1 < len(anchors) else page.height
                cells: dict[str, list] = {}
                for w in sorted((w for w in body if top <= w["top"] < bottom), key=lambda w: (round(w["top"]), w["x0"])):
                    cells.setdefault(col_of(w["x0"]), []).append(w["text"])
                join = {k: " ".join(v) for k, v in cells.items()}
                join["page"] = number
                rows.append(join)
    records = []
    for r in rows:
        if not re.fullmatch(r"[O0]?\d{3,4}", r.get("cawCode", "")) or not re.fullmatch(r"\d{3}", r.get("countyCode", "")):
            diagnostics.append({"level": "warning", "code": "row_skipped", "message": f"page {r.get('page')}: {json.dumps(r)[:140]}"})
            continue
        if "postpone" in (r.get("votes", "") + r.get("surname", "")).lower() or r.get("surname", "") in ("-", ""):
            diagnostics.append({"level": "info", "code": "no_member", "message": f"{r.get('county')} / {r.get('caw')}: {r.get('votes', 'no winner listed')}"[:160]})
            continue
        surname, other = r.get("surname", "").strip(), r.get("other", "").strip()
        if not other:
            continue
        records.append({
            "kind": "elected", "countyCode": r["countyCode"], "county": r.get("county", ""), "constCode": r.get("constCode", ""), "constituency": r.get("const", ""), "cawCode": r.get("cawCode", ""), "ward": r.get("caw", "").strip(),
            "surname": title(surname), "otherNames": title(other), "displayName": f"{title(other)} {title(surname)}", "partyName": r.get("party", ""), "partyAbbreviation": re.sub(r"[^A-Za-z]", "", r.get("abbr", "").split()[0]) if r.get("abbr") else "", "page": r["page"],
        })
    return records, diagnostics


COUNTY_HEAD = re.compile(r"^\s*([A-Z][A-Z' .\-]+?)\s*(?:COUNTY)?\s*[—–-]+\s*(\d{3})\s*$")
KIND_HEAD = re.compile(r"(MARGINALI[SZ]ED|GENDER TOP[ -]?UP)\s+LIST", re.I)
ROW = re.compile(r"^\s*(\d{1,2})\.?\s+(?P<name>.+?)\s{1,}(?P<gender>Male|Female)\s+(?P<id>[A-Z]{0,2}\*+\s?\d+|-)(?:\s+(?P<rest>.*))?$")


def parse_nominated(data: bytes) -> tuple[list[dict], list[dict]]:
    import subprocess
    import tempfile

    with tempfile.NamedTemporaryFile(suffix=".pdf") as handle:
        handle.write(data)
        handle.flush()
        text = subprocess.run(["pdftotext", "-layout", handle.name, "-"], capture_output=True, text=True, check=True).stdout
    records, diagnostics = [], []
    county = code = kind = None
    party = ""
    for line in text.replace("\x0c", "\n").split("\n"):
        stripped = line.strip()
        head = re.match(r"^([A-Z][A-Z\u2019' .\-]+?)\s*(?:COUNTY)?\s*[\u2014\u2013-]+\s*(\d{1,3})$", stripped) if stripped.upper() == stripped and len(stripped) < 60 else None
        if head:
            county, code, party = head.group(1).replace("COUNTY", "").strip().title(), head.group(2).zfill(3), ""
            continue
        k = KIND_HEAD.search(stripped)
        if k:
            kind = "marginalised" if k.group(1).upper().startswith("MARGIN") else "gender-top-up"
            party = ""
            continue
        if re.match(r"^\s*SCHEDULE\s+II\b", stripped, re.I):
            kind = "gender-top-up"
        if re.match(r"^\s*SCHEDULE\s+I\s*$", stripped, re.I):
            kind = "marginalised"
        row = ROW.match(line)
        if not row or not county or not kind:
            if party and stripped and re.fullmatch(r"[A-Za-z][A-Za-z\-/ ]{2,40}", stripped) and kind and not re.search(r"Male|Female|LIST|COUNTY|Name|Gender|Allocated|Interest|Party", stripped):
                party = f"{party} {stripped}".strip()  # wrapped party name on its own line
            continue
        name = " ".join(row.group("name").split())
        if name.lower().startswith("not "):
            diagnostics.append({"level": "info", "code": "not_allocated", "message": f"{county} {kind}: seat not allocated"})
            continue
        parts = [p for p in re.split(r"\s{2,}", (row.group("rest") or "").strip()) if p]
        # parts: nature of interest (marginalised list only), party fragment, seats; the interest is dropped on purpose
        fragment = None
        for p in parts:
            if re.fullmatch(r"\d{1,2}", p):
                continue
            if kind == "marginalised" and re.fullmatch(r"(?i)pwd|youth|ethnic\w*|ethnicity|marginali[sz]ed\w*|minority( group)?|ethnic minority|marginalised community|persons? with disabilit\w+|disab\w+", p):
                continue
            fragment = p
        if fragment:
            known_start = fragment
            party = fragment if not party or re.search(r"(?i)\b(party|alliance|congress|union|movement|democrats?|kenya|national|forum)\b$", party) and not _continuation(party, fragment) else f"{party} {fragment}".strip()
        records.append({"kind": kind, "countyCode": code, "county": county, "displayName": title(name), "partyName": party, "line": stripped[:0]})
    return records, diagnostics


def _continuation(party: str, fragment: str) -> bool:
    return fragment[:1].islower() or fragment in {"Movement", "Alliance", "Party", "Congress", "Union", "Democracy", "Kenya", "of Kenya"} and not party.endswith(fragment)


def run(data: bytes, profile: str | None) -> Output:
    try:
        records, diagnostics = parse_elected(data) if profile == "elected" else parse_nominated(data)
    except Exception as error:  # noqa: BLE001
        return Output("failed", diagnostics=[{"level": "error", "code": "unreadable", "message": f"{type(error).__name__}: {error}"[:200]}])
    segments = [{"key": f"{profile}-{i}", "kind": "record", "locator": json.dumps({"page": r.get("page"), "row": i}), "content": json.dumps(r, sort_keys=True), "confidence": 0.9 if profile == "elected" else 0.85} for i, r in enumerate(records)]
    diagnostics.append({"level": "info", "code": "members_read", "message": f"{len(segments)} members"})
    return Output("succeeded" if segments else "failed", segments, diagnostics)


EXTRACTOR = register(Extractor("iebc-gazette-mca", "0.1.0", run))
