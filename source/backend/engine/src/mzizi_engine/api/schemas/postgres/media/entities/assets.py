"""Assets: one row of assets."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.media.enums.asset_kind import AssetKind
from mzizi_engine.api.schemas.postgres.media.enums.availability import Availability


class MediaAssetsRow(BaseModel):
    """A photo, logo, flag, video, audio or scan: held bytes or an external link or embed."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "media.assets"

    author: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    availability: Availability | None = None
    captured_on: date | None = None
    checked_at: datetime | None = None
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    deleted_at: datetime | None = None
    duration: Annotated[float, Field(ge=0)] | None = None
    embed_url: Annotated[str, Field(max_length=2048)] | None = None
    end_second: Annotated[float, Field(ge=0)] | None = None
    external_id: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    external_url: Annotated[str, Field(max_length=2048)] | None = None
    height: Annotated[int, Field(ge=1)] | None = None
    id: UUID
    kind: AssetKind
    kind_term: UUID
    licence_term: UUID | None = None
    provider_term: UUID | None = None
    published_on: date | None = None
    start_second: Annotated[float, Field(ge=0)] | None = None
    thumbnail_url: Annotated[str, Field(max_length=2048)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
    version_id: UUID | None = None
    width: Annotated[int, Field(ge=1)] | None = None
