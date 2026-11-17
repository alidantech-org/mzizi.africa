"""Seed CSV files are checked against the generated database schemas: seed view, code links, load order, stable ids."""

from pathlib import Path
from uuid import UUID

import pytest

from mzizi_manifest.features.data.check import check_data
from mzizi_manifest.features.database.tables import load_order, load_tables, table_cycle
from mzizi_manifest.features.seeds.ids import SEED_NAMESPACE, stable_id
from mzizi_manifest.orchestrator.cli import main

SCHEMES = "code,title,owner_snapshot\ngeo.continent,Continents,un\nfin.currency,Currencies,iso\nref.language.kind,Language kinds,mzizi\n"
VALUES = (
    "code,scheme_code,label\n"
    "geo.continent.africa,geo.continent,Africa\n"
    "geo.continent.asia,geo.continent,Asia\n"
    "fin.currency.kes,fin.currency,Kenyan shilling\n"
    "ref.language.kind.language,ref.language.kind,Language\n"
)
LANGUAGES = "code,name,kind_code\nsw,Swahili,ref.language.kind.language\nen,English,ref.language.kind.language\n"
COUNTRIES = (
    "code,name,official_name,iso_alpha2,iso_alpha3,iso_numeric,calling_code,continent_code,currency_code\n"
    "ke,Kenya,Republic of Kenya,KE,KEN,404,+254,geo.continent.africa,fin.currency.kes\n"
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
        (
            "global/reference/values.csv",
            "code,scheme_code,label\ngeo.continent.north_america,geo.continent,x\n",
            "use a dash, not an underscore",
        ),
        (
            "global/reference/values.csv",
            "code,scheme_code,label\nGeo.Continent.x,geo.continent,x\n",
            "must be lowercase words joined by dashes",
        ),
        (
            "global/reference/values.csv",
            "code,scheme_code,label\nfin.currency.x,geo.continent,x\n",
            "must start with its parent's code 'geo.continent'",
        ),
        (
            "global/reference/values.csv",
            "code,scheme_code,label\ngeo.continent.a.b,geo.continent,x\n",
            "must add exactly one segment",
        ),
        (
            "global/reference/values.csv",
            "code,scheme_code,label\ngeo.continent.x,geo.continent,\n",
            "label is required",
        ),
        (
            "global/reference/values.csv",
            "code,scheme_code,label\nnope.scheme.x,nope.scheme,X\n",
            "unknown reference.schemes code 'nope.scheme'",
        ),
        (
            "global/reference/schemes.csv",
            "code,title,owner_snapshot\nbad.concept,T,o\n",
            "must start with a schema short",
        ),
        (
            "global/reference/schemes.csv",
            "code,title,owner_snapshot\ngeo.north-america,T,o\n",
            "concept 'north-america' must be a single word",
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
        ("global/reference/countries.csv", "code,name\nnorthern-cyprus,Northern Cyprus\n,,\nso,Somaliland\n", None),
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
    schemes = "code,title,owner_snapshot\ngeo.continent,Continents,un\n"
    forward = (
        "code,scheme_code,label,supersedes_code\n"
        "geo.continent.new,geo.continent,New,geo.continent.old\n"
        "geo.continent.old,geo.continent,Old,\n"
    )
    assert (
        check_data(
            tree(tmp_path, {"global/reference/schemes.csv": schemes, "global/reference/values.csv": forward})
        ).problems
        == []
    )
    circle = (
        "code,scheme_code,label,supersedes_code\n"
        "geo.continent.a,geo.continent,A,geo.continent.b\n"
        "geo.continent.b,geo.continent,B,geo.continent.a\n"
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
        "global/audit/events.csv": "id\n1\n",
        "global/schemes.csv": SCHEMES,
    }
    problems = check_data(tree(tmp_path, files)).problems
    assert any("scope 'nowhere'" in p for p in problems)
    assert any("reference.nonsense is not a stored table" in p for p in problems)
    assert any("audit.events has no natural key" in p for p in problems)
    assert any("a CSV must be data/<scope>/<domain>/<usage folders...>/<table>.csv" in p for p in problems)


def test_a_link_to_a_table_with_no_file_is_reported(tmp_path: Path) -> None:
    problems = check_data(tree(tmp_path, {"global/reference/countries.csv": COUNTRIES})).problems
    assert any("continent_code" in p and "has no seed file" in p for p in problems)


def test_the_same_code_in_two_scopes_is_a_duplicate(tmp_path: Path) -> None:
    files = {
        "global/reference/schemes.csv": SCHEMES,
        "global/reference/values.csv": VALUES,
        "ke/reference/values.csv": "code,scheme_code,label\ngeo.continent.africa,geo.continent,Africa again\n",
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
    # The whole database has cycles through nullable links (files and their current version; official entities, their
    # citations and the sources whose publisher is an entity); the check returns one as a closed path.
    cycle = table_cycle(tables)
    assert cycle is not None and cycle[0] == cycle[-1] and len(cycle) > 2
    geography = {name for name in tables if name.startswith("geography.")}
    assert table_cycle(tables, geography) is None
    for name in ("reference.countries", "reference.values"):
        assert tables[name].seedable


def test_the_command_reports_problems_and_exits_nonzero(tmp_path: Path, capsys: pytest.CaptureFixture[str]) -> None:
    root = tree(tmp_path, {"global/reference/schemes.csv": "code,title\nx,y\n"})
    assert main(["data", str(root)]) == 1
    assert "missing required column 'owner_snapshot'" in capsys.readouterr().err
    other = tree(tmp_path / "ok", good())
    assert main(["data", str(other)]) == 0


def test_a_growing_table_is_split_into_a_folder_of_parts(tmp_path: Path) -> None:
    files = {
        "global/reference/schemes.csv": SCHEMES,
        "global/reference/values/geo.values.csv": VALUES.split("fin.currency.kes")[0],
        "global/reference/values/deeper/fin.values.csv": "code,scheme_code,label\nfin.currency.kes,fin.currency,Kenyan shilling\n",
        "global/reference/countries.csv": COUNTRIES,
    }
    result = check_data(tree(tmp_path, files))
    assert result.problems == []
    assert len(result.rows["reference.values"]) == 3


def test_usage_folders_group_files_and_the_file_name_gives_the_table(tmp_path: Path) -> None:
    files = {
        "global/reference/schemes.csv": SCHEMES,
        "global/reference/values/geo.values.csv": VALUES,
        "global/reference/some/deeper/folder/countries.csv": COUNTRIES,
    }
    assert check_data(tree(tmp_path, files)).problems == []
    wrong = {"global/reference/values/geo.csv": VALUES}
    assert any("reference.geo is not a stored table" in p for p in check_data(tree(tmp_path / "x", wrong)).problems)


def test_a_table_with_no_code_is_keyed_by_its_unique_columns(tmp_path: Path) -> None:
    labels = (
        "value_code,language_code,label_kind,label\n"
        "geo.continent.africa,sw,preferred,Afrika\n"
        "geo.continent.africa,en,alternative,Africa\n"
        "geo.continent.asia,sw,preferred,Asia\n"
    )
    files = {**good(), "global/reference/languages.csv": LANGUAGES, "global/reference/value_labels.csv": labels}
    result = check_data(tree(tmp_path, files))
    assert result.problems == []
    assert load_tables(Path(__file__).resolve().parents[3] / "schema")["reference.value_labels"].natural_key == (
        "value_code",
        "language_code",
        "label_kind",
        "label",
    )
    assert result.order.index("reference.values") < result.order.index("reference.value_labels")


def test_a_repeated_composite_key_and_an_unknown_link_are_reported(tmp_path: Path) -> None:
    labels = (
        "value_code,language_code,label_kind,label\n"
        "geo.continent.africa,sw,preferred,Afrika\n"
        "geo.continent.africa,sw,preferred,Afrika\n"
        "geo.continent.nowhere,sw,preferred,Hakuna\n"
    )
    files = {**good(), "global/reference/languages.csv": LANGUAGES, "global/reference/value_labels.csv": labels}
    problems = check_data(tree(tmp_path, files)).problems
    assert any("duplicate value_code/language_code/label_kind/label" in p for p in problems)
    assert any("unknown reference.values code 'geo.continent.nowhere'" in p for p in problems)


def test_the_domain_folder_may_use_the_schema_short(tmp_path: Path) -> None:
    files = {**good(), "ke/geo/features.csv": "code,feature_type_code\nke,geo.continent.africa\n"}
    result = check_data(tree(tmp_path, files))
    assert "geography.features" in result.rows
    assert not any("ke/geo" in p and "not a stored table" in p for p in result.problems)


def test_every_seedable_table_has_a_code_so_no_seed_row_carries_an_id() -> None:
    tables = load_tables(Path(__file__).resolve().parents[3] / "schema")
    assert [name for name, table in tables.items() if table.seedable and "id" in table.seed.columns] == []
    assert tables["official.contacts"].natural_key == ("code",)
    assert tables["official.contacts"].seed_name("kind_id") == "kind_code"
