"""Script Job"""

from __future__ import annotations

from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.api.scripts.enums.script_state import ScriptState
from mzizi_engine.api.schemas.api.scripts.models.script_request import ScriptRequest


class ScriptJob(BaseModel):
    """Script Job"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    cancel_requested: bool = Field(alias="cancelRequested")
    error: Annotated[str, Field(max_length=1000)] | None = Field(default=None, alias="error")
    exit_code: int | None = Field(default=None, alias="exitCode")
    finished_at: datetime | None = Field(default=None, alias="finishedAt")
    id: UUID = Field(alias="id")
    image_id: Annotated[str, Field(max_length=1000)] = Field(alias="imageId")
    request: ScriptRequest = Field(alias="request")
    script_sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] = Field(
        alias="scriptSha256"
    )
    started_at: datetime = Field(alias="startedAt")
    status: ScriptState = Field(alias="status")
    stderr: Annotated[str, Field(max_length=262144)] = Field(alias="stderr")
    stderr_sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = Field(
        default=None, alias="stderrSha256"
    )
    stdout: Annotated[str, Field(max_length=262144)] = Field(alias="stdout")
    stdout_sha256: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")] | None = Field(
        default=None, alias="stdoutSha256"
    )
