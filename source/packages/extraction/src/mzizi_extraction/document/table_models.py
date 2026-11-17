"""Typed expectations and review evidence for competing PDF table layouts."""

from __future__ import annotations

from enum import StrEnum
from typing import Annotated, Self

from pydantic import Field, StringConstraints, model_validator

from mzizi_extraction.core import Frozen

type BBox = tuple[float, float, float, float]
type TableRows = tuple[tuple[str, ...], ...]
type NonBlank = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class ColumnType(StrEnum):
    TEXT = "text"
    INTEGER = "integer"
    NUMBER = "number"
    DATE = "date"
    QUANTITY = "quantity"


class TableColumn(Frozen):
    name: NonBlank
    aliases: tuple[NonBlank, ...] = ()
    type: ColumnType = ColumnType.TEXT
    required: bool = False
    units: tuple[NonBlank, ...] = ()

    @model_validator(mode="after")
    def validate_units(self) -> Self:
        if bool(self.units) != (self.type is ColumnType.QUANTITY):
            raise ValueError("quantity columns require units, and units apply only to quantity columns")
        return self


class TableSchema(Frozen):
    columns: tuple[TableColumn, ...] = Field(min_length=2)
    header_rows: int = Field(default=1, ge=1, le=5)

    @model_validator(mode="after")
    def unique_columns(self) -> Self:
        if len({column.name.casefold() for column in self.columns}) != len(self.columns):
            raise ValueError("column names must be unique")
        return self


class TableStrategy(StrEnum):
    RULES = "lines"
    STRICT = "lines_strict"
    TEXT = "text"
    OCR_GRID = "ocr_grid"


class ReviewReason(StrEnum):
    OCR_TEXT = "ocr_text_requires_review"
    CLOSE_SCORES = "close_scores"
    LOW_QUALITY = "low_quality"
    OVERLAPPING_REGIONS = "overlapping_regions"
    ROW_COVERAGE = "row_coverage_disagrees"
    SCHEMA = "schema_mismatch"
    SOURCE_COVERAGE = "low_source_word_coverage"
    DUPLICATE_SOURCE = "source_words_assigned_to_multiple_cells"
    TEXT_WITHOUT_SCHEMA = "text_alignment_without_matching_schema"
    PROSE_LIKE = "content_reads_as_running_text"
    TOTALS_MISMATCH = "totals_do_not_add_up"


class ColumnMetrics(Frozen):
    index: int
    header: str
    value_type: ColumnType | None
    filled_rows: int
    type_consistency: float
    missing_required_rows: tuple[int, ...] = ()
    invalid_rows: tuple[int, ...] = ()


class TableMetrics(Frozen):
    header_quality: float
    row_consistency: float
    sparse_columns: int
    empty_body_share: float
    type_consistency: float
    missing_required: int
    invalid_values: int
    schema_headers_match: bool | None
    word_coverage: float
    split_word_share: float
    duplicate_word_share: float
    columns: tuple[ColumnMetrics, ...]


class TableCandidateReport(Frozen):
    strategy: TableStrategy
    bbox: BBox
    row_count: int
    column_count: int
    score: float
    metrics: TableMetrics
    rows: TableRows | None = None


class TableDecision(Frozen):
    page: int
    table: int
    selected: TableStrategy
    review_required: bool
    reasons: tuple[ReviewReason, ...]
    candidates: tuple[TableCandidateReport, ...]


class TableReviewReport(Frozen):
    table_schema: TableSchema | None
    tables: tuple[TableDecision, ...]
