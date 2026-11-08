"""Extraction lineage: operations that read exact file versions and produce exact file versions.

Scheduling, retries and queue state belong to the engine; this records the lasting artifact chain: capability and tool versions,
configuration identity, input and output versions with roles. Outputs are registered through the same path as any content
(hash, deduplicate, upload, verify, register), so generated artifacts are indistinguishable in guarantees from uploaded ones.
There is no processed flag: status by operation is derived from history (`filesystem.version_operations`).
"""
from __future__ import annotations

import json
from pathlib import Path

from .hashing import sha256_hex
from .service import FilesystemService, Registration


def config_hash(config: dict | None) -> str:
    return sha256_hex(json.dumps(config or {}, sort_keys=True, separators=(",", ":")).encode())


def begin_extraction(service: FilesystemService, operation: str, capability: str, capability_version: str, input_version_ids: list[str], *, config: dict | None = None,
                     tool: dict | None = None, actor: str | None = None, engine_run_id: str | None = None, engine_job_id: str | None = None) -> dict:
    repo = service.repo
    with repo.transaction():
        for vid in input_version_ids:
            version = repo.get_version(vid)
            if version is None:
                raise ValueError(f"input version {vid} does not exist")
            service.authorizer.for_record(actor, "filesystem.read", "filesystem.files", version["file_id"])
        row = repo.create_extraction(operation, capability, capability_version, config_hash(config), config, tool or {}, actor, engine_run_id, engine_job_id)
        for i, vid in enumerate(input_version_ids):
            repo.link_extraction_file(row["id"], "input", vid, i)
    return row


def register_output(service: FilesystemService, extraction_id: str, folder_id: str, name: str, source: Path | bytes, *, ordinal: int = 0, actor: str | None = None,
                    registry_code: str | None = None, retention: str = "preserve_history", provenance_extra: dict | None = None) -> Registration:
    """Registers a generated file through the normal path and links the exact resulting (or existing identical) version as an output."""
    extra = {"extraction_id": str(extraction_id), **(provenance_extra or {})}
    reg = service.register(folder_id, name, source, registry_code=registry_code, retention=retention, actor=actor, provenance_extra=extra)
    if reg.outcome in ("created", "updated", "unchanged") and reg.version_id:
        with service.repo.transaction():
            service.repo.link_extraction_file(extraction_id, "output", reg.version_id, ordinal)
    return reg


def finish_extraction(service: FilesystemService, extraction_id: str, state: str, error: str | None = None) -> dict:
    with service.repo.transaction():
        return service.repo.finish_extraction(extraction_id, state, error)


def ancestry(service: FilesystemService, version_id: str, limit: int = 50) -> list[dict]:
    """The chain of extractions that produced a version, nearest first, with their input versions (cycles impossible by construction, bounded anyway)."""
    conn, out, frontier, seen = service.repo.conn, [], [version_id], {version_id}
    while frontier and len(out) < limit:
        vid = frontier.pop(0)
        for e in conn.execute("SELECT e.id, e.operation, e.capability, e.capability_version, e.state FROM filesystem.extractions e JOIN filesystem.extraction_files ef ON ef.extraction_id = e.id AND ef.role = 'output' WHERE ef.file_version_id = %s", (vid,)).fetchall():
            inputs = [str(r["file_version_id"]) for r in conn.execute("SELECT file_version_id FROM filesystem.extraction_files WHERE extraction_id = %s AND role = 'input' ORDER BY ordinal", (e["id"],)).fetchall()]
            out.append({"extraction_id": str(e["id"]), "operation": e["operation"], "capability": f"{e['capability']}@{e['capability_version']}", "state": e["state"], "output": vid, "inputs": inputs})
            for i in inputs:
                if i not in seen:
                    seen.add(i)
                    frontier.append(i)
    return out
