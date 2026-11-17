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
    return tuple(
        " ".join(" ".join(part for part in column if part).split()).casefold() for column in zip(*rows, strict=True)
    )


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
        taken: set[int] = set()  # a chain continues in at most one table of the next page
        for block in page.blocks:
            if not isinstance(block, TableBlock) or not block.rows:
                continue
            match = next(
                (
                    position
                    for position, chain in enumerate(chains)
                    if position not in taken and chain[-1][0] == page.number - 1 and _continues(chain[0][1], block)
                ),
                None,
            )
            if match is None:
                chains.append([(page.number, block)])
                taken.add(len(chains) - 1)
            else:
                chains[match].append((page.number, block))
                taken.add(match)
    return _group_by_columns(chains)


MAX_PADDED_COLUMNS = 2  # a continuation may lose trailing empty columns when blank columns are dropped


def _continues(head: TableBlock, block: TableBlock) -> bool:
    """The block carries on the table that starts with `head`: same headings again, or no heading and no wider."""
    if block.header_rows == 0:
        missing = len(head.rows[0]) - len(block.rows[0])
        return 0 <= missing <= MAX_PADDED_COLUMNS
    return _repeats_header(head, block)


def _padded(row: tuple[str, ...], width: int) -> tuple[str, ...]:
    return (*row, *([""] * (width - len(row))))


def _group_by_columns(chains: list[list[tuple[int, TableBlock]]]) -> list[LogicalTable]:
    """Tables anywhere in the document that print the same column headings become one table, in page order."""
    groups: list[list[list[tuple[int, TableBlock]]]] = []
    for chain in chains:
        head = chain[0][1]
        if head.header_rows == 0:
            groups.append([chain])
            continue
        for group in groups:
            first = group[0][0][1]
            if first.header_rows and _repeats_header(first, head):
                group.append(chain)
                break
        else:
            groups.append([chain])
    logical: list[LogicalTable] = []
    for group in groups:
        pieces = [piece for chain in group for piece in chain]
        if len(pieces) < 2:
            continue
        head = pieces[0][1]
        width = len(head.rows[0])
        header_count = max(1, head.header_rows)
        body = [_padded(row, width) for row in head.rows[header_count:]]
        for _, block in pieces[1:]:
            skip = block.header_rows if block.header_rows and _repeats_header(head, block) else 0
            body.extend(_padded(row, width) for row in block.rows[skip:])
        logical.append(
            LogicalTable(
                index=len(logical) + 1,
                pages=tuple(p for p, _ in pieces),
                parts=tuple((p, b.index) for p, b in pieces),
                header_rows=1,
                rows=(_joined_header(head.rows[:header_count]), *body),
            )
        )
    return logical
