"""Beneficiaries: one row of beneficiaries."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class BeneficiariesRow(BaseModel):
    """Who or what benefits from one project, procurement or contract: a facility, a place, an organisation or a population group, with the kind of benefit. The buyer and the supplier are not beneficiaries; they are separate roles."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "civic.beneficiaries"

    benefit_kind_id: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    contract_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    procurement_id: UUID | None = None
    project_id: UUID | None = None
    share_percent: Annotated[float, Field(ge=0, le=100)] | None = None
    source_citation_id: UUID | None = None
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
