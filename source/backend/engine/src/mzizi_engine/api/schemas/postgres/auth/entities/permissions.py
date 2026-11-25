"""Permissions: one row of permissions."""

from __future__ import annotations

from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.auth.enums.auth_action import AuthAction
from mzizi_engine.api.schemas.postgres.auth.enums.resource_type import ResourceType


class PermissionsRow(BaseModel):
    """A named action on a resource type, optionally narrowed to a field group."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "auth.permissions"

    action: AuthAction
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    description: Annotated[str, Field(max_length=4000)] | None = None
    field_group: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    id: UUID
    is_active: bool
    resource_type: ResourceType
