"""Pattern generation, guards and coverage over the real `mzizix` database, seeded from `.dev/seed`.

Needs the database reset, loaded and generated (`bun run db reset --yes`, the seed loaders, then the `template.generate`
operation); skipped when `mzizix` is unreachable or holds no patterns. Every test runs in a transaction that is rolled
back, so the database is not changed. No other database is ever created or used.
"""

from __future__ import annotations

import os
from collections.abc import Iterator
from pathlib import Path

import psycopg
import pytest

from mzizi_engine.persistence.postgres.connection import Connection, connect
from mzizi_engine.persistence.postgres.template import PostgresTemplates
from mzizi_engine.runtime.assembly import template_operations

ROOT = Path(__file__).resolve().parents[5]
PATTERNS = (
    "tpl.pat.ke.general-election",
    "tpl.pat.ke.county-government",
    "tpl.pat.ke.county-assembly",
    "tpl.pat.ke.parliament",
)


def _url() -> str:
    values: dict[str, str] = {}
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                key, value = line.split("=", 1)
                values[key.strip()] = value.strip().strip('"')
    return os.environ.get("MZIZI_DB_ADMIN_URL") or values.get("MZIZI_DB_ADMIN_URL", "")


@pytest.fixture
def conn() -> Iterator[Connection]:
    url = _url()
    if not url or not url.endswith("/mzizix"):
        pytest.skip("MZIZI_DB_ADMIN_URL does not name mzizix")
    try:
        connection = connect(url)
    except psycopg.OperationalError:
        pytest.skip("mzizix is not reachable")
    try:
        row = connection.execute(
            "SELECT count(*) AS n FROM information_schema.tables WHERE table_schema = 'template' AND table_name = 'patterns'"
        ).fetchone()
        if (
            row is None
            or row["n"] == 0
            or connection.execute("SELECT 1 FROM template.patterns LIMIT 1").fetchone() is None
        ):
            pytest.skip("mzizix holds no patterns; load the seed first")
        yield connection
    finally:
        connection.rollback()
        connection.close()


def _count(conn: Connection, sql: str) -> int:
    row = conn.execute(sql).fetchone()
    assert row is not None
    return int(row["n"])


def _rejected(conn: Connection, sql: str, *params: object) -> str:
    """Run a statement that the database must refuse; returns its message and leaves the transaction usable."""
    conn.execute("SAVEPOINT attempt")
    with pytest.raises(psycopg.errors.DatabaseError) as raised:
        conn.execute(sql, params)
    conn.execute("ROLLBACK TO SAVEPOINT attempt")
    return str(raised.value)


# ---------------------------------------------------------------------------------------------------- text templates
def test_render_applies_the_closed_transform_list(conn: Connection) -> None:
    row = conn.execute(
        "SELECT template.render('{c|compact}.go.ke / {c|slug} / {c|upper}', '{\"c\": \"Trans Nzoia\"}'::jsonb) AS text"
    ).fetchone()
    assert row is not None and row["text"] == "transnzoia.go.ke / trans-nzoia / TRANS NZOIA"


def test_render_refuses_an_unknown_transform_or_token(conn: Connection) -> None:
    assert "unknown transform" in _rejected(conn, "SELECT template.render('{c|reverse}', '{\"c\": \"x\"}'::jsonb)")
    assert "no value is known" in _rejected(conn, "SELECT template.render('{missing}', '{}'::jsonb)")


# ----------------------------------------------------------------------------------------------------- area guards
def _level(conn: Connection, code: str) -> str:
    row = conn.execute("SELECT id::text AS id FROM reference.levels WHERE code = %s", (code,)).fetchone()
    assert row is not None
    return str(row["id"])


def _area(conn: Connection, level: str) -> dict[str, object]:
    row = conn.execute(
        "SELECT id::text AS id, hierarchy_id::text AS hierarchy_id, feature_id::text AS feature_id FROM geography.areas WHERE level_id = %s ORDER BY code LIMIT 1",
        (level,),
    ).fetchone()
    assert row is not None
    return dict(row)


_NEW_AREA = (
    "INSERT INTO geography.areas (id, code, hierarchy_id, level_id, feature_id, parent_id, version, created_at, updated_at)"
    " VALUES (gen_random_uuid(), %s, %s::uuid, %s::uuid, %s::uuid, %s::uuid, 1, now(), now())"
)


def test_area_must_be_deeper_than_its_parent(conn: Connection) -> None:
    county = _area(conn, _level(conn, "ref.lev.ke.electoral.county"))
    ward = _area(conn, _level(conn, "ref.lev.ke.electoral.ward"))
    message = _rejected(
        conn,
        _NEW_AREA,
        "geo.are.test.upside-down",
        county["hierarchy_id"],
        _level(conn, "ref.lev.ke.electoral.county"),
        county["feature_id"],
        ward["id"],
    )
    assert "deeper level" in message


def test_area_may_not_skip_a_level_unless_its_level_allows_it(conn: Connection) -> None:
    county = _area(conn, _level(conn, "ref.lev.ke.electoral.county"))
    ward_level = _level(conn, "ref.lev.ke.electoral.ward")
    ward = _area(conn, ward_level)
    message = _rejected(
        conn, _NEW_AREA, "geo.are.test.skips", county["hierarchy_id"], ward_level, ward["feature_id"], county["id"]
    )
    assert "skips a level" in message
    conn.execute("UPDATE reference.levels SET allows_skip = true WHERE id = %s::uuid", (ward_level,))
    # the guard now accepts the skip (the transaction is rolled back, so the extra area never stays)
    conn.execute(
        _NEW_AREA, ("geo.are.test.skips", county["hierarchy_id"], ward_level, ward["feature_id"], county["id"])
    )


def test_area_cannot_be_its_own_parent(conn: Connection) -> None:
    county = _area(conn, _level(conn, "ref.lev.ke.electoral.county"))
    assert "cycle" in _rejected(conn, "UPDATE geography.areas SET parent_id = id WHERE id = %s::uuid", county["id"])


def test_area_parent_must_be_in_the_same_hierarchy(conn: Connection) -> None:
    admin_county = _area(conn, _level(conn, "ref.lev.ke.administrative.county"))
    constituency = _area(conn, _level(conn, "ref.lev.ke.electoral.constituency"))
    assert "fk_areas__area_parent_is_in_hierarchy" in _rejected(
        conn,
        "UPDATE geography.areas SET parent_id = %s::uuid WHERE id = %s::uuid",
        admin_county["id"],
        constituency["id"],
    )


# ------------------------------------------------------------------------------------------------ geometry guard
def test_an_expected_geometry_has_no_drawing_and_a_drawn_one_has_a_drawing(conn: Connection) -> None:
    expected = conn.execute(
        "SELECT id::text AS id FROM geography.geometries WHERE status = 'expected' LIMIT 1"
    ).fetchone()
    drawn = conn.execute(
        "SELECT id::text AS id FROM geography.geometries WHERE status = 'established' LIMIT 1"
    ).fetchone()
    assert expected is not None and drawn is not None
    assert "needs a drawing" in _rejected(
        conn, "UPDATE geography.geometries SET status = 'draft' WHERE id = %s::uuid", expected["id"]
    )
    assert "no drawing yet" in _rejected(
        conn, "UPDATE geography.geometries SET status = 'expected' WHERE id = %s::uuid", drawn["id"]
    )


# ------------------------------------------------------------------------------------------------- template guards
def test_template_must_fan_out_over_a_level_of_its_own_country(conn: Connection) -> None:
    other = conn.execute(
        "SELECT l.id::text AS id FROM reference.levels l JOIN reference.hierarchies h ON h.id = l.hierarchy_id"
        " JOIN reference.countries c ON c.id = h.country_id WHERE c.code <> 'ref.cty.ke' LIMIT 1"
    ).fetchone()
    assert other is not None
    message = _rejected(
        conn,
        "UPDATE template.templates SET fan_out_level_id = %s::uuid WHERE code = 'tpl.tpl.ke.county-government.institution'",
        other["id"],
    )
    assert "another country" in message


def test_a_root_must_name_a_template_that_makes_its_kind_of_row(conn: Connection) -> None:
    term_template = conn.execute(
        "SELECT id::text AS id FROM template.templates WHERE product = 'term' LIMIT 1"
    ).fetchone()
    assert term_template is not None
    message = _rejected(
        conn,
        "UPDATE governance.offices SET template_id = %s::uuid WHERE id = (SELECT id FROM governance.offices LIMIT 1)",
        term_template["id"],
    )
    assert "must name a template that makes office rows" in message


def test_confidence_and_reason_are_on_the_template_not_on_its_rows(conn: Connection) -> None:
    template = conn.execute(
        "SELECT confidence, reason FROM template.templates WHERE code = 'tpl.tpl.ke.county-government.institution'"
    ).fetchone()
    assert template is not None and template["reason"] and template["confidence"] is not None
    leaked = _count(
        conn,
        "SELECT count(*) AS n FROM information_schema.columns WHERE column_name IN ('template_confidence', 'template_reason')",
    )
    assert leaked == 0


# ----------------------------------------------------------------------------------------------------- generation
def test_generation_is_repeatable_and_creates_nothing_the_second_time(conn: Connection) -> None:
    templates = PostgresTemplates(conn)
    assert [templates.generate_pattern(templates.pattern_id(code)) for code in PATTERNS] == [0, 0, 0, 0]


def test_generated_structure_matches_the_constitution_counts(conn: Connection) -> None:
    by_kind = {
        row["kind"]: int(row["n"])
        for row in conn.execute(
            "SELECT split_part(code, '.', 5) AS kind, count(*) AS n FROM governance.offices GROUP BY 1"
        ).fetchall()
    }
    assert by_kind["governor"] == 47 and by_kind["deputy-governor"] == 47
    assert by_kind["senator"] == 47 and by_kind["woman-rep"] == 47 and by_kind["mp"] == 290
    assert by_kind["mca"] == 1450
    years = [
        int(row["from_year"])
        for row in conn.execute(
            "SELECT from_year FROM election.elections WHERE kind_term IS NOT NULL ORDER BY from_year"
        ).fetchall()
    ]
    assert years == [2013, 2017, 2022, 2027]


def test_a_governor_has_a_term_and_an_empty_holder_slot_for_every_cycle(conn: Connection) -> None:
    rows = conn.execute(
        "SELECT t.from_year, t.to_year, h.individual_id FROM governance.terms t JOIN governance.holders h ON h.term_id = t.id"
        " JOIN governance.offices o ON o.id = t.office_id WHERE o.code = 'gov.ofs.ke.office.governor.nairobi' ORDER BY t.from_year"
    ).fetchall()
    assert [(r["from_year"], r["to_year"]) for r in rows] == [(2013, 2017), (2017, 2022), (2022, 2027), (2027, None)]
    assert all(r["individual_id"] is None for r in rows)


def test_a_template_chain_creates_premises_and_contact_slots_with_candidate_values(conn: Connection) -> None:
    contact = conn.execute(
        "SELECT c.value, c.visibility FROM official.contacts c JOIN governance.institutions i ON i.id = c.identity_id"
        " WHERE i.code = 'gov.ins.ke.institution.trans-nzoia.government' AND c.kind = 'website'"
    ).fetchone()
    assert contact is not None and contact["value"] == "https://transnzoia.go.ke" and contact["visibility"] == "public"
    assert _count(conn, "SELECT count(*) AS n FROM official.premises") == 47


def test_every_generated_root_links_its_template_and_effects_do_not(conn: Connection) -> None:
    assert _count(conn, "SELECT count(*) AS n FROM governance.offices WHERE template_id IS NULL") == 0
    assert _count(conn, "SELECT count(*) AS n FROM governance.terms WHERE template_id IS NULL") == 0
    holder_columns = _count(
        conn,
        "SELECT count(*) AS n FROM information_schema.columns WHERE table_schema = 'governance' AND table_name = 'holders' AND column_name = 'template_id'",
    )
    assert holder_columns == 0


def test_two_wards_with_one_name_in_a_county_still_get_their_own_office(conn: Connection) -> None:
    assert (
        _count(
            conn,
            "SELECT count(*) AS n FROM governance.offices WHERE code LIKE 'gov.ofs.ke.office.mca.kiambu.%.township'",
        )
        == 2
    )


# --------------------------------------------------------------------------------------------------------- coverage
def test_the_pending_queue_lists_slots_without_inventing_people_or_results(conn: Connection) -> None:
    queue = PostgresTemplates(conn).counts()
    assert queue["geometry"] == 394
    assert queue["holder"] == _count(conn, "SELECT count(*) AS n FROM governance.holders")
    assert _count(conn, "SELECT count(*) AS n FROM official.individuals") == 0
    assert _count(conn, "SELECT count(*) AS n FROM election.results") == 0


def test_the_engine_operations_run_over_the_database(conn: Connection) -> None:
    conn.rollback()
    result = template_operations.generate(template_operations.GenerateRequest(patterns=PATTERNS[:1]))
    assert result.created == {PATTERNS[0]: 0}
    report = template_operations.coverage(template_operations.CoverageRequest(queue="geometry", limit=5))
    assert len(report.rows) == 5 and report.counts["geometry"] == 394


# ------------------------------------------------------------------------------------------------------------ enums
def test_a_closed_value_set_is_enforced_by_the_database(conn: Connection) -> None:
    holder = conn.execute("SELECT id::text AS id FROM governance.holders LIMIT 1").fetchone()
    assert holder is not None
    assert "method" in _rejected(
        conn, "UPDATE governance.holders SET method = 'by-lottery' WHERE id = %s::uuid", holder["id"]
    )
    conn.execute("UPDATE governance.holders SET method = 'acting' WHERE id = %s::uuid", (holder["id"],))


def test_every_enum_value_has_an_interface_label(conn: Connection) -> None:
    import re

    text = (ROOT / "dryv/contracts/schemas/_enums.ts").read_text(encoding="utf-8")
    expected: set[str] = set()
    for name, body in re.findall(r"^\s+(\w+): dryv\.property\.enum\(\{(.*?)\}\)", text, flags=re.M | re.S):
        kebab = re.sub(r"(?<!^)(?=[A-Z])", "-", name).lower()
        expected |= {f"enum.{kebab}.{value}" for value in re.findall(r'\w+: "([^"]+)"', body)}
    assert expected
    found = {
        row["code"]
        for row in conn.execute(
            "SELECT k.code FROM product.keys k JOIN product.messages m ON m.key_id = k.id WHERE k.code LIKE 'enum.%'"
        ).fetchall()
    }
    assert expected <= found, sorted(expected - found)[:5]


def test_a_missing_start_year_still_counts_as_one_value_in_a_unique_key(conn: Connection) -> None:
    county = _area(conn, _level(conn, "ref.lev.ke.electoral.county"))
    conn.execute("UPDATE geography.areas SET from_year = NULL WHERE id = %s::uuid", (county["id"],))
    message = _rejected(
        conn,
        _NEW_AREA,
        "geo.are.test.twice",
        county["hierarchy_id"],
        _level(conn, "ref.lev.ke.electoral.county"),
        county["feature_id"],
        None,
    )
    assert "uq_areas__" in message


# -------------------------------------------------------------------------------------- the provided routine
def test_the_provided_json_routine_runs_patterns_and_reports_each(conn: Connection) -> None:
    output = PostgresTemplates(conn).generate(PATTERNS[:2])
    assert [(item.pattern, item.created) for item in output.results] == [(PATTERNS[0], 0), (PATTERNS[1], 0)]


def test_the_provided_json_routine_raises_its_declared_failures(conn: Connection) -> None:
    from mzizi_engine.persistence.postgres.template import PatternNotFound

    with pytest.raises(PatternNotFound):
        PostgresTemplates(conn).generate(("tpl.pat.ke.nope",))
    conn.rollback()
    assert "validation_error" in _rejected(
        conn, "SELECT template.generate_json('{\"patterns\": []}'::jsonb, '{}'::jsonb)"
    )
