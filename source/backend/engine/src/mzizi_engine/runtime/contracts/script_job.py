"""HTTP script inputs and a durable result for bounded data transformations."""

from datetime import datetime
from enum import StrEnum
from typing import Literal
from uuid import UUID

from pydantic import ConfigDict, Field
from pydantic.alias_generators import to_camel

from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.runs.artifacts import ArtifactRef


class ScriptStatus(StrEnum):
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELLED = "cancelled"
    TIMED_OUT = "timed_out"
    OUTPUT_LIMIT = "output_limit"
    INTERRUPTED = "interrupted"


class ScriptRequest(Frozen):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    language: Literal["python", "bash"]
    script: str = Field(min_length=1, max_length=65536)
    inputs: tuple[ArtifactRef, ...] = Field(default=(), max_length=8, strict=False)
    timeout_seconds: int = Field(default=15, ge=1, le=60)


class ScriptJob(Frozen):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: UUID
    status: ScriptStatus
    request: ScriptRequest
    script_sha256: str
    image_id: str
    started_at: datetime
    finished_at: datetime | None = None
    cancel_requested: bool = False
    exit_code: int | None = None
    stdout: str = ""
    stderr: str = ""
    stdout_sha256: str | None = None
    stderr_sha256: str | None = None
    error: str | None = None


class ScriptRecord(Frozen):
    account_id: str | None
    job: ScriptJob
