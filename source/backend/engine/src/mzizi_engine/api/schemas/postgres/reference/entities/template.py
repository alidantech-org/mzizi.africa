"""Template: one row of templates."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.reference.enums.template_product import TemplateProduct


class TemplateRow(BaseModel):
    """One thing a pattern produces, how many (one per unit of a level), how it is named and coded, and the attributes it carries. Templates generate structure only, never people."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "reference.templates"

    arm_id: UUID | None = None
    class_id: UUID | None = None
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
    institution_kind_id: UUID | None = None
    name_template: Annotated[str, Field(min_length=1, max_length=500)]
    parent_template_id: UUID | None = None
    pattern_id: UUID
    produces: TemplateProduct
    role_id: UUID | None = None
    seat_basis_id: UUID | None = None
    seat_count: Annotated[int, Field(ge=1)] | None = None
    selection_method_id: UUID | None = None
    source_citation_id: UUID | None = None
    term_limit: Annotated[int, Field(ge=1)] | None = None
    term_years: Annotated[int, Field(ge=1)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
