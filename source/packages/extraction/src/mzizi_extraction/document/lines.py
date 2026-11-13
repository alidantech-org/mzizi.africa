"""Words and lines in page coordinates (points, origin top-left), independent of where they were read from."""

from __future__ import annotations

from dataclasses import dataclass

from mzizi_extraction.document.models import Span


@dataclass(frozen=True)
class Word:
    text: str
    x0: float
    x1: float
    top: float
    bottom: float
    size: float
    bold: bool = False
    italic: bool = False

    @property
    def center(self) -> tuple[float, float]:
        return (self.x0 + self.x1) / 2, (self.top + self.bottom) / 2


@dataclass(frozen=True)
class Line:
    spans: tuple[Span, ...]
    x0: float
    x1: float
    top: float
    bottom: float
    size: float
    group: int = 0  # lines of one reading-order group (a column band) may merge into paragraphs

    @property
    def text(self) -> str:
        return "".join(s.text for s in self.spans)

    @property
    def all_bold(self) -> bool:
        return bool(self.spans) and all(s.bold for s in self.spans if s.text.strip())


def merge_spans(spans: list[Span]) -> tuple[Span, ...]:
    """Adjacent spans of equal style become one span."""
    merged: list[Span] = []
    for span in spans:
        if not span.text:
            continue
        if merged and merged[-1].bold == span.bold and merged[-1].italic == span.italic:
            merged[-1] = Span(text=merged[-1].text + span.text, bold=span.bold, italic=span.italic)
        else:
            merged.append(span)
    return tuple(merged)


def words_to_line(words: list[Word], group: int) -> Line:
    ordered = sorted(words, key=lambda w: w.x0)
    spans: list[Span] = []
    for index, word in enumerate(ordered):
        text = word.text if index == 0 else " " + word.text
        spans.append(Span(text=text, bold=word.bold, italic=word.italic))
    sizes = sorted(w.size for w in ordered)
    return Line(
        spans=merge_spans(spans),
        x0=min(w.x0 for w in ordered),
        x1=max(w.x1 for w in ordered),
        top=min(w.top for w in ordered),
        bottom=max(w.bottom for w in ordered),
        size=sizes[len(sizes) // 2],
        group=group,
    )


def cluster_rows(words: list[Word]) -> list[list[Word]]:
    """Words sharing a baseline band, top to bottom."""
    rows: list[list[Word]] = []
    for word in sorted(words, key=lambda w: (w.top, w.x0)):
        if rows and abs(word.top - rows[-1][0].top) <= 0.6 * max(word.size, 1.0):
            rows[-1].append(word)
        else:
            rows.append([word])
    return rows
