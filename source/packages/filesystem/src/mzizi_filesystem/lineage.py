"""Derivation relations: which exact file version was derived from which.

Only the relationship is recorded (`filesystem.file_relations`). What ran, with which tool and configuration, and its schedule, status
and retries belong to the engine (`engine_job_id` is an optional pointer). Derived content is registered through the same path as any
other (hash, deduplicate, upload, verify, register), so generated artifacts carry the same guarantees as uploaded ones.
"""

from __future__ import annotations

from pathlib import Path

from mzizi_database import required

from .service import FilesystemService, Registration


def relate(
    service: FilesystemService,
    source_version_id: str,
    derived_version_id: str,
    *,
    relation: str = "derived_from",
    actor: str | None = None,
    engine_job_id: str | None = None,
) -> bool:
    """Records that one exact version was derived from another. Returns False when the same relation already exists."""
    repo = service.repo
    with repo.transaction():
        for vid in (source_version_id, derived_version_id):
            if repo.get_version(vid) is None:
                raise ValueError(f"version {vid} does not exist")
        source = required(repo.get_version(source_version_id))
        service.authorizer.for_record(actor, "filesystem.read", "filesystem.files", source["file_id"])
        return repo.link_relation(source_version_id, derived_version_id, relation, engine_job_id, actor)


def register_derived(
    service: FilesystemService,
    source_version_ids: list[str],
    folder_id: str,
    name: str,
    content: Path | bytes,
    *,
    relation: str = "derived_from",
    actor: str | None = None,
    engine_job_id: str | None = None,
    code: str | None = None,
    retention: str = "preserve_history",
    provenance_extra: dict | None = None,
) -> Registration:
    """Registers a generated file and relates the exact resulting (or already stored identical) version to each source version."""
    for vid in source_version_ids:
        version = service.repo.get_version(vid)
        if version is None:
            raise ValueError(f"source version {vid} does not exist")
        service.authorizer.for_record(actor, "filesystem.read", "filesystem.files", version["file_id"])
    extra = {"derived_from": [str(v) for v in source_version_ids], **(provenance_extra or {})}
    reg = service.register(
        folder_id, name, content, code=code, retention=retention, actor=actor, provenance_extra=extra
    )
    if reg.outcome in ("created", "updated", "unchanged") and reg.version_id:
        with service.repo.transaction():
            for vid in source_version_ids:
                service.repo.link_relation(vid, reg.version_id, relation, engine_job_id, actor)
    return reg


def ancestry(service: FilesystemService, version_id: str, limit: int = 50) -> list[dict]:
    """Every relation on the way back to the originals, nearest first: {source, derived, relation}."""
    conn, frontier, seen = service.repo.conn, [str(version_id)], {str(version_id)}
    out: list[dict] = []
    while frontier and len(out) < limit:
        vid = frontier.pop(0)
        for r in conn.execute(
            "SELECT source_version_id, relation, engine_job_id FROM filesystem.file_relations WHERE derived_version_id = %s ORDER BY created_at",
            (vid,),
        ).fetchall():
            src = str(r["source_version_id"])
            out.append(
                {
                    "source": src,
                    "derived": vid,
                    "relation": r["relation"],
                    "engine_job_id": str(r["engine_job_id"]) if r["engine_job_id"] else None,
                }
            )
            if src not in seen:
                seen.add(src)
                frontier.append(src)
    return out


def derivatives(service: FilesystemService, version_id: str) -> list[dict]:
    """Versions directly derived from this one."""
    rows = service.repo.conn.execute(
        "SELECT derived_version_id, relation FROM filesystem.file_relations WHERE source_version_id = %s ORDER BY created_at",
        (version_id,),
    ).fetchall()
    return [{"derived": str(r["derived_version_id"]), "relation": r["relation"]} for r in rows]
