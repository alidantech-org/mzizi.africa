"""Acts, Bills, regulations and Kenya Gazette issues (text PDFs) as instrument, provision and notice segments.

Data extraction only: it reads preserved bytes and proposes structure; nothing here decides what is canonical.

 * `instrument` record (one per document unless it is a Gazette issue): title, kind (act, bill, regulation), year, the
   "No. N of YYYY" number when printed, commencement date when printed.
 * `provision` segments: numbered sections. The arrangement-of-sections list is read first; the body is then read as the
   *last* run of consecutive section numbers starting at 1, so the contents list is never mistaken for the body. Section
   text is kept verbatim (whitespace collapsed). Checks refuse the provisions (the instrument is still emitted, and the
   result is `partial`) when numbers skip or repeat, or when an arrangement exists and the body disagrees with it.
 * `notice` segments: one per "GAZETTE NOTICE NO. n" of a Gazette issue, with the issue (volume, number) and date.

Scanned PDFs without a text layer are reported (`no_text`), never guessed.
"""
from __future__ import annotations

import io
import json
import re

import pypdfium2 as pdfium

from . import Extractor, Output, register

MAX_PAGES = 1500
MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December"
DATE = re.compile(rf"(\d{{1,2}})(?:st|nd|rd|th)?\s+({MONTHS}),?\s+(\d{{4}})", re.I)
TITLE_ACT = re.compile(r"^\s*(?:THE\s+)?([A-Z][A-Za-z0-9&,'\-\(\) ]{3,120}?\b(?:ACT|BILL|REGULATIONS|RULES|ORDER))\s*,?\s*((?:19|20)\d{2})\s*(?:\([^)]*\))?\s*$", re.I)
NOT_A_TITLE = {"PURSUANT", "PROVISIONS", "PROPOSAL", "ESTABLISHED", "COMMITTEE", "REPORT", "MEMORANDUM", "PAGE", "OF", "AND", "TO", "IN", "FOR", "BY", "ON", "THURSDAY", "WEDNESDAY", "TUESDAY", "MONDAY", "FRIDAY", "SECTION", "SECTIONS", "AMENDMENT", "THAT"}
NUMBER_OF = re.compile(r"\bNo\.?\s*(\d{1,3})\s+of\s+((?:19|20)\d{2})\b", re.I)
SECTION = re.compile(r"^\s*(\d{1,3})([A-Z]?)\.\s+(\S.*)$")
NOTICE = re.compile(r"\bG[A-Za-z]{3,7}\s+N[A-Za-z\']{3,6}\s+No[.,]?\s*(\d{1,5})\b", re.I)  # tolerant of OCR noise ("Gnzurru Nortcu No. 8")
ISSUE = re.compile(r"Vol(?:ume)?\.?\s+([CXVILU]+)\s*[—–\-\s]\s*No\.?\s*(\d+)", re.I)
ISSUE_DATE = re.compile(rf"NAIROBI,?\s+(\d{{1,2}})(?:st|nd|rd|th)?\s+({MONTHS}),?\s*(\d{{4}})", re.I)
MONTH_NUM = {m.lower(): i for i, m in enumerate(MONTHS.split("|"), 1)}


def _iso(match: re.Match) -> str:
    return f"{int(match.group(3)):04d}-{MONTH_NUM[match.group(2).lower()]:02d}-{int(match.group(1)):02d}"


def _clean(text: str) -> str:
    return re.sub(r"[ \t]+", " ", re.sub(r"\s*\n\s*", "\n", text)).strip()


def _diag(level: str, code: str, message: str) -> dict:
    return {"level": level, "code": code, "message": message}


def read_pages(data: bytes) -> list[str]:
    document = pdfium.PdfDocument(io.BytesIO(data))
    try:
        return [document[i].get_textpage().get_text_range() for i in range(min(len(document), MAX_PAGES))]
    finally:
        document.close()


TITLE_NO_YEAR = re.compile(r"^\s*(?:THE\s+)?([A-Z][A-Z0-9&,'\-\(\) ]{8,150}?\bACT)\s*(?:$|CHAPTER\b|CAP\b)")
CAP = re.compile(r"\b(?:CHAPTER|CAP\.?)\s*(\d{1,3}[A-Z]?)\b")


def plausible(name: str) -> bool:
    """A title is short, starts with a name word and is not the middle of a sentence."""
    words = re.sub(r"[^\w()'&\- ]", " ", name).split()
    return 2 <= len(words) <= 16 and words[0].upper() not in NOT_A_TITLE and not any(w.upper() in {"PURSUANT", "PROVISIONS", "ESTABLISHED", "PROPOSAL", "THURSDAY", "WEDNESDAY", "TUESDAY", "MONDAY", "FRIDAY", "PAGE"} for w in words)


def _name(raw: str) -> str:
    name = re.sub(r"\s+", " ", raw).strip().rstrip(",")
    if name.isupper():
        name = name.title().replace(" Of ", " of ").replace(" And ", " and ").replace(" The ", " the ").replace("Ng-Cdf", "NG-CDF")
    return name


def find_title(lines: list[str]) -> tuple[str | None, int | None, str | None]:
    """Returns (title, year, kind) from the first lines of the document. Revised-edition Acts carry no year in the title (they carry a chapter number)."""
    for i in range(min(len(lines), 30)):
        for width in (1, 2, 3):  # titles often wrap onto two or three lines
            joined = re.sub(r"^LAWS OF KENYA\s+", "", " ".join(x.strip() for x in lines[i:i + width]))
            match = TITLE_ACT.match(joined)
            if match and plausible(match.group(1)):
                name = _name(match.group(1))
                word = name.rsplit(" ", 1)[-1].upper()
                return f"{name}, {match.group(2)}", int(match.group(2)), {"ACT": "act", "BILL": "bill"}.get(word, "regulation")
            match = TITLE_NO_YEAR.match(joined)
            if match and plausible(match.group(1)) and len(match.group(1).split()) >= 3:
                return _name(match.group(1)), None, "act"
    return None, None, None


def split_sections(lines: list[str]) -> tuple[list[dict], list[dict], list[str]]:
    """The arrangement entries and the body sections (the last run of consecutive numbers starting at 1)."""
    hits = [(i, int(m.group(1)), m.group(2), m.group(3)) for i, line in enumerate(lines) if (m := SECTION.match(line))]
    runs: list[list[tuple]] = []
    for hit in hits:
        if runs and (hit[1] == runs[-1][-1][1] + 1 and not hit[2] or hit[1] == runs[-1][-1][1] and hit[2] and (not runs[-1][-1][2] or hit[2] > runs[-1][-1][2])):
            runs[-1].append(hit)
        elif hit[1] == 1 and not hit[2]:
            runs.append([hit])
        elif runs and hit[1] == runs[-1][-1][1] + 1:
            runs[-1].append(hit)
    problems: list[str] = []
    if not runs:
        return [], [], ["no numbered sections found"]
    longest = max(len(r) for r in runs)
    full = [r for r in runs if len(r) >= 0.8 * longest]  # a schedule or a numbered list restarting at 1 is shorter than the body
    body = full[-1]
    arrangement = full[-2] if len(full) > 1 else []
    headings = {f"{n}{s}": re.sub(r"[\s.]*\d*$", "", t).strip(" .") for _i, n, s, t in arrangement}
    sections = []
    for k, (i, n, s, first) in enumerate(body):
        end = body[k + 1][0] if k + 1 < len(body) else len(lines)
        text = _clean("\n".join([first] + lines[i + 1:end]))
        sections.append({"number": f"{n}{s}", "heading": headings.get(f"{n}{s}"), "text": text})
    if arrangement and len(arrangement) != len(body):
        problems.append(f"arrangement lists {len(arrangement)} sections but the body has {len(body)}")
    last = body[-1]
    skipped = [h for h in hits if h[0] > last[0] and h[1] == last[1] + 2 and not h[2]]  # a quoted 14A inside an amending Bill is not a missed section; a plain jump of two is
    if skipped:
        problems.append(f"numbering continues with section {skipped[0][1]}{skipped[0][2]} after section {last[1]}{last[2]} (a section was missed)")
    numbers = [int(s["number"].rstrip("ABCDEFGHIJKLMNOPQRSTUVWXYZ")) for s in sections]
    if numbers != sorted(numbers) or set(range(1, max(numbers) + 1)) - set(numbers):
        problems.append("section numbers skip or repeat")
    return sections, [{"number": f"{n}{s}", "heading": t} for _i, n, s, t in arrangement], problems


def repair(text: str) -> tuple[str, bool]:
    """Some PDFs map the space glyph to '!' ("This!Act!may!be!cited"); when '!' is that frequent it is read as a space."""
    if len(text) > 200 and text.count("!") / len(text) > 0.004 and len(re.findall(r"[A-Za-z]!+[A-Za-z(“]", text)) > 20:
        return re.sub(r"!+", " ", text), True
    return text, False


def parse(pages: list[str]) -> Output:
    text, repaired = repair("\n".join(pages))
    diagnostics: list[dict] = [_diag("warning", "text_repaired", "a glyph that stands for the space was read as a space")] if repaired else []
    if len(text.strip()) < 40:
        return Output("failed", diagnostics=[_diag("error", "no_text", "no text layer (scanned document): OCR is a separate, reviewed step")])
    lines = [ln for ln in (line.rstrip() for line in text.splitlines()) if ln.strip()]
    segments: list[dict] = []
    notices = list(NOTICE.finditer(text))
    is_gazette = bool(re.search(r"K[A-Z]NYA\W*\s*G[A-Z]Z\W?E?\W?T|GAZETTE\s+NOTICE|Published\s+by\s+Author", text[:3000], re.I))
    if is_gazette and not notices:
        return Output("failed", diagnostics=[_diag("error", "gazette_without_notices", "a Kenya Gazette issue whose notice numbers could not be read (legal notices or a supplement): not imported")])
    if len(notices) >= 1 and is_gazette:
        issue = ISSUE.search(text)
        date = ISSUE_DATE.search(text)
        issue_info = {"volume": issue.group(1).upper().replace("U", "V") if issue else None, "number": int(issue.group(2)) if issue else None, "date": _iso(date) if date else None}
        seen: set[str] = set()
        for k, m in enumerate(notices):
            number = m.group(1)
            if number in seen:
                continue
            seen.add(number)
            end = notices[k + 1].start() if k + 1 < len(notices) else len(text)
            body = _clean(text[m.end():end])[:6000]
            segments.append({"key": f"notice-{number}", "kind": "record", "locator": json.dumps({"notice": number}), "content": json.dumps({"type": "notice", "noticeNumber": number, "issue": issue_info, "text": body}, sort_keys=True), "confidence": 0.8 if not re.search(r"[^\x00-\x7f]|\bN[a-z]rtcu\b", body[:200]) else 0.6})
        diagnostics.append(_diag("info", "gazette_issue", f"{len(segments)} notices; issue {issue_info}"))
        if not issue_info["date"]:
            diagnostics.append(_diag("warning", "no_issue_date", "the issue date line was not recognised; notices carry no date"))
        return Output("succeeded", segments, diagnostics)
    head = "\n".join(lines[:40]).upper()
    if re.search(r"ORDERS? OF THE DAY|ORDER PAPER|OFFICIAL REPORT|\bHANSARD\b|PARLIAMENTARY DEBATES", head):
        return Output("failed", diagnostics=[_diag("error", "not_an_instrument", "an order paper or Hansard report names Bills and Acts as business, it is not one")])
    title, year, kind = find_title(lines)
    if not title:
        return Output("failed", diagnostics=[_diag("error", "no_title", "no Act, Bill or regulation title recognised on the first page")])
    number = NUMBER_OF.search("\n".join(lines[:80]))
    commencement = None
    for m in re.finditer(r"commencement[^\n]{0,60}", "\n".join(lines[:120]), re.I):
        d = DATE.search(m.group(0))
        if d:
            commencement = _iso(d)
            break
    sections, arrangement, problems = split_sections(lines)
    segments.append({"key": "instrument", "kind": "record", "locator": json.dumps({"page": 1}), "content": json.dumps({"type": "instrument", "title": title, "year": year, "kind": kind, "actNumber": f"No. {number.group(1)} of {number.group(2)}" if number else None, "chapter": (CAP.search("\n".join(lines[:40])) or [None, None])[1], "commencement": commencement, "sectionCount": len(sections), "arrangementCount": len(arrangement)}, sort_keys=True), "confidence": 0.8})
    if problems:
        diagnostics.append(_diag("error", "sections_refused", "; ".join(problems) + "; provisions not emitted"))
    else:
        for s in sections:
            segments.append({"key": f"s-{s['number']}", "kind": "record", "locator": json.dumps({"section": s["number"]}), "content": json.dumps({"type": "provision", **s}, sort_keys=True), "confidence": 0.85})
        diagnostics.append(_diag("info", "sections_read", f"{len(sections)} sections (arrangement lists {len(arrangement)})"))
    return Output("partial" if problems else "succeeded", segments, diagnostics)


def run(data: bytes, profile: str | None) -> Output:
    return parse(read_pages(data))


EXTRACTOR = register(Extractor("legal-pdf", "0.3.1", run))
