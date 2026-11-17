"""Typed HTTP inputs and review output for a PDF table draft."""

from typing import Annotated, Literal, Self

from pydantic import Field, model_validator

from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.runs.artifacts import ArtifactMetadata, ArtifactRef
from mzizi_engine.runtime.runs.contracts.spec import NonEmpty
from mzizi_extraction.core import Diagnostic, Limits, Status
from mzizi_extraction.document.table_models import BBox


class DraftLookup(Frozen):
    reference: ArtifactRef
    source_heading: NonEmpty
    name_column: NonEmpty
    code_column: NonEmpty
    target_column: NonEmpty
    target_table: NonEmpty


class DraftBinding(Frozen):
    source_heading: NonEmpty
    target_column: NonEmpty


class TableDraftRequest(Frozen):
    source: ArtifactRef
    first_page: int = Field(ge=1)
    last_page: int = Field(ge=1)
    headings: Annotated[tuple[NonEmpty, ...], Field(min_length=2, strict=False)]
    target_table: NonEmpty
    languages: NonEmpty
    lookup: DraftLookup
    bindings: tuple[DraftBinding, ...] = Field(default=(), strict=False)

    @model_validator(mode="after")
    def check_selection(self) -> Self:
        if not 1 <= self.last_page - self.first_page + 1 <= Limits().table_page_limit:
            raise ValueError("Invalid or oversized page selection")
        if len(set(self.headings)) != len(self.headings):
            raise ValueError("Headings must be unique")
        if any(heading in self.headings for heading in ("page", "table", "row", self.lookup.target_column)):
            raise ValueError("Headings collide with draft export columns")
        return self


class TableLocator(Frozen):
    page: int
    table: int
    row: int
    bbox: BBox


class DraftIssue(Frozen):
    kind: Literal["target_gap", "required", "unresolved", "ambiguous", "invalid_value", "structure"]
    detail: str
    locator: TableLocator | None = None


class DraftRow(Frozen):
    locator: TableLocator
    source_cells: tuple[str, ...]
    resolved_code: str | None


class TableDraftReport(Frozen):
    source: ArtifactMetadata
    reference: ArtifactMetadata
    catalog_sha256: str
    target_table: str
    extraction_status: Status
    diagnostics: tuple[Diagnostic, ...]
    issues: tuple[DraftIssue, ...]
    rows: tuple[DraftRow, ...]
    csv: str
