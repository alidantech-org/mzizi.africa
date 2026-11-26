"""PostgreSQL adapter for pattern generation: runs the database function `template.generate_pattern` and reads the coverage views.

The database owns the generation (its rules and checks are generated from the Dryv contracts and the project pack); this
adapter only calls it and parses what comes back into named contracts. It never decides what a pattern produces.
"""

from __future__ import annotations

import psycopg
from psycopg.types.json import Jsonb

from mzizi_engine.persistence.postgres.connection import Connection
from mzizi_engine.runtime.contracts.base import Frozen


class PatternNotFound(LookupError):
    """No pattern has the requested code."""


class Generated(Frozen):
    """One pattern's result from the routine: how many rows it created (zero on a repeat run)."""

    pattern: str
    created: int


class GenerateOutput(Frozen):
    results: tuple[Generated, ...]


class CoverageRow(Frozen):
    """One pending slot or gap: which queue it belongs to, the table and row, its code and what is missing."""

    queue: str
    table_name: str
    row_id: str
    code: str
    missing: str


class PostgresTemplates:
    def __init__(self, conn: Connection) -> None:
        self._conn = conn

    def pattern_id(self, code: str) -> str:
        row = self._conn.execute(
            "SELECT id::text AS id FROM template.patterns WHERE code = %s AND deleted_at IS NULL", (code,)
        ).fetchone()
        if row is None:
            raise PatternNotFound(code)
        return str(row["id"])

    def generate(self, codes: tuple[str, ...]) -> GenerateOutput:
        """Run patterns through the provided routine `template.generate_json` (operation `template.GeneratePatterns`)."""
        try:
            row = self._conn.execute(
                "SELECT template.generate_json(%s, '{}'::jsonb) AS result", (Jsonb({"patterns": list(codes)}),)
            ).fetchone()
        except psycopg.errors.RaiseException as error:
            if "pattern_not_found" in str(error):
                raise PatternNotFound(error.diag.message_detail or "") from error
            raise
        if row is None:
            raise RuntimeError("template.generate_json returned no row")
        return GenerateOutput.model_validate_json(str(row["result"]))

    def generate_pattern(self, pattern_id: str) -> int:
        """Run every root template of the pattern; returns the number of rows created (zero on a repeat run)."""
        row = self._conn.execute("SELECT template.generate_pattern(%s::uuid) AS made", (pattern_id,)).fetchone()
        if row is None:
            raise RuntimeError("template.generate_pattern returned no row")
        return int(row["made"])

    def pending(self, queue: str, limit: int) -> tuple[CoverageRow, ...]:
        """The pending queue (optionally one queue), the work list the engine researches and fills."""
        rows = self._conn.execute(
            "SELECT queue, table_name, row_id::text AS row_id, code, missing FROM template.pending_queue"
            " WHERE (%s = '' OR queue = %s) ORDER BY queue, code LIMIT %s",
            (queue, queue, limit),
        ).fetchall()
        return tuple(CoverageRow.model_validate(row) for row in rows)

    def counts(self) -> dict[str, int]:
        rows = self._conn.execute("SELECT queue, count(*) AS n FROM template.pending_queue GROUP BY queue").fetchall()
        return {str(row["queue"]): int(row["n"]) for row in rows}
