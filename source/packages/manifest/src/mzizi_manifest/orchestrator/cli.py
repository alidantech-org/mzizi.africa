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
    refs = sub.add_parser("refs", help="check that every source, mapping, terms and extraction code resolves")
    refs.add_argument("root", nargs="?", type=Path, default=SEED_ROOT, help="folder to scan (default: seed/)")
    refs.add_argument(
        "--no-paths", action="store_true", help="do not require folder paths to mirror codes (flat example folders)"
    )
    args = parser.parse_args(argv)
    if args.command == "refs":
        from mzizi_manifest.features.registry.scan import scan

        found = scan(args.root, mirror_paths=not args.no_paths)
        for code, entry in sorted(found.registry.entries.items()):
            print(f"{entry.kind}\t{code}\t{entry.path}")
        for problem in found.problems:
            print(f"error: {problem}", file=sys.stderr)
        print(f"{len(found.registry.entries)} codes, {len(found.problems)} problems")
        return 1 if found.problems else 0
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
