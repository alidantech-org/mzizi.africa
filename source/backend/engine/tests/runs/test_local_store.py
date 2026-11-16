"""Verify content hashes, idempotence, and recovery of local artifact writes."""

from datetime import UTC, datetime
from hashlib import sha256
from io import BytesIO
from pathlib import Path
from uuid import uuid4

import pytest

from mzizi_engine.runtime.runs.contracts.records import ArtifactProvenance, RunManifest
from mzizi_engine.runtime.runs.local_store import LocalRunStore

PROVENANCE = ArtifactProvenance(media_type="text/html", stage="crawl", source_url="http://127.0.0.1/")


class InterruptedStream(BytesIO):
    def read(self, size: int | None = -1) -> bytes:
        if self.tell():
            raise OSError("interrupted")
        return super().read(1)


def test_local_store_streams_and_can_restart_after_an_interrupted_write(tmp_path: Path) -> None:
    run_id = uuid4()
    store = LocalRunStore(tmp_path)
    assert store.list(run_id) == ()
    path = "artifacts/raw/index.html"
    with pytest.raises(OSError, match="interrupted"):
        store.put(run_id, path, InterruptedStream(b"abc"), PROVENANCE)
    assert list((tmp_path / str(run_id) / "artifacts" / "raw").iterdir()) == []
    assert store.list(run_id) == ()
    with pytest.raises(FileNotFoundError):
        store.open(run_id, path)
    data = b"abc" * 450_000
    record = store.put(run_id, path, BytesIO(data), PROVENANCE)
    assert record.sha256 == sha256(data).hexdigest() and record.size == len(data)
    restarted = LocalRunStore(tmp_path)
    assert restarted.put(run_id, path, BytesIO(data), PROVENANCE) == record
    assert restarted.list(run_id, "artifacts/raw/") == (record,)
    assert restarted.list(run_id, "logs/") == ()
    with restarted.open(run_id, path) as stream:
        assert stream.read() == data
    with pytest.raises(FileExistsError, match="different content"):
        restarted.put(run_id, path, BytesIO(b"changed"), PROVENANCE)
    restarted.delete(run_id)
    restarted.delete(run_id)
    assert restarted.list(run_id) == ()


def test_local_store_rejects_escape_paths_and_symlinks(tmp_path: Path) -> None:
    run_id = uuid4()
    store = LocalRunStore(tmp_path / "runs")
    for path in (
        "/etc/passwd",
        "artifacts",
        "artifacts/../escape",
        "artifacts/a\\b",
        "artifacts//escape",
        "logs/./file",
    ):
        with pytest.raises(ValueError):
            store.put(run_id, path, BytesIO(b"x"), PROVENANCE)
    run = tmp_path / "runs" / str(run_id)
    run.mkdir(parents=True)
    (run / "artifacts").symlink_to(tmp_path, target_is_directory=True)
    with pytest.raises(ValueError, match="Symlink"):
        store.put(run_id, "artifacts/escape", BytesIO(b"x"), PROVENANCE)
    assert not (tmp_path / "escape").exists()


def test_local_manifest_is_written_once_and_hashed(tmp_path: Path) -> None:
    store = LocalRunStore(tmp_path)
    now = datetime.now(UTC)
    manifest = RunManifest(
        run_id=uuid4(),
        spec_hash="a" * 64,
        started_at=now,
        finished_at=now,
        engine_version="1",
    )
    digest = store.write_manifest(manifest)
    encoded = (tmp_path / str(manifest.run_id) / "manifest.json").read_bytes()
    assert sha256(encoded).hexdigest() == digest
    assert RunManifest.model_validate_json(encoded) == manifest
    assert store.write_manifest(manifest) == digest
    with pytest.raises(FileExistsError):
        store.write_manifest(manifest.model_copy(update={"engine_version": "2"}))
