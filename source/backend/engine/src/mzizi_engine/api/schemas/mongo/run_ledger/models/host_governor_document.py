"""Host Governor Document"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class HostGovernorDocument(BaseModel):
    """Host Governor Document"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    expires_at: datetime = Field(alias="expiresAt")
    revision: UUID = Field(alias="revision")
    state_json: str = Field(alias="stateJson")
