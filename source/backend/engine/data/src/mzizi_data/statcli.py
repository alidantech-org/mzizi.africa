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
    cn = sub.add_parser("import-census", help="stage the 2019 census Volume I counts (national, county, sub-county) from a fetched KNBS PDF after arithmetic checks")
    cn.add_argument("file")
    cn.add_argument("--store", default=".data/objects")
    cn.add_argument("--report", help="write the linking and checking report as JSON")
    er = sub.add_parser("import-iebc-register", help="stage IEBC registered voters per county, constituency and ward for a general election year (2013 book, 2017 and 2022 tables)")
    er.add_argument("year", choices=["2013", "2017", "2022"])
    er.add_argument("--county")
    er.add_argument("--constituency")
    er.add_argument("--ward")
    er.add_argument("--book")
    er.add_argument("--turnout", action="store_true", help="2013 only: stage county turnout (votes cast) from the book")
    er.add_argument("--store", default=".data/objects")
    er.add_argument("--report")
    dv = sub.add_parser("derive", help="compute a registered derived indicator from current inputs and stage it ('stale' lists derived values whose inputs were superseded)")
    dv.add_argument("formula")
    dv.add_argument("--store", default=".data/objects")
    q = sub.add_parser("quality", help="run the statistical quality rules and store findings, or report; 'decide <finding> <accept|resolve|dispute> <rationale>' records a decision by the agent account")
    q.add_argument("action", choices=["run", "report", "decide"])
    q.add_argument("rest", nargs="*")
    c4 = sub.add_parser("import-census-vol4", help="stage census Volume IV religion and ICT county tables (group counts) after arithmetic checks")
    c4.add_argument("file")
    c4.add_argument("--store", default=".data/objects")
    cl = sub.add_parser("census-links", help="score-based sub-county to constituency links for the 2019 census as claims; weak canonical name links are listed")
    cl.add_argument("file")
    cl.add_argument("--dry-run", action="store_true")
    c3 = sub.add_parser("import-census-vol3", help="stage census Volume III age by sex per county (group counts) after arithmetic checks")
    c3.add_argument("file")
    c3.add_argument("--store", default=".data/objects")
    pv = sub.add_parser("import-poverty", help="stage the Kenya Poverty Report 2021 county table (survey estimates) after checks")
    pv.add_argument("file")
    pv.add_argument("--store", default=".data/objects")
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
    if args.command == "import-census":
        from .imports import census

        with connect() as conn:
            out = census.import_volume_1(conn, LocalDirectoryStore(conn, args.store), args.file)
        for name, st in out["staged"].stats.items():
            print(f"{name}: {st.created} new, {st.unchanged} unchanged, {st.invalid} invalid (run {out['staged'].runs[name]})")
        rep = out["report"]
        print(json.dumps({k: (v if not isinstance(v, list) else len(v)) for k, v in rep.items()}))
        if args.report:
            from pathlib import Path

            Path(args.report).write_text(json.dumps(rep, indent=1))
        return 0
    if args.command == "import-iebc-register":
        from .imports import iebc_register

        if args.year == "2013" and args.turnout:
            with connect() as conn:
                print(json.dumps(iebc_register.stage_turnout_2013(conn, LocalDirectoryStore(conn, args.store), args.book), indent=1))
            return 0
        files = {k: v for k, v in (("county", args.county), ("constituency", args.constituency), ("ward", args.ward), ("book", args.book)) if v}
        with connect() as conn:
            rep = iebc_register.stage_register(conn, LocalDirectoryStore(conn, args.store), args.year, files)
        print(json.dumps({k: (v if not isinstance(v, (list, dict)) or k in ("runs", "linked", "levels") else len(v)) for k, v in rep.items()}, indent=1))
        if args.report:
            from pathlib import Path

            Path(args.report).write_text(json.dumps(rep, indent=1))
        return 0
    if args.command == "derive":
        from . import derived

        with connect() as conn:
            if args.formula == "stale":
                print(json.dumps(derived.stale(conn), indent=1))
                return 0
            out = derived.run(conn, LocalDirectoryStore(conn, args.store), args.formula)
        print(json.dumps({k: v for k, v in out.items() if k != "stats"}, indent=1))
        return 0
    if args.command == "quality":
        from . import quality, statload

        with connect() as conn:
            if args.action == "run":
                print(json.dumps(quality.store(conn, quality.run_rules(conn))))
            elif args.action == "report":
                print(json.dumps(quality.report(conn), indent=1, default=str))
            else:
                print(quality.decide(conn, args.rest[0], statload.AGENT_ACCOUNT, args.rest[1], args.rest[2]))
        return 0
    if args.command == "import-census-vol4":
        from .imports import census_breakdowns

        with connect() as conn:
            rep = census_breakdowns.import_volume_4(conn, LocalDirectoryStore(conn, args.store), args.file)
            eth = census_breakdowns.stage_ethnicity(conn, LocalDirectoryStore(conn, args.store), args.file)
        print(json.dumps(rep, indent=1, default=str)[:2500])
        print(json.dumps(eth, indent=1, default=str))
        return 0
    if args.command == "census-links":
        from pathlib import Path

        from . import census_links

        with connect() as conn:
            rep = census_links.run(conn, Path(args.file).read_bytes(), write=not args.dry_run)
        print(json.dumps({k: (len(v) if isinstance(v, list) else v) for k, v in rep.items()}))
        Path("/tmp/d2/census-links.json").write_text(json.dumps(rep, indent=1))
        return 0
    if args.command == "import-census-vol3":
        from .imports import census_age

        with connect() as conn:
            print(json.dumps(census_age.import_volume_3(conn, LocalDirectoryStore(conn, args.store), args.file), indent=1, default=str)[:3000])
        return 0
    if args.command == "import-poverty":
        from .imports import poverty

        with connect() as conn:
            print(json.dumps(poverty.import_report(conn, LocalDirectoryStore(conn, args.store), args.file), indent=1))
        return 0
    if args.command == "stats-promote":
        from . import statload

        for step, text in statload.promote_run(args.run_id, args.rationale, args.env).items():
            print(f"[{step}] {text}")
        return 0
    return None
