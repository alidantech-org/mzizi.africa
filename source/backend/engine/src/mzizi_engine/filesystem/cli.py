"""mzizi-filesystem: synchronize, inspect and maintain the filesystem registry and its bucket.

  uv run mzizi-filesystem sync                                   # preview of seed/manifest.yaml (default, writes nothing)
  uv run mzizi-filesystem sync --apply --operator                # upload and register; or --actor <account id | issuer|subject>
  uv run mzizi-filesystem tree [/path]                           # folders with their effective classification
  uv run mzizi-filesystem ls /seed/global/auth                   # files with their object keys
  uv run mzizi-filesystem verify                                 # registry against bucket (missing, changed, unregistered objects)
  uv run mzizi-filesystem duplicates                             # files with equal content
  uv run mzizi-filesystem move /seed/a/b.json --name c.json --apply --operator      # rename or move; objects are relocated
  uv run mzizi-filesystem transition-access /path internal --apply --operator
  uv run mzizi-filesystem wipe --registry --bucket               # fresh start preview; --apply --confirm mzizi to run it
  uv run mzizi-filesystem cleanup-uploads [--apply]              uv run mzizi-filesystem live-check --apply

The object key is the registry path: <access>/<folder path>/<file name>. public/raw/ is a protected archive that no command writes or
deletes. S3 comes from the environment (S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, optional S3_PUBLIC_ENDPOINT); the repository-root
.env (git-ignored) is loaded when variables are unset; AWS_* names alias S3_*; the database is mzizi_new (REWRITE_DATABASE_URL).
Apply needs --actor (an account of the auth schema) unless --operator is given for local repository tooling.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

from mzizi_engine.filesystem.authz import DatabaseAuthorizer, OperatorAuthorizer
from mzizi_engine.filesystem.repository import Repository
from mzizi_engine.filesystem.reset import verify_registry, wipe_bucket, wipe_registry
from mzizi_engine.filesystem.secure import fetch_secure_file
from mzizi_engine.filesystem.service import FilesystemService
from mzizi_engine.filesystem.sync import ManifestError, load_plan, run_sync
from mzizi_engine.filesystem.transitions import move_file, move_folder, transition_folder_access
from mzizi_engine.filesystem.uploads import cleanup_uploads
from mzizi_engine.ports import Connection, connect, required, rewrite_url
from mzizi_filesystem.env import load_environment
from mzizi_filesystem.store import MemoryObjectStore, ObjectStore, S3ObjectStore, StoreError
from mzizi_manifest.paths import SEED_ROOT


def _store(kind: str, apply: bool) -> ObjectStore:
    have_s3 = all(os.environ.get(k) for k in ("S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY"))
    if kind == "auto":
        kind = "s3" if have_s3 else "memory"
    if kind == "memory":
        if apply:
            print("note: applying with the in-memory store is a rehearsal; nothing reaches S3", file=sys.stderr)
        return MemoryObjectStore()
    return S3ObjectStore()


def _actor(conn: Connection, args: argparse.Namespace) -> str | None:
    value = args.actor or os.environ.get("MZIZI_ACTOR")
    if value and "|" in value:
        issuer, subject = value.split("|", 1)
        resolved = conn.execute("SELECT account_id, outcome FROM auth.resolve_identity(%s, %s)", (issuer, subject))
        row = required(resolved.fetchone())
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
    s.add_argument("--actor")
    s.add_argument("--operator", action="store_true")
    s.add_argument("--json", action="store_true")
    s.add_argument("--limit-problems", type=int, default=20)
    t = sub.add_parser("tree")
    t.add_argument("path", nargs="?", default="/")
    c = sub.add_parser("cleanup-uploads")
    c.add_argument("--apply", action="store_true")
    c.add_argument("--store", choices=["auto", "s3", "memory"], default="auto")
    a = sub.add_parser("transition-access")
    a.add_argument("path")
    a.add_argument("access")
    a.add_argument("--apply", action="store_true")
    a.add_argument("--actor")
    a.add_argument("--operator", action="store_true")
    a.add_argument("--store", choices=["auto", "s3", "memory"], default="auto")
    sg = sub.add_parser(
        "secure-get", help="download a registered security file into the git-ignored local cache and print its path"
    )
    sg.add_argument("path")
    sg.add_argument("--refresh", action="store_true")
    sg.add_argument("--store", choices=["auto", "s3", "memory"], default="s3")
    ls = sub.add_parser("ls", help="files of a folder with revision, size and object key")
    ls.add_argument("path")
    sub.add_parser("duplicates", help="files with equal content (same sha256 and size)")
    vf = sub.add_parser("verify", help="compare the registry with the bucket")
    vf.add_argument("--store", choices=["auto", "s3", "memory"], default="s3")
    vf.add_argument("--limit", type=int, default=20)
    mv = sub.add_parser(
        "move", help="rename and/or move a file or folder; its objects are relocated to the new readable keys"
    )
    mv.add_argument("path")
    mv.add_argument("--name")
    mv.add_argument("--to", help="destination folder path")
    mv.add_argument("--apply", action="store_true")
    mv.add_argument("--actor")
    mv.add_argument("--operator", action="store_true")
    mv.add_argument("--store", choices=["auto", "s3", "memory"], default="auto")
    wp = sub.add_parser(
        "wipe",
        help="fresh start: delete registry rows and/or every object outside the protected public/raw/ archive (dry run by default)",
    )
    wp.add_argument("--registry", action="store_true")
    wp.add_argument("--bucket", action="store_true")
    wp.add_argument(
        "--drop-dependents",
        action="store_true",
        help="also delete rows of other schemas that reference file versions (reload them from seed afterwards)",
    )
    wp.add_argument("--apply", action="store_true")
    wp.add_argument("--confirm", help="must be the bucket name when applying")
    wp.add_argument("--store", choices=["auto", "s3", "memory"], default="s3")
    lv = sub.add_parser("live-check")
    lv.add_argument("--apply", action="store_true")
    lv.add_argument("--actor")
    args = p.parse_args(argv)
    load_environment()
    with connect(rewrite_url(), autocommit=True) as conn:
        repo = Repository(conn)
        if args.command == "tree":
            folder = repo.folder_by_path(args.path) if args.path != "/" else None
            rows = conn.execute(
                "SELECT id, filesystem.folder_path(id) AS path FROM filesystem.folders WHERE %s::uuid IS NULL OR id = %s OR filesystem.folder_path(id) LIKE %s ORDER BY 2",
                (folder["id"] if folder else None, folder["id"] if folder else None, (args.path.rstrip("/") + "/%")),
            ).fetchall()
            for r in rows:
                eff = repo.effective(r["id"])
                n = required(
                    conn.execute(
                        "SELECT count(*) AS n FROM filesystem.files WHERE folder_id = %s", (r["id"],)
                    ).fetchone()
                )["n"]
                print(
                    f"{r['path']}  [{eff['access']}{' seed' if eff['is_seed'] else ''}{' ' + eff['artifact_role'] if eff['artifact_role'] else ''}]  files={n}"
                )
            return 0
        if args.command == "live-check":
            from mzizi_engine.filesystem.livecheck import run_live_check

            if not args.apply:
                print(
                    "dry run: live-check uploads and removes a few test objects under private/tmp/mzizi-live-check-<id>/; pass --apply to run it"
                )
                return 0
            live = run_live_check(S3ObjectStore(), repo, _actor(conn, args))
            print(json.dumps(live, indent=2))
            return 0 if live["ok"] else 1
        if args.command == "ls":
            folder = repo.folder_by_path(args.path)
            if folder is None:
                print(f"no such folder {args.path}", file=sys.stderr)
                return 1
            for r in conn.execute(
                "SELECT f.name, f.retention, v.revision, v.size_bytes, v.s3_key, v.pinned FROM filesystem.files f JOIN filesystem.file_versions v ON v.id = f.current_version_id WHERE f.folder_id = %s ORDER BY f.name",
                (folder["id"],),
            ).fetchall():
                print(
                    f"{r['name']}  r{r['revision']}  {r['size_bytes']} bytes  {r['retention']}{' pinned' if r['pinned'] else ''}  {r['s3_key']}"
                )
            return 0
        if args.command == "duplicates":
            rows = repo.duplicates()
            for r in rows:
                print(f"{r['copies']} copies, {r['size_bytes']} bytes each, sha256 {r['sha256'][:16]}:")
                for path in r["paths"]:
                    print(f"  {path}")
            print(f"{len(rows)} groups of equal content")
            return 0
        store = _store(getattr(args, "store", "auto"), getattr(args, "apply", False))
        if args.command == "verify":
            rep = verify_registry(conn, store)
            verified: dict[str, Any] = {
                "clean": rep.clean,
                "versions": rep.versions,
                "ok": rep.ok,
                "protected_objects": rep.protected_objects,
            }
            for name in ("missing", "mismatched", "misplaced", "unregistered"):
                verified[name] = {"count": len(getattr(rep, name)), "first": getattr(rep, name)[: args.limit]}
            print(json.dumps(verified, indent=2))
            return 0 if rep.clean else 1
        if args.command == "wipe":
            if not (args.registry or args.bucket):
                print("say what to wipe: --registry, --bucket or both", file=sys.stderr)
                return 2
            if args.apply and args.confirm != store.bucket:
                print(f"applying a wipe needs --confirm {store.bucket}", file=sys.stderr)
                return 2
            wiped: dict[str, Any] = {}
            if args.registry:
                wiped["registry"] = wipe_registry(conn, dry_run=not args.apply, drop_dependents=args.drop_dependents)
                if wiped["registry"].get("error"):
                    print(json.dumps(wiped, indent=2, default=str))
                    return 1
            if args.bucket:
                wiped["bucket"] = wipe_bucket(store, dry_run=not args.apply)
            print(json.dumps(wiped, indent=2, default=str))
            return 0
        if args.command == "secure-get":
            print(fetch_secure_file(conn, store, args.path, refresh=args.refresh))
            return 0
        if args.command == "cleanup-uploads":
            service = FilesystemService(repo, store, OperatorAuthorizer())
            cleaned = cleanup_uploads(service, dry_run=not args.apply)
            print(json.dumps(vars(cleaned), indent=2, default=str))
            return 0 if not cleaned.errors else 1
        actor = _actor(conn, args)
        if getattr(args, "apply", False) and actor is None and not args.operator:
            print(
                "apply needs --actor <account id | issuer|subject> (or --operator for local repository tooling)",
                file=sys.stderr,
            )
            return 2
        authorizer = DatabaseAuthorizer(conn) if actor else OperatorAuthorizer()
        service = FilesystemService(repo, store, authorizer, verify=getattr(args, "verify", "head"))
        if args.command == "transition-access":
            folder = repo.folder_by_path(args.path)
            if folder is None:
                print(f"no such folder {args.path}", file=sys.stderr)
                return 1
            moved = transition_folder_access(service, folder["id"], args.access, actor=actor, dry_run=not args.apply)
            print(json.dumps(vars(moved), indent=2, default=str))
            return 0 if moved.error is None else 1
        if args.command == "move":
            target = args.path.rstrip("/")
            dest = repo.folder_by_path(args.to) if args.to else None
            if args.to and dest is None:
                print(f"no such folder {args.to}", file=sys.stderr)
                return 1
            folder = repo.folder_by_path(target)
            if folder is not None:
                relocated = move_folder(
                    service,
                    folder["id"],
                    new_parent_id=dest["id"] if dest else None,
                    new_name=args.name,
                    actor=actor,
                    dry_run=not args.apply,
                )
            else:
                parent = repo.folder_by_path(target.rsplit("/", 1)[0] or "/")
                file = repo.find_file(parent["id"], target.rsplit("/", 1)[1]) if parent else None
                if file is None:
                    print(f"no such file or folder {target}", file=sys.stderr)
                    return 1
                relocated = move_file(
                    service,
                    file["id"],
                    new_folder_id=dest["id"] if dest else None,
                    new_name=args.name,
                    actor=actor,
                    dry_run=not args.apply,
                )
            print(json.dumps(vars(relocated), indent=2, default=str))
            return 0 if relocated.error is None else 1
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
        summary = {
            "manifest": plan.name,
            "dry_run": report.dry_run,
            "ok": report.ok,
            "folders": report.summary("folder"),
            "files": report.summary("file"),
            "duplicates": sum(1 for i in report.items if i.duplicate_of),
            "server_copied": sum(1 for i in report.items if i.server_copied),
            "recovered": sum(1 for i in report.items if i.recovered),
            "problems": [vars(i) for i in report.problems()[: args.limit_problems]],
        }
        print(json.dumps(summary, indent=2))
        return 0 if report.ok else 1


if __name__ == "__main__":
    sys.exit(main())
