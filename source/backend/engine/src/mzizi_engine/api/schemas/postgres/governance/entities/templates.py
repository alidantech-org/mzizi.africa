"""Templates: one row of templates."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.governance.enums.template_product import TemplateProduct


class TemplatesRow(BaseModel):
    """One thing a pattern produces, how many, how it is named and coded. Templates generate structure only, never people."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "governance.templates"

    arm_term: UUID | None = None
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
    code_template: Annotated[str, Field(min_length=1, max_length=500)]
    created_at: datetime
    deleted_at: datetime | None = None
    fan_out_level_id: UUID | None = None
    id: UUID
    kind_term: UUID | None = None
    method_term: UUID | None = None
    name_template: Annotated[str, Field(min_length=1, max_length=500)]
    parent_template_id: UUID | None = None
    pattern_id: UUID
    produces: TemplateProduct
    role_term: UUID | None = None
    seat_count: Annotated[int, Field(ge=1)] | None = None
    term_limit: Annotated[int, Field(ge=1)] | None = None
    term_years: Annotated[int, Field(ge=1)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
