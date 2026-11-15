"""Submit Job Body"""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.jsonvalue import JsonValue


class SubmitJobBody(BaseModel):
    """Submit Job Body"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    idempotency_key: Annotated[str, Field(min_length=1, max_length=255)] | None = Field(
        default=None, alias="idempotencyKey"
    )
    input: JsonValue | None = Field(default=None, alias="input")
    kind: Annotated[str, Field(min_length=1, max_length=200)] = Field(alias="kind")
    run_id: UUID | None = Field(default=None, alias="runId")
