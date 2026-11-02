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
    geo = sub.add_parser("import-geoboundaries", help="stage unit and boundary candidates from downloaded geoBoundaries files")
    geo.add_argument("directory")
    geo.add_argument("--iso3", default="KEN")
    geo.add_argument("--jurisdiction", default=None, help="check only; the jurisdiction follows from the ISO3 code")
    geo.add_argument("--store", default=".data/objects", help="local object store directory")
    st = sub.add_parser("structure", help="site structure versions: submit, batch, list, activate, demote")
    ssub = st.add_subparsers(dest="action", required=True)
    for name in ("submit", "batch"):
        c = ssub.add_parser(name)
        c.add_argument("path")
        c.add_argument("--agent", required=True, help="the authoring agent or tool name")
        c.add_argument("--model")
        c.add_argument("--family", help="family bundle directory for a site that extends it (submit only)")
        c.add_argument("--store", default=".data/objects")
    lst = ssub.add_parser("list")
    lst.add_argument("code")
    act = ssub.add_parser("activate")
    act.add_argument("version_id")
    dem = ssub.add_parser("demote")
    dem.add_argument("version_id")
    dem.add_argument("--reason", required=True)
    wb = sub.add_parser("import-worldbank", help="stage population candidates from a saved World Bank SP.POP.TOTL JSON file")
    wb.add_argument("file")
    wb.add_argument("--iso3", required=True)
    wb.add_argument("--store", default=".data/objects")
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
    if args.command == "import-geoboundaries":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import geoboundaries

        with connect() as conn:
            result = geoboundaries.import_directory(conn, LocalDirectoryStore(conn, args.store), args.directory, args.iso3, args.jurisdiction)
        for item in result.levels:
            print(f"{item.level}: units {item.units.created} new / {item.units.unchanged} unchanged (run {item.unit_run}), boundaries {item.boundaries.created} new / {item.boundaries.unchanged} unchanged (run {item.boundary_run})")
        return 0
    if args.command == "structure":
        from . import batch
        from .db import connect
        from .files import LocalDirectoryStore

        with connect() as conn:
            if args.action in ("submit", "batch"):
                store = LocalDirectoryStore(conn, args.store)
                results = [batch.submit(conn, store, args.path, args.agent, args.model, args.family)] if args.action == "submit" else batch.submit_batch(conn, store, args.path, args.agent, args.model)
                conn.commit()
                for r in results:
                    print(f"{r.status:9} {r.site_code} {('v' + str(r.number)) if r.number else ''} {r.directory}")
                    for e in r.errors[:5]:
                        print(f"   error: {e}")
                return 0 if all(r.status == "validated" for r in results) else 1
            if args.action == "list":
                for v in batch.list_versions(conn, args.code):
                    print(f"v{v['number']:<3} {v['status']:10} {'current' if v['is_current'] else '':8} {v['id']}")
            elif args.action == "activate":
                batch.activate(conn, args.version_id)
                conn.commit()
                print("activated (collection still requires an approved assessment)")
            elif args.action == "demote":
                batch.demote(conn, args.version_id, args.reason)
                conn.commit()
                print("demoted")
        return 0
    if args.command == "import-worldbank":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import worldbank

        with connect() as conn:
            out = worldbank.import_population(conn, LocalDirectoryStore(conn, args.store), args.file, args.iso3)
        for name in worldbank.ORDER:
            print(f"{name}: {out.stats[name].created} new, {out.stats[name].unchanged} unchanged (run {out.runs[name]})")
        return 0
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
