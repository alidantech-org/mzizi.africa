"""Hansard reports and order papers of the National Assembly and the Senate (text PDFs) as one `sitting` record.

Public-office facts only: the sitting date and house, the Member presiding, the Members who spoke (name, constituency or county and party as the
Hansard prints them beside the name; no other personal data), motions moved, Bills named, and the counts of any division. Checks refuse what cannot
be right: no sitting date; a division whose Ayes plus Noes exceed the membership of the house (349 in the National Assembly, 67 in the Senate); a
negative or non-numeric count. Nothing is guessed: a field the document does not print is null.
"""
from __future__ import annotations

import json
import re

from . import Extractor, Output, register
from .legal_pdf import DATE, MONTH_NUM, _diag, read_pages

MEMBERSHIP = {"national-assembly": 349, "senate": 67}
DAY_DATE = re.compile(r"(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),?\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+),?\s+(\d{4})", re.I)
DAY_DATE_US = re.compile(r"(?:MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY),?\s+([A-Z]+)\s+(\d{1,2}),\s+(\d{4})")
SPEAKER = re.compile(r"^Hon\.?\s*(?:\((?:Dr|Prof|Eng|Rev|Ms|Mr|Mrs)\.?\)\s*|(?:Dr|Prof|Eng|Rev|Ms|Mr|Mrs)\.?\s+)?([A-Z][\w'’.\-]*(?:\s+[A-Z][\w'’.\-]*){0,4})\s*\(([^()]{3,80})\):")
CHAIR = re.compile(r"\[The\s+(Speaker|Temporary\s+Speaker|Deputy\s+Speaker|Chairperson|Chairman)\s*\((?:Hon\.?\s*)?([^)]+)\)\s+in\s+the\s+Chair\]", re.I)
SESSION = re.compile(r"\((\w+)\s+SESSION\)|(\w+)\s+Parliament\s+(\w+)\s+Session", re.I)
VOL = re.compile(r"Vol\.?\s+([IVXLC]+)\s+No\.?\s*(\d+)", re.I)
TIME = re.compile(r"(?:met at|AT)\s+(\d{1,2}[.:]\d{2})\s*([ap]\.?m\.?)", re.I)
BILL = re.compile(r"The\s+([A-Z][A-Za-z()&,\- ]{3,90}?\sBill)\s*\(\s*(National\s+Assembly|Senate)\s+Bills?\s+No\.?\s*(\d+)\s+of\s+(\d{4})\s*\)", re.I)


def sitting_date(text: str) -> str | None:
    """The first dated heading line: 'Wednesday, 21st October 2026' (Hansard) or 'TUESDAY, NOVEMBER 03, 2026' (order paper)."""
    found = []
    m = DAY_DATE.search(text)
    if m and m.group(2).lower() in MONTH_NUM:
        found.append((m.start(), f"{int(m.group(3)):04d}-{MONTH_NUM[m.group(2).lower()]:02d}-{int(m.group(1)):02d}"))
    m = DAY_DATE_US.search(text)
    if m and m.group(1).lower() in MONTH_NUM:
        found.append((m.start(), f"{int(m.group(3)):04d}-{MONTH_NUM[m.group(1).lower()]:02d}-{int(m.group(2)):02d}"))
    return min(found)[1] if found else None


def bill_title(raw: str) -> str:
    text = re.sub(r"\s+", " ", raw)
    for _ in range(3):
        text = re.sub(r"^.*?(?:\((?:[ivx]+|[a-z])\)\s+|Party\)\s+|\bTHAT,?\s+|amendments to (?:the )?|WHOLE HOUSE\s+|Consideration of\s+)", "", text, count=1)
    return re.sub(r"^The\s+", "", text).strip()


def parse(pages: list[str]) -> Output:
    text = "\n".join(pages)
    head = text[:2500].upper()
    if len(text.strip()) < 100:
        return Output("failed", diagnostics=[_diag("error", "no_text", "no text layer")])
    house = "senate" if re.search(r"\bTHE\s+SENATE\b|SENATE\s+DEBATES", head) and "NATIONAL ASSEMBLY" not in head else "national-assembly" if "NATIONAL ASSEMBLY" in head else None
    kind = "order_paper" if re.search(r"ORDERS?\s+OF\s+THE\s+DAY|ORDER\s+PAPER", head) else "hansard"
    date = sitting_date(text[:1200])
    diagnostics: list[dict] = []
    errors = []
    if not date:
        errors.append("no sitting date")
    if not house:
        errors.append("house not recognised")
    lines = [ln.strip() for ln in text.splitlines()]
    speakers: dict[str, dict] = {}
    for ln in lines:
        m = SPEAKER.match(ln)
        if m:
            name = re.sub(r"\s+", " ", m.group(1)).strip()
            area, _, party = m.group(2).rpartition(",")
            rec = speakers.setdefault(name, {"name": name, "area": area.strip() or m.group(2).strip(), "party": party.strip() if area else None, "contributions": 0})
            rec["contributions"] += 1
    chair = CHAIR.search(text)
    motions = [re.sub(r"\s+", " ", m.group(0))[:300] for m in re.finditer(r"(?:I\s+beg\s+to\s+move\s+that|^\s*THAT\b)[^\n]*(?:\n[^\n]+){0,3}", text, re.M)][:25]
    bills = sorted({f"{bill_title(b.group(1)).title() if bill_title(b.group(1)).isupper() else bill_title(b.group(1))} ({re.sub(r'\s+', ' ', b.group(2)).title()} Bill No. {b.group(3)} of {b.group(4)})" for b in BILL.finditer(re.sub(r"\s+", " ", text))})
    divisions = []
    flat = re.sub(r"\s+", " ", text)
    for m in re.finditer(r"\bAyes?\b[^.]{0,40}?(\d{1,3})[^.]{0,60}?\bNoes?\b[^.]{0,40}?(\d{1,3})", flat):
        ayes, noes = int(m.group(1)), int(m.group(2))
        divisions.append({"ayes": ayes, "noes": noes, "text": m.group(0)[:160]})
        if house and ayes + noes > MEMBERSHIP[house]:
            errors.append(f"division {ayes} Ayes + {noes} Noes exceeds the {MEMBERSHIP[house]} members of the house")
    vol, session, start = VOL.search(text[:3000]), SESSION.search(text[:3000]), TIME.search(text[:4000])
    record = {"type": "sitting", "documentKind": kind, "house": house, "date": date, "volume": vol.group(1).upper() if vol else None, "number": int(vol.group(2)) if vol else None,
              "session": " ".join(g for g in (session.groups() if session else ()) if g) or None, "startTime": f"{start.group(1)} {start.group(2)}" if start else None,
              "presiding": {"role": chair.group(1), "name": chair.group(2).strip()} if chair else None, "speakers": sorted(speakers.values(), key=lambda s: -s["contributions"]),
              "motions": motions, "bills": bills, "divisions": divisions, "pages": len(pages)}
    if errors:
        return Output("failed", diagnostics=[_diag("error", "sitting_refused", "; ".join(errors))])
    diagnostics.append(_diag("info", "sitting_read", f"{kind} {house} {date}: {len(speakers)} speakers, {len(divisions)} divisions, {len(bills)} bills"))
    return Output("succeeded", [{"key": f"{house}-{date}-{kind}", "kind": "record", "locator": json.dumps({"date": date}), "content": json.dumps(record, sort_keys=True), "confidence": 0.8}], diagnostics)


def run(data: bytes, profile: str | None) -> Output:
    return parse(read_pages(data))


EXTRACTOR = register(Extractor("sitting-pdf", "0.1.0", run))
