"""Command line entries for the statistics loaders, kept apart from cli.py so each loader adds its own block here."""
from __future__ import annotations

import argparse
import json


def register(sub: argparse._SubParsersAction) -> None:
    m = sub.add_parser("measure", help="compute area, perimeter and label point of every unit from its current boundary shape and stage them as derived observations")
    m.add_argument("--store", default=".data/objects")
    m.add_argument("--jurisdiction", default="ke")
    c = sub.add_parser("measure-compare-hdx", help="compare promoted county and constituency areas against the HDX COD-AB shapes")
    c.add_argument("--hdx-dir", default=".data/raw/geo/hdx/unzipped")
    c.add_argument("--threshold", type=float, default=0.05)
    p = sub.add_parser("stats-promote", help="validate, review (agent account, rationale) and promote one staging run")
    p.add_argument("run_id")
    p.add_argument("rationale")
    p.add_argument("--env", default=".data/real.env")


def dispatch(args: argparse.Namespace) -> int | None:
    from .db import connect
    from .files import LocalDirectoryStore

    if args.command == "measure":
        from . import measure

        with connect() as conn:
            out = measure.run(conn, LocalDirectoryStore(conn, args.store), args.jurisdiction)
        print(json.dumps({"rows": out["rows"], "label_points_set": out["label_points_set"]}))
        for name, st in out["stats"].items():
            print(f"{name}: {st.created} new, {st.unchanged} unchanged (run {out['runs'][name]})")
        return 0
    if args.command == "measure-compare-hdx":
        from . import measure

        with connect() as conn:
            print(json.dumps(measure.compare_hdx(conn, args.hdx_dir, args.threshold), indent=1))
        return 0
    if args.command == "stats-promote":
        from . import statload

        for step, text in statload.promote_run(args.run_id, args.rationale, args.env).items():
            print(f"[{step}] {text}")
        return 0
    return None
