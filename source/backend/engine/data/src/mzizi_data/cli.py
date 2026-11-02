"""Command line: mzizi-data validate <bundle-dir> [--family <dir>]"""
from __future__ import annotations

import argparse
import json
import sys

from .structure import bundle as bundle_mod
from .structure.validate import validate


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="mzizi-data")
    sub = parser.add_subparsers(dest="command", required=True)
    v = sub.add_parser("validate", help="validate a structure bundle")
    v.add_argument("bundle")
    v.add_argument("--family")
    v.add_argument("--json", action="store_true")
    stop = sub.add_parser("stop", help="incident: stop collection for a site, cancel its pending jobs and quarantine its candidates")
    stop.add_argument("site_code")
    stop.add_argument("--reason", required=True)
    args = parser.parse_args(argv)
    if args.command == "validate":
        report = validate(bundle_mod.load(args.bundle), bundle_mod.load(args.family) if args.family else None)
        if args.json:
            print(json.dumps(report.to_json(), indent=2))
        else:
            for message in report.errors:
                print(f"error: {message}")
            for message in report.warnings:
                print(f"warning: {message}")
            print("valid" if report.ok else f"invalid ({len(report.errors)} errors)")
        return 0 if report.ok else 1
    if args.command == "stop":
        from . import incidents, registry
        from .db import connect

        with connect() as conn:
            site = registry.site_by_code(conn, args.site_code)
            counts = incidents.stop_collection(conn, site["id"], args.reason, kind="manual")
            conn.commit()
        print(f"stopped {args.site_code}: {counts['cancelledJobs']} jobs cancelled, {counts['quarantinedCandidates']} candidates quarantined")
        return 0
    return 2


if __name__ == "__main__":
    sys.exit(main())
