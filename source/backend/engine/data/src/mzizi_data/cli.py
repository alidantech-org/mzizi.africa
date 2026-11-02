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
    bt = sub.add_parser("import-budget-table", help="stage fiscal year, unit and budget candidates from a budget table PDF")
    bt.add_argument("file")
    bt.add_argument("--jurisdiction", required=True)
    bt.add_argument("--fiscal-year", required=True)
    bt.add_argument("--title", required=True)
    bt.add_argument("--publisher-code", required=True)
    bt.add_argument("--publisher-name", required=True)
    bt.add_argument("--currency", default=None, help="used only when the table states none")
    bt.add_argument("--ocr", action="store_true", help="read scanned pages with Tesseract")
    bt.add_argument("--stage", choices=["foundation", "budget"], default="foundation", help="foundation = fiscal year and units; budget = budgets, after those are promoted")
    bt.add_argument("--store", default=".data/objects")
    bs = sub.add_parser("import-budget-summary", help="stage fiscal year, unit and budget candidates from a scanned 'summary of budget' page; refuses a table that does not add up")
    for name in ("file", "--jurisdiction", "--fiscal-year", "--title", "--publisher-code", "--publisher-name"):
        bs.add_argument(name, **({} if name == "file" else {"required": True}))
    bs.add_argument("--column", type=int, default=3, help="0-based amount column (default 3: the budget estimates of the year)")
    bs.add_argument("--url", default=None)
    bs.add_argument("--stage", choices=["foundation", "budget"], default="foundation")
    bs.add_argument("--store", default=".data/objects")
    mb = sub.add_parser("import-members", help="stage National Assembly and Senate members from fetched Parliament list pages (stages A, B, C)")
    mb.add_argument("directory")
    mb.add_argument("--stage", choices=["A", "B", "C"], required=True)
    mb.add_argument("--jurisdiction", default="ke")
    mb.add_argument("--store", default=".data/objects")
    ph = sub.add_parser("fetch-photos", help="fetch official portraits of listed members through the gate (slow: one request every 5 s)")
    ph.add_argument("directory")
    ph.add_argument("--site", default="ke/parliament")
    ph.add_argument("--limit", type=int, default=None)
    ph.add_argument("--store", default=".data/objects")
    ng = sub.add_parser("import-ngcdf", help="stage NG-CDF allocations and disbursements from fetched API responses (stages A, B)")
    ng.add_argument("directory")
    ng.add_argument("--constituencies", required=True, help="the saved NG-CDF constituency list page")
    ng.add_argument("--stage", choices=["A", "B"], required=True)
    ng.add_argument("--store", default=".data/objects")
    cn = sub.add_parser("import-constitution", help="stage the Constitution of Kenya (instrument, chapters, articles) from fetched KLRC pages (stages A, B)")
    cn.add_argument("directory")
    cn.add_argument("--stage", choices=["A", "B"], required=True)
    cn.add_argument("--store", default=".data/objects")
    ie = sub.add_parser("import-iebc", help="stage the IEBC commissioners from the fetched Commissioners page (stages B, C)")
    ie.add_argument("page")
    ie.add_argument("--stage", choices=["B", "C"], required=True)
    ie.add_argument("--store", default=".data/objects")
    ga = sub.add_parser("import-geo-admin", help="stage units or boundaries of one administrative level (0-3) from geoBoundaries GeoJSON, parents found by geometry")
    ga.add_argument("directory")
    ga.add_argument("--level", type=int, choices=[0, 1, 2, 3], required=True)
    ga.add_argument("--part", choices=["units", "boundaries"], required=True)
    ga.add_argument("--reference-year", default="")
    ga.add_argument("--store", default=".data/objects")
    pr = sub.add_parser("import-procurement", help="stage tenders.go.ke procuring entities, suppliers, tenders and contracts (stages A-D)")
    pr.add_argument("--pe-dir", required=True)
    pr.add_argument("--ocds-dir", required=True)
    pr.add_argument("--stage", choices=["A", "B", "C", "D"], required=True)
    pr.add_argument("--years", default=None, help="comma-separated financial years such as 2025-2026")
    pr.add_argument("--store", default=".data/objects")
    dd = sub.add_parser("dedup", help="score possible duplicates of people or organisations: auto-merge only with corroboration, flag the rest")
    dd.add_argument("kind", choices=["person", "organization"])
    dd.add_argument("--actor", default=None, help="the approving account id recorded on automatic decisions")
    pf = sub.add_parser("profile", help="print everything held about one person (by code) as JSON")
    pf.add_argument("code")
    gx = sub.add_parser("geo-crosscheck", help="compare promoted county and constituency boundaries with the HDX COD-AB files; --apply marks agreeing boundaries verified")
    gx.add_argument("hdx_dir")
    gx.add_argument("--actor", default=None)
    gx.add_argument("--apply", action="store_true")
    fe = sub.add_parser("fetch", help="live, gated, rate-limited fetch of one URL for a registered site (robots.txt respected); saves the raw bytes")
    fe.add_argument("--site", required=True, help="site code, e.g. ke/parliament")
    fe.add_argument("--url", required=True)
    fe.add_argument("--out", required=True, help="directory for the saved file")
    wb = sub.add_parser("import-worldbank", help="stage population candidates from a saved World Bank SP.POP.TOTL JSON file")
    wb.add_argument("file")
    wb.add_argument("--iso3", required=True)
    wb.add_argument("--store", default=".data/objects")
    ex = sub.add_parser("expand-patterns", help="create expected sites from a family's domain patterns (offline; no requests are made)")
    ex.add_argument("family_code")
    rep = sub.add_parser("catalogue-report", help="counts of families, patterns, sites and domains with their counting rules")
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
    if args.command == "import-budget-table":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import budget_table

        with connect() as conn:
            out = budget_table.import_budget_table(conn, LocalDirectoryStore(conn, args.store), args.file, args.jurisdiction, args.fiscal_year, args.title, args.publisher_code, args.publisher_name, default_currency=args.currency, profile="tables+ocr" if args.ocr else "tables", stages=("budget",) if args.stage == "budget" else ("fiscal_year", "unit"))
        for name in out.stats:
            print(f"{name}: {out.stats[name].created} new, {out.stats[name].unchanged} unchanged (run {out.runs[name]})")
        for problem in out.problems:
            print(f"note: {problem}")
        return 0
    if args.command == "import-budget-summary":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import budget_summary

        with connect() as conn:
            out = budget_summary.import_budget_summary(conn, LocalDirectoryStore(conn, args.store), args.file, args.jurisdiction, args.fiscal_year, args.title, args.publisher_code, args.publisher_name, column=args.column, url=args.url, stages=("budget",) if args.stage == "budget" else ("fiscal_year", "unit"))
        for name in out.stats:
            print(f"{name}: {out.stats[name].created} new, {out.stats[name].unchanged} unchanged (run {out.runs[name]})")
        return 0
    if args.command == "import-members":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import members

        with connect() as conn:
            out = members.import_members(conn, LocalDirectoryStore(conn, args.store), args.directory, args.jurisdiction, args.stage)
        print(f"{out.pages} pages, {out.members} member rows")
        for name, stat in out.stats.items():
            print(f"{name}: {stat.created} new, {stat.unchanged} unchanged, {stat.invalid} invalid, {stat.quarantined} quarantined (run {out.runs[name]})")
        return 0
    if args.command == "fetch-photos":
        from .db import connect
        from .fetch import live_fetcher
        from .files import LocalDirectoryStore
        from .imports import photos

        with connect() as conn:
            site = conn.execute("SELECT id FROM website.sites WHERE code = %s", (args.site,)).fetchone()
            fetcher = live_fetcher(conn, str(site["id"]), {"rate": {"requests_per_second": 0.2}, "limits": {"max_response_bytes": 5_000_000}})
            print(photos.fetch_photos(conn, LocalDirectoryStore(conn, args.store), args.directory, fetcher, args.limit))
        return 0
    if args.command == "import-ngcdf":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import ngcdf

        with connect() as conn:
            out = ngcdf.import_ngcdf(conn, LocalDirectoryStore(conn, args.store), args.directory, args.constituencies, args.stage)
        print(f"{out.files} files, {out.rows} rows, {len(out.skipped)} skipped")
        for note in out.skipped[:10]:
            print(f"note: {note}")
        for name, stat in out.stats.items():
            print(f"{name}: {stat.created} new, {stat.unchanged} unchanged, {stat.invalid} invalid, {stat.quarantined} quarantined (run {out.runs[name]})")
        return 0
    if args.command == "import-constitution":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import constitution

        with connect() as conn:
            out = constitution.import_constitution(conn, LocalDirectoryStore(conn, args.store), args.directory, args.stage)
        print(f"{out.pages} article pages, {out.articles} numbered articles")
        for note in out.notes[:10]:
            print(f"note: {note}")
        for name, stat in out.stats.items():
            print(f"{name}: {stat.created} new, {stat.unchanged} unchanged, {stat.invalid} invalid, {stat.quarantined} quarantined (run {out.runs[name]})")
        return 0
    if args.command == "import-iebc":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import iebc

        with connect() as conn:
            out = iebc.import_iebc(conn, LocalDirectoryStore(conn, args.store), args.page, args.page + ".provenance.json", args.stage)
        for name, stat in out.stats.items():
            print(f"{name}: {stat.created} new, {stat.unchanged} unchanged, {stat.invalid} invalid, {stat.quarantined} quarantined (run {out.runs[name]})")
        return 0
    if args.command == "import-geo-admin":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import geo_admin

        with connect() as conn:
            out = geo_admin.import_geo_admin(conn, LocalDirectoryStore(conn, args.store), args.directory, args.level, args.part, reference_year=args.reference_year)
        print(f"{out.units} units at level {args.level}")
        for note in out.problems:
            print(f"note: {note}")
        for name, stat in out.stats.items():
            print(f"{name}: {stat.created} new, {stat.unchanged} unchanged, {stat.invalid} invalid, {stat.quarantined} quarantined (run {out.runs[name]})")
        return 0
    if args.command == "import-procurement":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import procurement

        with connect() as conn:
            out = procurement.import_procurement(conn, LocalDirectoryStore(conn, args.store), args.pe_dir, args.ocds_dir, args.stage, args.years.split(",") if args.years else None)
        print(f"{out.sources} procuring entities, {len(out.notes)} notes")
        for note in out.notes[:5]:
            print(f"note: {note}")
        for name, stat in out.stats.items():
            print(f"{name}: {stat.created} new, {stat.unchanged} unchanged, {stat.invalid} invalid, {stat.quarantined} quarantined (run {out.runs[name]})")
        return 0
    if args.command == "dedup":
        from .db import connect
        from .dedup import run_dedup

        with connect() as conn:
            print(json.dumps(run_dedup(conn, args.kind, args.actor)))
        return 0
    if args.command == "profile":
        from .db import connect
        from .dedup import profile_person

        with connect() as conn:
            print(json.dumps(profile_person(conn, args.code), default=str, indent=2))
        return 0
    if args.command == "geo-crosscheck":
        from .db import connect
        from .geo_crosscheck import crosscheck

        with connect() as conn:
            report = crosscheck(conn, args.hdx_dir, args.actor, args.apply)
        print(json.dumps({**report, "low_overlap": report["low_overlap"][:25], "not_in_hdx": report["not_in_hdx"][:25], "hdx_not_in_mzizi": report["hdx_not_in_mzizi"][:25], "low_overlap_total": len(report["low_overlap"]), "not_in_hdx_total": len(report["not_in_hdx"]), "hdx_not_in_mzizi_total": len(report["hdx_not_in_mzizi"])}, indent=1))
        return 0
    if args.command == "fetch":
        from .db import connect
        from .fetch import live_fetcher
        from .fetchcmd import fetch_to_directory

        with connect() as conn:
            print(fetch_to_directory(conn, live_fetcher, args.site, args.url, args.out))
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
    if args.command == "expand-patterns":
        from . import patterns
        from .db import connect

        with connect() as conn:
            family = conn.execute("SELECT id::text AS id FROM website.families WHERE code = %s", (args.family_code,)).fetchone()
            if not family:
                raise SystemExit(f"unknown family {args.family_code}")
            made = 0
            for pattern in conn.execute("SELECT id::text AS id, template FROM website.domain_patterns WHERE family_id = %s", (family["id"],)).fetchall():
                expected = patterns.expand_pattern(conn, pattern["id"])
                made += sum(1 for e in expected if e.created)
                print(f"{pattern['template']}: {len(expected)} subjects, {sum(1 for e in expected if e.created)} new expected sites")
            conn.commit()
        return 0
    if args.command == "catalogue-report":
        from .db import connect

        with connect() as conn:
            q = lambda sql: conn.execute(sql).fetchall()
            print("Counting rules: families and patterns are registry records, not claims about existing sites; 'sites' counts website.sites rows by status; 'domains' counts rows valid today (a site can have many); expected sites are unconfirmed candidates, never counted as known sites.")
            print("families:", {r["status"]: r["n"] for r in q("SELECT status, count(*)::int AS n FROM website.families GROUP BY status")})
            print("patterns:", {r["status"]: r["n"] for r in q("SELECT status, count(*)::int AS n FROM website.domain_patterns GROUP BY status")})
            print("sites by status:", {r["status"]: r["n"] for r in q("SELECT status, count(*)::int AS n FROM website.sites GROUP BY status")})
            print("sites with a current approved assessment:", q("SELECT count(DISTINCT site_id)::int AS n FROM website.assessments WHERE is_current AND status IN ('approved','approved_with_conditions')")[0]["n"])
            print("domains valid today:", q("SELECT count(*)::int AS n FROM website.domains WHERE valid_from <= current_date AND (valid_to IS NULL OR valid_to >= current_date)")[0]["n"])
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
