"""Reinforcement: coverage reports, the gap queue, refill jobs and claim resolution (DEC-CLAIMS-AND-CONFLICTS).

Coverage counts, per table and nullable field, records with a value, known absent (a gap closed as `known_absent`) and
unknown. Unknowns become `engine.gaps`; a `refill` job tries the gap's sources, logs every attempt in
`engine.gap_attempts`, and records a found value as a *proposed claim* with a `source.attributions` row, never in the
data table. Claims are all kept; `resolve` derives the winner (highest trust, then most recent) with corroboration and
a dispute flag.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any, Callable

import psycopg
from psycopg import sql
from psycopg.types.json import Jsonb

from . import jobs

# table -> fields worth chasing and the refill sources worth trying, in order.
RULES: dict[str, dict[str, list[str]]] = {
    "geography.units": {"parent_id": ["wikidata", "knbs"], "valid_from": ["wikidata"], "wikidata_id": ["wikidata"], "flag_marker": ["wikidata"], "emblem_marker": ["wikidata"]},
    "political.parties": {"registry_identifier": ["orpp"], "abbreviation": ["orpp", "wikidata"], "registry_authority_id": ["orpp"], "symbol_url": ["orpp"], "valid_from": ["orpp", "wikidata"], "wikidata_id": ["wikidata"], "logo_marker": ["wikidata"]},
    "governance.institutions": {"scope_geo_unit_id": ["wikidata"], "legal_basis_id": ["kenya_law"], "description": ["wikidata"], "valid_from": ["wikidata"], "wikidata_id": ["wikidata"], "logo_marker": ["wikidata"]},
    "governance.offices": {"description": ["wikidata"], "valid_from": ["wikidata"]},
    "governance.holders": {"valid_from": ["iebc", "wikidata"], "selection_procedure_id": ["kenya_law"]},
    "person.individuals": {"wikidata_id": ["wikidata"], "portrait_marker": ["wikidata"]},
}
# Existence markers are three-state: `unknown` (or null) is missing, `has` is present, `none` is known absent.
MARKER_FIELDS = {"flag_marker", "emblem_marker", "logo_marker", "portrait_marker"}
# Rows worth chasing for a field: a flag is only expected of levels the reference data says have one, and Wikidata ids are
# only sought for the country, counties and constituencies (wards are not in Wikidata as a rule).
LEVEL_JOIN = "JOIN reference.classifications lv ON lv.id = t.level_id"
EXTRA: dict[tuple[str, str], str] = {
    ("geography.units", "wikidata_id"): "t.level_id IN (SELECT id FROM reference.classifications WHERE code IN ('geography/level/country', 'geography/level/county', 'geography/level/constituency'))",
    ("geography.units", "flag_marker"): "t.level_id IN (SELECT id FROM reference.classifications WHERE flag_expected IS DISTINCT FROM 'none')",
    ("geography.units", "emblem_marker"): "t.level_id IN (SELECT id FROM reference.classifications WHERE emblem_expected IS DISTINCT FROM 'none')",
}


def _missing(column: str) -> str:
    return f"(t.{column} IS NULL OR t.{column}::text = 'unknown')" if column in MARKER_FIELDS else f"t.{column} IS NULL"


STALE_AFTER = timedelta(days=365)


def _columns(conn: psycopg.Connection, table: str) -> set[str]:
    schema, name = table.split(".")
    return {r["column_name"] for r in conn.execute("SELECT column_name FROM information_schema.columns WHERE table_schema = %s AND table_name = %s", (schema, name))}


def coverage(conn: psycopg.Connection, rules: dict[str, dict[str, list[str]]] | None = None) -> list[dict[str, Any]]:
    """One row per table and field: total, present, known_absent, unknown, plus claims waiting and disputes. Read-only.

    Only rows worth chasing count in the total (a ward is not expected to have a flag). A marker is present when `has`,
    known absent when `none`; for other fields a gap closed as `known_absent` counts as absent.
    """
    rows = []
    has_gaps = conn.execute("SELECT to_regclass('engine.gaps') IS NOT NULL AS ok").fetchone()["ok"]  # works before the migration
    for table, fields in (rules or RULES).items():
        schema, name = table.split(".")
        existing = _columns(conn, table)  # a rule for a column a pending migration has not created yet is skipped
        for column in fields:
            if column not in existing:
                continue
            where = EXTRA.get((table, column))
            marker = column in MARKER_FIELDS
            join = "LEFT JOIN engine.gaps g ON g.target_kind = %s AND g.target_id = t.id AND g.field = %s" if has_gaps else "LEFT JOIN (SELECT NULL::text AS status WHERE %s::text <> %s::text) g ON false"
            present = f"count(*) FILTER (WHERE t.{column}::text = 'has')" if marker else f"count(t.{column})"
            absent = f"count(*) FILTER (WHERE t.{column}::text = 'none')" if marker else f"count(*) FILTER (WHERE t.{column} IS NULL AND g.status = 'known_absent')"
            query = sql.SQL(f"SELECT count(*) AS total, {present} AS present, {absent} AS known_absent FROM {{s}}.{{t}} t ").format(s=sql.Identifier(schema), t=sql.Identifier(name)) + sql.SQL(join) + sql.SQL(f" WHERE {where}" if where else "")
            r = conn.execute(query, (table, column)).fetchone()
            claims = {"proposed": 0, "disputed": 0, "corroborated": 0}
            if has_gaps:
                c = conn.execute("""SELECT count(*) FILTER (WHERE c.review = 'proposed') AS proposed,
                    (SELECT count(*) FROM engine.claim_standings s WHERE s.target_kind = %s AND s.field = %s AND s.disputed) AS disputed,
                    (SELECT count(*) FROM engine.claim_standings s WHERE s.target_kind = %s AND s.field = %s AND s.corroboration > 1) AS corroborated
                    FROM engine.claims c WHERE c.target_kind = %s AND c.field = %s""", (table, column, table, column, table, column)).fetchone()
                claims = dict(c)
            rows.append({"table": table, "field": column, "total": r["total"], "present": r["present"], "known_absent": r["known_absent"], "unknown": r["total"] - r["present"] - r["known_absent"], **claims})
    return rows


# Records that belong to a jurisdiction and must carry a geography scope (DEC-JURISDICTION-WIDE-SCOPE): (label, from clause, jurisdiction expression, scope column).
SCOPE_CHECKS: list[tuple[str, str, str, str]] = [
    ("governance.institutions", "governance.institutions t", "t.jurisdiction_id", "t.scope_geo_unit_id"),
    ("governance.offices", "governance.offices t JOIN governance.institutions i ON i.id = t.institution_id", "i.jurisdiction_id", "t.scope_geo_unit_id"),
    ("finance.units", "finance.units t", "t.jurisdiction_id", "t.geo_unit_id"),
    ("statistical.datasets", "statistical.datasets t", "t.jurisdiction_id", "t.geo_unit_id"),
]


def scope_gaps(conn: psycopg.Connection) -> list[dict[str, Any]]:
    """Scope-gap check: current records of a jurisdiction that has a single root unit but no scope. A jurisdiction-wide record
    points at the root unit; a null is a known gap, not a normal state. Read-only; one row per table."""
    rows = []
    for label, source, jurisdiction, column in SCOPE_CHECKS:
        r = conn.execute(f"""SELECT count(*) AS total, count({column}) AS scoped,
            count(*) FILTER (WHERE {column} IS NULL AND (SELECT count(*) FROM geography.units r WHERE r.jurisdiction_id = {jurisdiction} AND r.parent_id IS NULL AND r.is_current) = 1) AS gaps
            FROM {source} WHERE t.is_current""").fetchone()
        rows.append({"table": label, "total": r["total"], "scoped": r["scoped"], "gaps": r["gaps"]})
    return rows


def format_scope_gaps(rows: list[dict[str, Any]]) -> str:
    lines = [f"{'scope check':26} {'total':>7} {'scoped':>8} {'gaps':>6}"]
    lines += [f"{r['table']:26} {r['total']:>7} {r['scoped']:>8} {r['gaps']:>6}" for r in rows]
    return "\n".join(lines)


def format_coverage(rows: list[dict[str, Any]]) -> str:
    lines = [f"{'table':26} {'field':20} {'total':>7} {'present':>8} {'absent':>7} {'unknown':>8} {'proposed':>8} {'disputed':>8}  coverage"]
    for r in rows:
        pct = 100 * (r["present"] + r["known_absent"]) / r["total"] if r["total"] else 100.0
        lines.append(f"{r['table']:26} {r['field']:20} {r['total']:>7} {r['present']:>8} {r['known_absent']:>7} {r['unknown']:>8} {r.get('proposed', 0):>8} {r.get('disputed', 0):>8}  {pct:5.1f}%")
    return "\n".join(lines)


def coverage_markdown(rows: list[dict[str, Any]]) -> str:
    """The coverage report as a Markdown table, for the status document."""
    lines = ["| Table | Field | Rows worth chasing | Present | Known absent | Unknown | Claims proposed | Disputed | Coverage |", "|---|---|---:|---:|---:|---:|---:|---:|---:|"]
    for r in rows:
        pct = 100 * (r["present"] + r["known_absent"]) / r["total"] if r["total"] else 100.0
        lines.append(f"| {r['table']} | {r['field']} | {r['total']} | {r['present']} | {r['known_absent']} | {r['unknown']} | {r.get('proposed', 0)} | {r.get('disputed', 0)} | {pct:.1f}% |")
    return "\n".join(lines)


def build_gaps(conn: psycopg.Connection, rules: dict[str, dict[str, list[str]]] | None = None, limit: int | None = None) -> int:
    """Queue every missing field as an open gap (idempotent). Gaps already tried keep their status and log."""
    created = 0
    for table, fields in (rules or RULES).items():
        schema, name = table.split(".")
        existing = _columns(conn, table)
        for column, refill_sources in fields.items():
            if column not in existing:
                continue
            extra = EXTRA.get((table, column))
            query = sql.SQL(f"""INSERT INTO engine.gaps (target_kind, target_id, field, refill_sources)
                SELECT %s, t.id, %s, %s FROM {{s}}.{{t}} t WHERE {_missing(column)}{f" AND {extra}" if extra else ""}
                ON CONFLICT (target_kind, target_id, field) DO NOTHING""").format(s=sql.Identifier(schema), t=sql.Identifier(name))
            created += conn.execute(query, (table, column, Jsonb(refill_sources))).rowcount
    return created


def mark_disputed_and_stale(conn: psycopg.Connection, now: datetime | None = None) -> int:
    """Disputed standings and old winning claims re-enter the queue as gaps (reason disputed or stale)."""
    now = now or datetime.now(timezone.utc)
    n = conn.execute("""INSERT INTO engine.gaps (target_kind, target_id, field, reason, status)
        SELECT s.target_kind, s.target_id, s.field, 'disputed', 'open' FROM engine.claim_standings s WHERE s.disputed
        ON CONFLICT (target_kind, target_id, field) DO UPDATE SET reason = 'disputed', status = 'open', updated_at = now() WHERE engine.gaps.status <> 'open'""").rowcount
    n += conn.execute("""INSERT INTO engine.gaps (target_kind, target_id, field, reason, status)
        SELECT s.target_kind, s.target_id, s.field, 'stale', 'open' FROM engine.claim_standings s JOIN engine.claims c ON c.id = s.winning_claim_id
        WHERE NOT s.disputed AND c.observed_at < %s
        ON CONFLICT (target_kind, target_id, field) DO UPDATE SET reason = 'stale', status = 'open', updated_at = now() WHERE engine.gaps.status = 'found'""", (now - STALE_AFTER,)).rowcount
    return n


def queue(conn: psycopg.Connection, limit: int = 50, sources: list[str] | None = None, fields: list[str] | None = None, kinds: list[str] | None = None) -> list[dict[str, Any]]:
    """The gap queue: open gaps, and not-found or ambiguous ones, whose retry time has passed, highest priority first.
    With `sources`, only gaps that name at least one of those sources."""
    return conn.execute("SELECT * FROM engine.gaps WHERE (status = 'open' OR status IN ('not_found', 'ambiguous')) AND (retry_after IS NULL OR retry_after <= now()) AND (%s::text[] IS NULL OR refill_sources ?| %s::text[]) AND (%s::text[] IS NULL OR field = ANY(%s)) AND (%s::text[] IS NULL OR target_kind = ANY(%s)) ORDER BY priority DESC, created_at LIMIT %s", (sources, sources, fields, fields, kinds, kinds, limit)).fetchall()


def gap_report(conn: psycopg.Connection) -> list[dict[str, Any]]:
    return conn.execute("""SELECT target_kind, field, status, reason, count(*) AS n FROM engine.gaps GROUP BY 1, 2, 3, 4 ORDER BY 1, 2, 3""").fetchall()


# ---- refill jobs -------------------------------------------------------------------------------------------------

@dataclass
class Finding:
    outcome: str  # found | not_found | ambiguous
    value: Any = None
    attribution_id: str | None = None  # a source.attributions row the handler already wrote for the evidence
    detail: dict[str, Any] = field(default_factory=dict)


class Unsupported(Exception):
    """A handler does not refill this kind of field: the source is skipped without logging a search that never happened."""


RefillHandler = Callable[[dict[str, Any]], Finding]
REFILL_SOURCES: dict[str, RefillHandler] = {}
REFILL_FIELDS: dict[str, set[str] | None] = {}  # fields a handler can refill; None means any


def register_refill(code: str, handler: RefillHandler, fields: set[str] | None = None) -> None:
    """Other lanes register a handler per source (wikidata, orpp, knbs, iebc...). A handler only searches and reports.
    `fields` lists the fields it can refill, so gaps it cannot serve are never queued for it."""
    REFILL_SOURCES[code] = handler
    REFILL_FIELDS[code] = fields


def enqueue_refills(conn: psycopg.Connection, limit: int = 50, fields: list[str] | None = None, kinds: list[str] | None = None) -> int:
    n = 0
    for gap in queue(conn, limit, list(REFILL_SOURCES), fields, kinds):
        sources = [code for code in gap["refill_sources"] or [] if code in REFILL_SOURCES and (REFILL_FIELDS.get(code) is None or gap["field"] in REFILL_FIELDS[code])]
        if not sources:
            continue  # no handler registered for any source of this gap: it stays open rather than logging a search that never happened
        _, created = jobs.enqueue(conn, "refill", {"gap_id": str(gap["id"])}, rerun=gap["attempts"] > 0)
        if created:
            conn.execute("UPDATE engine.gaps SET status = 'queued', updated_at = now() WHERE id = %s", (gap["id"],))
            n += 1
    return n


def refill_handler(conn: psycopg.Connection, retry_days: int = 30) -> Callable[[jobs.Job], tuple[dict[str, Any], str | None]]:
    """Job handler: try each source not already tried for the gap; log every attempt; a found value becomes a proposed claim."""
    def handle(job: jobs.Job) -> tuple[dict[str, Any], str | None]:
        gap = conn.execute("SELECT * FROM engine.gaps WHERE id = %s", (job.input["gap_id"],)).fetchone()
        tried = {r["refill_source"] for r in conn.execute("SELECT refill_source FROM engine.gap_attempts WHERE gap_id = %s AND outcome IN ('found', 'not_found', 'ambiguous') AND created_at > now() - make_interval(days => %s)", (gap["id"], retry_days))}
        final, outcomes, tried_any = "not_found", {}, False
        for code in gap["refill_sources"]:
            if code in tried or code not in REFILL_SOURCES:
                continue
            try:
                f = REFILL_SOURCES[code](dict(gap))
            except Unsupported:
                continue
            except Exception as error:
                conn.execute("INSERT INTO engine.gap_attempts (gap_id, refill_source, outcome, result, job_id) VALUES (%s, %s, 'error', %s, %s)", (gap["id"], code, Jsonb({"error": str(error)[:500]}), job.id))
                continue
            conn.execute("INSERT INTO engine.gap_attempts (gap_id, refill_source, outcome, result, job_id) VALUES (%s, %s, %s, %s, %s)", (gap["id"], code, f.outcome, Jsonb({"value": f.value, **f.detail}), job.id))
            outcomes[code] = f.outcome
            tried_any = True
            if f.outcome == "found":
                if f.attribution_id is None:
                    raise jobs.NonRetryable(f"refill source {code} found a value without evidence")
                add_claim(conn, gap["target_kind"], gap["target_id"], gap["field"], f.value, f.attribution_id)
                final = "found"
                break
            if f.outcome == "ambiguous":
                final = "ambiguous"
        if not tried_any and not outcomes:
            conn.execute("UPDATE engine.gaps SET status = 'open', updated_at = now() WHERE id = %s AND status = 'queued'", (gap["id"],))
            return {"gap_id": str(gap["id"]), "outcome": "skipped", "attempts": {}}, None
        conn.execute("""UPDATE engine.gaps SET status = %s, attempts = attempts + 1, last_attempt_at = now(),
            retry_after = CASE WHEN %s = 'found' THEN NULL ELSE now() + make_interval(days => %s) END, updated_at = now() WHERE id = %s""", (final, final, retry_days, gap["id"]))
        return {"gap_id": str(gap["id"]), "outcome": final, "attempts": outcomes}, None
    return handle


# ---- claims ------------------------------------------------------------------------------------------------------

def value_hash(value: Any) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":"), default=str).encode()).hexdigest()


def add_claim(conn: psycopg.Connection, kind: str, target_id: Any, fld: str, value: Any, attribution_id: Any, valid_from=None, valid_to=None) -> str:
    """Record a claim, taking trust from the publisher of the attribution's document (reliability x attribution confidence)."""
    a = conn.execute("""SELECT a.confidence, p.id AS publisher_id, p.reliability FROM source.attributions a
        JOIN source.documents d ON d.id = a.document_id JOIN source.publishers p ON p.id = d.publisher_id WHERE a.id = %s""", (attribution_id,)).fetchone()
    if a is None:
        raise ValueError("claim needs an existing attribution")
    trust = round((a["reliability"] if a["reliability"] is not None else 0.5) * (a["confidence"] if a["confidence"] is not None else 1.0), 4)
    row = conn.execute("""INSERT INTO engine.claims (target_kind, target_id, field, value, value_hash, attribution_id, publisher_id, trust, valid_from, valid_to)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (attribution_id, field, value_hash) DO UPDATE SET observed_at = now() RETURNING id""",
        (kind, target_id, fld, Jsonb(value), value_hash(value), attribution_id, a["publisher_id"], trust, valid_from, valid_to)).fetchone()
    rebuild_standing(conn, kind, target_id, fld)
    return str(row["id"])


@dataclass
class Claim:
    id: str
    value_hash: str
    publisher: str | None
    trust: float
    observed_at: datetime


@dataclass
class Standing:
    winner: str
    corroboration: int
    disputed: bool
    distinct_values: int
    why: str


def resolve(claims: list[Claim]) -> Standing | None:
    """Winner = highest trust, then most recent. Corroboration = independent publishers behind the winning value.
    Disputed = more than one distinct value among the claims. Nothing is discarded."""
    if not claims:
        return None
    win = max(claims, key=lambda c: (c.trust, c.observed_at))
    agree = {c.publisher or c.id for c in claims if c.value_hash == win.value_hash}
    values = {c.value_hash for c in claims}
    why = f"highest trust {win.trust:.2f}" + (f" of {len(claims)} claims" if len(claims) > 1 else "")
    return Standing(win.id, len(agree), len(values) > 1, len(values), why)


def rebuild_standing(conn: psycopg.Connection, kind: str, target_id: Any, fld: str) -> Standing | None:
    rows = conn.execute("SELECT id, value_hash, publisher_id, trust, observed_at FROM engine.claims WHERE target_kind = %s AND target_id = %s AND field = %s AND review <> 'rejected'", (kind, target_id, fld)).fetchall()
    st = resolve([Claim(str(r["id"]), r["value_hash"], str(r["publisher_id"]) if r["publisher_id"] else None, float(r["trust"]), r["observed_at"]) for r in rows])
    if st is None:
        conn.execute("DELETE FROM engine.claim_standings WHERE target_kind = %s AND target_id = %s AND field = %s", (kind, target_id, fld))
        return None
    conn.execute("""INSERT INTO engine.claim_standings (target_kind, target_id, field, winning_claim_id, corroboration, disputed, distinct_values, why)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (target_kind, target_id, field) DO UPDATE SET winning_claim_id = EXCLUDED.winning_claim_id,
        corroboration = EXCLUDED.corroboration, disputed = EXCLUDED.disputed, distinct_values = EXCLUDED.distinct_values, why = EXCLUDED.why, computed_at = now()""",
        (kind, target_id, fld, st.winner, st.corroboration, st.disputed, st.distinct_values, st.why))
    return st


def rebuild_all_standings(conn: psycopg.Connection) -> int:
    """Recompute every standing from its non-rejected claims (after a reviewer rejected claims)."""
    n = 0
    for r in conn.execute("SELECT DISTINCT target_kind, target_id, field FROM engine.claims").fetchall():
        rebuild_standing(conn, r["target_kind"], r["target_id"], r["field"])
        n += 1
    return n
