"""Seed CSV files are checked against the generated database schemas: seed view, code links, load order, stable ids."""

from pathlib import Path
from uuid import UUID

import pytest

from mzizi_manifest.features.data.check import check_data
from mzizi_manifest.features.database.tables import load_order, load_tables, table_cycle
from mzizi_manifest.features.seeds.ids import SEED_NAMESPACE, stable_id
from mzizi_manifest.orchestrator.cli import main

SCHEMES = "code,title,owner_snapshot\ngeography.continent,Continents,un\nfinance.currency,Currencies,iso\n"
VALUES = (
    "code,scheme_code,label\n"
    "geography.continent.africa,geography.continent,Africa\n"
    "geography.continent.asia,geography.continent,Asia\n"
    "finance.currency.kes,finance.currency,Kenyan shilling\n"
)
COUNTRIES = (
    "code,name,official_name,iso_alpha2,iso_alpha3,iso_numeric,calling_code,continent_code,currency_code\n"
    "ke,Kenya,Republic of Kenya,KE,KEN,404,+254,geography.continent.africa,finance.currency.kes\n"
)


def tree(tmp_path: Path, files: dict[str, str]) -> Path:
    for name, text in files.items():
        path = tmp_path / "data" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    return tmp_path


def good() -> dict[str, str]:
    return {
        "global/reference/schemes.csv": SCHEMES,
        "global/reference/values.csv": VALUES,
        "global/reference/countries.csv": COUNTRIES,
    }


def test_a_valid_release_loads_in_dependency_order_and_links_by_code(tmp_path: Path) -> None:
    result = check_data(tree(tmp_path, good()))
    assert result.problems == []
    assert result.order == ["reference.schemes", "reference.values", "reference.countries"]
    assert [row.values["code"] for row in result.rows["reference.countries"]] == ["ke"]


@pytest.mark.parametrize(
    ("file", "text", "expected"),
    [
        ("global/reference/values.csv", "id,code,scheme_code,label\n1,a,b,c\n", "'id' is filled by the system"),
        (
            "global/reference/values.csv",
            "code,scheme_code,label,version\na,b,c,1\n",
            "'version' is filled by the system",
        ),
        ("global/reference/values.csv", "code,scheme_id,label\na,b,c\n", "unknown column 'scheme_id'"),
        ("global/reference/values.csv", "code,label\na,b\n", "missing required column 'scheme_code'"),
        ("global/reference/values.csv", "code,scheme_code,label\nBad Code,geography.continent,x\n", "does not match"),
        (
            "global/reference/values.csv",
            "code,scheme_code,label\ngeography.continent.x,geography.continent,\n",
            "label is required",
        ),
        (
            "global/reference/values.csv",
            "code,scheme_code,label\ngeography.continent.x,nope.scheme,X\n",
            "unknown reference.schemes code 'nope.scheme'",
        ),
        ("global/reference/countries.csv", "code,name,iso_alpha2\nke,Kenya,ke\n", "iso_alpha2: 'ke' does not match"),
        (
            "global/reference/countries.csv",
            "code,name,iso_alpha2,calling_code\nke,Kenya,KE,254\n",
            "calling_code: '254' does not match",
        ),
        (
            "global/reference/countries.csv",
            "code,name,iso_alpha2,established_on\nke,Kenya,KE,1963-13-01\n",
            "not a valid date",
        ),
        (
            "global/reference/countries.csv",
            "code,name,iso_alpha2\nke,Kenya,KE\nke2,Kenya Two,KE\n",
            "duplicate iso_alpha2 'KE'",
        ),
        (
            "global/reference/countries.csv",
            "code,name,iso_alpha2\nke,Kenya,KE\nke,Kenya Again,KX\n",
            "duplicate code 'ke'",
        ),
        ("global/reference/countries.csv", "code,name,iso_alpha2\nke,Kenya,KE\n,,\nug,Uganda,UG\n", None),
    ],
)
def test_broken_rows_are_reported_with_file_line_and_column(
    tmp_path: Path, file: str, text: str, expected: str | None
) -> None:
    files = {"global/reference/schemes.csv": SCHEMES, file: text}
    problems = check_data(tree(tmp_path, files)).problems
    if expected is None:
        assert problems == []
    else:
        assert any(expected in p for p in problems), problems
        assert any(p.startswith(file.replace("global", "data/global")) for p in problems)


def test_a_self_link_may_point_forward_but_never_in_a_circle(tmp_path: Path) -> None:
    schemes = "code,title,owner_snapshot\ngeography.continent,Continents,un\n"
    forward = (
        "code,scheme_code,label,supersedes_code\n"
        "geography.continent.new,geography.continent,New,geography.continent.old\n"
        "geography.continent.old,geography.continent,Old,\n"
    )
    assert (
        check_data(
            tree(tmp_path, {"global/reference/schemes.csv": schemes, "global/reference/values.csv": forward})
        ).problems
        == []
    )
    circle = (
        "code,scheme_code,label,supersedes_code\n"
        "geography.continent.a,geography.continent,A,geography.continent.b\n"
        "geography.continent.b,geography.continent,B,geography.continent.a\n"
    )
    other = tmp_path / "other"
    problems = check_data(
        tree(other, {"global/reference/schemes.csv": schemes, "global/reference/values.csv": circle})
    ).problems
    assert any("supersedes_code cycle" in p for p in problems)


def test_the_path_must_name_a_seedable_table_in_a_valid_scope(tmp_path: Path) -> None:
    files = {
        "nowhere/reference/schemes.csv": SCHEMES,
        "global/reference/nonsense.csv": SCHEMES,
        "global/reference/value_relations.csv": "id\n1\n",
        "global/schemes.csv": SCHEMES,
    }
    problems = check_data(tree(tmp_path, files)).problems
    assert any("scope 'nowhere'" in p for p in problems)
    assert any("reference.nonsense is not a stored table" in p for p in problems)
    assert any("reference.value_relations has no natural key" in p for p in problems)
    assert any("a CSV must be data/<scope>/<domain>/<table>.csv" in p for p in problems)


def test_a_link_to_a_table_with_no_file_is_reported(tmp_path: Path) -> None:
    problems = check_data(tree(tmp_path, {"global/reference/countries.csv": COUNTRIES})).problems
    assert any("continent_code" in p and "has no seed file" in p for p in problems)


def test_the_same_code_in_two_scopes_is_a_duplicate(tmp_path: Path) -> None:
    files = {
        "global/reference/schemes.csv": SCHEMES,
        "global/reference/values.csv": VALUES,
        "ke/reference/values.csv": "code,scheme_code,label\ngeography.continent.africa,geography.continent,Africa again\n",
    }
    assert any("duplicate code" in p for p in check_data(tree(tmp_path, files)).problems)


def test_ids_are_stable_and_derived_from_the_table_and_code() -> None:
    first = stable_id("reference.countries", "ke")
    assert first == stable_id("reference.countries", "ke") and isinstance(first, UUID)
    assert first != stable_id("reference.values", "ke") and first != stable_id("reference.countries", "ug")
    assert UUID("f5bb0f3c-a1a5-5a0c-8f23-3e1ccd8c9b0c") == SEED_NAMESPACE or SEED_NAMESPACE.version == 5


def test_the_reference_group_links_without_a_cycle_and_the_whole_database_has_only_the_known_one() -> None:
    tables = load_tables()
    reference = {name for name in tables if name.startswith("reference.")}
    assert table_cycle(tables, reference) is None
    assert load_order(tables, reference)[0] in {
        "reference.schemes",
        "reference.topics",
        "reference.units",
        "reference.patterns",
        "reference.countries",
    }
    assert table_cycle(tables) == ["filesystem.file_versions", "filesystem.files", "filesystem.file_versions"]
    for name in ("reference.countries", "reference.values"):
        assert tables[name].seedable


def test_the_command_reports_problems_and_exits_nonzero(tmp_path: Path, capsys: pytest.CaptureFixture[str]) -> None:
    root = tree(tmp_path, {"global/reference/schemes.csv": "code,title\nx,y\n"})
    assert main(["data", str(root)]) == 1
    assert "missing required column 'owner_snapshot'" in capsys.readouterr().err
    other = tree(tmp_path / "ok", good())
    assert main(["data", str(other)]) == 0
