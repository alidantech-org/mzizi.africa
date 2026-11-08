"""mzizi-filesystem: synchronize, inspect and maintain the filesystem registry.

  uv run mzizi-filesystem sync --manifest seed/manifest.yaml                 # preview (default, writes nothing)
  uv run mzizi-filesystem sync --manifest seed/manifest.yaml --apply --actor <account-id>
  uv run mzizi-filesystem sync --manifest seed/manifests/legacy-artifacts.yaml --apply --actor <account-id>
  uv run mzizi-filesystem tree [/path]            uv run mzizi-filesystem cleanup-uploads [--apply]
  uv run mzizi-filesystem transition-access /path internal --apply --actor <id>      uv run mzizi-filesystem live-check --apply

S3 comes from the environment (S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, optional S3_PUBLIC_ENDPOINT); the repository-root .env (git-ignored) is loaded when variables are unset; AWS_* names alias S3_*; the database is mzizi_new
(REWRITE_DATABASE_URL). Apply needs --actor (an account of the auth schema) unless --operator is given for local repository tooling.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from mzizi_database import connect, rewrite_url
from mzizi_manifest.paths import SEED_ROOT

from .authz import DatabaseAuthorizer, OperatorAuthorizer
from .repository import Repository
from .env import load_environment
from .secure import fetch_secure_file
from .service import FilesystemService
from .store import MemoryObjectStore, S3ObjectStore, StoreError
from .sync import ManifestError, load_plan, run_sync
from .transitions import transition_folder_access
from .uploads import cleanup_uploads


def _store(kind: str, apply: bool):
    have_s3 = all(os.environ.get(k) for k in ("S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY"))
    if kind == "auto":
        kind = "s3" if have_s3 else "memory"
    if kind == "memory":
        if apply:
            print("note: applying with the in-memory store is a rehearsal; nothing reaches S3", file=sys.stderr)
        return MemoryObjectStore()
    return S3ObjectStore()


def _actor(conn, args) -> str | None:
    value = args.actor or os.environ.get("MZIZI_ACTOR")
    if value and "|" in value:
        issuer, subject = value.split("|", 1)
        row = conn.execute("SELECT account_id, outcome FROM auth.resolve_identity(%s, %s)", (issuer, subject)).fetchone()
        if row["outcome"] != "ok":
            raise SystemExit(f"actor {issuer}|{subject} does not resolve ({row['outcome']})")
        return str(row["account_id"])
    return value


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(prog="mzizi-filesystem")
    sub = p.add_subparsers(dest="command", required=True)
    s = sub.add_parser("sync", help="plan or apply folders and files from a manifest")
    s.add_argument("--manifest", default=str(SEED_ROOT / "manifest.yaml"))
    s.add_argument("--entry", action="append", help="limit to a seed manifest entry id (repeatable)")
    s.add_argument("--apply", action="store_true")
    s.add_argument("--dry-run", action="store_true", help="explicit preview (the default)")
    s.add_argument("--store", choices=["auto", "s3", "memory"], default="auto")
    s.add_argument("--verify", choices=["head", "get"], default="head")
    s.add_argument("--actor"); s.add_argument("--operator", action="store_true")
    s.add_argument("--json", action="store_true"); s.add_argument("--limit-problems", type=int, default=20)
    t = sub.add_parser("tree"); t.add_argument("path", nargs="?", default="/")
    c = sub.add_parser("cleanup-uploads"); c.add_argument("--apply", action="store_true"); c.add_argument("--store", choices=["auto", "s3", "memory"], default="auto")
    a = sub.add_parser("transition-access"); a.add_argument("path"); a.add_argument("access"); a.add_argument("--apply", action="store_true"); a.add_argument("--actor"); a.add_argument("--operator", action="store_true"); a.add_argument("--store", choices=["auto", "s3", "memory"], default="auto")
    sg = sub.add_parser("secure-get", help="download a registered security file into the git-ignored local cache and print its path"); sg.add_argument("path"); sg.add_argument("--refresh", action="store_true"); sg.add_argument("--store", choices=["auto", "s3", "memory"], default="s3")
    lv = sub.add_parser("live-check"); lv.add_argument("--apply", action="store_true"); lv.add_argument("--actor")
    args = p.parse_args(argv)
    load_environment()
    with connect(rewrite_url(), autocommit=True) as conn:
        repo = Repository(conn)
        if args.command == "tree":
            folder = repo.folder_by_path(args.path) if args.path != "/" else None
            rows = conn.execute("SELECT id, filesystem.folder_path(id) AS path FROM filesystem.folders WHERE %s::uuid IS NULL OR id = %s OR filesystem.folder_path(id) LIKE %s ORDER BY 2", (folder["id"] if folder else None, folder["id"] if folder else None, (args.path.rstrip("/") + "/%"))).fetchall()
            for r in rows:
                eff = repo.effective(r["id"])
                n = conn.execute("SELECT count(*) AS n FROM filesystem.files WHERE folder_id = %s", (r["id"],)).fetchone()["n"]
                print(f"{r['path']}  [{eff['access']}{' seed' if eff['is_seed'] else ''}{' ' + eff['artifact_role'] if eff['artifact_role'] else ''}]  files={n}")
            return 0
        if args.command == "live-check":
            from .livecheck import run_live_check

            if not args.apply:
                print("dry run: live-check uploads and removes a few test objects under private/tmp/mzizi-live-check-<id>/; pass --apply to run it")
                return 0
            report = run_live_check(S3ObjectStore(), repo, _actor(conn, args))
            print(json.dumps(report, indent=2))
            return 0 if report["ok"] else 1
        store = _store(getattr(args, "store", "auto"), getattr(args, "apply", False))
        if args.command == "secure-get":
            print(fetch_secure_file(conn, store, args.path, refresh=args.refresh))
            return 0
        if args.command == "cleanup-uploads":
            service = FilesystemService(repo, store, OperatorAuthorizer())
            rep = cleanup_uploads(service, dry_run=not args.apply)
            print(json.dumps(vars(rep), indent=2, default=str))
            return 0 if not rep.errors else 1
        actor = _actor(conn, args)
        if getattr(args, "apply", False) and actor is None and not args.operator:
            print("apply needs --actor <account id | issuer|subject> (or --operator for local repository tooling)", file=sys.stderr)
            return 2
        authorizer = DatabaseAuthorizer(conn) if actor else OperatorAuthorizer()
        service = FilesystemService(repo, store, authorizer, verify=getattr(args, "verify", "head"))
        if args.command == "transition-access":
            folder = repo.folder_by_path(args.path)
            if folder is None:
                print(f"no such folder {args.path}", file=sys.stderr)
                return 1
            rep = transition_folder_access(service, folder["id"], args.access, actor=actor, dry_run=not args.apply)
            print(json.dumps(vars(rep), indent=2, default=str))
            return 0 if rep.error is None else 1
        try:
            plan = load_plan(Path(args.manifest), entry_ids=set(args.entry or []) or None)
        except ManifestError as error:
            print(f"manifest error: {error}", file=sys.stderr)
            return 2
        try:
            report = run_sync(plan, service, actor=actor, dry_run=not args.apply)
        except StoreError as error:
            print(f"store error: {error}", file=sys.stderr)
            return 1
        out = {"manifest": plan.name, "dry_run": report.dry_run, "ok": report.ok, "folders": report.summary("folder"), "files": report.summary("file"),
               "reused_storage": sum(1 for i in report.items if i.reused_storage), "recovered": sum(1 for i in report.items if i.recovered),
               "problems": [vars(i) for i in report.problems()[: args.limit_problems]]}
        print(json.dumps(out, indent=2))
        return 0 if report.ok else 1


if __name__ == "__main__":
    sys.exit(main())
