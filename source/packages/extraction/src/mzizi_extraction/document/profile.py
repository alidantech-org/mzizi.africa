"""What a caller asks of structured extraction."""

from __future__ import annotations

from enum import StrEnum
from typing import Self

from pydantic import model_validator

from mzizi_extraction.core import Frozen, Limits
from mzizi_extraction.document.table_models import TableSchema


class OcrMode(StrEnum):
    AUTO = "auto"  # OCR only pages with no usable text layer
    OFF = "off"
    FORCE = "force"  # OCR every page


class DocumentProfile(Frozen):
    ocr: OcrMode = OcrMode.AUTO
    languages: str = "eng"
    tables: bool = True
    strict_table_lines: bool = False  # Ignore rectangle edges when detecting a ruled table.
    auto_tables: bool = False
    table_schema: TableSchema | None = None
    figures: bool = True
    page_renders: bool = False
    #: Caption words in the document's language ("Figure", "Table", ...). Supplied by the caller; empty means the
    #: caption is found by position and style alone.
    caption_labels: tuple[str, ...] = ()
    limits: Limits = Limits()

    @model_validator(mode="after")
    def validate_table_mode(self) -> Self:
        if self.strict_table_lines and (self.auto_tables or self.table_schema is not None):
            raise ValueError("strict_table_lines conflicts with automatic table selection")
        if not self.tables and (self.auto_tables or self.table_schema is not None):
            raise ValueError("automatic table selection requires table extraction")
        return self

    @property
    def compare_tables(self) -> bool:
        return self.auto_tables or self.table_schema is not None
