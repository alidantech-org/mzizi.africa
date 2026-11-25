"""Evidence: one row of evidence."""

from __future__ import annotations

import builtins
from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable
from mzizi_engine.api.schemas.postgres.source.enums.evidence_method import EvidenceMethod
from mzizi_engine.api.schemas.postgres.source.enums.evidence_role import EvidenceRole


class EvidenceRow(BaseModel):
    """The provenance linking table: which citation supports, or contradicts, which row. No foreign key on the subject by design; soft-deleted rows keep their evidence."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "source.evidence"

    citation_id: UUID
    confidence: Annotated[float, Field(ge=0, le=1)] | None = None
    created_at: datetime
    fields: builtins.list[Annotated[str, Field(min_length=1, max_length=63)]] | None = None
    id: UUID
    method: EvidenceMethod
    observed_at: datetime | None = None
    recorded_at: datetime
    role: EvidenceRole
    subject_id: UUID
    subject_table: SubjectTable
