"""Loader `auth.baseline`: applies seed/global/auth/ (roles, namespaces, role bundles, scope targets) to the auth schema.

Additive and idempotent: existing rows are kept, role names may be refreshed, nothing is deleted because a file stops
listing it. Every value is a bound parameter; the files cannot run SQL.
"""
from __future__ import annotations

import csv
import os
from dataclasses import dataclass
from pathlib import Path

import psycopg
import yaml


def seed_root() -> Path:
    return Path(os.environ.get("MZIZI_SEED_ROOT") or Path(__file__).resolve().parents[6] / "seed")


def read_records(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return [row for row in csv.DictReader(handle) if any(v for v in row.values())]


@dataclass(frozen=True)
class AuthSeedResult:
    roles: int
    namespaces: int
    bundle_permissions: int
    scope_targets: int


def _counts(conn: psycopg.Connection) -> tuple[int, int, int, int]:
    q = lambda sql: conn.execute(sql).fetchone()["n"]  # noqa: E731
    return (q("SELECT count(*) AS n FROM auth.roles"), q("SELECT count(DISTINCT namespace) AS n FROM auth.permissions"), q("SELECT count(*) AS n FROM auth.role_permissions"), q("SELECT count(*) AS n FROM auth.scope_targets") + q("SELECT count(*) AS n FROM auth.governed_tables"))


def apply_auth_seed(conn: psycopg.Connection, root: Path | None = None) -> AuthSeedResult:
    directory = (root or seed_root()) / "global" / "auth"
    roles = read_records(directory / "roles.csv")
    namespaces = read_records(directory / "namespaces.csv")
    bundles = read_records(directory / "role-permissions.csv")
    targets = read_records(directory / "scope-targets.csv")
    governed = read_records(directory / "governed-tables.csv")
    before = _counts(conn)
    with conn.transaction():
        for role in roles:
            conn.execute("INSERT INTO auth.roles (code, name) VALUES (%s, %s) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name", (role["code"], role["name"]))
        for namespace in namespaces:
            conn.execute("SELECT auth.register_namespace(%s)", (namespace["namespace"],))
        for bundle in bundles:
            ns, action = bundle["permission"].split(".")
            known = conn.execute("SELECT 1 FROM auth.roles r, auth.permissions p WHERE r.code = %s AND p.namespace = %s AND (%s = '*' OR p.action = %s)", (bundle["role_code"], ns, action, action)).fetchone()
            if not known:
                raise ValueError(f"role-permissions.csv: {bundle['role_code']} / {bundle['permission']} matches no role or permission")
            conn.execute(
                "INSERT INTO auth.role_permissions SELECT r.id, p.namespace, p.action FROM auth.roles r, auth.permissions p WHERE r.code = %s AND p.namespace = %s AND (%s = '*' OR p.action = %s) ON CONFLICT DO NOTHING",
                (bundle["role_code"], ns, action, action),
            )
        for target in targets:
            if not conn.execute("SELECT 1 FROM auth.scope_targets WHERE table_name = %s", (target["table_name"],)).fetchone():
                conn.execute("SELECT auth.register_scope_target(%s, %s)", (target["table_name"], target["parent_column"] or None))
        for table in governed:
            if not conn.execute("SELECT 1 FROM auth.governed_tables WHERE table_name = %s", (table["table_name"],)).fetchone():
                conn.execute("SELECT auth.register_governed_table(%s, %s, %s, %s)", (table["table_name"], table["namespace"], table["link_table"], table["link_column"]))
    after = _counts(conn)
    return AuthSeedResult(*(a - b for a, b in zip(after, before)))


def read_bootstrap(root: Path | None = None) -> dict:
    return yaml.safe_load(((root or seed_root()) / "global" / "auth" / "bootstrap.yaml").read_text(encoding="utf-8"))


def bootstrap_admin(conn: psycopg.Connection, issuer: str, subject: str, display_name: str, role: str) -> str:
    return str(conn.execute("SELECT auth.bootstrap_admin(%s, %s, %s, %s) AS id", (issuer, subject, display_name, role)).fetchone()["id"])
