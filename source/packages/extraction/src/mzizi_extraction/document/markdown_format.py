"""One Markdown formatter for every Markdown file the engine writes (document, page, section, web page).

It changes layout only: line endings, spacing between blocks, list markers and table alignment. Words, links and
code blocks are never reworded."""

from __future__ import annotations

import re

FENCE = re.compile(r"^\s*(```|~~~)")
HEADING = re.compile(r"^(#{1,6})([^#\s].*|\s+.*)$")
BULLET = re.compile(r"^(\s*)[-*+•]\s+(.*)$")
TABLE_ROW = re.compile(r"^\s*\|.*\|\s*$")
SEPARATOR_CELL = re.compile(r"^:?-{1,}:?$")
MIN_CELL_WIDTH = 3
MAX_CELL_WIDTH = 60  # very wide cells are not padded, so one long cell cannot stretch a whole table


def _cells(line: str) -> list[str]:
    body = line.strip()[1:-1]
    cells: list[str] = []
    current = ""
    escaped = False
    for char in body:
        if char == "|" and not escaped:
            cells.append(current.strip())
            current = ""
        else:
            current += char
        escaped = char == "\\" and not escaped
    cells.append(current.strip())
    return cells


def _align_table(lines: list[str]) -> list[str]:
    rows = [_cells(line) for line in lines]
    width = max(len(row) for row in rows)
    rows = [row + [""] * (width - len(row)) for row in rows]
    is_separator = [all(SEPARATOR_CELL.match(c) for c in row if c) and any(row) for row in rows]
    widths = [
        max(
            [MIN_CELL_WIDTH]
            + [
                len(row[i])
                for row, sep in zip(rows, is_separator, strict=True)
                if not sep and len(row[i]) <= MAX_CELL_WIDTH
            ]
        )
        for i in range(width)
    ]
    out: list[str] = []
    for row, sep in zip(rows, is_separator, strict=True):
        if sep:
            out.append("| " + " | ".join(_rule(cell, widths[i]) for i, cell in enumerate(row)) + " |")
        else:
            out.append("| " + " | ".join(cell.ljust(widths[i]) for i, cell in enumerate(row)) + " |")
    return out


def _rule(cell: str, width: int) -> str:
    left, right = cell.startswith(":"), cell.endswith(":") and len(cell) > 1
    return (":" if left else "") + "-" * max(1, width - left - right) + (":" if right else "")


def format_markdown(text: str) -> str:
    """The text with consistent block spacing, `-` bullets, `# Heading` spacing and aligned pipe tables."""
    front, text = _split_front_matter(text)
    body = _format_body(text)
    return front + body


def _split_front_matter(text: str) -> tuple[str, str]:
    """A leading `---` YAML block is metadata, not prose, so it is kept exactly."""
    if text.startswith("---\n"):
        end = text.find("\n---\n", 4)
        if end != -1:
            return text[: end + 5] + "\n", text[end + 5 :]
    return "", text


def _format_body(text: str) -> str:
    lines = text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    blocks: list[list[str]] = []  # each block is lines that belong together; blocks get one blank line between
    in_fence = False
    fence_block: list[str] = []
    paragraph: list[str] = []
    table: list[str] = []

    def flush_paragraph() -> None:
        if paragraph:
            blocks.append(list(paragraph))
            paragraph.clear()

    def flush_table() -> None:
        if table:
            blocks.append(_align_table(table))
            table.clear()

    for raw in lines:
        line = raw.rstrip()
        if in_fence:
            fence_block.append(raw.rstrip("\n"))
            if FENCE.match(line):
                blocks.append(fence_block)
                fence_block, in_fence = [], False
            continue
        if FENCE.match(line):
            flush_paragraph()
            flush_table()
            in_fence, fence_block = True, [line]
            continue
        if TABLE_ROW.match(line):
            flush_paragraph()
            table.append(line)
            continue
        flush_table()
        if not line.strip():
            flush_paragraph()
            continue
        heading = HEADING.match(line)
        if heading:
            flush_paragraph()
            blocks.append([f"{heading.group(1)} {heading.group(2).strip()}"])
            continue
        bullet = BULLET.match(line)
        if bullet:
            line = f"{bullet.group(1)}- {bullet.group(2)}"
            if paragraph and not BULLET.match(paragraph[-1]):
                flush_paragraph()
        elif paragraph and BULLET.match(paragraph[-1]) and not raw.startswith((" ", "\t")):
            flush_paragraph()
        paragraph.append(line)
    flush_paragraph()
    flush_table()
    blocks.extend([fence_block] if fence_block else [])
    return "\n\n".join("\n".join(block) for block in blocks).strip() + "\n"
