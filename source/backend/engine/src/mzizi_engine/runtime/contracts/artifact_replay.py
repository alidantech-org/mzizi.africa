"""Typed expectations for replaying one pinned run artifact."""

from typing import Annotated, Literal

from pydantic import Field

from mzizi_crawler import CellCheck, ReplayReport, SelectorCheck
from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.runs.artifacts import ArtifactMetadata, ArtifactRef


class HtmlChecks(Frozen):
    kind: Literal["html"]
    selectors: tuple[SelectorCheck, ...] = Field(default=(), strict=False)
    cells: tuple[CellCheck, ...] = Field(default=(), strict=False)


class PdfChecks(Frozen):
    kind: Literal["pdf"]
    pages: int | None = Field(default=None, ge=1)
    cells: tuple[CellCheck, ...] = Field(default=(), strict=False)


class ArtifactReplayRequest(Frozen):
    artifact: ArtifactRef
    checks: Annotated[HtmlChecks | PdfChecks, Field(discriminator="kind")]


class ArtifactReplayReport(Frozen):
    evidence: ArtifactMetadata
    report: ReplayReport
