"""Command line: mzizi-data validate <bundle-dir> [--family <dir>]"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import os
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
    ld = sub.add_parser("import-legal-documents", help="stage instruments (A) or provisions (B) for Acts, Bills and Gazette notices from classified registered documents; --flag-figures flags budget and audit documents for review")
    ld.add_argument("--stage", choices=["A", "B"])
    ld.add_argument("--site", action="append", help="site code; repeatable (default: all sites)")
    ld.add_argument("--limit", type=int)
    ld.add_argument("--flag-figures", action="store_true")
    ld.add_argument("--report")
    ld.add_argument("--store", default=".data/objects")
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
    cv = sub.add_parser("coverage", help="coverage report per table and nullable field (read-only)")
    cv.add_argument("--json", action="store_true")
    gp = sub.add_parser("gaps", help="gap queue: build (queue missing fields, disputed, stale), report, enqueue (refill jobs)")
    gp.add_argument("action", choices=["build", "report", "enqueue"])
    gp.add_argument("--limit", type=int, default=50)
    wr = sub.add_parser("wikimedia-register", help="register the Wikimedia API hosts as a site (then run the database engine's auto-assess)")
    wr.add_argument("--jurisdiction", default="ke")
    rf = sub.add_parser("refill", help="run refill jobs for queued gaps with the Wikidata handler through the gate (gaps build, then this)")
    rf.add_argument("--field", action="append", help="only gaps of this field (repeatable)")
    rf.add_argument("--kind", action="append", help="only gaps of this target kind (repeatable)")
    rf.add_argument("--limit", type=int, default=50)
    rf.add_argument("--rate", type=float, default=0.5, help="requests per second (polite default 0.5)")
    rf.add_argument("--store", default=".data/objects")
    fm = sub.add_parser("fetch-media", help="store flags, emblems, logos and portraits announced by promoted markers, only with a recorded free licence")
    fm.add_argument("--role", choices=["flag", "emblem", "logo", "portrait"])
    fm.add_argument("--limit", type=int, default=None)
    fm.add_argument("--rate", type=float, default=0.5)
    fm.add_argument("--store", default=".data/objects")
    fm.add_argument("--report", default=".data/reports/wikimedia-media.json")
    sub.add_parser("claims-rebuild", help="recompute every claim standing after claims were rejected")
    pf = sub.add_parser("profile", help="print everything held about one person (by code) as JSON")
    pf.add_argument("code")
    gx = sub.add_parser("geo-crosscheck", help="compare promoted county and constituency boundaries with the HDX COD-AB files; --apply marks agreeing boundaries verified")
    gx.add_argument("hdx_dir")
    gx.add_argument("--actor", default=None)
    gx.add_argument("--apply", action="store_true")
    gf = sub.add_parser("geo-fix-containment", help="reparent wrongly parented units and re-stage clipped boundaries for candidates the containment check deferred; --apply writes")
    gf.add_argument("--apply", action="store_true")
    fe = sub.add_parser("fetch", help="live, gated, rate-limited fetch of one URL for a registered site (robots.txt respected); saves the raw bytes")
    fe.add_argument("--site", required=True, help="site code, e.g. ke/parliament")
    fe.add_argument("--url", required=True)
    fe.add_argument("--out", required=True, help="directory for the saved file")
    cs = sub.add_parser("crawl-sections", help="bounded, gated crawl of a site's modelled content sections; registers downloaded files as documents (0.2 req/s, robots.txt, depth 2, stop on refusal)")
    cs.add_argument("--site", required=True, help="site code, e.g. ke/orpp")
    cs.add_argument("--seed-family", help="use the seeded sections of this family code (e.g. ke/regulator) instead of the site's own structure")
    cs.add_argument("--max-requests", type=int, default=100)
    cs.add_argument("--max-pages-per-section", type=int, default=3)
    cs.add_argument("--max-depth", type=int, default=2, choices=[2, 3], help="3 for sites whose listings link package pages that link the file (WordPress Download Manager)")
    cs.add_argument("--max-file-mb", type=int, default=25)
    cs.add_argument("--raw-dir", help="also keep raw bytes with a provenance file beside each")
    cs.add_argument("--store", default=".data/objects")
    cd = sub.add_parser("classify-documents", help="classify registered documents (URL, text, fuzzy title), route to parsers, queue unclassified ones as gaps")
    cd.add_argument("--site")
    cd.add_argument("--limit", type=int)
    cd.add_argument("--force", action="store_true", help="reclassify documents already classified by this classifier version")
    cd.add_argument("--labels", help="JSON file of [{id, kind}] reviewed labels: print precision and recall per kind")
    cd.add_argument("--store", default=".data/objects")
    wb = sub.add_parser("import-worldbank",help="stage population candidates from a saved World Bank SP.POP.TOTL JSON file")
    wb.add_argument("file")
    wb.add_argument("--iso3", required=True)
    wb.add_argument("--store", default=".data/objects")
    ex = sub.add_parser("expand-patterns", help="create expected sites from a family's domain patterns (offline; no requests are made)")
    ex.add_argument("family_code")
    pd = sub.add_parser("probe-domains", help="probe candidate domains of trusted zones through the gate (0.2 req/s, robots, stop on refusal) and record DNS snapshots; resumable")
    pd.add_argument("--limit", type=int)
    pd.add_argument("--report", action="store_true")
    pd.add_argument("--retry-timeouts", action="store_true", help="probe again the unreachable domains whose last failure was a timeout")
    pd.add_argument("--timeout", type=int, default=15, help="seconds per request (default 15)")
    sub.add_parser("apply-directory", help="add the hostnames the NG-CDF constituency directory lists as page_link candidates and mark unlisted pattern spellings unreachable (offline)")
    sub.add_parser("backfill-domains", help="create candidate domain rows for every site from its reachability-check candidates, link zones and parents, report counts (offline)")
    rep = sub.add_parser("catalogue-report", help="counts of families, patterns, sites and domains with their counting rules")
    stop = sub.add_parser("stop", help="incident: stop collection for a site, cancel its pending jobs and quarantine its candidates")
    stop.add_argument("site_code")
    stop.add_argument("--reason", required=True)
    from . import statcli

    statcli.register(sub)
    from . import partycli

    partycli.register(sub)
    args = parser.parse_args(argv)
    handled = statcli.dispatch(args)
    if handled is not None:
        return handled
    handled = partycli.dispatch(args)
    if handled is not None:
        return handled
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
    if args.command == "import-legal-documents":
        from .db import connect
        from .files import LocalDirectoryStore
        from .imports import legal_documents

        with connect() as conn:
            out: dict = {}
            if args.flag_figures:
                out["figures"] = legal_documents.flag_figures_for_review(conn, args.site)
            if args.stage:
                res = legal_documents.stage_legal(conn, LocalDirectoryStore(conn, args.store), args.stage, args.site, args.limit)
                out["runs"] = res.runs
                out["stats"] = {k: {f: getattr(v, f) for f in ("created", "unchanged", "invalid", "quarantined")} for k, v in res.stats.items()}
                out["report"] = res.report
        if args.report:
            Path(args.report).write_text(json.dumps(out, indent=1, default=str))
        print(json.dumps(out, indent=1, default=str)[:6000])
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
    if args.command == "coverage":
        from . import reinforcement
        from .db import connect

        with connect() as conn:
            rows = reinforcement.coverage(conn)
        print(json.dumps(rows, indent=2) if args.json else reinforcement.format_coverage(rows))
        return 0
    if args.command == "gaps":
        from . import reinforcement
        from .db import connect

        with connect() as conn:
            if args.action == "build":
                out = {"created": reinforcement.build_gaps(conn), "disputed_or_stale": reinforcement.mark_disputed_and_stale(conn)}
            elif args.action == "enqueue":
                out = {"enqueued": reinforcement.enqueue_refills(conn, args.limit)}
            else:
                out = reinforcement.gap_report(conn)
            conn.commit()
        print(json.dumps(out, default=str, indent=2))
        return 0
    if args.command == "wikimedia-register":
        from . import wikimedia
        from .db import connect

        with connect() as conn:
            site_id = wikimedia.register_site(conn, args.jurisdiction)
            conn.commit()
        print(site_id)
        return 0
    if args.command == "claims-rebuild":
        from . import reinforcement
        from .db import connect

        with connect() as conn:
            n = reinforcement.rebuild_all_standings(conn)
            conn.commit()
        print(n)
        return 0
    if args.command in ("refill", "fetch-media"):
        from . import jobs, reinforcement, wikimedia
        from .db import connect
        from .fetch import live_fetcher
        from .files import LocalDirectoryStore

        with connect() as conn:
            site = conn.execute("SELECT id FROM website.sites WHERE code = %s", (wikimedia.SITE_CODE,)).fetchone()
            if not site:
                raise SystemExit("register the Wikimedia site first (wikimedia-register, then auto-assess)")
            fetcher = live_fetcher(conn, str(site["id"]), {"rate": {"requests_per_second": args.rate}, "limits": {"max_response_bytes": 8_000_000}}, robots_exempt_paths=wikimedia.API_PATHS)
            wm = wikimedia.Wikimedia(fetcher.get)
            store = LocalDirectoryStore(conn, args.store)
            if args.command == "fetch-media":
                import json as _json
                from pathlib import Path

                report = wikimedia.fetch_media(conn, wm, store, only=args.role, limit=args.limit)
                Path(args.report).parent.mkdir(parents=True, exist_ok=True)
                Path(args.report).write_text(_json.dumps({"stored": report.stored, "skipped": report.skipped}, indent=1))
                print(_json.dumps({"stored": len(report.stored), "skipped": len(report.skipped), "report": args.report}))
                return 0
            reinforcement.register_refill("wikidata", wikimedia.wikidata_refill(conn, wm, store), wikimedia.SUPPORTED)
            n = reinforcement.enqueue_refills(conn, args.limit, fields=args.field, kinds=args.kind)
            conn.commit()
            done = 0
            handlers = {"refill": reinforcement.refill_handler(conn)}
            while jobs.run_once(conn, handlers, worker="refill"):
                done += 1
                conn.commit()
                if fetcher.tripped:
                    print(f"stopped: {fetcher.tripped}")
                    break
            conn.commit()
        print(f"enqueued {n}, ran {done}")
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
    if args.command == "geo-fix-containment":
        from .db import connect
        from .geo_fix import fix_containment

        with connect() as conn:
            report = fix_containment(conn, args.apply)
        print(json.dumps({**report, "counts": {k: len(v) for k, v in report.items()}}, indent=1))
        return 0
    if args.command == "crawl-sections":
        from pathlib import Path

        from . import crawl
        from .db import connect
        from .fetch import live_fetcher
        from .files import LocalDirectoryStore

        with connect() as conn:
            store = LocalDirectoryStore(conn, args.store)
            config = crawl.CrawlConfig(max_depth=args.max_depth, max_requests=args.max_requests, max_pages_per_section=args.max_pages_per_section, max_file_bytes=args.max_file_mb * 1024 * 1024, raw_dir=Path(args.raw_dir) if args.raw_dir else None)
            report = crawl.crawl_site(conn, store, live_fetcher, args.site, config, args.seed_family, log=lambda m: print(m, flush=True))
        print(json.dumps({**report.to_json(), "skipped_sample": report.skipped[:15], "errors_sample": report.errors[:10]}, indent=1, default=str))
        return 0
    if args.command == "classify-documents":
        from . import semantics
        from .db import connect
        from .files import LocalDirectoryStore

        with connect() as conn:
            store = LocalDirectoryStore(conn, args.store)
            summary = semantics.classify_pending(conn, store, args.limit, args.site, log=lambda m: print(m, flush=True), force=args.force)
            conn.commit()
            if args.labels:
                labels = json.loads(open(args.labels).read())
                rows = conn.execute("SELECT document_id::text AS id, kind FROM source.document_classifications WHERE classifier_version = %s", (semantics.CLASSIFIER_VERSION,)).fetchall()
                summary["precision"] = semantics.precision_by_kind(labels, {r["id"]: r["kind"] for r in rows})
        print(json.dumps(summary, indent=1))
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
    if args.command == "probe-domains":
        from . import probe_domains
        from .db import connect

        with connect() as conn:
            if not args.report:
                print("zones snapshotted:", probe_domains.snapshot_zones(conn), flush=True)
                print(probe_domains.probe_all(conn, os.environ.get("MZIZI_USER_AGENT", "MziziBot/1.0 (+https://alidantech.org; dev@alidantech.org)"), limit=args.limit, log=lambda m: print(m, flush=True), retry_timeouts=args.retry_timeouts, timeout_seconds=args.timeout))
            print(json.dumps(probe_domains.probe_report(conn), indent=2, default=str))
        return 0
    if args.command == "apply-directory":
        from . import patterns
        from .db import connect

        with connect() as conn:
            print(json.dumps(patterns.apply_directory(conn), indent=2))
            conn.commit()
        return 0
    if args.command == "backfill-domains":
        from . import domains
        from .db import connect

        with connect() as conn:
            print(domains.backfill_from_checks(conn))
            conn.commit()
            print(json.dumps(domains.report(conn), indent=2))
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
