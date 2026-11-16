"""Filesystem run store with streamed hashes and write-once artifact paths."""

import hashlib
import os
import shutil
import tempfile
import threading
from collections.abc import Iterator
from contextlib import contextmanager
from io import BytesIO
from pathlib import Path
from typing import BinaryIO
from uuid import UUID

from mzizi_engine.runtime.runs.contracts.records import ArtifactProvenance, ArtifactRecord, RunManifest
from mzizi_engine.runtime.runs.encode import canonical_json
from mzizi_engine.runtime.runs.paths import run_path

_CHUNK_BYTES = 1024 * 1024


def _child(directory: Path, *parts: str) -> Path:
    target = directory
    for part in parts:
        target /= part
        if target.is_symlink():
            raise ValueError(f"Symlink is not allowed in the run store: {target.name}")
    return target


@contextmanager
def _temporary(directory: Path) -> Iterator[tuple[Path, BinaryIO]]:
    directory.mkdir(parents=True, exist_ok=True)
    descriptor, name = tempfile.mkstemp(dir=directory)
    path = Path(name)
    with os.fdopen(descriptor, "wb") as stream:
        try:
            yield path, stream
        finally:
            path.unlink(missing_ok=True)


def _write(target: Path, source: BinaryIO) -> tuple[str, int]:
    """Publish bytes atomically. Retries can reuse identical bytes and can repair missing metadata."""
    digest = hashlib.sha256()
    size = 0
    with _temporary(target.parent) as (temporary, stream):
        while chunk := source.read(_CHUNK_BYTES):
            digest.update(chunk)
            size += stream.write(chunk)
        stream.flush()
        os.fsync(stream.fileno())
        expected = digest.hexdigest()
        try:
            target.hardlink_to(temporary)
        except FileExistsError:
            with target.open("rb") as existing:
                if hashlib.file_digest(existing, "sha256").hexdigest() != expected:
                    raise FileExistsError(f"Run store already contains different content for {target.name}") from None
        return expected, size


class LocalRunStore:
    def __init__(self, root: Path) -> None:
        self.root = root.resolve()
        self._lock = threading.RLock()

    def _run(self, run_id: UUID) -> Path:
        return _child(self.root, str(run_id))

    def put(self, run_id: UUID, relative_path: str, source: BinaryIO, provenance: ArtifactProvenance) -> ArtifactRecord:
        parts = run_path(relative_path)
        if len(parts) < 2:
            raise ValueError("An artifact or log path must include a filename")
        run = self._run(run_id)
        key = hashlib.sha256(relative_path.encode("utf-8")).hexdigest()
        target = _child(run, *parts)
        metadata = _child(run, ".metadata", f"{key}.json")
        with self._lock:
            if self.read_manifest(run_id) is not None:
                raise FileExistsError(f"Run {run_id} is sealed")
            digest, size = _write(target, source)
            record = ArtifactRecord(
                path=relative_path,
                sha256=digest,
                size=size,
                media_type=provenance.media_type,
                stage=provenance.stage,
                source_url=provenance.source_url,
                derived_from=provenance.derived_from,
            )
            _write(metadata, BytesIO(canonical_json(record)))
            return record

    def open(self, run_id: UUID, relative_path: str) -> BinaryIO:
        parts = run_path(relative_path)
        return _child(self._run(run_id), *parts).open("rb")

    def list(self, run_id: UUID, prefix: str = "") -> tuple[ArtifactRecord, ...]:
        prefix = prefix.rstrip("/")
        if prefix:
            run_path(prefix, area_allowed=True)
        metadata = _child(self._run(run_id), ".metadata")
        with self._lock:
            records = (
                ArtifactRecord.model_validate_json(_child(metadata, path.name).read_bytes())
                for path in metadata.glob("*.json")
            )
            return tuple(
                sorted(
                    (
                        record
                        for record in records
                        if not prefix or record.path == prefix or record.path.startswith(prefix + "/")
                    ),
                    key=lambda record: record.path,
                )
            )

    def read_manifest(self, run_id: UUID) -> bytes | None:
        try:
            return _child(self._run(run_id), "manifest.json").read_bytes()
        except FileNotFoundError:
            return None

    def write_manifest(self, manifest: RunManifest) -> str:
        with self._lock:
            digest, _ = _write(_child(self._run(manifest.run_id), "manifest.json"), BytesIO(canonical_json(manifest)))
            return digest

    def delete(self, run_id: UUID) -> None:
        with self._lock:
            run = self._run(run_id)
            if run.exists():
                shutil.rmtree(run)
