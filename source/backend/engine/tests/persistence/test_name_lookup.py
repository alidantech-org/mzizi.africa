import os

import pytest

from mzizi_engine.persistence.postgres.connection import connect
from mzizi_engine.persistence.postgres.name_lookup import Stored, candidates_sql, resolve_source, similar
from mzizi_manifest.features.database.tables import load_tables
from mzizi_patterns.shared.contracts import LookupSource

URL = os.environ.get("MZIZI_TEST_DATABASE_URL", "")


def test_a_lookup_source_resolves_to_stored_tables_and_columns() -> None:
    source = LookupSource(table="identity.names", text="text", code="identity_code")
    stored = resolve_source(source, load_tables())
    assert stored.names_table == ("identity", "names") and stored.link_column == "identity_id"
    assert stored.target_table == ("identity", "identities") and stored.kind_column == ""
    assert "unaccent(lower(n." in candidates_sql(stored).as_string()


@pytest.mark.skipif(
    not URL, reason="set MZIZI_TEST_DATABASE_URL to a database with pg_trgm, unaccent and fuzzystrmatch"
)
def test_the_sql_lookup_finds_near_names_with_trigram_and_edit_distance() -> None:
    with connect(URL, autocommit=False) as conn, conn.cursor() as cursor:
        cursor.execute("CREATE TEMP TABLE things (id int PRIMARY KEY, code text)")
        cursor.execute("CREATE TEMP TABLE thing_names (id serial PRIMARY KEY, thing_id int, name text)")
        cursor.execute("INSERT INTO things VALUES (1, 'ke.mombasa'), (2, 'ke.kiambu')")
        cursor.execute("INSERT INTO thing_names (thing_id, name) VALUES (1, 'Mombasa'), (2, 'Kiambu')")
        stored = Stored(("pg_temp", "thing_names"), "name", "thing_id", ("pg_temp", "things"))
        found = similar(conn, stored, "mombassa")
        assert found[0].code == "ke.mombasa" and found[0].similarity > 0.4 and found[0].distance == 1
        assert similar(conn, stored, "kiambu")[0].code == "ke.kiambu"
        conn.rollback()
