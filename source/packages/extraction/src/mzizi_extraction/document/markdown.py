"""Markdown and CSV rendering of a structured document."""

from __future__ import annotations

import csv
import io

from mzizi_extraction.document.models import (
    FigureBlock,
    Heading,
    ListItem,
    Page,
    Paragraph,
    Span,
    TableBlock,
)


def _wrap(marker: str, text: str) -> str:
    """Markers hug the text; whitespace at the edges stays outside them."""
    core = text.strip()
    if not core:
        return text
    lead = text[: len(text) - len(text.lstrip())]
    trail = text[len(text.rstrip()) :]
    return f"{lead}{marker}{core}{marker}{trail}"


def _bold_only(span: Span) -> str:
    return _wrap("**", span.text) if span.bold else span.text


def _emphasis(group: list[Span]) -> str:
    """Italic runs wrap their bold parts (`*a **b** c*`); a span's own bold stays on that span."""
    parts: list[str] = []
    index = 0
    while index < len(group):
        if not group[index].italic:
            parts.append(_bold_only(group[index]))
            index += 1
            continue
        end = index
        while end < len(group) and group[end].italic:
            end += 1
        parts.append(_wrap("*", "".join(_bold_only(s) for s in group[index:end])))
        index = end
    return "".join(parts)


def render_spans(spans: tuple[Span, ...]) -> str:
    """Markdown for inline spans: one link per run of spans sharing a destination, emphasis nested inside it."""
    out: list[str] = []
    index = 0
    while index < len(spans):
        href = spans[index].href
        end = index
        while end < len(spans) and spans[end].href == href:
            end += 1
        inner = _emphasis(list(spans[index:end]))
        if href and inner.strip():
            core = inner.strip()
            lead = inner[: len(inner) - len(inner.lstrip())]
            trail = inner[len(inner.rstrip()) :]
            inner = f"{lead}[{core}]({href}){trail}"
        out.append(inner)
        index = end
    return "".join(out).strip()


def _cell(text: str) -> str:
    return text.replace("|", "\\|").replace("\n", " ")


def render_table(table: TableBlock) -> str:
    width = max(len(r) for r in table.rows)
    rows = [[*r, *([""] * (width - len(r)))] for r in table.rows]
    lines = ["| " + " | ".join(_cell(c) for c in rows[0]) + " |", "|" + "---|" * width]
    lines += ["| " + " | ".join(_cell(c) for c in r) + " |" for r in rows[1:]]
    return "\n".join(lines)


def table_csv(table: TableBlock) -> str:
    buffer = io.StringIO()
    csv.writer(buffer, lineterminator="\n").writerows(table.rows)
    return buffer.getvalue()


def render_markdown(pages: tuple[Page, ...]) -> str:
    out: list[str] = []
    for page in pages:
        note = f"page {page.number}" + (f", OCR {page.ocr_confidence:.2f}" if page.ocr and page.ocr_confidence else "")
        out.append(f"<!-- {note} -->")
        previous_list = False
        for block in page.blocks:
            is_list = isinstance(block, ListItem)
            text = _block(block)
            if is_list and previous_list and out:
                out[-1] = out[-1] + "\n" + text
            else:
                out.append(text)
            previous_list = is_list
    return "\n\n".join(out).strip() + "\n"


def _block(block: Heading | Paragraph | ListItem | TableBlock | FigureBlock) -> str:
    match block:
        case Heading():
            return "#" * min(block.level, 6) + " " + render_spans(block.spans)
        case Paragraph():
            return render_spans(block.spans)
        case ListItem():
            bullet = block.marker if block.ordered else "-"
            return f"{bullet} {render_spans(block.spans)}"
        case TableBlock():
            caption = f"*{block.caption}*\n\n" if block.caption else ""
            return caption + render_table(block)
        case FigureBlock():
            caption = f"\n\n*{block.caption}*" if block.caption else ""
            return f"![{block.alt}]({block.asset}){caption}"
