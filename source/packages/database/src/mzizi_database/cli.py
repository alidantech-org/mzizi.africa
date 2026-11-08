"""mzizi-db: status, init, reset and bootstrap-admin for the disposable rewrite database (mzizi_new)."""
from __future__ import annotations

import argparse
import json
import os
import sys

from .connection import assert_rewrite_session, connect, rewrite_url
from .loaders import auth
from .migrate import apply_migrations, migration_files, reset_database


def init() -> dict:
    applied = apply_migrations()
    with connect(rewrite_url()) as conn:
        assert_rewrite_session(conn)
        seeded = auth.apply_auth_seed(conn)
    return {"applied": applied, "auth_seed_added": vars(seeded)}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="mzizi-db")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("status")
    sub.add_parser("init", help="create mzizi_new if missing, apply pending SQL, apply the auth seed")
    sub.add_parser("reset", help="drop and recreate mzizi_new only (host and current_database() verified), then init")
    admin = sub.add_parser("bootstrap-admin", help="create the first administrator; identity from args or the AUTH_BOOTSTRAP_* variables named in seed/global/auth/bootstrap.yaml")
    admin.add_argument("issuer", nargs="?")
    admin.add_argument("subject", nargs="?")
    admin.add_argument("name", nargs="?")
    args = parser.parse_args(argv)
    if args.command == "status":
        with connect(rewrite_url()) as conn:
            assert_rewrite_session(conn)
            applied = [r["name"] for r in conn.execute("SELECT name FROM public.migrations ORDER BY name").fetchall()]
        print(json.dumps({"database": "mzizi_new", "applied": applied, "known": [n for n, _, _ in migration_files()]}, indent=2))
    elif args.command == "init":
        print(json.dumps(init()))
    elif args.command == "reset":
        reset_database()
        print(json.dumps(init()))
    else:
        definition = auth.read_bootstrap()
        env = definition["identity"]
        issuer, subject, name = args.issuer or os.environ.get(env["issuer_env"]), args.subject or os.environ.get(env["subject_env"]), args.name or os.environ.get(env["display_name_env"])
        if not (issuer and subject and name):
            print(f"usage: bootstrap-admin <issuer> <subject> <name> (or set {env['issuer_env']}, {env['subject_env']}, {env['display_name_env']})", file=sys.stderr)
            return 2
        with connect(rewrite_url()) as conn:
            assert_rewrite_session(conn)
            with conn.transaction():
                print(json.dumps({"accountId": auth.bootstrap_admin(conn, issuer, subject, name, definition["role"])}))
    return 0


if __name__ == "__main__":
    sys.exit(main())
