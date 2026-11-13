"""Typed extraction contracts: segments, diagnostics and the neutral result every extractor returns.

Extractors never touch a database. The wire form (`encode/wire.py`) matches the shared ExtractionResult contract.
"""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict

from mzizi_extraction.core.json_value import JsonValue


class Frozen(BaseModel):
    """Base for every contract in this package: immutable, strictly typed, no unknown fields."""

    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")


class Status(StrEnum):
    SUCCEEDED = "succeeded"
    PARTIAL = "partial"
    FAILED = "failed"


class Level(StrEnum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"


class Code(StrEnum):
    TOO_LARGE = "too_large"
    NOT_UTF8 = "not_utf8"
    EMPTY = "empty"
    RAGGED_ROW = "ragged_row"
    INVALID_JSON = "invalid_json"
    NOT_GEOJSON = "not_geojson"
    NO_GEOMETRY = "no_geometry"
    BAD_GEOMETRY = "bad_geometry"
    EMPTY_GEOMETRY = "empty_geometry"
    INVALID_GEOMETRY = "invalid_geometry"
    OUTSIDE_WGS84_RANGE = "outside_wgs84_range"
    NOT_POLYGONAL = "not_polygonal"
    DUPLICATE_NAME = "duplicate_name"
    CRS_NOT_WGS84 = "crs_not_wgs84"
    FEATURES_READ = "features_read"
    NOT_PDF = "not_pdf"
    UNREADABLE_PDF = "unreadable_pdf"
    PAGES = "pages"
    TOO_MANY_PAGES = "too_many_pages"
    OCR_ENGINE_UNAVAILABLE = "ocr_engine_unavailable"
    OCR_FAILED = "ocr_failed"
    OCR_NO_TEXT = "ocr_no_text"
    OCR_LOW_CONFIDENCE = "ocr_low_confidence"
    OCR_REQUIRED = "ocr_required"
    OCR = "ocr"
    TABLE_EXTRACTION_FAILED = "table_extraction_failed"
    TABLE_PAGE_LIMIT = "table_page_limit"
    TABLES = "tables"
    TEXT_PAGES = "text_pages"


class Locator(Frozen):
    """Where in the input a segment or diagnostic comes from. Unused parts stay unset."""

    page: int | None = None
    table: int | None = None
    feature: int | None = None
    line: int | None = None
    ocr: bool | None = None


class Diagnostic(Frozen):
    level: Level
    code: Code
    message: str
    locator: Locator | None = None


class SegmentKind(StrEnum):
    TEXT = "text"
    TABLE = "table"
    FEATURE = "feature"
    ROW = "row"
    RECORD = "record"


class OcrMethod(Frozen):
    engine: str
    version: str
    languages: str


class TextContent(Frozen):
    text: str
    ocr: OcrMethod | None = None
    mean_confidence: float | None = None


class TableContent(Frozen):
    rows: tuple[tuple[str, ...], ...]
    bbox: tuple[float, float, float, float]


class FeatureContent(Frozen):
    properties: dict[str, JsonValue]
    geometry: dict[str, JsonValue]
    bounds: tuple[float, float, float, float]
    name: str | None


class RowContent(Frozen):
    cells: dict[str, str]


class RecordContent(Frozen):
    value: JsonValue


type Content = TextContent | TableContent | FeatureContent | RowContent | RecordContent


class Segment(Frozen):
    key: str
    kind: SegmentKind
    locator: Locator
    content: Content
    confidence: float


class Output(Frozen):
    status: Status
    segments: tuple[Segment, ...] = ()
    diagnostics: tuple[Diagnostic, ...] = ()
