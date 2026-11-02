"""Command line entries for the party and money loaders (ORPP, Political Parties Fund), kept apart from cli.py."""
from __future__ import annotations

import argparse
import json


def register(sub: argparse._SubParsersAction) -> None:
    s = sub.add_parser("import-orpp-parties", help="preserve the ORPP register PDFs, match rows to stored parties, stage candidates for new parties only; writes a plan/report file")
    s.add_argument("--full", required=True)
    s.add_argument("--provisional", required=True)
    s.add_argument("--plan", default=".data/reports/orpp-parties-plan.json")
    s.add_argument("--store", default=".data/objects")
    a = sub.add_parser("apply-orpp-parties", help="after the new parties are promoted: update matched parties (audited), add source attributions, restricted contacts and symbol documents")
    a.add_argument("--plan", default=".data/reports/orpp-parties-plan.json")
    a.add_argument("--actor", required=True, help="the approving account id (agent or person)")
    a.add_argument("--rationale", required=True)
    a.add_argument("--store", default=".data/objects")


def dispatch(args: argparse.Namespace) -> int | None:
    from pathlib import Path

    from .db import connect
    from .files import LocalDirectoryStore

    if args.command == "import-orpp-parties":
        from .imports import orpp_parties

        with connect() as conn:
            out = orpp_parties.stage_register(conn, LocalDirectoryStore(conn, args.store), args.full, args.provisional, args.plan)
        print(json.dumps(out.report["counts"]))
        if out.stats:
            print(f"party candidates: {out.stats.created} new, {out.stats.unchanged} unchanged, {out.stats.invalid} invalid, {out.stats.quarantined} quarantined (run {out.run_id})")
        return 0
    if args.command == "apply-orpp-parties":
        from .imports import orpp_parties

        with connect() as conn:
            print(json.dumps(orpp_parties.apply_register(conn, LocalDirectoryStore(conn, args.store), args.plan, args.actor, args.rationale)))
        return 0
    return None
