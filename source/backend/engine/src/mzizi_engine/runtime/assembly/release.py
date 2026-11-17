"""Plan and apply approved filesystem placements for a sealed S3 run."""

from collections.abc import Iterator
from contextlib import contextmanager
from datetime import UTC, datetime
from hashlib import sha256
from uuid import UUID

from pydantic import NonNegativeInt

from mzizi_engine import __version__
from mzizi_engine.config import ConfigError, EngineConfig
from mzizi_engine.persistence.mongo.run_ledger import MongoRunLedger
from mzizi_engine.persistence.postgres.connection import Connection, connect
from mzizi_engine.persistence.postgres.filesystem import PostgresRegistry
from mzizi_engine.persistence.postgres.source import record_file_derivation
from mzizi_engine.runtime.assembly.default_operations import build_operation_registry
from mzizi_engine.runtime.assembly.filesystem_operations import _Wiring
from mzizi_engine.runtime.assembly.run_operations import local_run_root
from mzizi_engine.runtime.assembly.run_storage import run_store
from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.runs.bundles import verify_objects
from mzizi_engine.runtime.runs.contracts.records import ArtifactRecord, ReleaseApproval, RunManifest, RunState
from mzizi_engine.runtime.runs.encode import canonical_json
from mzizi_engine.runtime.runs.lifecycle import _required, expire_run, read_sealed, seal_run, summarize
from mzizi_engine.runtime.runs.paths import run_lock
from mzizi_engine.runtime.runs.s3_store import S3RunStore
from mzizi_filesystem import (
    DuplicatePolicy,
    FilesystemOrchestrator,
    MediaCatalog,
    NameConflictPolicy,
    Outcome,
    RegisterRequest,
)
from mzizi_filesystem.features.media.parse import load_media_formats
from mzizi_filesystem.features.placement.contracts import Placement
from mzizi_filesystem.features.register.storage import StoredObject


class PlacementEntry(Frozen):
    path: str
    placement: Placement
    pinned: bool = False


class ReleaseManifest(Frozen):
    entries: tuple[PlacementEntry, ...]
    relation_kind_id: UUID | None = None


class PlannedFile(Frozen):
    artifact: ArtifactRecord
    placement: Placement
    pinned: bool


class ReleasePlan(Frozen):
    run_id: UUID
    manifest_hash: str
    files: tuple[PlannedFile, ...]
    relation_kind_id: UUID | None


class PlannedRelease(Frozen):
    plan: ReleasePlan
    plan_hash: str


class ReleaseResult(Frozen):
    run_id: UUID
    promoted: NonNegativeInt
    already_promoted: bool = False


@contextmanager
def _services(config: EngineConfig) -> Iterator[tuple[S3RunStore, MongoRunLedger]]:
    store = run_store(config)
    if not isinstance(store, S3RunStore):
        raise ConfigError("Sealing and release require ENGINE_RUN_STORE=s3")
    ledger = MongoRunLedger(
        config.require_mongo(), build_operation_registry(), log_retention_days=config.runs.require_log_retention()
    )
    try:
        ledger.initialize()
        yield store, ledger
    finally:
        ledger.close()


def seal(run_id: UUID, config: EngineConfig) -> RunManifest:
    with _services(config) as (store, ledger):
        return seal_run(ledger, store, run_id, __version__)


def sweep(config: EngineConfig) -> int:
    if config.runs.retention_days is None:
        raise ConfigError("ENGINE_RUN_RETENTION_DAYS is required to sweep temporary bundles")
    with _services(config) as (store, ledger):
        now = datetime.now(UTC)
        return sum(
            expire_run(
                ledger,
                store,
                run,
                now=now,
                run_days=config.runs.retention_days,
                log_days=config.runs.require_log_retention(),
            )
            for run in ledger.expiry_candidates()
        )


def _plan(manifest: RunManifest, digest: str, placements: ReleaseManifest) -> ReleasePlan:
    requested = {entry.path: entry for entry in placements.entries}
    if len(requested) != len(placements.entries) or requested.keys() != {item.path for item in manifest.files}:
        raise ValueError("The placement manifest must contain exactly one placement per bundled artifact")
    destinations = {
        (item.placement.access, item.placement.folders, item.placement.file_name) for item in requested.values()
    }
    if len(destinations) != len(requested):
        raise ValueError("Two bundled artifacts target the same destination")
    if placements.relation_kind_id is None and any(item.derived_from for item in manifest.files):
        raise ValueError("The placement manifest must specify a lineage relation kind")
    return ReleasePlan(
        run_id=manifest.run_id,
        manifest_hash=digest,
        relation_kind_id=placements.relation_kind_id,
        files=tuple(
            PlannedFile(
                artifact=artifact, placement=requested[artifact.path].placement, pinned=requested[artifact.path].pinned
            )
            for artifact in manifest.files
        ),
    )


def plan_release(run_id: UUID, placements: ReleaseManifest, config: EngineConfig) -> PlannedRelease:
    with _services(config) as (store, ledger):
        record = _required(ledger, run_id)
        if record.state not in {RunState.SEALED, RunState.APPROVED, RunState.PROMOTED} or not record.manifest_hash:
            raise ValueError("The run must be sealed before planning release")
        manifest = read_sealed(store, record)
        verify_objects(store, manifest, logs=False)
        plan = _plan(manifest, record.manifest_hash, placements)
        return PlannedRelease(plan=plan, plan_hash=sha256(canonical_json(plan)).hexdigest())


def _promote(fs: FilesystemOrchestrator, store: S3RunStore, plan: ReleasePlan, connection: Connection) -> None:
    versions: dict[str, str] = {}
    for entry in plan.files:
        artifact = entry.artifact
        result = fs.register(
            RegisterRequest(
                placement=entry.placement,
                file_code=None,
                declared_type=artifact.media_type,
                original_filename=None,
                provenance={"run_id": str(plan.run_id), "manifest_hash": plan.manifest_hash, "artifact": artifact.path},
                created_by={},
                on_name_conflict=NameConflictPolicy.REJECT,
                on_duplicate=DuplicatePolicy.KEEP_BOTH,
                pinned=entry.pinned,
                dry_run=False,
            ),
            StoredObject(
                key=store.object_key(plan.run_id, artifact.path),
                expected_sha256=artifact.sha256,
                expected_size=artifact.size,
            ),
        )
        if result.outcome not in {Outcome.CREATED, Outcome.UNCHANGED} or result.version_id is None:
            raise ValueError(f"Promotion failed for {artifact.path}: {result.detail}")
        if result.sha256 != artifact.sha256:
            raise ValueError(f"Promoted file does not match manifest: {artifact.path}")
        versions[artifact.path] = result.version_id
    if plan.relation_kind_id is not None:
        for entry in plan.files:
            for parent in entry.artifact.derived_from:
                record_file_derivation(
                    connection,
                    input_version_id=versions[parent],
                    output_version_id=versions[entry.artifact.path],
                    kind_id=plan.relation_kind_id,
                    method=f"promoted from run {plan.run_id}",
                )


def release_run(
    run_id: UUID,
    placements: ReleaseManifest,
    approval: ReleaseApproval,
    config: EngineConfig,
) -> ReleaseResult:
    with run_lock(local_run_root(config) / ".release-locks", run_id), _services(config) as (store, ledger):
        record = _required(ledger, run_id)
        if record.state not in {RunState.SEALED, RunState.APPROVED, RunState.PROMOTED} or not record.manifest_hash:
            raise ValueError("The run must be sealed before release")
        manifest = read_sealed(store, record)
        plan = _plan(manifest, record.manifest_hash, placements)
        digest = sha256(canonical_json(plan)).hexdigest()
        if approval.plan_hash != digest:
            raise ValueError("The approval is for a different release plan")
        if record.state != RunState.SEALED and (record.approval != approval or record.release_plan_hash != digest):
            raise ValueError("Run already has a different recorded approval or release plan")
        if record.state == RunState.PROMOTED:
            summarize(ledger, record, manifest)
            return ReleaseResult(run_id=run_id, promoted=0, already_promoted=True)
        verify_objects(store, manifest, logs=False)
        if record.state == RunState.SEALED:
            approved = record.model_copy(
                update={
                    "state": RunState.APPROVED,
                    "approval": approval,
                    "release_plan_hash": digest,
                    "revision": record.revision + 1,
                }
            )
            if not ledger.update_if(record, approved):
                raise ValueError("Run changed before release approval could be recorded")
            record = approved
        wiring = _Wiring(config)
        catalog = MediaCatalog(load_media_formats(wiring.media_formats_path) if wiring.media_formats_path else {})
        with connect(wiring.database_url) as connection:
            _promote(
                FilesystemOrchestrator(wiring.config, PostgresRegistry(connection), wiring.store, catalog),
                store,
                plan,
                connection,
            )
        for item in manifest.files:
            ledger.mark_promoted(run_id, item)
        final = record.model_copy(update={"state": RunState.PROMOTED, "revision": record.revision + 1})
        if not ledger.update_if(record, final):
            raise ValueError("Run changed before promotion could be recorded")
        summarize(ledger, final, manifest)
        return ReleaseResult(run_id=run_id, promoted=len(plan.files))
