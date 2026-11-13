"""Reading order: detect a column gutter and split text rows into column lines and full-width lines."""

from __future__ import annotations

from dataclasses import dataclass

from mzizi_extraction.document.lines import Line, Word, cluster_rows, words_to_line

MIN_GUTTER_POINTS = 10.0
SEARCH_FROM, SEARCH_TO = 0.3, 0.7
SPANNING_ROW_SHARE = 0.12  # a gutter may be crossed by up to this share of rows (titles, wide headings)
MIN_SIDE_SHARE = 0.2


@dataclass(frozen=True)
class Gutter:
    left: float
    right: float

    @property
    def middle(self) -> float:
        return (self.left + self.right) / 2


def find_gutter(rows: list[list[Word]], page_width: float) -> Gutter | None:
    """A vertical empty band between two text columns, or None for single-column pages."""
    if len(rows) < 8:
        return None
    start, stop = int(page_width * SEARCH_FROM), int(page_width * SEARCH_TO)
    crossings = [0] * (stop - start + 1)
    for row in rows:
        covered: set[int] = set()
        for word in row:
            for x in range(max(int(word.x0), start), min(int(word.x1), stop) + 1):
                covered.add(x - start)
        for x in covered:
            crossings[x] += 1
    limit = max(1, int(SPANNING_ROW_SHARE * len(rows)))
    best: tuple[int, int] | None = None
    run_start: int | None = None
    for index, count in enumerate([*crossings, limit + 1]):
        if count <= limit and run_start is None:
            run_start = index
        elif count > limit and run_start is not None:
            if best is None or index - run_start > best[1] - best[0]:
                best = (run_start, index)
            run_start = None
    if best is None or best[1] - best[0] < MIN_GUTTER_POINTS:
        return None
    gutter = Gutter(start + best[0], start + best[1])
    left = sum(1 for r in rows for w in r if w.x1 <= gutter.middle)
    right = sum(1 for r in rows for w in r if w.x0 >= gutter.middle)
    total = left + right
    if total == 0 or min(left, right) / total < MIN_SIDE_SHARE:
        return None
    return Gutter(gutter.left, gutter.right)


def build_lines(words: list[Word], gutter: Gutter | None) -> list[tuple[Line, int]]:
    """Lines with their column (0, 1, or -1 when the line spans the gutter or the page has one column)."""
    result: list[tuple[Line, int]] = []
    for row in cluster_rows(words):
        if gutter is None or any(w.x0 < gutter.left and w.x1 > gutter.right for w in row):
            result.append((words_to_line(row, 0), -1))
            continue
        left = [w for w in row if w.x1 <= gutter.middle]
        right = [w for w in row if w.x1 > gutter.middle]
        if left:
            result.append((words_to_line(left, 0), 0))
        if right:
            result.append((words_to_line(right, 0), 1))
    return result


def reading_order(items: list[tuple[float, float, int, object]]) -> list[tuple[int, object]]:
    """Orders `(top, bottom, column, payload)` items: full-width items split the page into bands; each band reads the
    left column, then the right. Returns `(group, payload)`; items of one group may merge into a paragraph."""
    ordered = sorted(items, key=lambda i: (i[0], i[2]))
    output: list[tuple[int, object]] = []
    band: list[tuple[float, float, int, object]] = []
    group = 0

    def flush() -> None:
        nonlocal group
        for column in (0, 1):
            members = [i for i in band if i[2] == column]
            if members:
                group += 1
                output.extend((group, i[3]) for i in sorted(members, key=lambda i: i[0]))
        band.clear()

    full_group: int | None = None
    for item in ordered:
        if item[2] == -1:
            flush()
            if full_group is None or output[-1][0] != full_group:
                group += 1
                full_group = group
            output.append((full_group, item[3]))
        else:
            band.append(item)
    flush()
    return output
