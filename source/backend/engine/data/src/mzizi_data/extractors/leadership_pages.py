"""Leadership pages of ministry, commission and agency sites to one `record` segment per (person, title).

Public-office facts only: the name and title as the institution's own page prints them. Three layouts are read: a name line next
to a title line (either order), "Name - Title" / "Title: Name" in one line, and table cells. Anything that is not clearly a name
(two to five words, letters only, no organisation words) is skipped and counted. No biography text is kept.
The profile is the institution code the page belongs to (from the fetch provenance).
"""
from __future__ import annotations

import json
import re

from lxml import html

from . import Extractor, Output, register

TITLE = re.compile(
    r"^(?:the\s+)?(?P<t>(?:acting\s+)?(?:cabinet secretary|principal secretary|deputy principal secretary|chief executive officer|chief executive|ceo|director[- ]general|managing director|commission secretary|secretary(?:\s*/\s*ceo)?|"
    r"chairperson|chairman|chair|vice[- ]chairperson|vice[- ]chair|commissioner|board member|director|auditor[- ]general|attorney[- ]general|registrar|inspector[- ]general|controller of budget|chief justice|chief registrar))\b(?P<rest>.{0,140})$",
    re.I,
)
HONORIFIC = re.compile(r"^(?:(?:hon|sen|dr|prof|eng|amb|mrs|mr|ms|rtd|maj|gen|col|lt|capt|rev|bishop|cpa|justice|lady|sir|arch|ca|fcpa|ph\.?d)\.?\s*)+", re.I)
POST = re.compile(r"(?:,\s*|\s+)(?:CBS|EBS|OGW|MBS|HSC|EGH|MGH|SC|MP|PhD|FCPA|CPA|OBS|CBE|MBA|\(.*?\))\.?\s*$", re.I)
BAD = re.compile(r"\b(ministry|state|department|authority|board|commission|council|office|kenya|director|secretary|chief|officer|services?|cabinet|republic|government|read|more|biography|contact|home|about|news|welcome|message|profile|view|click|download|team|management|leadership|mission|vision|ps|toll|free|hotline|phone|email|fax|livestock|agriculture|vacant)\b", re.I)


def name_of(line: str) -> str | None:
    text = " ".join(line.replace(" ", " ").split()).strip(" -–:,|")
    for _ in range(3):
        text = HONORIFIC.sub("", text).strip()
        text = POST.sub("", text).strip()
    words = text.split()
    if not (2 <= len(words) <= 5) or len(text) > 60 or re.search(r"[0-9@/]", text) or BAD.search(text):
        return None
    if not all(re.match(r"^[A-Za-z][A-Za-z.'’\-]*$", w) for w in words):
        return None
    if not any(len(w.strip(".")) >= 3 for w in words):
        return None
    return " ".join(w.capitalize() if w.isupper() and len(w) > 2 else w for w in words)


def title_of(line: str) -> str | None:
    text = " ".join(line.split()).strip(" -–:,|")
    if len(text) > 150 or text.endswith((".", "!", "?")) and len(text) > 80:
        return None
    match = TITLE.match(text)
    return " ".join(text.split()) if match else None


def run(data: bytes, profile: str | None) -> Output:
    try:
        tree = html.fromstring(data)
    except Exception as error:  # noqa: BLE001
        return Output("failed", diagnostics=[{"level": "error", "code": "not_html", "message": str(error)[:200]}])
    for tag in tree.xpath("//script|//style|//noscript|//nav|//footer|//header"):
        tag.drop_tree()
    lines = [" ".join(s.split()) for s in tree.itertext() if s.strip()]
    lines = [s for s in lines if len(s) > 1]
    found: dict[tuple[str, str], dict] = {}
    skipped = 0
    for i, line in enumerate(lines):
        pair = None
        for sep in (" - ", " – ", " — ", ", ", " | ", ": "):
            if sep in line and len(line) < 160:
                a, b = line.split(sep, 1)
                if title_of(b) and name_of(a):
                    pair = (name_of(a), title_of(b))
                elif title_of(a) and name_of(b):
                    pair = (name_of(b), title_of(a))
                if pair:
                    break
        if not pair and title_of(line):
            t = title_of(line)
            for j in (i - 1, i + 1):
                if 0 <= j < len(lines) and name_of(lines[j]) and not title_of(lines[j]):
                    pair = (name_of(lines[j]), t)
                    break
            if not pair:
                skipped += 1
        if pair:
            found.setdefault((pair[0], pair[1].lower()), {"displayName": pair[0], "title": pair[1], "institution": profile})
    segments = [{"key": f"lead-{k}", "kind": "record", "locator": json.dumps({"n": k}), "content": json.dumps(v, sort_keys=True), "confidence": 0.6} for k, v in enumerate(found.values())]
    return Output("succeeded" if segments else "failed", segments, [{"level": "info", "code": "leaders", "message": f"{len(segments)} name and title pairs, {skipped} title lines without a readable name"}])


EXTRACTOR = register(Extractor("leadership-page", "0.1.0", run))
