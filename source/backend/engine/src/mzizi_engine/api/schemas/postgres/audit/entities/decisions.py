"""Decisions: one row of decisions."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.audit.enums.audit_decision import AuditDecision
from mzizi_engine.api.schemas.postgres.audit.enums.audit_decision_type import AuditDecisionType
from mzizi_engine.api.schemas.postgres.audit.enums.audit_subject_kind import AuditSubjectKind


class DecisionsRow(BaseModel):
    """Operational review decision with the policy version, reason and request it applied to."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "audit.decisions"

    actor_id: UUID | None = None
    decided_at: datetime
    decision: AuditDecision
    decision_type: AuditDecisionType
    event_id: UUID
    id: UUID
    policy_version: Annotated[str, Field(min_length=1, max_length=255)]
    reason: Annotated[str, Field(min_length=1, max_length=1000)]
    request_hash: Annotated[str, Field(min_length=64, max_length=64, pattern="^[a-f0-9]{64}$")]
    subject_id: UUID | None = None
    subject_kind: AuditSubjectKind
    subject_version: Annotated[str, Field(min_length=1, max_length=255)] | None = None
