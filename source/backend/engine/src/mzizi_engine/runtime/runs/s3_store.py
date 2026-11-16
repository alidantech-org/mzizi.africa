"""Write-once run objects and gzip logs over the injected S3 transport."""

import hashlib
import tempfile
from collections.abc import Callable, Iterator, Sequence
from datetime import datetime
from pathlib import Path
from typing import BinaryIO, NotRequired, Protocol, TypedDict
from uuid import UUID

from mzizi_engine.runtime.runs.bundles import hash_stream, verify_objects
from mzizi_engine.runtime.runs.contracts.records import ArtifactProvenance, ArtifactRecord, RunManifest, StageReceipt
from mzizi_engine.runtime.runs.encode import canonical_json
from mzizi_engine.runtime.runs.paths import run_lock, run_path, within

TEMP_PREFIX = "private/tmp/runs/"
LOG_PREFIX = "logs/runs/"
MANIFEST = "manifest.json"
CHUNK_SIZE = 1024 * 1024


class ObjectHead(Protocol):
    @property
    def size(self) -> int: ...

    @property
    def sha256(self) -> str | None: ...


class MultipartUpload(TypedDict):
    Key: str
    UploadId: str
    Initiated: NotRequired[datetime | None]


class RunObjects(Protocol):
    def head(self, key: str) -> ObjectHead | None: ...
    def put(self, key: str, data: bytes, content_type: str, sha256: str) -> None: ...
    def put_path(self, key: str, path: str, content_type: str, sha256: str) -> None: ...
    def get(self, key: str) -> bytes: ...
    def open_stream(self, key: str) -> BinaryIO: ...
    def list_keys(self, prefix: str = "") -> Iterator[tuple[str, int]]: ...
    def delete_many(self, keys: list[str]) -> int: ...
    def list_multipart(self, prefix: str) -> Sequence[MultipartUpload]: ...
    def abort_multipart(self, key: str, upload_id: str) -> None: ...


class S3RunStore:
    def __init__(self, objects: RunObjects, local_root: Path) -> None:
        self._objects = objects
        self._local_root = local_root

    @staticmethod
    def _root(run_id: UUID) -> str:
        return f"{TEMP_PREFIX}{run_id}/"

    @staticmethod
    def _logs(run_id: UUID) -> str:
        return f"{LOG_PREFIX}{run_id}/"

    def object_key(self, run_id: UUID, relative_path: str) -> str:
        parts = run_path(relative_path)
        if parts[0] == "logs":
            return self._logs(run_id) + "/".join(parts[1:])
        return self._root(run_id) + relative_path

    def _metadata_key(self, run_id: UUID, path: str) -> str:
        name = hashlib.sha256(path.encode()).hexdigest() + ".json"
        if path.startswith("logs/"):
            return self._logs(run_id) + ".metadata/" + name
        return self._root(run_id) + ".metadata/" + name

    def _matches(self, key: str, digest: str, size: int) -> bool:
        existing = self._objects.head(key)
        if existing is None:
            return False
        if existing.size != size or (existing.sha256 is not None and existing.sha256 != digest):
            raise FileExistsError(f"Run object already contains different bytes: {key}")
        if existing.sha256 is None:
            with self._objects.open_stream(key) as stream:
                if hash_stream(stream)[0] != digest:
                    raise FileExistsError(f"Run object already contains different bytes: {key}")
        return True

    def _put_json(self, key: str, data: bytes) -> str:
        checksum = hashlib.sha256(data).hexdigest()
        if not self._matches(key, checksum, len(data)):
            self._objects.put(key, data, "application/json", checksum)
        return checksum

    def put(self, run_id: UUID, relative_path: str, source: BinaryIO, provenance: ArtifactProvenance) -> ArtifactRecord:
        key = self.object_key(run_id, relative_path)
        with run_lock(self._local_root / "locks", run_id):
            if self._objects.head(self._root(run_id) + MANIFEST) is not None:
                raise FileExistsError(f"Run {run_id} is sealed")
            spool = self._local_root / "spool"
            spool.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(dir=spool, prefix=f"{run_id}-") as target:
                digest, size = hashlib.sha256(), 0
                while chunk := source.read(CHUNK_SIZE):
                    digest.update(chunk)
                    size += target.write(chunk)
                target.flush()
                checksum = digest.hexdigest()
                if not self._matches(key, checksum, size):
                    self._objects.put_path(key, target.name, provenance.media_type, checksum)
                record = ArtifactRecord(
                    path=relative_path,
                    sha256=checksum,
                    size=size,
                    media_type=provenance.media_type,
                    stage=provenance.stage,
                    source_url=provenance.source_url,
                    derived_from=provenance.derived_from,
                )
            self._put_json(self._metadata_key(run_id, relative_path), canonical_json(record))
            return record

    def open(self, run_id: UUID, relative_path: str) -> BinaryIO:
        return self._objects.open_stream(self.object_key(run_id, relative_path))

    def list(self, run_id: UUID, prefix: str = "") -> tuple[ArtifactRecord, ...]:
        prefix = prefix.rstrip("/")
        if prefix:
            run_path(prefix, area_allowed=True)
        records = []
        for root in (self._root(run_id), self._logs(run_id)):
            for key, _ in self._objects.list_keys(root + ".metadata/"):
                record = ArtifactRecord.model_validate_json(self._objects.get(key))
                if within(record.path, prefix):
                    records.append(record)
        return tuple(sorted(records, key=lambda item: item.path))

    def read_receipt(self, run_id: UUID, index: int) -> StageReceipt | None:
        key = self._root(run_id) + f".stages/{index}.json"
        return StageReceipt.model_validate_json(self._objects.get(key)) if self._objects.head(key) else None

    def verify_receipt(self, run_id: UUID, receipt: StageReceipt) -> None:
        for item in receipt.files:
            if not self._matches(self.object_key(run_id, item.path), item.sha256, item.size):
                raise ValueError(f"Staged object is missing: {item.path}")

    def write_receipt(self, run_id: UUID, receipt: StageReceipt) -> None:
        with run_lock(self._local_root / "locks", run_id):
            if self.read_manifest(run_id) is not None:
                raise FileExistsError(f"Run {run_id} is sealed")
            self._put_json(self._root(run_id) + f".stages/{receipt.index}.json", canonical_json(receipt))

    def read_manifest(self, run_id: UUID) -> bytes | None:
        key = self._root(run_id) + MANIFEST
        return self._objects.get(key) if self._objects.head(key) is not None else None

    def write_manifest(self, manifest: RunManifest) -> str:
        run_id = manifest.run_id
        data = canonical_json(manifest)
        with run_lock(self._local_root / "locks", run_id):
            prior = self.read_manifest(run_id)
            if prior is not None:
                if prior != data:
                    raise FileExistsError(f"Run {run_id} already has a different manifest")
                return hashlib.sha256(data).hexdigest()
            expected = {self.object_key(run_id, item.path) for item in manifest.files}
            expected.update(self.object_key(run_id, item.path) for item in manifest.logs)
            actual = {key for key, _ in self._objects.list_keys(self._root(run_id) + "artifacts/")}
            actual |= {
                key
                for key, _ in self._objects.list_keys(self._logs(run_id))
                if not key.startswith(self._logs(run_id) + ".metadata/")
            }
            if expected != actual:
                raise ValueError("Run objects do not match the sealing manifest")
            verify_objects(self, manifest, logs=True)
            return self._put_json(self._root(run_id) + MANIFEST, data)

    def _delete_prefix(self, prefix: str) -> None:
        for upload in self._objects.list_multipart(prefix):
            if upload["Key"].startswith(prefix):
                self._objects.abort_multipart(upload["Key"], upload["UploadId"])
        batch: list[str] = []
        for key, _ in self._objects.list_keys(prefix):
            batch.append(key)
            if len(batch) == 1000:
                self._objects.delete_many(batch)
                batch = []
        if batch:
            self._objects.delete_many(batch)
        if next(self._objects.list_keys(prefix), None) is not None:
            raise RuntimeError("Temporary run objects remain after expiry")

    def sweep_spool(self, is_live: Callable[[UUID], bool]) -> None:
        for file in (self._local_root / "spool").glob("*"):
            try:
                run_id = UUID(file.name[:36])
            except ValueError:
                continue
            if file.name.startswith(f"{run_id}-") and not is_live(run_id):
                with run_lock(self._local_root / "locks", run_id):
                    if not is_live(run_id):
                        file.unlink(missing_ok=True)

    def expire(self, run_id: UUID, *, artifacts: bool, logs: bool) -> None:
        with run_lock(self._local_root / "locks", run_id):
            if artifacts:
                self._delete_prefix(self._root(run_id))
            if logs:
                self._delete_prefix(self._logs(run_id))

    def delete(self, run_id: UUID) -> None:
        self.expire(run_id, artifacts=True, logs=True)
