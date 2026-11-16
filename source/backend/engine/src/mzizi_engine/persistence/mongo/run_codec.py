"""Translate runtime contracts to Dryv-generated Mongo documents at the persistence boundary."""

from datetime import datetime, timedelta
from hashlib import sha256
from uuid import UUID

from pydantic import BaseModel, TypeAdapter

from mzizi_engine.api.schemas.mongo.run_ledger.enums.ledger_artifact_state import LedgerArtifactState
from mzizi_engine.api.schemas.mongo.run_ledger.enums.ledger_event_level import LedgerEventLevel
from mzizi_engine.api.schemas.mongo.run_ledger.enums.ledger_run_state import LedgerRunState
from mzizi_engine.api.schemas.mongo.run_ledger.models.ledger_decision import LedgerDecision
from mzizi_engine.api.schemas.mongo.run_ledger.models.ledger_stage_count import LedgerStageCount
from mzizi_engine.api.schemas.mongo.run_ledger.models.run_artifact_document import RunArtifactDocument
from mzizi_engine.api.schemas.mongo.run_ledger.models.run_event_document import RunEventDocument
from mzizi_engine.api.schemas.mongo.run_ledger.models.run_summary_document import RunSummaryDocument
from mzizi_engine.api.schemas.mongo.run_ledger.models.worker_run_document import WorkerRunDocument
from mzizi_engine.jsonvalue import JsonValue
from mzizi_engine.runtime.operations import OperationRegistry
from mzizi_engine.runtime.runs.contracts.records import (
    ArtifactRecord,
    ReleaseApproval,
    RunEvent,
    RunRecord,
    RunState,
    RunSummary,
)
from mzizi_engine.runtime.runs.encode import canonical_json
from mzizi_engine.runtime.runs.parse import parse_job_spec

type BsonDocument = dict[str, JsonValue | datetime]
_JSON_DOCUMENT = TypeAdapter(dict[str, JsonValue])


def _bson(model: BaseModel, identity: str) -> BsonDocument:
    json_fields = _JSON_DOCUMENT.validate_python(model.model_dump(mode="json", by_alias=True), strict=True)
    return {**json_fields, "_id": identity}


def alias(model: type[BaseModel], field: str) -> str:
    return model.model_fields[field].alias or field


RUN_STATE = alias(WorkerRunDocument, "state")
RUN_SPEC_HASH = alias(WorkerRunDocument, "spec_hash")
EVENT_EXPIRY = alias(RunEventDocument, "expires_at")
RUN_REVISION = alias(WorkerRunDocument, "revision")
RUN_AVAILABLE_AT = alias(WorkerRunDocument, "available_at")
RUN_LEASE_EXPIRY = alias(WorkerRunDocument, "lease_expires_at")
RUN_REQUESTED_AT = alias(WorkerRunDocument, "requested_at")


def encode_run(record: RunRecord) -> BsonDocument:
    model = WorkerRunDocument(
        run_id=record.run_id,
        spec_json=canonical_json(record.spec).decode("utf-8"),
        spec_hash=record.spec_hash,
        state=LedgerRunState(record.state),
        attempts=record.attempts,
        requested_at=record.requested_at,
        started_at=record.started_at,
        finished_at=record.finished_at,
        requested_by=record.requested_by,
        manifest_hash=record.manifest_hash,
        failure_type=record.failure_type,
        revision=record.revision,
        lease_id=record.lease_id,
        lease_expires_at=record.lease_expires_at,
        heartbeat_at=record.heartbeat_at,
        available_at=record.available_at,
        stages_completed=record.stages_completed,
        cancel_requested_at=record.cancel_requested_at,
        sealed_at=record.sealed_at,
        run_store=record.run_store,
        approval_json=canonical_json(record.approval).decode() if record.approval else None,
        release_plan_hash=record.release_plan_hash,
        logs_expired=record.logs_expired,
    )
    document = _bson(model, str(record.run_id))
    for key, value in ((RUN_AVAILABLE_AT, record.available_at), (RUN_LEASE_EXPIRY, record.lease_expires_at)):
        document[key] = value
    return document


def decode_run(document: BsonDocument, registry: OperationRegistry) -> RunRecord:
    model = WorkerRunDocument.model_validate({key: value for key, value in document.items() if key != "_id"})
    if sha256(model.spec_json.encode("utf-8")).hexdigest() != model.spec_hash:
        raise ValueError(f"Persisted spec hash mismatch for run {model.run_id}")
    run_store = model.run_store or "local"
    if run_store not in ("local", "s3"):
        raise ValueError("Unknown run-store backend in the ledger")
    return RunRecord(
        run_id=model.run_id,
        spec_hash=model.spec_hash,
        spec=parse_job_spec(model.spec_json, registry),
        state=RunState(model.state),
        attempts=model.attempts,
        requested_at=model.requested_at,
        started_at=model.started_at,
        finished_at=model.finished_at,
        requested_by=model.requested_by,
        manifest_hash=model.manifest_hash,
        failure_type=model.failure_type,
        revision=model.revision or 0,
        lease_id=model.lease_id,
        lease_expires_at=model.lease_expires_at,
        heartbeat_at=model.heartbeat_at,
        available_at=model.available_at,
        stages_completed=model.stages_completed or 0,
        cancel_requested_at=model.cancel_requested_at,
        sealed_at=model.sealed_at,
        run_store="s3" if run_store == "s3" else "local",
        approval=ReleaseApproval.model_validate_json(model.approval_json) if model.approval_json else None,
        release_plan_hash=model.release_plan_hash,
        logs_expired=bool(model.logs_expired),
    )


def encode_event(event: RunEvent, retention: timedelta) -> BsonDocument:
    model = RunEventDocument(
        event_id=event.event_id,
        run_id=event.run_id,
        time=event.time,
        expires_at=event.time + retention,
        level=LedgerEventLevel(event.level),
        state=LedgerRunState(event.state),
        stage=event.stage,
        failure_type=event.failure_type,
    )
    document = _bson(model, str(event.event_id))
    document[EVENT_EXPIRY] = model.expires_at  # MongoDB TTL requires a native BSON date.
    return document


def _artifact(run_id: UUID, record: ArtifactRecord) -> RunArtifactDocument:
    return RunArtifactDocument(
        run_id=run_id,
        path=record.path,
        sha256=record.sha256,
        size=record.size,
        media_type=record.media_type,
        stage=record.stage,
        source_url=record.source_url,
        derived_from=list(record.derived_from),
        state=LedgerArtifactState(record.state),
    )


def encode_artifact(run_id: UUID, record: ArtifactRecord) -> BsonDocument:
    return _bson(_artifact(run_id, record), f"{run_id}:{record.path}")


def encode_summary(record: RunSummary) -> BsonDocument:
    model = RunSummaryDocument(
        run_id=record.run_id,
        spec_hash=record.spec_hash,
        state=LedgerRunState(record.state),
        finished_at=record.finished_at,
        approver=record.approver,
        approval_json=canonical_json(record.approval).decode() if record.approval else None,
        manifest_hash=record.manifest_hash,
        files=[_artifact(record.run_id, artifact) for artifact in record.files],
        counts=[LedgerStageCount(stage=count.stage, files=count.files) for count in record.counts],
        decisions=[
            LedgerDecision(source_url=item.source_url, fetched=item.fetched, reason=item.reason, score=item.score)
            for item in record.decisions
        ],
    )
    return _bson(model, str(record.run_id))
