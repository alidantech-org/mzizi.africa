"""Run lifecycle, events, and evidence metadata for storage and audit."""

from enum import StrEnum
from typing import Annotated
from uuid import UUID

from pydantic import AwareDatetime, NonNegativeInt, StringConstraints

from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.runs.contracts.spec import JobSpec, NonEmpty

type Sha256 = Annotated[str, StringConstraints(min_length=64, max_length=64)]


class RunState(StrEnum):
    QUEUED = "queued"
    LEASED = "leased"
    WORKING = "working"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    SEALED = "sealed"
    CHECKING = "checking"
    APPROVED = "approved"
    REJECTED = "rejected"
    PARTIAL = "partial"
    PROMOTED = "promoted"
    EXPIRED = "expired"


class ArtifactState(StrEnum):
    STAGED = "staged"
    PROMOTED = "promoted"
    REJECTED = "rejected"


class EventLevel(StrEnum):
    INFO = "info"
    ERROR = "error"


class RunRecord(Frozen):
    run_id: UUID
    spec_hash: Sha256
    spec: JobSpec
    state: RunState
    attempts: NonNegativeInt = 0
    requested_at: AwareDatetime
    started_at: AwareDatetime | None = None
    finished_at: AwareDatetime | None = None
    requested_by: str | None = None
    manifest_hash: Sha256 | None = None
    failure_type: str | None = None


class ArtifactProvenance(Frozen):
    media_type: NonEmpty
    stage: NonEmpty
    source_url: str | None = None
    derived_from: tuple[str, ...] = ()


class ArtifactRecord(ArtifactProvenance):
    path: Annotated[str, StringConstraints(min_length=1)]
    sha256: Sha256
    size: NonNegativeInt
    state: ArtifactState = ArtifactState.STAGED


class LogRecord(Frozen):
    path: Annotated[str, StringConstraints(min_length=1)]
    sha256: Sha256


class RunDecision(Frozen):
    source_url: NonEmpty
    fetched: bool
    reason: NonEmpty
    score: float | None = None


class StageCount(Frozen):
    stage: NonEmpty
    files: NonNegativeInt


class RunManifest(Frozen):
    run_id: UUID
    spec_hash: Sha256
    started_at: AwareDatetime
    finished_at: AwareDatetime
    files: tuple[ArtifactRecord, ...] = ()
    logs: tuple[LogRecord, ...] = ()
    decisions: tuple[RunDecision, ...] = ()
    counts: tuple[StageCount, ...] = ()
    engine_version: NonEmpty


class RunEvent(Frozen):
    event_id: UUID
    run_id: UUID
    time: AwareDatetime
    level: EventLevel
    state: RunState
    stage: str | None = None
    failure_type: str | None = None


class RunSummary(Frozen):
    run_id: UUID
    spec_hash: Sha256
    state: RunState
    finished_at: AwareDatetime
    counts: tuple[StageCount, ...] = ()
    files: tuple[ArtifactRecord, ...] = ()
    decisions: tuple[RunDecision, ...] = ()
    approver: str | None = None
