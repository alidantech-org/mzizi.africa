"""The universal `code` column rule (.docs/rules/code-columns.md): one name, one shape, hierarchical by prefix, reproducible."""
from __future__ import annotations

import pytest
from fs_helpers import CLASS, purge

from mzizi_filesystem.codes import child_code, code_segment, is_code

SHAPE = r"^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$"


def test_every_code_column_is_named_code_and_carries_the_universal_shape_check(conn):
    cols = conn.execute("""SELECT c.table_schema, c.table_name, c.column_name FROM information_schema.columns c
        JOIN information_schema.tables t USING (table_schema, table_name)
        WHERE t.table_type = 'BASE TABLE' AND c.table_schema IN ('auth', 'engine', 'filesystem')
          AND (c.column_name = 'code' OR c.column_name LIKE '%\\_code' ESCAPE '\\')""").fetchall()
    assert {(c["table_schema"], c["table_name"]) for c in cols if c["column_name"] == "code"} == {("auth", "roles"), ("auth", "institutions"), ("filesystem", "folders"), ("filesystem", "files")}
    for c in cols:
        if c["column_name"] == "code":
            checks = [r["def"] for r in conn.execute("SELECT pg_get_constraintdef(oid) AS def FROM pg_constraint WHERE contype = 'c' AND conrelid = %s::regclass", (f"{c['table_schema']}.{c['table_name']}",)).fetchall()]
            assert any("code ~" in d and "[a-z0-9_]*" in d and "string_to_array" in d and "<= 255" in d for d in checks), f"{c['table_schema']}.{c['table_name']} lacks the code shape check"
        else:
            assert c["column_name"] in ("country_code", "jurisdiction_code"), f"unexpected qualified code column {c['column_name']}"


def test_code_segments_are_reproducible_and_python_matches_sql(conn):
    for name in ["legacy-artifacts", "roles.csv", "World GeoBoundaries (v2).json", "__x__", "A--B", "2fe4cc"]:
        assert code_segment(name) == conn.execute("SELECT filesystem.code_segment(%s) AS s", (name,)).fetchone()["s"]
    assert code_segment("legacy-artifacts") == "legacy_artifacts" and code_segment("roles.csv") == "roles_csv"
    assert child_code("seeds.global", "auth") == "seeds.global.auth" and child_code(None, "x") is None and child_code("a", "---") is None


@pytest.mark.parametrize("value,ok", [("seeds", True), ("seeds.global.auth.roles_csv", True), ("2fe.a_b", True), ("Seeds", False), ("a-b", False), ("a/b", False), ("a..b", False), (".a", False), ("a.", False), ("a" * 256, False), (".".join(["a"] * 17), False)])
def test_code_shape(value, ok):
    assert is_code(value) is ok


def test_database_refuses_bad_codes_and_codes_that_leave_their_parent(conn, repo):
    top = repo.create_folder(None, "codetest-top", {**CLASS, "code": "codetest"}, None)
    try:
        child = repo.create_folder(top["id"], "kid", {**CLASS, "code": "codetest.kid"}, None)
        with pytest.raises(Exception, match="must sit under"):
            repo.create_folder(top["id"], "stray", {**CLASS, "code": "elsewhere.stray"}, None)
        with pytest.raises(Exception):
            repo.create_folder(top["id"], "upper", {**CLASS, "code": "CodeTest.upper"}, None)
        # an uncoded folder between keeps the hierarchy through the nearest coded ancestor
        mid = repo.create_folder(child["id"], "mid", dict(CLASS), None)
        with pytest.raises(Exception, match="must sit under"):
            repo.create_folder(mid["id"], "deep", {**CLASS, "code": "codetest.deep"}, None)
        assert repo.create_folder(mid["id"], "deep", {**CLASS, "code": "codetest.kid.deep"}, None)["code"] == "codetest.kid.deep"
    finally:
        purge(conn, top["id"])


def test_roles_and_institutions_use_the_same_shape(conn):
    with pytest.raises(Exception):
        conn.execute("INSERT INTO auth.roles (code, name) VALUES ('Bad-Role', 'x')")
    with pytest.raises(Exception):
        conn.execute("INSERT INTO auth.institutions (code, name, country_code) VALUES ('bad-inst', 'x', 'KE')")
