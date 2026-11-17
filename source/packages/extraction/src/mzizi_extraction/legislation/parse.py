"""A published instrument as a tree: chapters, parts, articles, clauses, paragraphs and sub-paragraphs, one statement each.

The page layout this reads: a left-aligned body with numbered articles (`12.`), clauses (`(1)`), paragraphs (`(a)`) and
sub-paragraphs (`(i)`), and a margin column that holds each article's heading. Words are placed by their position, so the
margin heading is separated from the body line it sits beside. A marker is accepted only when it is the one expected next
(articles run 1, 2, 3...; clauses (1), (2)...; paragraphs (a), (b)...), which keeps a cross-reference such as "(2)" in running
text from being taken for a clause. What could not be placed is reported, never dropped silently.
"""

from __future__ import annotations

import re
from collections import defaultdict

import pdfplumber
from pdfplumber.pdf import PDF

from mzizi_extraction.legislation.layouts import SW_NUMBERS, SWAHILI  # noqa: F401  (re-exported)
from mzizi_extraction.legislation.models import (  # noqa: F401  (re-exported)
    CHAPTER,
    HEADER,
    NUMBER_WORDS,
    PART,
    ROMAN,
    SCHEDULE,
    Layout,
    Line,
    Node,
    ParseReport,
    Word,
)

MARKER = re.compile(r"^(\(?\d+[.)]?|\d+\)|\(?[a-z]\)|\(?[ivx]+[.)]|[ivx]+\))$")


def _whole_words(pieces: list[Word]) -> list[Word]:
    """Words split where the type size changes (small capitals) are put back together; a word keeps its largest size."""
    rows: list[list[Word]] = []
    for piece in sorted(pieces, key=lambda w: w.top):
        if rows and abs(rows[-1][0].top - piece.top) < 3:
            rows[-1].append(piece)
        else:
            rows.append([piece])
    out: list[Word] = []
    for row in rows:
        row.sort(key=lambda w: w.x0)
        for piece in row:
            last = out[-1] if out else None
            gap = piece.x0 - last.x1 if last is not None else 0.0
            if (
                last is not None
                and abs(last.top - piece.top) < 3
                and ((-0.6 <= gap < 1.6 and abs(last.size - piece.size) > 0.5) or -0.3 <= gap < 0.35)
            ):
                last.text += piece.text
                last.x1 = piece.x1
                last.size = max(last.size, piece.size)
            else:
                out.append(Word(piece.text, piece.x0, piece.x1, piece.top, piece.size))
    return out


def _is_margin(word: Word, layout: Layout, width: float) -> bool:
    """A margin note is set smaller than the body. Markers (`(1)`, `a)`) are small too but belong to the body."""
    if layout.margin_size_below is None or word.size >= layout.margin_size_below:
        return False
    if layout.size_only:
        # Page layouts vary from page to page, so size alone decides.
        return MARKER.match(word.text) is None and word.top > layout.top_min + 4
    return word.x0 >= width * 0.76 or word.x1 <= width * 0.19


def _lines(pdf: PDF, first: int, last: int, layout: Layout | None = None) -> list[Line]:
    layout = layout or Layout()
    out: list[Line] = []
    for index in range(first, last):
        page = pdf.pages[index]
        raw = page.extract_words(keep_blank_chars=False, use_text_flow=False, extra_attrs=["size"])
        words = _whole_words(
            [Word(str(w["text"]), float(w["x0"]), float(w["x1"]), float(w["top"]), float(w["size"])) for w in raw]
        )
        words = [w for w in words if layout.top_min < w.top < page.height - 40]
        rows: dict[int, list[Word]] = defaultdict(list)
        for w in words:
            rows[round(w.top / layout.line_tolerance)].append(w)
        merged: list[tuple[float, list[Word]]] = []
        for key in sorted(rows):
            top = min(w.top for w in rows[key])
            if merged and top - merged[-1][0] < layout.line_tolerance + 1:
                merged[-1][1].extend(rows[key])
            else:
                merged.append((top, list(rows[key])))
        for top, ws in merged:
            ws.sort(key=lambda w: w.x0)
            margin = [w for w in ws if _is_margin(w, layout, float(page.width))]
            body = [w for w in ws if not _is_margin(w, layout, float(page.width))]
            if not body and not margin:
                continue
            out.append(
                Line(
                    index + 1,
                    top,
                    body[0].x0 if body else margin[0].x0,
                    " ".join(w.text for w in body),
                    " ".join(w.text for w in margin),
                )
            )
    return out


SMALL = {"of", "the", "and", "to", "in", "for", "on", "a", "an", "by", "or", "at", "from", "with"}


def _title(text: str) -> str:
    """Capitalise a heading's words, keeping small words lower case: 'SOVEREIGNTY OF THE PEOPLE' -> 'Sovereignty of the People'."""
    words = _clean(text).lower().split(" ")
    return " ".join(w if (i and w in SMALL) else w[:1].upper() + w[1:] for i, w in enumerate(words))


def _chapter_number(word: str, layout: Layout) -> int | None:
    return layout.numbers.get(re.sub(r"\s+", " ", word.strip().upper()))


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("­", "")).strip()


def _join(parts: list[str]) -> str:
    text = ""
    for part in parts:
        if text.endswith("-") and not text.endswith(("--", " -")) and part[:1].islower():
            text = text[:-1] + part  # a word hyphenated across the line
        else:
            text = f"{text} {part}".strip()
    return _clean(text)


def _toc_titles(pdf: PDF, first: int, last: int, layout: Layout | None = None) -> dict[int, str]:
    layout = layout or Layout()
    """Article titles from the arrangement of articles ("12—Citizenship by birth."), which are cleaner than the margin notes."""
    titles: dict[int, str] = {}
    current: int | None = None
    for line in _lines(pdf, first, last, layout):
        text = line.text.strip()
        match = re.match(r"^(\d+)\s*[–—-]+\s*(.+)$", text)
        if match:
            current = int(match.group(1))
            titles[current] = match.group(2)
        elif (
            current is not None
            and text
            and not layout.chapter.match(text)
            and not layout.part.match(text)
            and not text.isupper()
        ):
            titles[current] = f"{titles[current]} {text}"
        else:
            current = None
    return {n: _clean(t).rstrip(".") for n, t in titles.items()}


SCHEDULE_HEAD = re.compile(r"^(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH)\s+SCHEDULE\b\s*(.*)$")
SCHEDULE_ANY = re.compile(r"\b(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH)\s+SCHEDULE\b\s*(.*)$")


def _schedules(lines: list[Line], root: Node, report: ParseReport) -> None:
    current: Node | None = None
    item: Node | None = None
    for line in lines:
        text = line.text.strip()
        if line.margin.strip() in NUMBER_WORDS and text.startswith("SCHEDULE"):
            text = f"{line.margin.strip()} {text}"  # the ordinal sat in the left margin
        if not text or HEADER.match(text):
            continue
        head = SCHEDULE_ANY.search(text)
        if head and (text.startswith(head.group(1)) or text[: head.start()].strip() == ""):
            number = NUMBER_WORDS[head.group(1)]
            current = Node("schedule", f"Schedule {number}", _clean(head.group(2)).strip("–— ").title(), page=line.page)
            root.children.append(current)
            item = None
            continue
        if current is None:
            continue
        marker = re.match(r"^(\d+)\.\s+(.*)$", text) or re.match(r"^\(([a-z]|[ivx]+|\d+)\)\s+(.*)$", text)
        if marker:
            item = Node("item", marker.group(1), text=marker.group(2), page=line.page)
            current.children.append(item)
        elif item is not None:
            item.text = _join([item.text, text])
        elif current.text or text:
            current.text = _join([current.text, text])


def parse_instrument(
    pdf_path: str,
    first_page: int,
    last_page: int,
    *,
    title: str,
    toc_pages: tuple[int, int] | None = None,
    layout: Layout | None = None,
) -> ParseReport:
    layout = layout or Layout()
    """Parse the pages [first_page, last_page) (0-based) of an English instrument laid out as described above."""
    with pdfplumber.open(pdf_path) as pdf:
        lines = _lines(pdf, first_page, min(last_page, len(pdf.pages)), layout)
        toc = _toc_titles(pdf, *toc_pages, layout) if toc_pages else {}
    root = Node("instrument", "", title)
    report = ParseReport(root)
    chapter: Node | None = None
    part: Node | None = None
    article: Node | None = None
    clause: Node | None = None
    paragraph: Node | None = None
    sub: Node | None = None
    expected_article = 1
    buffer: list[str] = []
    target: Node | None = None
    margin_budget = 0
    margin_parts: list[str] = []
    preamble: Node | None = None
    definition: Node | None = None

    def flush() -> None:
        nonlocal buffer
        if target is not None and buffer:
            target.text = _join([target.text, *buffer]) if target.text else _join(buffer)
        buffer = []

    def next_letter(node: Node | None) -> str:
        if node is None or not node.children:
            return "a"
        last = node.children[-1].designation.strip("()")
        return chr(ord(last) + 1) if len(last) == 1 else "a"

    for line in lines:
        text = line.text.strip()
        if layout.header.match(text) or not (text or line.margin):
            continue
        if margin_budget > 0 and line.margin and article is not None:
            margin_parts.append(line.margin)
            margin_budget -= 1
            article.title = _join(margin_parts)
        if not text:
            continue
        if chapter is None and text.upper() == "PREAMBLE":
            flush()
            preamble = Node("preamble", "Preamble", "Preamble", page=line.page)
            root.children.append(preamble)
            target = preamble
            continue
        if (
            chapter is None
            and preamble is not None
            and not layout.chapter.match(text)
            and text.upper() != "THE CONSTITUTION OF KENYA"
        ):
            first = text.split(" ", 1)[0]
            if (first.isalpha() and first.isupper() and len(first) >= 4) or text.startswith("We, the people"):
                flush()
                item = Node("item", str(len(preamble.children) + 1), page=line.page)
                preamble.children.append(item)
                target = item
                buffer = [text]
                continue
        match = layout.chapter.match(text)
        if match and _chapter_number(match.group(1), layout) is not None:
            flush()
            chapter = Node(
                "chapter", f"Chapter {_chapter_number(match.group(1), layout)}", _title(match.group(2)), page=line.page
            )
            root.children.append(chapter)
            part = article = clause = paragraph = sub = None
            target = chapter
            continue
        if (
            chapter is not None
            and target is chapter
            and not (layout.part.match(text) or re.match(r"^\d+\.", text))
            and text.isupper()
        ):
            chapter.title = _title(f"{chapter.title} {text}")
            continue
        match = layout.part.match(text)
        if match and chapter is not None:
            flush()
            number = int(match.group(1))
            last = max((int(c.designation.split()[1]) for c in chapter.children if c.kind == "part"), default=0)
            if number <= last:
                report.notes.append(
                    f"page {line.page}: Part {number} repeated in {chapter.designation}; read as Part {last + 1}"
                )
                number = last + 1
            part = Node("part", f"Part {number}", _title(match.group(2)), page=line.page)
            chapter.children.append(part)
            article = clause = paragraph = sub = None
            target = part
            continue
        match = re.match(rf"^{expected_article}\.\s*(.*)$", text)
        if match and chapter is not None:
            flush()
            article = Node("article", f"Article {expected_article}", page=line.page)
            (part or chapter).children.append(article)
            expected_article += 1
            report.articles += 1
            clause = paragraph = sub = definition = None
            margin_parts = [line.margin] if line.margin else []
            margin_budget = 3
            if line.margin:
                article.title = _join(margin_parts)
            rest = match.group(1)
            cm = re.match(r"^\(1\)\s*(.*)$", rest)
            if cm:
                clause = Node("clause", "(1)", page=line.page)
                article.children.append(clause)
                target, buffer = clause, [cm.group(1)] if cm.group(1) else []
            else:
                target, buffer = article, [rest] if rest else []
            continue
        if article is not None and article.designation == "Article 260" and text[:1] in '“"':
            term = re.match(r"^[“\"]([^”\"]+)[”\"]", text)
            flush()
            definition = Node("definition", term.group(1) if term else "term", page=line.page)
            (clause or article).children.append(definition)
            paragraph = sub = None
            target, buffer = definition, [text]
            continue
        if article is not None:
            cm = re.match(r"^\((\d+)\)\s*(.*)$", text)
            if cm and definition is None:
                number = int(cm.group(1))
                want = len(article.children) + 1
                if number == want and (not article.children or article.children[-1].kind == "clause"):
                    flush()
                    clause = Node("clause", f"({number})", page=line.page)
                    article.children.append(clause)
                    paragraph = sub = None
                    target, buffer = clause, [cm.group(2)] if cm.group(2) else []
                    continue
            pm = re.match(r"^\(?([a-z])\)\s*(.*)$" if layout.bare_paragraph_marker else r"^\(([a-z])\)\s*(.*)$", text)
            if pm:
                holder = definition or clause or article
                letter = pm.group(1)
                if letter == next_letter(holder) and not (
                    sub is not None and letter in ROMAN and paragraph is not None and letter != next_letter(holder)
                ):
                    flush()
                    paragraph = Node("paragraph", f"({letter})", page=line.page)
                    holder.children.append(paragraph)
                    sub = None
                    target, buffer = paragraph, [pm.group(2)] if pm.group(2) else []
                    continue
            sm = re.match(r"^\(?([ivx]+)\)\s*(.*)$" if layout.bare_paragraph_marker else r"^\(([ivx]+)\)\s*(.*)$", text)
            if sm and paragraph is not None:
                expected_roman = ROMAN[len(paragraph.children)] if len(paragraph.children) < len(ROMAN) else ""
                if sm.group(1) == expected_roman:
                    flush()
                    sub = Node("subparagraph", f"({sm.group(1)})", page=line.page)
                    paragraph.children.append(sub)
                    target, buffer = sub, [sm.group(2)] if sm.group(2) else []
                    continue
        if SCHEDULE_HEAD.match(text) and chapter is not None and expected_article > 260:
            flush()
            target = None
            schedule_start = lines.index(line)
            _schedules(lines[schedule_start:], root, report)
            break
        if target is not None:
            buffer.append(text)
        else:
            report.unplaced.append(f"page {line.page}: {text[:80]}")
    flush()
    for node in root.walk():
        if node.kind == "article" and toc:
            number = int(node.designation.split()[1])
            node.title = toc.get(number, node.title)
    return report
