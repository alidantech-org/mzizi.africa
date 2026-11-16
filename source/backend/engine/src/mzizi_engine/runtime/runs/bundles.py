"""Verify a run's immutable evidence and assemble a canonical manifest."""

import hashlib
from collections import Counter
from graphlib import CycleError, TopologicalSorter
from typing import BinaryIO

from mzizi_engine.runtime.runs.contracts.records import ArtifactRecord, LogRecord, RunManifest, RunRecord, StageCount
from mzizi_engine.runtime.runs.store import RunStore


def assemble_manifest(
    store: RunStore, record: RunRecord, version: str, artifacts: tuple[ArtifactRecord, ...]
) -> RunManifest:
    if record.started_at is None or record.finished_at is None:
        raise ValueError("A completed run must have start and finish times")
    logs = store.list(record.run_id, "logs")
    counts = Counter(item.stage for item in artifacts)
    return RunManifest(
        run_id=record.run_id,
        spec_hash=record.spec_hash,
        started_at=record.started_at,
        finished_at=record.finished_at,
        files=tuple(sorted(artifacts, key=lambda item: item.path)),
        logs=tuple(LogRecord(path=item.path, sha256=item.sha256) for item in logs),
        counts=tuple(StageCount(stage=name, files=count) for name, count in sorted(counts.items())),
        engine_version=version,
    )


def verify_objects(store: RunStore, manifest: RunManifest, *, logs: bool) -> None:
    seen: set[str] = set()
    items: list[ArtifactRecord | LogRecord] = list(manifest.files)
    if logs:
        items.extend(manifest.logs)
    for item in items:
        area = "artifacts/" if isinstance(item, ArtifactRecord) else "logs/"
        if not item.path.startswith(area):
            raise ValueError(f"Manifest item is in the wrong area: {item.path}")
        if item.path in seen:
            raise ValueError(f"Duplicate manifest path: {item.path}")
        seen.add(item.path)
        with store.open(manifest.run_id, item.path) as stream:
            digest, size = hash_stream(stream)
        if digest != item.sha256 or (isinstance(item, ArtifactRecord) and item.size != size):
            raise ValueError(f"Bundle checksum mismatch: {item.path}")
    graph = {artifact.path: artifact.derived_from for artifact in manifest.files}
    if any(parent not in graph for parents in graph.values() for parent in parents):
        raise ValueError("Bundle lineage references an absent artifact")
    try:
        tuple(TopologicalSorter(graph).static_order())
    except CycleError as problem:
        raise ValueError("Bundle lineage contains a cycle") from problem


def hash_stream(stream: BinaryIO) -> tuple[str, int]:
    digest = hashlib.sha256()
    size = 0
    while chunk := stream.read(1024 * 1024):
        digest.update(chunk)
        size += len(chunk)
    return digest.hexdigest(), size
