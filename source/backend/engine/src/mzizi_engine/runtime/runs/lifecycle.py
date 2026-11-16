"""Seal verified run objects and expire temporary bytes without removing permanent metadata."""

import hashlib
from datetime import UTC, datetime, timedelta
from uuid import UUID

from mzizi_engine.runtime.runs.bundles import assemble_manifest
from mzizi_engine.runtime.runs.contracts.records import RunManifest, RunRecord, RunState, RunSummary
from mzizi_engine.runtime.runs.control import LeaseLost, WorkerLedger
from mzizi_engine.runtime.runs.s3_store import S3RunStore


def read_sealed(store: S3RunStore, record: RunRecord) -> RunManifest:
    data = store.read_manifest(record.run_id)
    if data is None or record.manifest_hash != hashlib.sha256(data).hexdigest():
        raise ValueError("Bundle manifest is missing or its checksum differs from the ledger")
    manifest = RunManifest.model_validate_json(data)
    if manifest.run_id != record.run_id or manifest.spec_hash != record.spec_hash:
        raise ValueError("Bundle manifest does not describe this run")
    return manifest


def _required(ledger: WorkerLedger, run_id: UUID) -> RunRecord:
    record = ledger.read(run_id)
    if record is None:
        raise KeyError(run_id)
    return record


def summarize(ledger: WorkerLedger, record: RunRecord, manifest: RunManifest) -> None:
    ledger.summarize(
        RunSummary(
            run_id=record.run_id,
            spec_hash=record.spec_hash,
            state=record.state,
            finished_at=manifest.finished_at,
            counts=manifest.counts,
            decisions=manifest.decisions,
            files=manifest.files,
            approver=record.approval.approver if record.approval else None,
            approval=record.approval,
            manifest_hash=record.manifest_hash,
        )
    )


def seal_run(ledger: WorkerLedger, store: S3RunStore, run_id: UUID, version: str) -> RunManifest:
    record = _required(ledger, run_id)
    if record.run_store != "s3":
        raise ValueError("The run was created on a different storage backend")
    if record.state == RunState.SEALED:
        manifest = read_sealed(store, record)
        summarize(ledger, record, manifest)
        return manifest
    if record.state != RunState.COMPLETED or record.stages_completed != len(record.spec.stages):
        raise ValueError("Only a completed run with all stages checkpointed can be sealed")
    prior = store.read_manifest(run_id)
    if prior is None:
        receipts = tuple(store.read_receipt(run_id, index) for index in range(record.stages_completed))
        if any(receipt is None for receipt in receipts):
            raise ValueError("A completed stage has no durable upload receipt")
        manifest = assemble_manifest(
            store,
            record,
            version,
            tuple(item for receipt in receipts if receipt for item in receipt.files),
        ).model_copy(
            update={
                "decisions": tuple(item for receipt in receipts if receipt for item in receipt.decisions),
            }
        )
    else:
        manifest = RunManifest.model_validate_json(prior)
        if manifest.run_id != run_id or manifest.spec_hash != record.spec_hash:
            raise ValueError("Existing manifest describes a different run")
    digest = store.write_manifest(manifest)
    sealed = record.model_copy(
        update={
            "state": RunState.SEALED,
            "sealed_at": datetime.now(UTC),
            "manifest_hash": digest,
            "revision": record.revision + 1,
        }
    )
    if not ledger.update_if(record, sealed):
        current = _required(ledger, run_id)
        if current.state == RunState.SEALED and current.manifest_hash == digest:
            return manifest
        raise LeaseLost(f"Run {run_id} changed while sealing")
    summarize(ledger, sealed, manifest)
    return manifest


def expire_run(
    ledger: WorkerLedger,
    store: S3RunStore,
    run: RunRecord,
    *,
    now: datetime,
    run_days: int,
    log_days: int,
) -> bool:
    finished = run.finished_at
    if run.run_store != "s3" or finished is None or run.state == RunState.COMPLETED:
        return False
    logs_due = not run.logs_expired and finished + timedelta(days=log_days) <= now
    expirable = {RunState.SEALED, RunState.PROMOTED, RunState.REJECTED, RunState.CANCELLED, RunState.FAILED}
    artifacts_due = run.state == RunState.EXPIRING or (
        run.state in expirable and (run.sealed_at or finished) + timedelta(days=run_days) <= now
    )
    if not artifacts_due and not logs_due:
        return False
    if artifacts_due and run.state != RunState.EXPIRING:
        # Reserve expiry before any deletion so release cannot acquire the same sealed run.
        reserved = run.model_copy(update={"state": RunState.EXPIRING, "revision": run.revision + 1})
        if not ledger.update_if(run, reserved):
            return False
        run = reserved
    store.expire(run.run_id, artifacts=artifacts_due, logs=logs_due)
    updated = run.model_copy(
        update={
            "state": RunState.EXPIRED if artifacts_due else run.state,
            "logs_expired": run.logs_expired or logs_due,
            "revision": run.revision + 1,
        }
    )
    return ledger.update_if(run, updated)
