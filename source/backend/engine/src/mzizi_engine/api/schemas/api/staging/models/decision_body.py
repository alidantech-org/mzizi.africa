"""Decision Body"""

from __future__ import annotations

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.mongo.staging.enums.review_decision import ReviewDecision


class DecisionBody(BaseModel):
    """Decision Body"""

    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    decision: ReviewDecision = Field(alias="decision")
    reason: Annotated[str, Field(max_length=4000)] | None = Field(default=None, alias="reason")
