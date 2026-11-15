"""Lay out native HTML table cells and retain their original positions and spans."""

from __future__ import annotations

from collections.abc import Callable, Iterator

from bs4 import Tag

from mzizi_extraction.document.models import TableCell

MAX_COLUMNS = 1000


def _groups(table: Tag) -> Iterator[tuple[str, list[Tag]]]:
    direct: list[Tag] = []
    groups: list[tuple[str, list[Tag]]] = []
    for child in table.find_all(["thead", "tbody", "tfoot", "tr"], recursive=False):
        if child.name == "tr":
            direct.append(child)
            continue
        if direct:
            groups.append(("tbody", direct))
            direct = []
        groups.append((child.name, child.find_all("tr", recursive=False)))
    if direct:
        groups.append(("tbody", direct))
    yield from sorted(groups, key=lambda group: {"thead": 0, "tfoot": 2}.get(group[0], 1))


def _span(cell: Tag, name: str, remaining: int) -> int:
    try:
        value = int(str(cell.get(name, "1")))
    except ValueError:
        return 1
    if name == "rowspan" and value == 0:
        return remaining
    return max(1, min(value, remaining))


def table_grid(
    table: Tag, render: Callable[[Tag], str]
) -> tuple[tuple[tuple[str, ...], ...], int, tuple[TableCell, ...]]:
    grid: list[dict[int, str]] = []
    originals: list[TableCell] = []
    headers = width = 0
    for group, rows in _groups(table):
        start = len(grid)
        grid.extend({} for _ in rows)
        for offset, row in enumerate(rows):
            index = start + offset
            column = 0
            cells = row.find_all(["td", "th"], recursive=False)
            header = group == "thead" or (bool(cells) and all(c.name == "th" for c in cells))
            if index == headers and header:
                headers += 1
            for cell in cells:
                while column in grid[index]:
                    column += 1
                across = _span(cell, "colspan", MAX_COLUMNS)
                down = _span(cell, "rowspan", len(rows) - offset)
                # Malformed overlapping spans move forward until the current row has room.
                for occupied in sorted(grid[index]):
                    if column <= occupied < column + across:
                        column = occupied + 1
                if column >= MAX_COLUMNS:
                    break
                across = min(across, MAX_COLUMNS - column)
                text = render(cell)
                originals.append(
                    TableCell(
                        row=index,
                        column=column,
                        rowspan=down,
                        colspan=across,
                        header=cell.name == "th",
                        row_group=group,
                        text=text,
                    )
                )
                for target in grid[index : index + down]:
                    for slot in range(column, column + across):
                        target.setdefault(slot, text)
                column += across
                width = max(width, column)
    return tuple(tuple(row.get(column, "") for column in range(width)) for row in grid), headers, tuple(originals)
