"""mzizi-manifest: validate and lock the seed registry."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from mzizi_manifest.features.seeds import seed_registry as reg
from mzizi_manifest.shared.paths import SEED_ROOT


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="mzizi-manifest")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("check", help="validate folder metadata, manifest, dependencies, consumers and the lock (no writes)")
    sub.add_parser("lock", help="regenerate seed/manifest.lock.yaml")
    sub.add_parser("report", help="effective metadata per artifact")
    data = sub.add_parser(
        "data", help="check seed CSV files (data/<scope>/<domain>/<table>.csv) against the database schemas"
    )
    data.add_argument("root", nargs="?", type=Path, default=SEED_ROOT, help="folder holding data/ (default: seed/)")
    data.add_argument(
        "--context",
        action="append",
        type=Path,
        default=[],
        help="an earlier batch's seed folder, read only so links can name its rows (repeatable)",
    )
    verify = sub.add_parser(
        "verify", help="check seed rows against the real datasets named in each folder's _source.yaml"
    )
    verify.add_argument("root", nargs="?", type=Path, default=SEED_ROOT, help="folder holding data/ (default: seed/)")
    datasets = sub.add_parser(
        "datasets",
        help="write the seed product, edition and artifact catalogue under data/global/source/: one artifact for every seed CSV",
    )
    datasets.add_argument("root", nargs="?", type=Path, default=SEED_ROOT, help="folder holding data/ (default: seed/)")
    refs = sub.add_parser("refs", help="check that every source, mapping and terms code resolves")
    refs.add_argument("root", nargs="?", type=Path, default=SEED_ROOT, help="folder to scan (default: seed/)")
    refs.add_argument(
        "--no-paths", action="store_true", help="do not require folder paths to mirror codes (flat example folders)"
    )
    report = sub.add_parser("columns-report", help="how much of each seedable table the column dictionaries describe")
    report.add_argument("root", nargs="?", type=Path, default=SEED_ROOT)
    report.add_argument("--missing", action="store_true", help="list the seed columns no dictionary describes")
    args = parser.parse_args(argv)
    if args.command == "columns-report":
        from mzizi_manifest.features.registry.coverage import coverage

        rows = coverage(args.root)
        have = sum(len(r.covered) for r in rows)
        total = sum(len([c for c in r.seed_columns if c != "code"]) for r in rows)
        for r in rows:
            flags = ("recipe " if r.recipe else "") + ("lookup" if r.lookup else "")
            print(
                f"{r.table:38} {len(r.covered):3}/{len([c for c in r.seed_columns if c != 'code']):3} columns  {flags}"
            )
            if args.missing and r.uncovered:
                print(f"    missing: {', '.join(r.uncovered)}")
        print(
            f"{len(rows)} seedable tables; {have} of {total} seed columns have terms; derived headings cover the rest weakly"
        )
        return 0
    if args.command == "refs":
        from mzizi_manifest.features.registry.scan import scan

        found = scan(args.root, mirror_paths=not args.no_paths)
        for code, entry in sorted(found.registry.entries.items()):
            print(f"{entry.kind}\t{code}\t{entry.path}")
        for problem in found.problems:
            print(f"error: {problem}", file=sys.stderr)
        print(f"{len(found.registry.entries)} codes, {len(found.problems)} problems")
        return 1 if found.problems else 0
    if args.command == "datasets":
        from mzizi_manifest.features.data.datasets import write_datasets

        print(f"wrote {write_datasets(args.root)} artifact rows")
        return 0
    if args.command == "verify":
        from mzizi_manifest.features.provenance.verify import verify as run_verify

        outcome = run_verify(args.root, args.root.parent)
        for line in outcome.checked:
            print(f"verified\t{line}")
        for line in outcome.unavailable:
            print(f"unavailable\t{line}")
        for line in outcome.unverified:
            print(f"unverified\t{line}")
        for problem in outcome.problems:
            print(f"error: {problem}", file=sys.stderr)
        print(
            f"{len(outcome.checked)} verified, {len(outcome.unverified)} unverified, {len(outcome.problems)} problems"
        )
        return 1 if outcome.problems else 0
    if args.command == "data":
        from mzizi_manifest.features.data.check import check_data

        checked = check_data(args.root, context_roots=tuple(args.context))
        for table in checked.order:
            print(f"{table}\t{len(checked.rows[table])} rows")
        for problem in checked.problems:
            print(f"error: {problem}", file=sys.stderr)
        print(f"{len(checked.rows)} tables, {len(checked.problems)} problems")
        return 1 if checked.problems else 0
    lock_path = SEED_ROOT / reg.LOCK_NAME
    if args.command == "lock":
        result = reg.validate_manifest()
        if result.errors or not result.manifest:
            print("\n".join(result.errors), file=sys.stderr)
            return 1
        lock_path.write_text(reg.dump_lock(reg.build_lock(result.manifest)), encoding="utf-8")
        print(f"wrote {lock_path}")
        return 0
    if args.command == "check":
        result = reg.validate_manifest()
        if result.manifest and not result.errors:
            current = lock_path.read_text(encoding="utf-8") if lock_path.exists() else ""
            if current != reg.dump_lock(reg.build_lock(result.manifest)):
                result.errors.append("manifest.lock.yaml is missing or stale: run `mzizi-manifest lock`")
        print(
            f"{len((result.manifest or {}).get('entries', []))} entries, {len(result.warnings)} classification warnings"
        )
        for warning in result.warnings:
            print(f"warning: {warning}")
        for error in result.errors:
            print(f"error: {error}", file=sys.stderr)
        return 1 if result.errors else 0
    if args.command == "report":
        for file in reg.artifact_files():
            effective, errors = reg.resolve_effective(file)
            print(
                f"{file}\t{effective['role']}\t{effective['acquisition_class']}\t{effective['preparation']}\t{effective['access']}\t{'seed' if effective['seed'] else 'not-seed'}"
                if effective
                else f"{file}\tERROR {'; '.join(errors)}"
            )
        return 0
    return 2


if __name__ == "__main__":
    sys.exit(main())
