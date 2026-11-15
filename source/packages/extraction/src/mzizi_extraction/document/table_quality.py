"""Score a detected grid using geometry and typed column expectations."""

from __future__ import annotations

from collections import Counter
from datetime import date
from decimal import Decimal, InvalidOperation
from statistics import mean

from mzizi_extraction.document.lines import Word
from mzizi_extraction.document.table_models import (
    BBox,
    ColumnMetrics,
    ColumnType,
    TableColumn,
    TableMetrics,
    TableRows,
    TableSchema,
)

SPARSE_COLUMN_SHARE = 1 / 3
WORD_SPLIT_SHARE = 0.2


def intersection(a: BBox, b: BBox) -> float:
    return max(0.0, min(a[2], b[2]) - max(a[0], b[0])) * max(0.0, min(a[3], b[3]) - max(a[1], b[1]))


def geometry(bbox: BBox, cells_by_row: tuple[tuple[BBox, ...], ...], words: list[Word]) -> tuple[float, float, float]:
    """Check that words inside a candidate grid land in cells and edges do not cut across them."""
    by_row = sorted((min(c[1] for c in row), max(c[3] for c in row), row) for row in cells_by_row if row)
    inside = placed = split = duplicate = 0
    for word in words:
        x, y = word.center
        if not (bbox[0] <= x < bbox[2] and bbox[1] <= y < bbox[3]):
            continue
        inside += 1
        word_box = (word.x0, word.top, word.x1, word.bottom)
        overlaps: list[float] = []
        assignments = 0
        for top, bottom, row in by_row:
            if top >= word.bottom:
                break
            if bottom > word.top:
                overlaps.extend(intersection(word_box, cell) for cell in row)
                assignments += sum(cell[0] <= x < cell[2] and cell[1] <= y < cell[3] for cell in row)
        area = intersection(word_box, word_box)
        placed += area > 0 and sum(overlaps) >= area * (1 - WORD_SPLIT_SHARE)
        split += area > 0 and sum(overlap > area * WORD_SPLIT_SHARE for overlap in overlaps) > 1
        duplicate += assignments > 1
    return placed / max(1, inside), split / max(1, inside), duplicate / max(1, inside)


def _number(value: str) -> Decimal | None:
    try:
        number = Decimal(value.strip())
    except InvalidOperation:
        return None
    return number if number.is_finite() else None


def _date(value: str) -> bool:
    try:
        date.fromisoformat(value)
    except ValueError:
        return False
    return True


def _value_type(value: str, column: TableColumn) -> bool:
    if column.type is ColumnType.TEXT:
        return True
    if column.type is ColumnType.DATE:
        return _date(value)
    if column.type is ColumnType.QUANTITY:
        lowered = value.casefold()
        units = (unit.casefold() for unit in column.units)
        return any(lowered.endswith(unit) and _number(lowered[: -len(unit)]) is not None for unit in units)
    number = _number(value)
    return number is not None and (column.type is ColumnType.NUMBER or number == number.to_integral_value())


def _inferred_type(value: str) -> ColumnType:
    if _number(value) is not None:
        return ColumnType.NUMBER
    return ColumnType.DATE if _date(value) else ColumnType.TEXT


def _column_metrics(
    index: int, header: str, values: tuple[str, ...], first_row: int, expected: TableColumn | None
) -> ColumnMetrics:
    filled = sum(bool(value) for value in values)
    if expected is not None:
        missing = tuple(row for row, value in enumerate(values, first_row) if expected.required and not value)
        invalid = tuple(
            row for row, value in enumerate(values, first_row) if value and not _value_type(value, expected)
        )
        return ColumnMetrics(
            index=index,
            header=header,
            value_type=expected.type,
            filled_rows=filled,
            type_consistency=1 - len(invalid) / max(1, filled),
            missing_required_rows=missing,
            invalid_rows=invalid,
        )
    types = Counter(_inferred_type(value) for value in values if value)
    dominant, count = types.most_common(1)[0] if types else (None, 0)
    return ColumnMetrics(
        index=index, header=header, value_type=dominant, filled_rows=filled, type_consistency=count / max(1, filled)
    )


def table_metrics(
    rows: TableRows,
    word_coverage: float,
    split_word_share: float,
    duplicate_word_share: float,
    schema: TableSchema | None,
) -> TableMetrics:
    width = len(rows[0])
    header_count = schema.header_rows if schema else 1
    header = tuple(" ".join(cell for cell in col if cell) for col in zip(*rows[:header_count], strict=True))
    body = rows[header_count:]
    columns = tuple(zip(*body, strict=True)) if body else ((),) * width
    headers_match: bool | None = None
    if schema:
        headers_match = (
            bool(body)
            and width == len(schema.columns)
            and all(
                name.casefold() in {title.casefold() for title in (column.name, *column.aliases)}
                for name, column in zip(header, schema.columns, strict=True)
            )
        )
    checks = tuple(
        _column_metrics(
            index, name, values, header_count + 1, schema.columns[index - 1] if schema and headers_match else None
        )
        for index, (name, values) in enumerate(zip(header, columns, strict=True), start=1)
    )
    occupied = sum(check.filled_rows for check in checks)
    fill_counts = Counter(sum(bool(cell) for cell in row) for row in body)
    return TableMetrics(
        header_quality=len({name.casefold() for name in header if name}) / width,
        row_consistency=max(fill_counts.values(), default=0) / max(1, len(body)),
        sparse_columns=sum(check.filled_rows < SPARSE_COLUMN_SHARE * len(body) for check in checks),
        empty_body_share=1 - occupied / max(1, len(body) * width),
        type_consistency=mean(check.type_consistency for check in checks),
        missing_required=sum(len(check.missing_required_rows) for check in checks),
        invalid_values=sum(len(check.invalid_rows) for check in checks),
        schema_headers_match=headers_match,
        word_coverage=word_coverage,
        split_word_share=split_word_share,
        duplicate_word_share=duplicate_word_share,
        columns=checks,
    )


def layout_score(metrics: TableMetrics, width: int, body_rows: int, strategy_is_text: bool) -> float:
    """Heuristic preference. A score difference is not a calibrated probability."""
    geometry_score = 0.20 * metrics.word_coverage + 0.25 * (1 - metrics.split_word_share - metrics.duplicate_word_share)
    shape_score = 0.25 * metrics.header_quality + 0.08 * metrics.row_consistency
    values_score = 0.12 * metrics.type_consistency + 0.10 * (1 - metrics.empty_body_share)
    sparse_penalty = 0.15 * metrics.sparse_columns / width
    schema_bonus = 0.25 if metrics.schema_headers_match else 0.0
    required_penalty = 0.4 * metrics.missing_required / max(1, width * body_rows)
    text_penalty = 0.06 if strategy_is_text else 0.0
    return geometry_score + shape_score + values_score + schema_bonus - sparse_penalty - required_penalty - text_penalty
