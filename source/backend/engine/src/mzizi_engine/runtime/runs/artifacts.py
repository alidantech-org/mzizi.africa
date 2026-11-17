"""Resolve and verify a caller's exact reference to a stored run artifact."""

from collections.abc import Callable
from hashlib import sha256
from typing import Annotated, Self
from uuid import UUID

from pydantic import ConfigDict, Field, StringConstraints, model_validator
from pydantic.alias_generators import to_camel

from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.runs.contracts.records import ArtifactRecord, ArtifactState, RunManifest, RunRecord, RunState
from mzizi_engine.runtime.runs.paths import run_path
from mzizi_engine.runtime.runs.store import RunStore
from mzizi_extraction.core import Limits


class ArtifactRef(Frozen):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    run_id: UUID = Field(strict=False)
    path: Annotated[str, StringConstraints(min_length=1, max_length=2048)]
    sha256: Annotated[str, StringConstraints(pattern=r"^[0-9a-f]{64}$")]

    @model_validator(mode="after")
    def artifact_path(self) -> Self:
        if run_path(self.path)[0] != "artifacts":
            raise ValueError("Expected a path under artifacts/")
        return self


class ArtifactAccess(Frozen):
    account_id: str | None
    service: bool = False


class ArtifactMetadata(Frozen):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    artifact: ArtifactRef
    size: int = Field(ge=0)
    media_type: str
    stage: str
    source_url: str | None
    derived_from: tuple[str, ...]


class ArtifactReadError(Exception):
    """Artifact resolution failed before an operation could use the bytes."""

    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status


class ArtifactReader:
    def __init__(
        self, read_run: Callable[[UUID], RunRecord | None], select_store: Callable[[RunRecord], RunStore]
    ) -> None:
        self._read_run = read_run
        self._select_store = select_store

    def read(self, ref: ArtifactRef, access: ArtifactAccess) -> tuple[ArtifactMetadata, bytes]:
        run = self._read_run(ref.run_id)
        if run is None:
            raise ArtifactReadError(404, "Run not found")
        if not access.service and (access.account_id is None or access.account_id != run.requested_by):
            raise ArtifactReadError(403, "Artifact access refused")
        if run.state in (RunState.EXPIRED, RunState.EXPIRING):
            raise ArtifactReadError(410, "Run artifacts have expired")
        store = self._select_store(run)
        record = self._record(ref, run, store)
        if record.sha256 != ref.sha256:
            raise ArtifactReadError(409, "Artifact hash differs from the requested revision")
        if record.size > Limits().max_bytes:
            raise ArtifactReadError(413, "Artifact exceeds the engine extraction byte limit")
        try:
            with store.open(ref.run_id, ref.path) as stream:
                data = stream.read(record.size + 1)
        except FileNotFoundError as error:
            raise ArtifactReadError(404, "Artifact bytes not found") from error
        if len(data) != record.size or sha256(data).hexdigest() != ref.sha256:
            raise ArtifactReadError(409, "Stored artifact does not match its recorded size and hash")
        return (
            ArtifactMetadata(
                artifact=ref,
                size=record.size,
                media_type=record.media_type,
                stage=record.stage,
                source_url=record.source_url,
                derived_from=record.derived_from,
            ),
            data,
        )

    @staticmethod
    def _record(ref: ArtifactRef, run: RunRecord, store: RunStore) -> ArtifactRecord:
        if run.manifest_hash is not None:
            raw = store.read_manifest(ref.run_id)
            if raw is None:
                raise ArtifactReadError(404, "Run manifest not found")
            if sha256(raw).hexdigest() != run.manifest_hash:
                raise ArtifactReadError(409, "Run manifest does not match the ledger")
            manifest = RunManifest.model_validate_json(raw)
            if manifest.run_id != run.run_id or manifest.spec_hash != run.spec_hash:
                raise ArtifactReadError(409, "Run manifest does not match the run")
            records = manifest.files
        else:
            records = store.list(ref.run_id, ref.path)
        for record in records:
            if record.path == ref.path and record.state is not ArtifactState.REJECTED:
                return record
        raise ArtifactReadError(404, "Artifact not found in the run")
