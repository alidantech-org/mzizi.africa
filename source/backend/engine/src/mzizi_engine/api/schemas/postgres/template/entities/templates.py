"""Templates: one row of templates."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.contact_kind import ContactKind
from mzizi_engine.api.schemas.postgres.shared.enums.contact_visibility import ContactVisibility
from mzizi_engine.api.schemas.postgres.shared.enums.election_status import ElectionStatus
from mzizi_engine.api.schemas.postgres.shared.enums.identity_kind import IdentityKind
from mzizi_engine.api.schemas.postgres.shared.enums.institution_arm import InstitutionArm
from mzizi_engine.api.schemas.postgres.shared.enums.selection_method import SelectionMethod
from mzizi_engine.api.schemas.postgres.template.enums.count_kind import CountKind
from mzizi_engine.api.schemas.postgres.template.enums.product import Product
from mzizi_engine.api.schemas.postgres.template.enums.scope import Scope


class TemplatesRow(BaseModel):
    """The recipe for one kind of row: what it creates, over which places or items, how many, and with which attributes. Its names are `identity.names`; texts for codes, names, domains and contact values are `template.texts`."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "template.templates"

    arm: InstitutionArm | None = None
    basis_term: UUID | None = None
    class_term: UUID | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    confidence: Annotated[float, Field(ge=0, le=1)] | None = None
    contact_kind: ContactKind | None = None
    contact_visibility: ContactVisibility | None = None
    contest_kind_term: UUID | None = None
    count_kind: CountKind
    count_max: Annotated[int, Field(ge=1)] | None = None
    count_min: Annotated[int, Field(ge=1)] | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    election_kind_term: UUID | None = None
    election_past_status: ElectionStatus | None = None
    election_status: ElectionStatus | None = None
    entity_kind_term: UUID | None = None
    fan_out_level_id: UUID | None = None
    id: UUID
    identity_kind: IdentityKind
    kind_term: UUID | None = None
    method: SelectionMethod | None = None
    pattern_id: UUID
    premises_kind_term: UUID | None = None
    product: Product
    reason: Annotated[str, Field(min_length=1, max_length=500)] | None = None
    repeat_years: Annotated[int, Field(ge=1)] | None = None
    role_term: UUID | None = None
    scope: Scope
    seat_count: Annotated[int, Field(ge=1)] | None = None
    sequence: Annotated[int, Field(ge=0)]
    start_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    term_kind_term: UUID | None = None
    term_limit: Annotated[int, Field(ge=1)] | None = None
    term_years: Annotated[int, Field(ge=1)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
