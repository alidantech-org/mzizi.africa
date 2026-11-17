"""Join a table that continues across pages into one logical table.

A table continues when the next page's table has the same number of columns and either repeats the header or has no
header of its own. Nothing is invented: repeated header rows are dropped and every other row is kept in order."""

from __future__ import annotations

from dataclasses import dataclass

from mzizi_extraction.document.models import Page, TableBlock


@dataclass(frozen=True)
class LogicalTable:
    index: int
    pages: tuple[int, ...]
    parts: tuple[tuple[int, int], ...]  # (page, table index) of each piece, in order
    header_rows: int
    rows: tuple[tuple[str, ...], ...]


HEADER_MATCH_SHARE = 0.8


def _columns(rows: tuple[tuple[str, ...], ...]) -> tuple[str, ...]:
    return tuple(" ".join(" ".join(part for part in column if part).split()).casefold() for column in zip(*rows, strict=True))


def _repeats_header(head: TableBlock, block: TableBlock) -> bool:
    """The block prints the same column headings as the chain's first table. Wrapping may move words between the
    header's lines, so the lines of each column are compared as one text."""
    span = min(head.header_rows, block.header_rows)
    if span == 0 or len(head.rows[0]) != len(block.rows[0]):
        return False
    mine, theirs = _columns(head.rows[:span]), _columns(block.rows[:span])
    return sum(a == b for a, b in zip(mine, theirs, strict=True)) >= HEADER_MATCH_SHARE * len(mine)


def _repeated_rows(head: TableBlock, block: TableBlock) -> int:
    """How many leading rows of `block` are a repeated header (0 when none)."""
    return block.header_rows if _repeats_header(head, block) else 0


def _joined_header(rows: tuple[tuple[str, ...], ...]) -> tuple[str, ...]:
    return tuple(" ".join(dict.fromkeys(part for part in column if part)) for column in zip(*rows, strict=True))


def stitch_tables(pages: tuple[Page, ...]) -> list[LogicalTable]:
    """Logical tables that span two or more pages, in document order. The header becomes one row."""
    chains: list[list[tuple[int, TableBlock]]] = []
    for page in pages:
        for block in page.blocks:
            if not isinstance(block, TableBlock) or not block.rows:
                continue
            if chains:
                last_page, last = chains[-1][-1]
                head = chains[-1][0][1]
                adjacent = page.number == last_page + 1
                if (
                    adjacent
                    and len(block.rows[0]) == len(head.rows[0])
                    and (_repeated_rows(head, block) > 0 or block.header_rows == 0)
                ):
                    chains[-1].append((page.number, block))
                    continue
            chains.append([(page.number, block)])
    logical: list[LogicalTable] = []
    for chain in chains:
        if len(chain) < 2:
            continue
        head = chain[0][1]
        header_count = max(1, head.header_rows)
        body = list(head.rows[header_count:])
        for _, block in chain[1:]:
            body.extend(block.rows[_repeated_rows(head, block) :])
        rows = (_joined_header(head.rows[:header_count]), *body)
        logical.append(
            LogicalTable(
                index=len(logical) + 1,
                pages=tuple(p for p, _ in chain),
                parts=tuple((p, b.index) for p, b in chain),
                header_rows=1,
                rows=tuple(rows),
            )
        )
    return logical
