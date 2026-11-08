"""Appointment notices in Kenya Gazette issues (text layer) to one `record` segment per appointed person.

Reads "appoints ... to be the Chairperson of the Board of X, for a period of three (3) years, with effect from the 19th March, 2024"
and the plural / tribunal forms ("Under paragraph (a)- Name - Chairperson ... to be members of X"). The OCR of these issues is noisy,
so a name is accepted only when every word is plain Title or UPPER case letters of plausible shape; a name that fails is counted and
reported, never repaired by guessing. Dates are read with digit repair (l -> 1, O -> 0) and fuzzy month names.
Data extraction only: the role and institution are text, matched to the database later by score.
"""
from __future__ import annotations

import json
import re

from rapidfuzz import fuzz, process

from . import Extractor, Output, register

MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
NOTICE = re.compile(r"G[A-Za-z]{3,7}\s+N[A-Za-z\']{3,6}\s+No[.,]?\s*([0-9IlO ]{1,9})", re.I)
ISSUE = re.compile(r"Vol(?:ume)?\.?\s+([CXVILU]+)\s*[-—–\s]*No\.?\s*([0-9IlO]+)", re.I)
ISSUE_DATE = re.compile(r"NAIRO\w+,?\s+([0-9IlO]{1,2})\s*(?:st|nd|rd|th|lh|tlr)?[\s,]*([A-Za-z]{3,10})[\s,.]*([0-9IlO]{4})", re.I)
ROLE = r"(Vice[- ]Chairp\w{4,7}|Chairp\w{4,7}|Chief Execut\w{3,5}(?: Officer)?|Director[- ]General|Managing Director|Commissioners?|m[eco]mb[eco]rs?|Secretary|Registrar|Director)"
TO_BE = re.compile(rf"\bappoints?\b[\s￾￿]*(?P<names>.{{3,900}}?)\s+to\s+b[ec]\s+(?:the\s+|a\s+|an\s+)?(?P<role>{ROLE})\b(?P<rest>.{{0,300}})", re.S | re.I)
MEMBERS_OF = re.compile(rf"appointment\s+of\s+(?P<names>.{{3,500}}?)\s*,?\s+as\s+(?P<role>members?|chairperson|chief executive)\s+of\s+the\s+(?P<rest>.{{0,200}})", re.S | re.I)
EFFECT = re.compile(r"(?:with|rvith)\s+[ec]?ff?[ec]ct\s+from\s+th[ec]\s+([0-9IlO]{1,2})\s*(?:st|nd|rd|th|lh)?[\s,]*([A-Za-z]{3,10})[\s,.]*([0-9IlO]{4})", re.I)
WORD_OK = re.compile(r"^(?:[A-Z][a-z]{1,}|[A-Z]{2,}|[A-Z]\.|Dr\.?|Prof\.?|Eng\.?|\(Dr\.?\)|\(Prof\.?\)|\(Eng\.?\)|\(Amb\.?\)|[A-Z][a-z]+-[A-Z][a-z]+|[A-Z]'[A-Z][a-z]+)$")


def digits(text: str) -> str:
    return text.replace("l", "1").replace("I", "1").replace("O", "0").replace(" ", "")


def month(text: str) -> int | None:
    best = process.extractOne(text.title(), MONTHS, scorer=fuzz.ratio, score_cutoff=70)
    return MONTHS.index(best[0]) + 1 if best else None


def iso(day: str, mon: str, year: str) -> str | None:
    m = month(mon)
    try:
        d, y = int(digits(day)), int(digits(year))
    except ValueError:
        return None
    return f"{y:04d}-{m:02d}-{d:02d}" if m and 1 <= d <= 31 and 1990 <= y <= 2100 else None


NOT_A_NAME = {"defence", "forces", "republic", "president", "board", "authority", "cabinet", "secretary", "kenya", "act", "council", "commission", "tribunal", "institute", "fund", "service", "limited", "government", "chief", "commander"}


def plausible(name: str) -> bool:
    if any(w.lower().strip(".,") in NOT_A_NAME for w in name.split()):
        return False
    words = [w for w in re.split(r"\s+", name.strip()) if w]
    core = [w for w in words if not re.match(r"^\(?(Dr|Prof|Eng|Amb|Rev|Hon)\.?\)?$", w, re.I)]
    return 2 <= len(core) <= 6 and all(WORD_OK.match(w) for w in words) and any(len(w) >= 3 for w in core)


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("￾", " ").replace("￿", " ").replace("—", "-")).strip()


def proper(name: str) -> str:
    """ALL-CAPS names (the Gazette prints appointees in capitals) to Title Case; mixed case is kept."""
    return " ".join(w.capitalize() if w.isupper() and len(w) > 2 else w for w in name.split())


def split_names(raw: str) -> list[tuple[str, str | None]]:
    raw = re.sub(r"Under\s+par\w+\s*\(\w\)\s*-?", ";", raw, flags=re.I)
    out = []
    for part in re.split(r"[;,\n]|\band\b", raw):
        part = clean(part)
        tail = re.search(rf"\s-\s*(Chairp\w{{4,7}}|Vice[- ]Chairp\w{{4,7}})$", part, re.I)
        part = re.sub(rf"\s*-\s*{ROLE}$", "", part, flags=re.I).strip(" -.")
        if part:
            out.append((part, tail.group(1).title() if tail else None))
    return out


PAGE_HINT = re.compile(r"ppoint|pointm|Chairp|Chief Exec|Commission(?:er)?s?\b|Members? of", re.I)


def ocr_page(page, dpi: int = 300) -> str:
    """Tesseract (English) over the page rendered at `dpi`; empty when the engine is missing."""
    import shutil
    import subprocess
    import tempfile

    if not shutil.which("tesseract"):
        return ""
    image = page.render(scale=dpi / 72).to_pil().convert("L")
    with tempfile.TemporaryDirectory() as tmp:
        path = f"{tmp}/p.png"
        image.save(path)
        out = subprocess.run(["tesseract", path, "stdout", "-l", "eng", "--psm", "4"], capture_output=True, text=True, timeout=180)
    return out.stdout


def run(data: bytes, profile: str | None) -> Output:
    import io

    import pypdfium2 as pdfium

    try:
        pdf = pdfium.PdfDocument(io.BytesIO(data))
        pages = []
        for index in range(len(pdf)):
            page = pdf[index]
            layer = page.get_textpage().get_text_range()
            # re-OCR only the pages whose text layer hints at an appointment: a whole issue at 300 dpi would take hours
            pages.append(ocr_page(page) or layer if profile == "reocr" and PAGE_HINT.search(layer) else layer)
        text = "\n".join(pages)
    except Exception as error:  # noqa: BLE001
        return Output("failed", diagnostics=[{"level": "error", "code": "not_pdf", "message": str(error)[:160]}])
    issue = ISSUE.search(text[:4000])
    idate = ISSUE_DATE.search(text[:4000])
    issue_info = {"volume": issue.group(1).upper() if issue else None, "number": int(digits(issue.group(2))) if issue and digits(issue.group(2)).isdigit() else None, "date": iso(*idate.groups()) if idate else None}
    marks = list(NOTICE.finditer(text))
    segments, rejected = [], 0
    for index, mark in enumerate(marks):
        chunk = text[mark.end(): marks[index + 1].start() if index + 1 < len(marks) else len(text)]
        if not re.search(r"appoint", chunk, re.I):
            continue
        number = digits(mark.group(1))
        match = TO_BE.search(chunk) or MEMBERS_OF.search(chunk)
        if not match:
            continue
        role = clean(match.group("role")).title().replace("Mcmbcr", "Member").replace("Mcmber", "Member").replace("Member", "Member")
        rest = clean(match.group("rest"))
        institution = re.split(r",| for a period|\bwith effect|\bDated", rest)[0]
        institution = re.sub(r"^(?:of\s+)?(?:the\s+)?(?:Board(?: of Directors)? of\s+(?:the\s+)?|Council of\s+(?:the\s+)?)?", "", institution, flags=re.I).strip(" .")
        effect = EFFECT.search(chunk)
        for position, (name, own_role) in enumerate(split_names(match.group("names"))):
            if not plausible(name):
                rejected += 1
                continue
            body = {"noticeNumber": number, "issue": issue_info, "role": own_role or role, "institutionText": institution[:200], "displayName": proper(re.sub(r"\s*\((?:Dr|Prof|Eng)\.?\)\s*", " ", name).strip()), "effective": iso(*effect.groups()) if effect else None, "period": "gazette"}
            segments.append({"key": f"notice-{number}-{position}", "kind": "record", "locator": json.dumps({"notice": number, "n": position}), "content": json.dumps(body, sort_keys=True), "confidence": 0.5})
    return Output("succeeded" if segments else "failed", segments, [{"level": "info", "code": "appointments", "message": f"{len(segments)} appointees read, {rejected} names rejected as unreadable OCR, issue {issue_info}"}])


EXTRACTOR = register(Extractor("gazette-appointments", "0.1.0", run))
