"""Port for a run's local or remote artifact bytes and manifest."""

from typing import BinaryIO, Protocol
from uuid import UUID

from mzizi_engine.runtime.runs.contracts.records import ArtifactProvenance, ArtifactRecord, RunManifest


class RunStore(Protocol):
    def put(
        self, run_id: UUID, relative_path: str, source: BinaryIO, provenance: ArtifactProvenance
    ) -> ArtifactRecord: ...

    def open(self, run_id: UUID, relative_path: str) -> BinaryIO: ...

    def list(self, run_id: UUID, prefix: str = "") -> tuple[ArtifactRecord, ...]: ...

    def read_manifest(self, run_id: UUID) -> bytes | None: ...

    def write_manifest(self, manifest: RunManifest) -> str: ...

    def delete(self, run_id: UUID) -> None: ...
