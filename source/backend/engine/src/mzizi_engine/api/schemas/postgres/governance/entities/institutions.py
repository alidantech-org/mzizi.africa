"""Institutions: one row of institutions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind
from mzizi_engine.api.schemas.postgres.shared.enums.institution_arm import InstitutionArm
from mzizi_engine.api.schemas.postgres.shared.enums.institution_basis import InstitutionBasis


class InstitutionsRow(BaseModel):
    """A public institution; it shares its organisation's identity (`official.entities`). Committees are institutions linked to their house."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.institutions"

    arm: InstitutionArm | None = None
    basis: InstitutionBasis | None = None
    class_term: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    ends_on: date | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_kind: IdentityKind
    kind_term: UUID
    starts_on: date | None = None
    template_id: UUID | None = None
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
