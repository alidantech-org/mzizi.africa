"""Contacts: one row of contacts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.shared.enums.contact_kind import ContactKind
from mzizi_engine.api.schemas.postgres.shared.enums.contact_visibility import ContactVisibility


class ContactsRow(BaseModel):
    """A public or official-business contact of a named thing."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "official.contacts"

    created_at: datetime
    deleted_at: datetime | None = None
    from_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    id: UUID
    identity_id: UUID
    kind: ContactKind
    to_year: Annotated[int, Field(ge=-10000, le=3000)] | None = None
    updated_at: datetime
    value: Annotated[str, Field(min_length=1, max_length=1000)] | None = None
    version: Annotated[int, Field(ge=1)]
    visibility: ContactVisibility
