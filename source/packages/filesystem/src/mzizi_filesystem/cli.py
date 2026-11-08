"""mzizi-publish-seed: validate and publish prepared seed inputs through the filesystem package.

Dry run is the default. `--apply` needs `--store s3` (existing S3 environment) or `--store memory` (rehearsal) and a
ledger path; it never creates buckets, deletes objects or runs garbage collection.
"""
from __future__ import annotations

import argparse
import json
import sys

from mzizi_manifest.paths import SEED_ROOT

from .publish import publish_seeds
from .registry import JsonLedgerRegistry, MemoryRegistry
from .store import MemoryObjectStore, S3ObjectStore


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="mzizi-publish-seed")
    parser.add_argument("--apply", action="store_true", help="upload, verify and register (default is a dry run)")
    parser.add_argument("--store", choices=["s3", "memory"], default="memory")
    parser.add_argument("--ledger", default=str(SEED_ROOT / "local" / "registry-ledger.json"), help="local registry ledger (seed/local is ignored by Git)")
    parser.add_argument("--entry", action="append", help="limit to a manifest entry id (repeatable)")
    parser.add_argument("--verify", choices=["head", "get"], default="head")
    args = parser.parse_args(argv)
    store = S3ObjectStore() if args.store == "s3" else MemoryObjectStore()
    registry = JsonLedgerRegistry(args.ledger) if args.apply and args.store == "s3" else MemoryRegistry()
    report = publish_seeds(store, registry, dry_run=not args.apply, entry_ids=set(args.entry or []) or None, verify=args.verify)
    print(json.dumps({"release": report.release, "dry_run": report.dry_run, "ok": report.ok, "summary": report.summary(), "problems": [vars(o) for o in report.outcomes if o.outcome in ("failed", "conflict")]}, indent=2))
    return 0 if report.ok else 1


if __name__ == "__main__":
    sys.exit(main())
