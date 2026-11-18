"""Caller-selected native PDF table geometry; no publisher names or automatic content matching."""

from typing import Self

from pydantic import Field, model_validator

from mzizi_extraction.core import Frozen
from mzizi_extraction.document.table_models import BBox


class PositionedColumn(Frozen):
    name: str = Field(min_length=1)
    left: float = Field(ge=0)
    right: float = Field(gt=0)
    remove_characters: str = ""
    trim_characters: str = ""

    @model_validator(mode="after")
    def ordered(self) -> Self:
        if self.left >= self.right:
            raise ValueError("Column bounds must be ordered")
        return self


class PositionedTable(Frozen):
    page: int = Field(ge=1)
    bbox: BBox = Field(strict=False)
    columns: tuple[PositionedColumn, ...] = Field(min_length=2, strict=False)
    row_tolerance: float = Field(default=2.0, gt=0, le=10)
    label_left: float | None = Field(default=None, ge=0)
    label_right: float | None = Field(default=None, ge=0)

    @model_validator(mode="after")
    def ordered(self) -> Self:
        left, top, right, bottom = self.bbox
        if not (0 <= left < right and 0 <= top < bottom):
            raise ValueError("Table region must have positive ordered bounds")
        if len({c.name for c in self.columns}) != len(self.columns):
            raise ValueError("Column names must be unique")
        if any(c.left < left or c.right > right for c in self.columns):
            raise ValueError("Columns must fit inside the table region")
        if any(a.right > b.left for a, b in zip(self.columns, self.columns[1:], strict=False)):
            raise ValueError("Columns must be ordered and must not overlap")
        if (self.label_left is None) != (self.label_right is None):
            raise ValueError("Both row-label bounds must be supplied together")
        if self.label_left is not None and self.label_right is not None and self.label_left >= self.label_right:
            raise ValueError("Row-label bounds must be ordered")
        return self
