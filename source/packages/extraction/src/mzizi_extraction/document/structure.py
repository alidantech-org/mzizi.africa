"""From lines to blocks: headings by size and weight, paragraphs, lists, with hyphenation joined."""

from __future__ import annotations

from dataclasses import dataclass, field
from statistics import median

from mzizi_extraction.document.lines import Line, merge_spans
from mzizi_extraction.document.models import BBox, Block, Heading, ListItem, Paragraph, Span
from mzizi_extraction.text.patterns import list_marker

HEADING_RATIO = 1.12
MAX_SIZE_LEVELS = 4
MAX_BOLD_HEADING_CHARS = 100
PARAGRAPH_GAP = 0.45  # vertical gap, in body-text heights, that starts a new paragraph
BOLD_HEADING_GAP = 0.3


@dataclass(frozen=True)
class Typography:
    body: float
    levels: tuple[float, ...]  # heading sizes, largest first
    ratio: float = HEADING_RATIO


def typography(sizes_by_chars: list[tuple[float, int]], ratio: float = HEADING_RATIO) -> Typography:
    """Body size is the size carrying the most characters; larger sizes become heading levels."""
    weight: dict[float, int] = {}
    for size, chars in sizes_by_chars:
        key = round(size * 2) / 2
        weight[key] = weight.get(key, 0) + chars
    if not weight:
        return Typography(body=10.0, levels=())
    body = max(weight, key=lambda k: weight[k])
    larger = sorted((k for k in weight if k >= body * ratio), reverse=True)
    return Typography(body=body, levels=tuple(larger[:MAX_SIZE_LEVELS]), ratio=ratio)


def line_height_typography(lines: list[Line]) -> Typography:
    """Typography for OCR pages, where only line heights exist: the median is the body, much taller lines are headings."""
    if not lines:
        return Typography(body=10.0, levels=(), ratio=1.3)
    body = median(line.size for line in lines)
    sizes = sorted({round(line.size * 2) / 2 for line in lines if line.size >= body * 1.3}, reverse=True)
    return Typography(body=body, levels=tuple(sizes[:MAX_SIZE_LEVELS]), ratio=1.3)


def _size_level(size: float, typ: Typography) -> int | None:
    if not typ.levels or size < typ.body * typ.ratio:
        return None
    nearest = min(range(len(typ.levels)), key=lambda i: abs(typ.levels[i] - size))
    return nearest + 1


@dataclass
class _Pending:
    kind: str
    spans: list[Span]
    x0: float
    x1: float
    top: float
    bottom: float
    size: float
    level: int = 0
    ordered: bool = False
    marker: str = ""
    count: int = field(default=1)

    def add(self, line: Line, strip_marker: int = 0) -> None:
        self.spans = _join(self.spans, list(line.spans))
        self.x0, self.x1 = min(self.x0, line.x0), max(self.x1, line.x1)
        self.bottom = max(self.bottom, line.bottom)
        self.count += 1


def _join(first: list[Span], second: list[Span]) -> list[Span]:
    """Joins wrapped lines: a trailing hyphen before a lowercase letter is a soft hyphen and disappears."""
    if not first or not second:
        return first + second
    tail, head = first[-1].text.rstrip(), second[0].text.lstrip()
    if tail.endswith("-") and len(tail) > 1 and head[:1].islower():
        trimmed = Span(text=tail[:-1], bold=first[-1].bold, italic=first[-1].italic)
        return [*first[:-1], trimmed, Span(text=head, bold=second[0].bold, italic=second[0].italic), *second[1:]]
    return [*first, Span(text=" ", bold=first[-1].bold, italic=first[-1].italic), *second]


def _strip_marker(spans: tuple[Span, ...], rest: str) -> list[Span]:
    """Spans of a list line without its marker (the marker is shown by the renderer)."""
    full = "".join(s.text for s in spans)
    cut = len(full) - len(rest)
    kept: list[Span] = []
    position = 0
    for span in spans:
        end = position + len(span.text)
        if end > cut:
            kept.append(Span(text=span.text[max(cut - position, 0) :], bold=span.bold, italic=span.italic))
        position = end
    return kept


def _unbold(spans: list[Span]) -> list[Span]:
    return [Span(text=s.text, bold=False, italic=s.italic) for s in spans]


def build_blocks(lines: list[Line], typ: Typography, page: int) -> list[Block]:
    blocks: list[Block] = []
    current: _Pending | None = None
    previous: Line | None = None

    def flush() -> None:
        nonlocal current
        if current is not None:
            blocks.append(_finish(current, page))
            current = None

    for index, line in enumerate(lines):
        following = lines[index + 1] if index + 1 < len(lines) else None
        same_group_prev = previous if previous is not None and previous.group == line.group else None
        gap = line.top - same_group_prev.bottom if same_group_prev else 1e9
        level = _heading_level(line, same_group_prev, following, typ)
        marker = None if level else list_marker(line.text)
        if current is not None and same_group_prev is not None and _continues(current, line, gap, level, marker, typ):
            current.add(line)
        else:
            flush()
            current = _start(line, level, marker)
        previous = line
    flush()
    return blocks


def _heading_level(line: Line, prev: Line | None, following: Line | None, typ: Typography) -> int | None:
    text = line.text.strip()
    if not text:
        return None
    by_size = _size_level(line.size, typ)
    if by_size is not None and len(text) <= 300:
        return by_size
    if not line.all_bold or len(text) > MAX_BOLD_HEADING_CHARS or text[-1] in ",;":
        return None
    if list_marker(text) is not None:
        return None
    before = prev is None or line.top - prev.bottom > BOLD_HEADING_GAP * typ.body
    after = (
        following is None
        or following.group != line.group
        or following.top - line.bottom > BOLD_HEADING_GAP * typ.body
        or not following.all_bold
    )
    return min(len(typ.levels) + 1, 6) if before and after else None


def _start(line: Line, level: int | None, marker: object) -> _Pending:
    base = {"x0": line.x0, "x1": line.x1, "top": line.top, "bottom": line.bottom, "size": line.size}
    if level:
        return _Pending(kind="heading", spans=_unbold(list(line.spans)), level=level, **base)
    found = list_marker(line.text) if marker is not None else None
    if found is not None:
        return _Pending(
            kind="list", spans=_strip_marker(line.spans, found.rest), ordered=found.ordered, marker=found.marker, **base
        )
    return _Pending(kind="paragraph", spans=list(line.spans), **base)


def _continues(cur: _Pending, line: Line, gap: float, level: int | None, marker: object, typ: Typography) -> bool:
    if cur.kind == "heading":
        return level == cur.level and gap <= 1.0 * line.size
    if level is not None or marker is not None:
        return False
    if gap > PARAGRAPH_GAP * typ.body or abs(line.size - cur.size) > 0.8:
        return False
    return cur.kind != "list" or line.x0 >= cur.x0 - 1


def _finish(p: _Pending, page: int) -> Block:
    bbox: BBox = (round(p.x0, 1), round(p.top, 1), round(p.x1, 1), round(p.bottom, 1))
    spans = merge_spans(p.spans)
    if p.kind == "heading":
        return Heading(level=p.level, spans=spans, page=page, bbox=bbox)
    if p.kind == "list":
        return ListItem(ordered=p.ordered, marker=p.marker, spans=spans, page=page, bbox=bbox)
    return Paragraph(spans=spans, page=page, bbox=bbox)
