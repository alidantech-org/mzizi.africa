"""Reading an Act's PDF as lines: the publisher's layout, the line types, small text helpers and the marker-order checks.

Split from `act.py` so each file stays small; `act.py` re-exports these names.
"""

from __future__ import annotations

import re
from collections.abc import Iterator
from dataclasses import dataclass, field
from typing import Literal

import pdfplumber

from mzizi_extraction.legislation.models import Node

ORDINALS = {
    "FIRST": 1, "SECOND": 2, "THIRD": 3, "FOURTH": 4, "FIFTH": 5, "SIXTH": 6, "SEVENTH": 7, "EIGHTH": 8, "NINTH": 9,
    "TENTH": 10, "ELEVENTH": 11, "TWELFTH": 12, "THIRTEENTH": 13, "FOURTEENTH": 14, "FIFTEENTH": 15,
}  # fmt: skip
PART_LINE = re.compile(r"^PART\s+([IVXLC]+)\s*[–—-]+\s*(.*)$", re.IGNORECASE)
SCHEDULE_LINE = re.compile(r"^(?:([A-Z]+)\s+)?SCHEDULE\b\s*(.*)$")
SECTION_LINE = re.compile(r"^(\d+)([A-Z]{0,2})\.\s*(.*)$")
CLAUSE_LINE = re.compile(r"^\((\d+)([A-Z]{0,2})\)\s*(.*)$")
LETTER_LINE = re.compile(r"^\(?([a-z]{1,2})\)\s*(.*)$")
ROMAN_LINE = re.compile(r"^\(?([ivx]+)\)\s*(.*)$")
ITEM_LINE = re.compile(r"^(\d+)\.\s+(.*)$")
DEFINITION_LINE = re.compile(r"^[“\"]([^”\"]+)[”\"]")
NOTE_START = re.compile(
    r"^\[(?:Act|Legal Notice|L\.N\.|Deleted|Substituted|Inserted|Repealed|Amended|Revised|Rectified|Corrigend)"
)
LEAD_IN = ("—", "-", ":", "–")


@dataclass(frozen=True)
class ActLayout:
    """How one publisher's print of an Act is laid out. Publisher knowledge lives in the caller's layout, not in this parser."""

    #: Lines matching any of these are running headers, footers or page numbers.
    running: tuple[re.Pattern[str], ...]
    #: The first body line (earlier lines are the cover, notes, long title and contents).
    body_start: re.Pattern[str]
    heading: Literal["inline", "bold-above"]
    #: A contents line giving a section number (group 1) and heading (group 2); used to check the parse.
    toc_entry: re.Pattern[str] | None = None
    #: Sections with a heading matching this hold definitions in quotation marks.
    definitions_in: re.Pattern[str] = re.compile(r"interpretation|definition", re.IGNORECASE)
    bold_share: float = 0.6
    #: The line that starts the body is boilerplate (`ENACTED by the Parliament`), not a provision.
    skip_start_line: bool = False
    #: Prints that set section headings in a margin column beside the text, mirrored from page to page (left on odd pages
    #: counting from zero, right on even). Words left of `margin_left_max`, or right of `margin_right_min` on the other pages,
    #: below `margin_top_min` points from the top, are margin headings (read as bold, in order, ahead of the line they sit by).
    margin_left_max: float | None = None
    margin_right_min: float = 390.0
    margin_top_min: float = 50.0
    longest_inline_heading: int = 120


@dataclass(frozen=True)
class ActLine:
    page: int
    text: str
    bold: bool
    x0: float
    margin: bool = False


@dataclass
class ActReport:
    root: Node
    #: Lines before the body: cover, assent and commencement, long title (contents lines are in `toc`).
    front: list[str] = field(default_factory=list)
    toc: dict[str, str] = field(default_factory=dict)
    sections: list[str] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)
    unplaced: list[str] = field(default_factory=list)

    @property
    def missing_from_body(self) -> list[str]:
        return [n for n in self.toc if n not in set(self.sections)]

    @property
    def not_in_contents(self) -> list[str]:
        return [n for n in self.sections if self.toc and n not in self.toc]


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace("­", "")).strip()


def _roman_value(text: str) -> int:
    total, values = 0, {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100}
    for i, ch in enumerate(text.upper()):
        v = values[ch]
        total += -v if i + 1 < len(text) and values[text.upper()[i + 1]] > v else v
    return total


def _roman(number: int) -> str:
    out = ""
    for value, symbol in (
        (100, "C"),
        (90, "XC"),
        (50, "L"),
        (40, "XL"),
        (10, "X"),
        (9, "IX"),
        (5, "V"),
        (4, "IV"),
        (1, "I"),
    ):
        while number >= value:
            out, number = out + symbol, number - value
    return out


def _balanced(text: str) -> tuple[str, str] | None:
    """A leading `[s. 5(1)]` or `(s. 110(1))` reference, brackets balanced, and what follows it."""
    if not text or text[0] not in "[(":
        return None
    depth = 0
    for i, ch in enumerate(text):
        depth += ch in "[("
        depth -= ch in "])"
        if depth == 0:
            return text[: i + 1], text[i + 1 :].strip()
    return None


def _clean_caps(text: str) -> str:
    """Small-capital lettering read as `PrelImInary` becomes `Preliminary`."""
    text = _clean(text)
    return text.lower().capitalize() if re.search(r"[a-z][A-Z]", text) else text


def _join(parts: list[str]) -> str:
    text = ""
    for part in parts:
        if text.endswith("-") and not text.endswith(("--", " -")) and part[:1].islower():
            text = text[:-1] + part
        else:
            text = f"{text} {part}".strip()
    return _clean(text)


def _margin_lines(page: pdfplumber.page.Page, index: int, layout: ActLayout) -> Iterator[tuple[float, ActLine]]:
    """Lines of a page with a margin column: body lines and margin headings, each ordered by vertical position."""
    assert layout.margin_left_max is not None
    left = index % 2 == 1
    groups: dict[bool, list[list[dict[str, str | float]]]] = {False: [], True: []}
    for word in sorted(page.extract_words(extra_attrs=["fontname"]), key=lambda w: (w["top"], w["x0"])):
        is_margin = float(word["top"]) > layout.margin_top_min and (
            float(word["x0"]) < layout.margin_left_max if left else float(word["x0"]) >= layout.margin_right_min
        )
        rows = groups[is_margin]
        if rows and abs(float(rows[-1][0]["top"]) - float(word["top"])) < 3:
            rows[-1].append(word)
        else:
            rows.append([word])
    for is_margin, rows in groups.items():
        for row in rows:
            text = _clean(" ".join(str(w["text"]) for w in sorted(row, key=lambda w: float(w["x0"]))))
            letters = [w for w in row if any(c.isalpha() for c in str(w["text"]))]
            bold = bool(letters) and sum("Bold" in str(w["fontname"]) for w in letters) / len(letters) >= 0.6
            top = float(row[0]["top"])
            yield (
                top - (0.1 if is_margin else 0.0),
                ActLine(index + 1, text, bold or is_margin, float(row[0]["x0"]), is_margin),
            )


def read_lines(
    path: str, first: int = 0, last: int | None = None, layout: ActLayout | None = None
) -> Iterator[ActLine]:
    """The text lines of pages [first, last) (0-based), each with whether it is set in bold."""
    with pdfplumber.open(path) as pdf:
        for number, page in enumerate(pdf.pages[first:last], first + 1):
            if layout is not None and layout.margin_left_max is not None:
                for _, found in sorted(_margin_lines(page, number - 1, layout), key=lambda pair: pair[0]):
                    if found.text:
                        yield found
                continue
            for line in page.extract_text_lines(return_chars=True):
                chars = [c for c in line["chars"] if c["text"].strip()]
                text = _clean(str(line["text"]))
                if chars and text:
                    bold = sum("Bold" in str(c["fontname"]) for c in chars) / len(chars)
                    yield ActLine(number, text, bold >= 0.6, float(line["x0"]))


def _follows(last: tuple[int, str] | None, number: int, suffix: str) -> bool:
    """Is (number, suffix) the next designation after `last`: 4 -> 4A -> 4B -> 5."""
    if last is None:
        return (number, suffix) == (1, "")
    return (number == last[0] + 1 and suffix == "") or (number == last[0] and suffix > last[1])


def _next_letter(last: str | None) -> set[str]:
    """Letters that may follow `last`: b after a, and the inserted `ha` after h."""
    if last is None:
        return {"a"}
    nxt = chr(ord(last[-1]) + 1) if len(last) == 1 else ""
    return {nxt, last + "a"} - {""}


def _designation(text: str) -> tuple[int, str]:
    m = re.match(r"^(\d+)([A-Z]*)$", text)
    return (int(m.group(1)), m.group(2)) if m else (0, "")
