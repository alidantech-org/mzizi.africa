"""Registration of sources and retrievals in the `source` schema (DATA_INTAKE_PLAN.md stages 1 and 2).

The data engine writes document and capture rows and the methods it uses; it never writes
attributions or verifications (promotion owns those).
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone

import psycopg


def _kind_id(conn: psycopg.Connection, scheme: str, code: str) -> str:
    row = conn.execute("SELECT id FROM reference.classifications WHERE scheme = %s AND code = %s", (scheme, f"{scheme}/{code}")).fetchone()
    if not row:
        raise LookupError(f"classification {scheme}/{code} is not seeded")
    return str(row["id"])


def ensure_publisher(conn: psycopg.Connection, code: str, name: str, kind: str = "institution", jurisdiction_id: str | None = None, website_url: str | None = None) -> str:
    row = conn.execute("SELECT id FROM source.publishers WHERE code = %s", (code,)).fetchone()
    if row:
        return str(row["id"])
    return str(
        conn.execute(
            "INSERT INTO source.publishers (code, name, kind_id, jurisdiction_id, website_url, created_at, updated_at, version) VALUES (%s, %s, %s, %s, %s, now(), now(), 1) RETURNING id",
            (code, name, _kind_id(conn, "source/publisher-kind", kind), jurisdiction_id, website_url),
        ).fetchone()["id"]
    )


def ensure_method(conn: psycopg.Connection, kind: str, name: str, tool: str, tool_version: str, model: str | None = None) -> str:
    row = conn.execute("SELECT id FROM source.methods WHERE kind = %s AND name = %s AND tool = %s AND tool_version = %s AND model IS NOT DISTINCT FROM %s", (kind, name, tool, tool_version, model)).fetchone()
    if row:
        return str(row["id"])
    return str(
        conn.execute(
            "INSERT INTO source.methods (kind, name, tool, tool_version, model, created_at, updated_at, version) VALUES (%s, %s, %s, %s, %s, now(), now(), 1) RETURNING id",
            (kind, name, tool, tool_version, model),
        ).fetchone()["id"]
    )


@dataclass
class DocumentSpec:
    publisher_id: str
    title: str
    kind: str
    url: str | None = None
    licence: str | None = None
    citation: str | None = None
    language: str | None = None
    published_on: date | None = None
    published_on_precision: str | None = None
    jurisdiction_id: str | None = None
    site_id: str | None = None


def ensure_document(conn: psycopg.Connection, spec: DocumentSpec) -> str:
    row = conn.execute("SELECT id FROM source.documents WHERE publisher_id = %s AND title = %s AND url IS NOT DISTINCT FROM %s", (spec.publisher_id, spec.title, spec.url)).fetchone()
    if row:
        return str(row["id"])
    return str(
        conn.execute(
            """INSERT INTO source.documents (publisher_id, title, kind_id, url, licence, citation, language, published_on, published_on_precision, jurisdiction_id, site_id, created_at, updated_at, version)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now(), now(), 1) RETURNING id""",
            (spec.publisher_id, spec.title, _kind_id(conn, "source/document-kind", spec.kind), spec.url, spec.licence, spec.citation, spec.language, spec.published_on, spec.published_on_precision, spec.jurisdiction_id, spec.site_id),
        ).fetchone()["id"]
    )


def record_capture(
    conn: psycopg.Connection,
    document_id: str,
    file_version_id: str,
    content_hash: str,
    url: str | None,
    tool: str,
    http_status: int | None = None,
    retrieved_at: datetime | None = None,
    site_id: str | None = None,
    domain_id: str | None = None,
    structure_version_id: str | None = None,
    family_version_id: str | None = None,
    assessment_id: str | None = None,
) -> str:
    """Every retrieval is a new capture row, even for identical bytes; raw evidence is never replaced."""
    return str(
        conn.execute(
            """INSERT INTO source.captures (document_id, file_version_id, content_hash, retrieved_url, http_status, tool, retrieved_at, site_id, domain_id, structure_version_id, family_version_id, assessment_id, created_at, updated_at, version)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, now(), now(), 1) RETURNING id""",
            (document_id, file_version_id, content_hash, url, http_status, tool, retrieved_at or datetime.now(timezone.utc), site_id, domain_id, structure_version_id, family_version_id, assessment_id),
        ).fetchone()["id"]
    )
