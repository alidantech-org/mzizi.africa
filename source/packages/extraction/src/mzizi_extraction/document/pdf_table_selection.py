"""Find competing layouts in the same part of a PDF page and record why one was preferred."""

from __future__ import annotations

from dataclasses import dataclass

import pdfplumber.page
from pdfplumber.table import Table

from mzizi_extraction.core import Code, Diagnostic, Locator, warning
from mzizi_extraction.document.lines import Word
from mzizi_extraction.document.table_gate import looks_like_prose, totals_mismatch
from mzizi_extraction.document.table_models import (
    BBox,
    ReviewReason,
    TableCandidateReport,
    TableDecision,
    TableMetrics,
    TableRows,
    TableSchema,
    TableStrategy,
)
from mzizi_extraction.document.table_quality import geometry, intersection, layout_score, table_metrics
from mzizi_extraction.pdf.tables import clean_table

SAME_REGION_SHARE = 0.48
CONTAINED_REGION_SHARE = 0.85
BOTTOM_ALIGNMENT_POINTS = 5.0
CONFLICT_REGION_SHARE = 0.25
MIN_QUALITY = 0.82
MIN_WORD_COVERAGE = 0.9
MIN_TYPE_CONSISTENCY = 0.85
CLOSE_SCORE_MARGIN = 0.07
MIN_TEXT_WORDS = 12
MIN_TEXT_BODY_ROWS = 3
MIN_EXTRA_WORDS = 3
MAX_TEXT_RETRIES_PER_PAGE = 8
# A real column edge falls between words. Text alignment that cuts through words is reading prose, not a table.
MAX_TEXT_SPLIT_SHARE = 0.05


@dataclass(frozen=True)
class Candidate:
    strategy: TableStrategy
    box: BBox
    rows: TableRows
    metrics: TableMetrics
    score: float

    def report(self, include_rows: bool) -> TableCandidateReport:
        return TableCandidateReport(
            strategy=self.strategy,
            bbox=self.box,
            row_count=len(self.rows),
            column_count=len(self.rows[0]),
            score=round(self.score, 4),
            metrics=self.metrics,
            rows=self.rows if include_rows else None,
        )


@dataclass(frozen=True)
class Selection:
    candidate: Candidate
    decision: TableDecision


def _keep_text_edge_words(table: Table, words: list[Word]) -> Table:
    """Word alignment can end inside an unaligned word at the right edge of a table."""
    right = table.bbox[2]
    crossing = [word for word in words if word.x0 < right < word.x1]
    if not crossing:
        return table
    cells: list[BBox] = []
    for left, top, edge, bottom in table.cells:
        if edge == right:
            edge = max(
                (word.x1 for word in crossing if left <= word.x0 and top <= word.center[1] < bottom),
                default=edge,
            )
        cells.append((left, top, edge, bottom))
    return Table(table.page, cells)


def _candidates(
    page: pdfplumber.page.Page,
    words: list[Word],
    strategy: TableStrategy,
    schema: TableSchema | None,
    number: int,
    diagnostics: list[Diagnostic],
) -> list[Candidate]:
    candidates: list[Candidate] = []
    header_count = schema.header_rows if schema else 1
    text_mode = strategy is TableStrategy.TEXT
    try:
        tables = page.find_tables({"vertical_strategy": strategy.value, "horizontal_strategy": strategy.value})
        for table in tables:
            if text_mode:
                table = _keep_text_edge_words(table, words)
            rows: TableRows = tuple(tuple(row) for row in clean_table(table.extract()))
            if len(rows) <= header_count or len(rows[0]) < 2:
                continue
            box: BBox = table.bbox
            cells: tuple[tuple[BBox, ...], ...] = tuple(
                tuple(cell for cell in row.cells if cell is not None) for row in table.rows
            )
            coverage, split_share, duplicate_share = geometry(box, cells, words)
            metrics = table_metrics(rows, coverage, split_share, duplicate_share, schema)
            body_rows = len(rows) - header_count
            prose = looks_like_prose(rows)
            if (text_mode and (metrics.split_word_share > MAX_TEXT_SPLIT_SHARE or prose)) or (
                prose and metrics.split_word_share > MAX_TEXT_SPLIT_SHARE
            ):
                continue  # prose guard: the region stays paragraph text
            if (
                text_mode
                and not metrics.schema_headers_match
                and (body_rows < MIN_TEXT_BODY_ROWS or metrics.sparse_columns == len(rows[0]) - 1)
            ):
                continue
            candidates.append(
                Candidate(strategy, box, rows, metrics, layout_score(metrics, len(rows[0]), body_rows, text_mode))
            )
    except Exception as problem:  # One detector's failure need not prevent the others or the page text.
        diagnostics.append(
            warning(Code.TABLE_EXTRACTION_FAILED, f"{strategy.value}: {str(problem)[:150]}", Locator(page=number))
        )
    return candidates


def _region_similarity(a: BBox, b: BBox) -> float:
    shared = intersection(a, b)
    areas = (intersection(a, a), intersection(b, b))
    if abs(a[3] - b[3]) <= BOTTOM_ALIGNMENT_POINTS and shared >= CONTAINED_REGION_SHARE * min(areas):
        return (1 + shared / max(*areas, 1.0)) / 2
    return shared / max(*areas, 1.0)


def _regions(candidates: list[Candidate]) -> list[list[Candidate]]:
    groups: list[list[Candidate]] = []
    for candidate in candidates:
        best: list[Candidate] | None = None
        best_overlap = SAME_REGION_SHARE
        for group in groups:
            if any(member.strategy is candidate.strategy for member in group):
                continue
            overlap = max(_region_similarity(member.box, candidate.box) for member in group)
            if overlap >= best_overlap:
                best, best_overlap = group, overlap
        if best is None:
            groups.append([candidate])
        else:
            best.append(candidate)
    return groups


def _strong(candidate: Candidate) -> bool:
    m = candidate.metrics
    return (
        candidate.score >= MIN_QUALITY
        and m.schema_headers_match is not False
        and m.word_coverage >= MIN_WORD_COVERAGE
        and m.duplicate_word_share == 0
        and m.type_consistency >= MIN_TYPE_CONSISTENCY
    )


def _potential_row_loss(winner: Candidate, other: Candidate, words: list[Word]) -> bool:
    if other.strategy is TableStrategy.TEXT or len(other.rows) <= len(winner.rows):
        return False
    x0, _, x1, bottom = winner.box
    below = sum(x0 < x < x1 and bottom < y <= other.box[3] for x, y in (word.center for word in words))
    return below >= MIN_EXTRA_WORDS


def _review(group: list[Candidate], winners: list[Candidate], words: list[Word]) -> tuple[ReviewReason, ...]:
    winner, *others = group
    reasons: list[ReviewReason] = []
    if winner.score < MIN_QUALITY:
        reasons.append(ReviewReason.LOW_QUALITY)
    metrics = winner.metrics
    if metrics.word_coverage < MIN_WORD_COVERAGE:
        reasons.append(ReviewReason.SOURCE_COVERAGE)
    if metrics.duplicate_word_share > 0:
        reasons.append(ReviewReason.DUPLICATE_SOURCE)
    if metrics.schema_headers_match is False or metrics.missing_required or metrics.invalid_values:
        reasons.append(ReviewReason.SCHEMA)
    if winner.strategy is TableStrategy.TEXT and not metrics.schema_headers_match:
        reasons.append(ReviewReason.TEXT_WITHOUT_SCHEMA)
    if looks_like_prose(winner.rows):
        reasons.append(ReviewReason.PROSE_LIKE)
    if totals_mismatch(winner.rows):
        reasons.append(ReviewReason.TOTALS_MISMATCH)
    if any(abs(winner.score - other.score) < CLOSE_SCORE_MARGIN and winner.rows != other.rows for other in others):
        reasons.append(ReviewReason.CLOSE_SCORES)
    if any(_potential_row_loss(winner, other, words) for other in others):
        reasons.append(ReviewReason.ROW_COVERAGE)
    if any(
        candidate is not winner
        and intersection(winner.box, candidate.box)
        > CONFLICT_REGION_SHARE * min(intersection(winner.box, winner.box), intersection(candidate.box, candidate.box))
        for candidate in winners
    ):
        reasons.append(ReviewReason.OVERLAPPING_REGIONS)
    return tuple(reasons)


def select_pdf_tables(
    page: pdfplumber.page.Page,
    words: list[Word],
    schema: TableSchema | None,
    number: int,
    diagnostics: list[Diagnostic],
) -> list[Selection]:
    ruled = _candidates(page, words, TableStrategy.RULES, schema, number, diagnostics)
    strict = _candidates(page, words, TableStrategy.STRICT, schema, number, diagnostics)
    groups = _regions(ruled + strict)
    _add_text_candidates(page, words, schema, number, diagnostics, groups)
    for group in groups:
        _rank(group)
    groups.sort(key=lambda group: (group[0].box[1], group[0].box[0]))
    winners = [group[0] for group in groups]
    selections: list[Selection] = []
    for index, group in enumerate(groups, start=1):
        reasons = _review(group, winners, words)
        winner = group[0]
        selections.append(
            Selection(
                winner,
                TableDecision(
                    page=number,
                    table=index,
                    selected=winner.strategy,
                    review_required=bool(reasons),
                    reasons=reasons,
                    candidates=tuple(candidate.report(bool(reasons)) for candidate in group),
                ),
            )
        )
    return selections


def _rank(group: list[Candidate]) -> None:
    group.sort(key=lambda item: item.score, reverse=True)
    best = group[0]
    if best.strategy is not TableStrategy.TEXT:
        return
    ruled = next((item for item in group if item.strategy is not TableStrategy.TEXT), None)
    if (
        ruled is not None
        and best.score - ruled.score < CLOSE_SCORE_MARGIN
        and best.metrics.schema_headers_match == ruled.metrics.schema_headers_match
    ):
        group.remove(ruled)
        group.insert(0, ruled)


def _uncovered_bands(bbox: BBox, tables: list[BBox]) -> list[BBox]:
    """Limit text detection to areas between ruled tables, so it cannot duplicate their contents."""
    left, start, right, end = bbox
    bands: list[BBox] = []
    for box in sorted(tables, key=lambda box: box[1]):
        if start < box[1] < end:
            bands.append((left, start, right, box[1]))
        start = min(end, max(start, box[3]))
    if start < end:
        bands.append((left, start, right, end))
    return bands


def _add_text_candidates(
    page: pdfplumber.page.Page,
    words: list[Word],
    schema: TableSchema | None,
    number: int,
    diagnostics: list[Diagnostic],
    groups: list[list[Candidate]],
) -> None:
    winners = [max(group, key=lambda item: item.score) for group in groups]
    targets = [(best.box, group) for best, group in zip(winners, groups, strict=True) if not _strong(best)]
    targets.extend((box, []) for box in _uncovered_bands(page.bbox, [winner.box for winner in winners]))
    attempted = 0
    for box, group in targets:
        region_words = [word for word in words if box[0] < word.center[0] < box[2] and box[1] < word.center[1] < box[3]]
        if len(region_words) < MIN_TEXT_WORDS:
            continue
        if attempted >= MAX_TEXT_RETRIES_PER_PAGE:
            diagnostics.append(
                warning(Code.TABLE_REVIEW, "text-alignment retry limit reached on this page", Locator(page=number))
            )
            break
        attempted += 1
        region = page if box == page.bbox else page.crop(box, strict=False)
        text = _candidates(region, region_words, TableStrategy.TEXT, schema, number, diagnostics)
        if group:
            comparable = [
                candidate for candidate in text if _region_similarity(candidate.box, box) >= SAME_REGION_SHARE
            ]
            if comparable:
                group.append(max(comparable, key=lambda item: item.score))
        else:
            groups.extend([candidate] for candidate in text)
