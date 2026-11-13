"""Running headers, footers and page numbers: lines repeating in the page margins of many pages."""

from __future__ import annotations

from mzizi_extraction.document.lines import Line
from mzizi_extraction.document.pdf_scan import PageScan

FURNITURE_ZONE = 0.08
MIN_FURNITURE_PAGES = 3
FURNITURE_SHARE = 0.4

ROMAN_DIGITS = frozenset("ivxlcdm")
MAX_ROMAN_CHARS = 7


def normalised(text: str) -> str:
    """Page numbers (arabic or roman) become `#`, so "Report iv" and "Report xxxix" count as the same running header."""
    tokens = [
        "#" if token and len(token) <= MAX_ROMAN_CHARS and set(token) <= ROMAN_DIGITS else token
        for token in text.translate(str.maketrans("0123456789", "##########")).strip().lower().split()
    ]
    return " ".join(tokens)


def find_furniture(scans: list[PageScan], lines: dict[int, list[tuple[Line, int]]]) -> set[str]:
    """Texts repeating in the top or bottom band of many pages (running headers, footers, page numbers)."""
    pages = [s for s in scans if not s.ocr]
    if len(pages) < MIN_FURNITURE_PAGES:
        return set()
    counts: dict[str, int] = {}
    for scan in pages:
        seen: set[str] = set()
        for line, _ in lines[scan.number]:
            if line.top < FURNITURE_ZONE * scan.height or line.bottom > (1 - FURNITURE_ZONE) * scan.height:
                seen.add(normalised(line.text))
        for key in seen:
            counts[key] = counts.get(key, 0) + 1
    need = max(MIN_FURNITURE_PAGES, FURNITURE_SHARE * len(pages))
    return {k for k, n in counts.items() if n >= need and k}


def is_furniture(line: Line, scan: PageScan, repeated: set[str]) -> bool:
    in_band = line.top < FURNITURE_ZONE * scan.height or line.bottom > (1 - FURNITURE_ZONE) * scan.height
    return in_band and normalised(line.text) in repeated
