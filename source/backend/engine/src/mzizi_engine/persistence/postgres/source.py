"""Writes of Source-owned derivation: which exact input an output was made from.

Filesystem owns bytes only. When a promotion or preparation derives one exact file version from another, the engine records the
connection here as a classified `source.relationships` row (output made from input); no engine run is required.
"""

from __future__ import annotations

from uuid import UUID, uuid4

from mzizi_engine.persistence.postgres.connection import Connection


def record_file_derivation(
    connection: Connection,
    *,
    input_version_id: str,
    output_version_id: str,
    kind_id: UUID,
    method: str | None,
) -> bool:
    """Record that one file version was made from another; `False` when this exact connection already exists."""
    if input_version_id == output_version_id:
        raise ValueError("a file version cannot be derived from itself")
    existing = connection.execute(
        "SELECT 1 AS found FROM source.relationships WHERE kind_id = %s AND input_file_version_id = %s "
        "AND output_file_version_id = %s AND deleted_at IS NULL LIMIT 1",
        (kind_id, UUID(input_version_id), UUID(output_version_id)),
    ).fetchone()
    if existing is not None:
        return False
    connection.execute(
        "INSERT INTO source.relationships (id, created_at, updated_at, version, kind_id, input_file_version_id, "
        "output_file_version_id, method) VALUES (%s, now(), now(), 1, %s, %s, %s, %s)",
        (uuid4(), kind_id, UUID(input_version_id), UUID(output_version_id), method),
    )
    return True
