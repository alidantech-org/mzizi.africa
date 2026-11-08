"""Candidate production (DATA_INTAKE_PLAN.md stage 6): staging rows with a natural-key hash for idempotency.

Rows are written to `staging` only. A candidate whose personal-data scan finds categories the
assessment did not anticipate is quarantined with an issue, never promoted silently.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from typing import Any

import psycopg
from psycopg.types.json import Jsonb

from . import compliance
from .structure import transforms


def _hash(value: Any) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, default=str).encode()).hexdigest()


@dataclass
class CandidateStats:
    created: int = 0
    unchanged: int = 0
    superseding: int = 0
    quarantined: int = 0
    invalid: int = 0
    ids: list[str] = field(default_factory=list)


def create_run(conn: psycopg.Connection, dataset: str, mapping_version: str, capture_id: str | None, extraction_result_id: str | None) -> str:
    return str(conn.execute("INSERT INTO staging.runs (dataset, mapping_version, capture_id, extraction_result_id, status) VALUES (%s, %s, %s, %s, 'running') RETURNING id", (dataset, mapping_version, capture_id, extraction_result_id)).fetchone()["id"])


def finish_run(conn: psycopg.Connection, run_id: str, status: str = "completed") -> None:
    conn.execute("UPDATE staging.runs SET status = %s WHERE id = %s", (status, run_id))


def map_record(mapping: dict, record: dict) -> tuple[dict, list[str]]:
    """Applies a mapping's fields to an extracted record. A failed transform is reported, not guessed."""
    payload: dict[str, Any] = {}
    errors: list[str] = []
    for target, spec in mapping["fields"].items():
        try:
            if "const" in spec:
                value = spec["const"]
            else:
                value = record.get(spec["from"].split(".")[0])
                if value is not None and "transform" in spec:
                    value = transforms.apply(spec["transform"], value)
            payload[target] = value
            if "precision" in spec and value is not None:
                payload[f"{target}Precision"] = spec["precision"]
        except Exception as error:
            payload[target] = None
            errors.append(f"{target}: {error}")
    return payload, errors


def add_candidates(
    conn: psycopg.Connection,
    run_id: str,
    mapping: dict,
    records: list[tuple[str, dict]],
    extraction_result_id: str,
    allowed_categories: list[str],
    excluded_categories: list[str],
    method: str = "extracted",
) -> CandidateStats:
    """records: (segment key, extracted record). Idempotent on (target, natural key hash, payload hash)."""
    stats = CandidateStats()
    target = mapping["target_kind"]
    for segment_key, record in records:
        payload, errors = map_record(mapping, record)
        key_values = [payload.get(k) for k in mapping["key"]]
        status, issues = "pending", [("transform", "error", e) for e in errors]
        if any(v in (None, "") for v in key_values):
            status = "invalid"
            issues.append(("natural_key", "error", f"key field(s) {mapping['key']} are empty"))
        found = compliance.scan_personal_data({**record, **{k: v for k, v in payload.items() if isinstance(v, str)}})
        unexpected = compliance.unexpected_categories(found, allowed_categories, excluded_categories)
        if unexpected:
            status = "quarantined"
            issues.append(("personal_data", "error", f"unexpected personal data categories: {', '.join(sorted(unexpected))}"))
        key_hash, payload_hash = _hash([target, key_values]), _hash(payload)
        existing = conn.execute("SELECT id, status, payload_hash FROM staging.candidates WHERE target_kind = %s AND natural_key_hash = %s ORDER BY created_at DESC LIMIT 1", (target, key_hash)).fetchone()
        if existing and existing["payload_hash"] == payload_hash:
            stats.unchanged += 1
            continue
        row = conn.execute(
            """INSERT INTO staging.candidates (run_id, target_kind, natural_key_hash, payload_hash, payload, extraction_result_id, segment_key, locator, method, status, supersedes_candidate_id, key_fields)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (run_id, target, key_hash, payload_hash, Jsonb(payload), extraction_result_id, segment_key, Jsonb({"segment": segment_key}), method, status, existing["id"] if existing else None, list(mapping["key"])),
        ).fetchone()
        cid = str(row["id"])
        stats.ids.append(cid)
        for rule, severity, message in issues:
            conn.execute("INSERT INTO staging.issues (candidate_id, rule, severity, message) VALUES (%s, %s, %s, %s)", (cid, rule, severity, message))
        if existing:
            stats.superseding += 1
            conn.execute("UPDATE staging.candidates SET status = 'superseded' WHERE id = %s AND status IN ('pending', 'invalid')", (existing["id"],))
        stats.created += 1
        stats.quarantined += status == "quarantined"
        stats.invalid += status == "invalid"
    return stats
