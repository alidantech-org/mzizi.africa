"""Sites: one row of sites."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.product.enums.site_status import SiteStatus


class ProductSitesRow(BaseModel):
    """A public site or domain of an app, with its default locale and status."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "product.sites"

    app_id: UUID
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    host: Annotated[
        str,
        Field(
            min_length=3, max_length=253, pattern="^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$"
        ),
    ]
    id: UUID
    locale_id: UUID | None = None
    status: SiteStatus
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
