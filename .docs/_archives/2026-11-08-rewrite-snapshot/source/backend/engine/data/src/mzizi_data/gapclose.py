"""Reinforcement from data already collected (lane S, DEC-COMPLETION-FIRST).

* `close_satisfied` marks gaps `found` when the field has since been filled by a normal load (the gap queue is built once and a
  later import fills the column without telling it).
* `orpp_refill` is the refill handler for the `orpp` source: it searches the staged candidates of the ORPP register (no request
  is made) for the party and its field, and reports the value with the party's own ORPP attribution as evidence.
* `non_party_absent` closes the registry gaps of rows that are not registered parties (independent candidates, coalitions)
  as `known_absent`, so they are not chased again.

KNBS and IEBC handlers are not written: the fields they were meant to refill (population, results) are loaded as observations
and results, not as nullable columns, so no gap exists that they could serve.
Run: `python -m mzizi_data.gapclose [close|orpp|absent]` (DATABASE_URL points at the target database).
"""
from __future__ import annotations

import json
import sys
from typing import Any

import psycopg
from psycopg import sql

from . import jobs, reinforcement
from .reinforcement import Finding, Unsupported
from .seedroot import read_seed_json

ORPP_FIELDS = {"registry_identifier": "registryIdentifier", "abbreviation": "abbreviation", "valid_from": "validFrom"}
NON_PARTY_CODES = tuple(read_seed_json("ke/policy/non-party-codes.json")["codes"])


def payload_value(payload: dict[str, Any], field: str) -> Any:
    """The scalar a candidate payload holds for a column, or None (references are not values)."""
    key = ORPP_FIELDS.get(field)
    value = payload.get(key) if key else None
    return value if isinstance(value, (str, int, float)) and str(value).strip() else None


def close_satisfied(conn: psycopg.Connection) -> int:
    closed = 0
    for row in conn.execute("SELECT DISTINCT target_kind, field FROM engine.gaps WHERE status IN ('open', 'queued', 'not_found', 'ambiguous')").fetchall():
        schema, name = row["target_kind"].split(".")
        if row["field"] not in reinforcement._columns(conn, row["target_kind"]):
            continue
        q = sql.SQL(f"UPDATE engine.gaps g SET status = 'found', updated_at = now() FROM {{s}}.{{t}} t WHERE g.target_kind = %s AND g.field = %s AND g.target_id = t.id AND g.status IN ('open', 'queued', 'not_found', 'ambiguous') AND NOT ({reinforcement._missing(row['field'])})").format(s=sql.Identifier(schema), t=sql.Identifier(name))
        closed += conn.execute(q, (row["target_kind"], row["field"])).rowcount
    return closed


def non_party_absent(conn: psycopg.Connection) -> int:
    return conn.execute(
        "UPDATE engine.gaps g SET status = 'known_absent', updated_at = now() FROM political.parties p WHERE g.target_kind = 'political.parties' AND g.target_id = p.id AND p.code = ANY(%s) AND g.field IN ('registry_identifier', 'registry_authority_id', 'valid_from') AND g.status <> 'found'",
        (list(NON_PARTY_CODES),),
    ).rowcount


def orpp_refill(conn: psycopg.Connection):
    def handle(gap: dict[str, Any]) -> Finding:
        if gap["target_kind"] != "political.parties" or gap["field"] not in ORPP_FIELDS:
            raise Unsupported()
        party = conn.execute("SELECT code, name FROM political.parties WHERE id = %s", (gap["target_id"],)).fetchone()
        rows = conn.execute("SELECT payload FROM staging.candidates WHERE target_kind = 'political.parties' AND status <> 'rejected' AND (payload->>'code' = %s OR payload->>'name' = %s) ORDER BY created_at DESC", (party["code"], party["name"])).fetchall()
        for r in rows:
            value = payload_value(r["payload"], gap["field"])
            if value is None:
                continue
            attr = conn.execute("SELECT id FROM source.attributions WHERE target_kind = 'political.parties' AND target_id = %s ORDER BY created_at LIMIT 1", (gap["target_id"],)).fetchone()
            if attr is None:
                return Finding("not_found", detail={"note": "value staged but the party has no attribution to cite"})
            return Finding("found", value, str(attr["id"]), {"from": "staged ORPP candidate"})
        return Finding("not_found", detail={"searched": "staged ORPP party candidates", "candidates": len(rows)})
    return handle


def main(argv: list[str]) -> int:
    from .db import connect

    action = argv[0] if argv else "close"
    with connect() as conn:
        if action == "close":
            print(json.dumps({"closed_found": close_satisfied(conn), "known_absent": non_party_absent(conn)}))
        elif action == "orpp":
            reinforcement.register_refill("orpp", orpp_refill(conn), set(ORPP_FIELDS))
            n = reinforcement.enqueue_refills(conn, 500, kinds=["political.parties"])
            conn.commit()
            done = 0
            while jobs.run_once(conn, {"refill": reinforcement.refill_handler(conn)}, worker="refill"):
                done += 1
                conn.commit()
            print(json.dumps({"enqueued": n, "ran": done}))
        conn.commit()
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
