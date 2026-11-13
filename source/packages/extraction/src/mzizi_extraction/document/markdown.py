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


def render_spans(spans: tuple[Span, ...]) -> str:
    """Emphasis markers hug the text: surrounding spaces stay outside `**...**`."""
    parts: list[str] = []
    for span in spans:
        core = span.text.strip()
        if not core:
            parts.append(span.text)
            continue
        lead, trail = span.text[: len(span.text) - len(span.text.lstrip())], span.text[len(span.text.rstrip()) :]
        marked = core
        if span.bold and span.italic:
            marked = f"***{core}***"
        elif span.bold:
            marked = f"**{core}**"
        elif span.italic:
            marked = f"*{core}*"
        if span.href:
            marked = f"[{marked}]({span.href})"
        parts.append(f"{lead}{marked}{trail}")
    return "".join(parts).strip()


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
