"""Command line entries for place research (constituency offices, landmarks, refills, claims, duplicates, coverage)."""
from __future__ import annotations

import argparse
import json


def register(sub: argparse._SubParsersAction) -> None:
    co = sub.add_parser("import-constituency-offices", help="read the IEBC constituency offices PDF into places, occupancies and resolved expectations (--dry-run only reports the matching)")
    co.add_argument("file")
    co.add_argument("--store", default=".data/objects")
    co.add_argument("--report")
    co.add_argument("--dry-run", action="store_true")
    sub.add_parser("load-landmarks", help="load the landmark institutional places seed (headquarters of national bodies and county governments); resolves no expectation")
    sub.add_parser("place-register-osm", help="register the OpenStreetMap Nominatim API host as a site (then run the database engine's auto-assess)")
    pr = sub.add_parser("place-refill", help="queue point and address gaps of headquarters places and run the registered handlers through the gate")
    pr.add_argument("--source", action="append", choices=["site_documents", "wikidata_place", "osm_nominatim"], help="only these sources (repeatable)")
    pr.add_argument("--limit", type=int, default=50)
    pr.add_argument("--rate", type=float, default=0.2, help="requests per second (0.2, within the Nominatim policy of 1)")
    pr.add_argument("--store", default=".data/objects")
    sub.add_parser("place-apply", help="apply corroborated or trusted point and address claims to places, then resolve expectations their evidence supports")
    sub.add_parser("place-duplicates", help="score and flag likely duplicate places (never merges)")
    pc = sub.add_parser("place-coverage", help="known against expected places, occupancies and contacts")
    pc.add_argument("--markdown", action="store_true")


def dispatch(args: argparse.Namespace) -> int | None:
    from pathlib import Path

    from .db import connect
    from .files import LocalDirectoryStore

    if args.command == "import-constituency-offices":
        from .imports import constituency_offices

        with connect() as conn:
            report = constituency_offices.load_offices(conn, LocalDirectoryStore(conn, args.store), args.file, write=not args.dry_run)
        out = {k: v for k, v in report.__dict__.items() if k != "unlinked"} | {"unlinkedCount": len(report.unlinked)}
        if args.report:
            Path(args.report).parent.mkdir(parents=True, exist_ok=True)
            Path(args.report).write_text(json.dumps(report.__dict__, indent=1, default=str))
        print(json.dumps(out, indent=2))
        return 0
    if args.command == "load-landmarks":
        from . import landmarks

        with connect() as conn:
            print(json.dumps(landmarks.load_landmarks(conn).__dict__, indent=2))
        return 0
    if args.command == "place-register-osm":
        from . import place_research

        with connect() as conn:
            site_id = place_research.register_osm_site(conn)
            conn.commit()
        print(site_id)
        return 0
    if args.command == "place-refill":
        from . import jobs, place_research, reinforcement, wikimedia
        from .fetch import live_fetcher

        sources = set(args.source or ["site_documents", "wikidata_place", "osm_nominatim"])
        with connect() as conn:
            store = LocalDirectoryStore(conn, args.store)
            reinforcement.RULES.update(place_research.PLACE_RULES)
            reinforcement.EXTRA.update(place_research.PLACE_EXTRA)
            if "site_documents" in sources:
                reinforcement.register_refill("site_documents", place_research.site_documents_refill(conn, store), {"address_text"})
            fetchers = []
            if "wikidata_place" in sources:
                site = conn.execute("SELECT id FROM website.sites WHERE code = %s", (wikimedia.SITE_CODE,)).fetchone()
                if not site:
                    raise SystemExit("register the Wikimedia site first (wikimedia-register, then auto-assess)")
                f = live_fetcher(conn, str(site["id"]), {"rate": {"requests_per_second": args.rate}, "limits": {"max_response_bytes": 8_000_000}}, robots_exempt_paths=wikimedia.API_PATHS)
                fetchers.append(f)
                reinforcement.register_refill("wikidata_place", place_research.wikidata_place_refill(conn, wikimedia.Wikimedia(f.get), store), {"latitude"})
            if "osm_nominatim" in sources:
                site = conn.execute("SELECT id FROM website.sites WHERE code = %s", (place_research.OSM_SITE,)).fetchone()
                if not site:
                    raise SystemExit("register the Nominatim site first (place-register-osm, then auto-assess)")
                f = live_fetcher(conn, str(site["id"]), {"rate": {"requests_per_second": min(args.rate, 1.0)}, "limits": {"max_response_bytes": 2_000_000}})
                fetchers.append(f)
                reinforcement.register_refill("osm_nominatim", place_research.nominatim_refill(conn, f.get, store), {"latitude", "address_text"})
            for code in list(reinforcement.REFILL_SOURCES):
                if code in {"site_documents", "wikidata_place", "osm_nominatim"} - sources:
                    reinforcement.REFILL_SOURCES.pop(code)
            created = reinforcement.build_gaps(conn, place_research.PLACE_RULES)
            n = reinforcement.enqueue_refills(conn, args.limit, kinds=["place.places"])
            conn.commit()
            done = 0
            handlers = {"refill": reinforcement.refill_handler(conn)}
            while jobs.run_once(conn, handlers, worker="place-refill"):
                done += 1
                conn.commit()
                tripped = next((f.tripped for f in fetchers if f.tripped), None)
                if tripped:
                    print(f"stopped: {tripped}")
                    break
            conn.commit()
        print(f"gaps created {created}, enqueued {n}, ran {done}")
        return 0
    if args.command == "place-apply":
        from . import place_research

        with connect() as conn:
            applied = place_research.apply_place_claims(conn)
            resolved = place_research.resolve_corroborated_expectations(conn)
        print(json.dumps({"points": applied.points, "addresses": applied.addresses, "held": applied.held, "expectationsResolved": resolved}, indent=2))
        return 0
    if args.command == "place-duplicates":
        from . import place_research

        with connect() as conn:
            print(json.dumps(place_research.score_duplicate_places(conn)))
        return 0
    if args.command == "place-coverage":
        from . import place_research

        with connect() as conn:
            report = place_research.place_coverage(conn)
        print(place_research.coverage_markdown(report) if args.markdown else json.dumps(report, indent=2, default=str))
        return 0
    return None
