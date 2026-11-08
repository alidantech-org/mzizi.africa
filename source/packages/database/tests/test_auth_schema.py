"""The auth schema in the disposable rewrite database (mzizi_new): keys, OIDC resolution, scoped access, lifecycle, ownership.

Ported from the earlier Bun checks. Every test runs inside a transaction that is rolled back; stand-in data tables
(geography, results, budgets) are created inside that transaction in a throwaway schema.
"""
from __future__ import annotations

import psycopg
import pytest

from mzizi_database import connect, rewrite_url
from mzizi_database.cli import init
from mzizi_database.loaders import auth as auth_loader

ISSUER = "https://sso.example.test/realms/mzizi"


@pytest.fixture(scope="module", autouse=True)
def initialised():
    return init()


@pytest.fixture
def db():
    conn = connect(rewrite_url())
    yield conn
    conn.rollback()
    conn.close()


def one(db, sql, params=()):
    return db.execute(sql, params).fetchone()


def rejected(db, sql, params=()):
    db.execute("SAVEPOINT attempt")
    try:
        db.execute(sql, params)
    except psycopg.Error as error:
        db.execute("ROLLBACK TO attempt")
        return error
    db.execute("ROLLBACK TO attempt")
    raise AssertionError(f"expected rejection: {sql}")


def account(db, name, subject=None):
    acct = one(db, "INSERT INTO auth.accounts (display_name) VALUES (%s) RETURNING id", (name,))["id"]
    if subject:
        db.execute("INSERT INTO auth.identities (account_id, issuer, subject) VALUES (%s, %s, %s)", (acct, ISSUER, subject))
    return acct


def institution(db, code, parent=None):
    return one(db, "INSERT INTO auth.institutions (code, name, parent_id, country_code) VALUES (%s, %s, %s, 'KE') RETURNING id", (code, code, parent))["id"]


def grant(db, grantor, to, role, table=None, scope_id=None, expires=None):
    return one(db, "SELECT auth.grant_role(%s, %s, %s, %s, %s, %s) AS id", (grantor, to, role, table, scope_id, expires))["id"]


def decide(db, acct, permission, table, record):
    return one(db, "SELECT auth.can(%s, %s, %s, %s) AS r", (acct, permission, table, record))["r"]


class World:
    pass


@pytest.fixture
def w(db):
    x = World()
    x.admin = one(db, "SELECT auth.bootstrap_admin(%s, 'admin-sub', 'Admin', 'admin') AS id", (ISSUER,))["id"]
    x.iebc, x.nairobi_gov = institution(db, "iebc"), institution(db, "nairobi_county")
    x.nairobi_health = institution(db, "nairobi_county.health", x.nairobi_gov)
    db.execute("CREATE SCHEMA geo")
    db.execute("CREATE TABLE geo.units (id uuid PRIMARY KEY DEFAULT uuidv7(), name text, parent_id uuid REFERENCES geo.units(id))")
    unit = lambda name, parent=None: one(db, "INSERT INTO geo.units (name, parent_id) VALUES (%s, %s) RETURNING id", (name, parent))["id"]  # noqa: E731
    x.kenya = unit("kenya")
    x.nairobi, x.kisumu = unit("nairobi", x.kenya), unit("kisumu", x.kenya)
    x.westlands = unit("westlands", x.nairobi)
    db.execute("CREATE TABLE geo.budgets (id uuid PRIMARY KEY DEFAULT uuidv7(), unit_id uuid NOT NULL REFERENCES geo.units(id))")
    db.execute("CREATE TABLE geo.results (id uuid PRIMARY KEY DEFAULT uuidv7(), steward_id uuid NOT NULL REFERENCES auth.institutions(id), unit_id uuid REFERENCES geo.units(id))")
    db.execute("SELECT auth.register_scope_target('geo.units', 'parent_id')")
    db.execute("SELECT auth.register_governed_table('geo.budgets', 'finance', 'geo.units', 'unit_id')")
    db.execute("SELECT auth.register_governed_table('geo.results', 'electoral', 'auth.institutions', 'steward_id')")
    db.execute("SELECT auth.create_role('finance_manager', 'Finance manager', ARRAY['finance.*'])")
    db.execute("SELECT auth.create_role('electoral_manager', 'Electoral manager', ARRAY['electoral.*'])")
    x.budget = lambda unit_id: one(db, "INSERT INTO geo.budgets (unit_id) VALUES (%s) RETURNING id", (unit_id,))["id"]
    x.result = lambda steward, unit_id=None: one(db, "INSERT INTO geo.results (steward_id, unit_id) VALUES (%s, %s) RETURNING id", (steward, unit_id))["id"]
    return x


# ---------------------------------------------------------------------------- initialization and keys
def test_migrations_are_recorded_and_the_nine_auth_tables_exist(db):
    assert [r["name"] for r in db.execute("SELECT name FROM public.migrations ORDER BY name").fetchall()] == ["auth/0001_auth.sql", "auth/0002_auth_functions.sql", "engine/0001_engine.sql", "filesystem/0001_filesystem.sql"]
    tables = [r["table_name"] for r in db.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth' AND table_type = 'BASE TABLE' ORDER BY 1").fetchall()]
    assert tables == ["accounts", "governed_tables", "identities", "institutions", "permissions", "role_assignments", "role_permissions", "roles", "scope_targets"]
    assert {r["table_name"] for r in db.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'").fetchall()} == {"migrations"}


def test_every_auth_table_has_a_primary_key_and_a_comment(db):
    rows = db.execute("""SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = 'auth' WHERE c.relkind = 'r'
        AND (obj_description(c.oid) IS NULL AND c.relname <> 'role_permissions' OR NOT EXISTS (SELECT 1 FROM pg_constraint k WHERE k.conrelid = c.oid AND k.contype = 'p'))""").fetchall()
    assert rows == []


def test_the_seed_is_applied_from_files_idempotently_and_namespaces_extend_the_admin_role(db):
    assert auth_loader.apply_auth_seed(db) == auth_loader.AuthSeedResult(0, 0, 0, 0)
    db.rollback()
    assert one(db, "SELECT count(*) AS n FROM auth.permissions WHERE namespace = 'electoral'")["n"] == 6
    assert one(db, "SELECT count(*) AS n FROM auth.roles")["n"] == 5
    assert one(db, "SELECT count(*) AS n FROM auth.role_permissions rp JOIN auth.roles r ON r.id = rp.role_id WHERE r.code = 'admin'")["n"] == 72
    assert rejected(db, "INSERT INTO auth.permissions VALUES ('electoral', 'approve')").sqlstate == "23514"
    db.execute("SELECT auth.register_namespace('newarea')")
    assert one(db, "SELECT count(*) AS n FROM auth.role_permissions rp JOIN auth.roles r ON r.id = rp.role_id WHERE r.code = 'admin' AND namespace = 'newarea'")["n"] == 6


def test_a_bad_bundle_row_is_rejected_without_partial_change(db, tmp_path):
    import shutil

    target = tmp_path / "global" / "auth"
    target.mkdir(parents=True)
    for name in ("roles.csv", "namespaces.csv", "scope-targets.csv", "governed-tables.csv"):
        shutil.copy(auth_loader.seed_root() / "global" / "auth" / name, target / name)
    (target / "role-permissions.csv").write_text("role_code,permission\nreader,nonexistent.read\n")
    before = one(db, "SELECT count(*) AS n FROM auth.role_permissions")["n"]
    with pytest.raises(ValueError, match="matches no role or permission"):
        auth_loader.apply_auth_seed(db, tmp_path)
    db.rollback()
    assert one(db, "SELECT count(*) AS n FROM auth.role_permissions")["n"] == before


def test_foreign_keys_uniqueness_and_scope_pairing_are_enforced(db, w):
    a = account(db, "A", "same")
    assert rejected(db, "INSERT INTO auth.identities (account_id, issuer, subject) VALUES (%s, %s, 'same')", (a, ISSUER)).sqlstate == "23505"
    assert rejected(db, "INSERT INTO auth.role_permissions VALUES (uuidv7(), 'electoral', 'read')").sqlstate == "23503"
    assert rejected(db, "INSERT INTO auth.role_assignments (account_id, role_id, scope_table, granted_by) SELECT %s, id, 'geo.units', %s FROM auth.roles WHERE code = 'reader'", (a, a)).sqlstate == "23514"


# -------------------------------------------------------------------------------------- OIDC identity
def test_opaque_non_uuid_subjects_resolve_and_unknown_or_suspended_are_distinguished(db, w):
    for s in ("auth0|65f1c3", "kc:7b/x y", "plain"):
        account(db, f"u {s}", s)
        assert one(db, "SELECT outcome FROM auth.resolve_identity(%s, %s)", (ISSUER, s))["outcome"] == "ok"
    assert one(db, "SELECT outcome FROM auth.resolve_identity(%s, 'nobody')", (ISSUER,))["outcome"] == "unknown_identity"
    assert one(db, "SELECT outcome FROM auth.resolve_identity('https://other.example', 'plain')")["outcome"] == "unknown_identity"
    db.execute("UPDATE auth.accounts SET status = 'suspended' WHERE display_name = 'u plain'")
    assert one(db, "SELECT outcome FROM auth.resolve_identity(%s, 'plain')", (ISSUER,))["outcome"] == "account_not_active"


# ----------------------------------------------------------------------------------------- scoped access
def test_an_iebc_official_edits_iebc_results_but_a_nairobi_manager_cannot_even_for_nairobi_results(db, w):
    iebc_official, county_official = account(db, "IEBC official"), account(db, "Nairobi official")
    grant(db, w.admin, iebc_official, "electoral_manager", "auth.institutions", w.iebc)
    grant(db, w.admin, county_official, "electoral_manager", "geo.units", w.nairobi)
    iebc_result = w.result(w.iebc, w.nairobi)
    assert decide(db, iebc_official, "electoral.edit", "geo.results", iebc_result)["allowed"] is True
    denied = decide(db, county_official, "electoral.edit", "geo.results", iebc_result)
    assert denied["allowed"] is False and denied["reason"] == "out_of_scope"


def test_a_parent_grant_covers_children_but_not_siblings_or_the_parent(db, w):
    manager = account(db, "Nairobi finance")
    grant(db, w.admin, manager, "finance_manager", "geo.units", w.nairobi)
    assert decide(db, manager, "finance.edit", "geo.budgets", w.budget(w.nairobi))["allowed"]
    assert decide(db, manager, "finance.edit", "geo.budgets", w.budget(w.westlands))["allowed"]
    assert decide(db, manager, "finance.edit", "geo.budgets", w.budget(w.kisumu))["reason"] == "out_of_scope"
    assert decide(db, manager, "finance.edit", "geo.budgets", w.budget(w.kenya))["reason"] == "out_of_scope"


def test_institution_grants_cover_departments_and_roles_cover_only_their_namespace(db, w):
    official = account(db, "County official")
    grant(db, w.admin, official, "electoral_manager", "auth.institutions", w.nairobi_gov)
    assert decide(db, official, "electoral.read", "geo.results", w.result(w.nairobi_health))["allowed"]
    assert not decide(db, official, "electoral.read", "geo.results", w.result(w.iebc))["allowed"]
    manager = account(db, "Finance manager")
    grant(db, w.admin, manager, "finance_manager", "geo.units", w.kenya)
    assert decide(db, manager, "finance.publish", "geo.budgets", w.budget(w.kisumu))["allowed"]
    assert decide(db, manager, "electoral.edit", "geo.budgets", w.budget(w.kisumu))["reason"] == "namespace_mismatch"
    reader = account(db, "Reader")
    grant(db, w.admin, reader, "reader")
    assert decide(db, reader, "finance.read", "geo.budgets", w.budget(w.kisumu))["allowed"]
    assert decide(db, reader, "finance.edit", "geo.budgets", w.budget(w.kisumu))["reason"] == "no_grant"


def test_platform_grants_cover_governed_tables_and_unregistered_tables_are_denied(db, w):
    manager = account(db, "Platform manager")
    grant(db, w.admin, manager, "finance_manager")
    assert decide(db, manager, "finance.edit", "geo.budgets", w.budget(w.kisumu))["allowed"]
    db.execute("CREATE TABLE geo.unregistered (id uuid PRIMARY KEY DEFAULT uuidv7())")
    rid = one(db, "INSERT INTO geo.unregistered DEFAULT VALUES RETURNING id")["id"]
    assert decide(db, w.admin, "finance.edit", "geo.unregistered", rid)["reason"] == "table_not_governed"


def test_expiry_revocation_and_suspension_deny_immediately(db, w):
    budget = w.budget(w.kisumu)
    timed = account(db, "Timed")
    grant(db, w.admin, timed, "finance_manager", "geo.units", w.kenya, "2099-01-01")
    assert decide(db, timed, "finance.edit", "geo.budgets", budget)["allowed"]
    db.execute("UPDATE auth.role_assignments SET expires_at = now() - interval '1 second' WHERE account_id = %s", (timed,))
    assert decide(db, timed, "finance.edit", "geo.budgets", budget)["reason"] == "no_grant"
    revoked = account(db, "Revoked")
    g = grant(db, w.admin, revoked, "finance_manager", "geo.units", w.kenya)
    db.execute("SELECT auth.revoke_grant(%s, %s)", (w.admin, g))
    assert decide(db, revoked, "finance.edit", "geo.budgets", budget)["reason"] == "no_grant"
    suspended = account(db, "Suspended")
    grant(db, w.admin, suspended, "finance_manager", "geo.units", w.kenya)
    db.execute("UPDATE auth.accounts SET status = 'suspended' WHERE id = %s", (suspended,))
    assert decide(db, suspended, "finance.edit", "geo.budgets", budget)["reason"] == "account_not_active"


# ----------------------------------------------------------------------------- grants and ownership
def test_only_a_platform_auth_editor_grants_or_revokes(db, w):
    nobody, friend, reviewer = account(db, "Nobody"), account(db, "Friend"), account(db, "Reviewer")
    assert "may not grant" in str(rejected(db, "SELECT auth.grant_role(%s, %s, 'reader')", (nobody, friend)))
    grant(db, w.admin, reviewer, "reviewer")
    assert "may not grant" in str(rejected(db, "SELECT auth.grant_role(%s, %s, 'reader')", (reviewer, friend)))
    g = grant(db, w.admin, friend, "reader")
    assert "may not revoke" in str(rejected(db, "SELECT auth.revoke_grant(%s, %s)", (nobody, g)))


def test_invalid_scopes_are_rejected_and_grants_cannot_be_edited_extended_or_deleted(db, w):
    user = account(db, "User")
    assert "does not exist" in str(rejected(db, "SELECT auth.grant_role(%s, %s, 'reader', 'geo.units', uuidv7())", (w.admin, user)))
    assert "not an allowed scope target" in str(rejected(db, "SELECT auth.grant_role(%s, %s, 'reader', 'geo.budgets', uuidv7())", (w.admin, user)))
    g = grant(db, w.admin, user, "reader", "geo.units", w.nairobi, "2099-01-01")
    assert "cannot be extended" in str(rejected(db, "UPDATE auth.role_assignments SET expires_at = expires_at + interval '1 day' WHERE id = %s", (g,)))
    assert "cannot be edited" in str(rejected(db, "UPDATE auth.role_assignments SET role_id = (SELECT id FROM auth.roles WHERE code = 'admin') WHERE id = %s", (g,)))
    assert "never deleted" in str(rejected(db, "DELETE FROM auth.role_assignments WHERE id = %s", (g,)))


def test_registration_needs_real_tables_and_columns(db, w):
    assert "does not exist" in str(rejected(db, "SELECT auth.register_scope_target('geo.missing')"))
    assert "not registered" in str(rejected(db, "SELECT auth.register_governed_table('geo.budgets', 'nonamespace', 'geo.units', 'unit_id')"))
    db.execute("CREATE TABLE geo.other (id uuid PRIMARY KEY)")
    assert "not found" in str(rejected(db, "SELECT auth.register_governed_table('geo.other', 'finance', 'geo.units', 'unit_id')"))


def test_moving_a_records_owner_is_checked_against_both_existing_and_proposed_owner(db, w):
    manager = account(db, "Nairobi finance")
    grant(db, w.admin, manager, "finance_manager", "geo.units", w.nairobi)
    budget, outside = w.budget(w.westlands), w.budget(w.kisumu)
    change = lambda record, to: one(db, "SELECT auth.can_change(%s, 'finance.edit', 'geo.budgets', %s, %s) AS r", (manager, record, to))["r"]  # noqa: E731
    assert change(budget, w.nairobi)["allowed"]
    assert change(budget, w.kisumu)["failed_on"] == "proposed_owner"
    assert change(outside, w.nairobi)["failed_on"] == "existing_owner"


def test_institution_parents_cannot_form_a_cycle(db, w):
    assert "cycle" in str(rejected(db, "UPDATE auth.institutions SET parent_id = %s WHERE id = %s", (w.nairobi_health, w.nairobi_gov)))


def test_allowed_links_filter_before_pagination_and_totals(db, w):
    manager = account(db, "Lister")
    grant(db, w.admin, manager, "finance_manager", "geo.units", w.nairobi)
    units = [w.nairobi, w.kisumu, w.westlands, w.kenya, w.kisumu, w.nairobi, w.kisumu, w.westlands]
    ids = [w.budget(u) for u in units]
    visible = "FROM geo.budgets b WHERE EXISTS (SELECT 1 FROM auth.allowed_links(%s, 'finance.read', 'geo.budgets') l WHERE l.all_records OR l.link_id = b.unit_id)"
    assert one(db, f"SELECT count(*) AS n {visible}", (manager,))["n"] == 4
    page = db.execute(f"SELECT b.id {visible} ORDER BY b.id LIMIT 3 OFFSET 2", (manager,)).fetchall()
    assert len(page) == 2 and {r["id"] for r in page} <= {ids[0], ids[2], ids[5], ids[7]}
    assert one(db, "SELECT count(*) AS n FROM auth.allowed_links(%s, 'finance.read', 'geo.budgets') WHERE all_records", (w.admin,))["n"] == 1
    assert db.execute("SELECT 1 FROM auth.allowed_links(%s, 'electoral.read', 'geo.budgets')", (manager,)).fetchall() == []
