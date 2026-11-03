"""County assembly member pages (any assembly site) to one `record` segment per person block.

Assembly sites publish member lists in many layouts, so this extractor is deliberately literal: it finds each "Hon." name (cards, list
items, table rows) and keeps the few lines that follow it as `context`, plus whatever the same line says after the name (Lamu writes
"Hon. A B. Deputy Speaker and MCA Mkunumbi Ward"). It does not decide the ward, party or seat kind; the importer does, against the
geography and party tables. Only public-office facts are read: contact details, phone numbers and e-mail addresses are dropped.
"""
from __future__ import annotations

import json
import re

from bs4 import BeautifulSoup

from . import Extractor, Output, register
from .parliament_members import POSTNOMINALS, _word

HON = re.compile(r"^\s*(?:the\s+)?(?:hon|honou?rable)\b\.?\s*[,:]?\s*(?P<rest>.*)$", re.I)
TABLE_NAME = re.compile(r"^\s*(?:\d{1,3}\s*[.)]?\s+)?(?P<rest>[A-Z][A-Za-z'’.\- ]{5,60})$")
INLINE_SPLIT = re.compile(r"\.\s+(?=(?:MCA|Deputy|Majority|Minority|Speaker|Leader|Chief|Chair|Nominated|Member|Hon)\b)|\s+[-–|]\s+|\s{2,}|,\s+(?=MCA\b|Nominated\b)")
NOISE = re.compile(r"@|\+?\d[\d\s-]{7,}|https?://|read more|view profile|click|download|\bmenu\b", re.I)
TITLES = {"dr", "prof", "eng", "cpa", "amb", "rev", "sen", "mr", "mrs", "ms", "hon", "arch", "sheikh", "bishop", "pastor", "fcpa", "adv", "mp", "mca", "ogw", "mbs", "ebs", "hsc", "cbs", "egh", "mgh"}


def clean_person(raw: str) -> str:
    raw = re.sub(r"\([^)]*\)", " ", raw)
    raw = re.sub(r"[;:]+", " ", raw)
    words = []
    for token in raw.replace(" ", " ").split():
        bare = token.strip(".,").lower()
        if bare in TITLES or bare in {p.lower() for p in POSTNOMINALS}:
            continue
        words.append(_word(token.strip(",.;")) if token.strip(",.;") else "")
    words = [w for w in words if w]
    return " ".join(words)


def plausible(name: str) -> bool:
    parts = name.split()
    return 2 <= len(parts) <= 6 and all(re.fullmatch(r"[A-Za-z'’\-]+", p) for p in parts) and sum(len(p) for p in parts) >= 6


def lines_of(data: bytes) -> list[str]:
    soup = BeautifulSoup(data, "html.parser")
    for tag in soup(["script", "style", "nav", "header", "footer", "noscript", "form", "select"]):
        tag.decompose()
    return [" ".join(l.split()) for l in soup.get_text("\n").split("\n") if l.strip()]


def run(data: bytes, profile: str | None) -> Output:
    try:
        lines = lines_of(data)
    except Exception as error:  # noqa: BLE001
        return Output("failed", diagnostics=[{"level": "error", "code": "not_html", "message": str(error)[:200]}])
    people: list[dict] = []
    for index, line in enumerate(lines):
        m = HON.match(line)
        if not m or not m.group("rest").strip():
            continue
        parts = INLINE_SPLIT.split(m.group("rest").strip(), maxsplit=1)
        name = clean_person(parts[0])
        tail = re.search(r"\b(nomi?nated|elected|special)\b\s*$", name, re.I)
        inline_extra = ""
        ward_tail = re.search(r"\s(\S+\s+ward)$", name, re.I)
        if ward_tail and len(name.split()) >= 4:
            inline_extra, name = ward_tail.group(1), name[: ward_tail.start() - 0].strip()
            name = name.rsplit(" ", 0)[0]
        if tail:
            inline_extra, name = tail.group(1), name[: tail.start()].strip()
        if not plausible(name):
            continue
        inline = ((parts[1] if len(parts) > 1 else "") + " " + inline_extra).strip()
        context = []
        for follower in lines[index + 1 : index + 5]:
            if HON.match(follower) or NOISE.search(follower):
                break
            context.append(follower[:120])
        people.append({"name": name, "inline": inline[:160], "context": context, "line": index})
    segments = []
    seen = set()
    for p in people:
        key = re.sub(r"[^a-z]", "", p["name"].lower())
        if key in seen:
            continue
        seen.add(key)
        segments.append({"key": f"p-{len(segments)}", "kind": "record", "locator": json.dumps({"line": p["line"]}), "content": json.dumps({**p, "county": profile}, sort_keys=True), "confidence": 0.7})
    if not segments:
        return Output("failed", diagnostics=[{"level": "warning", "code": "no_members", "message": "no 'Hon.' name blocks found"}])
    return Output("succeeded", segments, [{"level": "info", "code": "members_read", "message": f"{len(segments)} name blocks"}])


EXTRACTOR = register(Extractor("county-assembly-members", "0.1.0", run))
