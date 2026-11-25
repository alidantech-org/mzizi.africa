"""Messages: one row of messages."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.product.enums.message_status import MessageStatus
from mzizi_engine.api.schemas.postgres.product.enums.text_origin import TextOrigin


class MessagesRow(BaseModel):
    """The text of one interface key in one language, optionally for one country."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "product.messages"

    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    key_id: UUID
    language_id: UUID
    origin: TextOrigin
    status: MessageStatus
    text: Annotated[str, Field(min_length=1, max_length=8000)]
    translator: Annotated[str, Field(min_length=1, max_length=255)] | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
