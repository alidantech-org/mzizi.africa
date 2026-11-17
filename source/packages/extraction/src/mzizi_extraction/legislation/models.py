"""The data a parsed instrument is built from: numerals, heading patterns, the page layout and the tree it produces."""

from __future__ import annotations

import re
from dataclasses import dataclass, field

ROMAN = [
    "i",
    "ii",
    "iii",
    "iv",
    "v",
    "vi",
    "vii",
    "viii",
    "ix",
    "x",
    "xi",
    "xii",
    "xiii",
    "xiv",
    "xv",
    "xvi",
    "xvii",
    "xviii",
    "xix",
    "xx",
]
CHAPTER = re.compile(r"^CHAPTER\s+([A-Z\-]+)\s*[–—-]+\s*(.*)$")
PART = re.compile(r"^Part\s+(\d+)\s*[–—-]+\s*(.*)$", re.IGNORECASE)
SCHEDULE = re.compile(r"^(?:THE\s+)?([A-Z]+)\s+SCHEDULE\b\s*(.*)$")
HEADER = re.compile(
    r"^(?:The Constitution of Kenya|THE CONSTITUTION OF KENYA)\b.*$|^\d+\s+The Constitution of Kenya$|^\d+$"
)
NUMBER_WORDS = {
    "ONE": 1,
    "TWO": 2,
    "THREE": 3,
    "FOUR": 4,
    "FIVE": 5,
    "SIX": 6,
    "SEVEN": 7,
    "EIGHT": 8,
    "NINE": 9,
    "TEN": 10,
    "ELEVEN": 11,
    "TWELVE": 12,
    "THIRTEEN": 13,
    "FOURTEEN": 14,
    "FIFTEEN": 15,
    "SIXTEEN": 16,
    "SEVENTEEN": 17,
    "EIGHTEEN": 18,
    "FIRST": 1,
    "SECOND": 2,
    "THIRD": 3,
    "FOURTH": 4,
    "FIFTH": 5,
    "SIXTH": 6,
    "SEVENTH": 7,
}


@dataclass(frozen=True)
class Layout:
    """How a language's edition is typeset: where the margin column is and how headings are written."""

    language: str = "en"
    #: Words within this many points vertically are one line.
    line_tolerance: float = 3.0
    #: When set, words set smaller than this size are margin notes (the English print sets them in 9 pt against a 10 pt body).
    margin_size_below: float | None = 9.6
    #: Decide margin notes by size alone (for editions whose pages are laid out differently from page to page).
    size_only: bool = False
    #: Lines above this are the running page header.
    top_min: float = 62.0
    chapter: re.Pattern[str] = CHAPTER
    part: re.Pattern[str] = PART
    header: re.Pattern[str] = HEADER
    numbers: dict[str, int] = field(default_factory=lambda: dict(NUMBER_WORDS))
    #: Paragraph and clause markers may be written without the opening bracket: `a)`.
    bare_paragraph_marker: bool = False


@dataclass
class Node:
    kind: str
    designation: str
    title: str = ""
    text: str = ""
    page: int = 0
    children: list[Node] = field(default_factory=list)

    def walk(self) -> list[Node]:
        out = [self]
        for child in self.children:
            out.extend(child.walk())
        return out


@dataclass
class ParseReport:
    root: Node
    articles: int = 0
    notes: list[str] = field(default_factory=list)
    unplaced: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class Line:
    page: int
    top: float
    x0: float
    text: str
    margin: str


@dataclass
class Word:
    text: str
    x0: float
    x1: float
    top: float
    size: float
