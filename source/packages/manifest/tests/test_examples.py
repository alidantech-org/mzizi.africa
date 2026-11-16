"""Every `_example/` document validates against its schema, and the example CSV files match the generated table schemas."""

import csv
import json
import re
from pathlib import Path

import pytest
import yaml
from jsonschema import Draft202012Validator
from referencing import Registry, Resource

from mzizi_manifest.features.database.tables import load_tables

SCHEMA_ROOT = Path(__file__).resolve().parents[3] / "schema"
UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")

#: (example file, schema file) pairs, relative to `source/schema/`.
PAIRS = [
    ("sources/_example/website-bundle/manifest.yml", "sources/source.schema.json"),
    ("sources/_example/api-source.yml", "sources/source.schema.json"),
    ("sources/_example/website-bundle/modules/documents.yml", "sources/module.schema.json"),
    ("sources/_example/api-module.yml", "sources/module.schema.json"),
    ("sources/_example/website-bundle/mappings/example-ministry-publications.yml", "engine/mapping.schema.json"),
    ("engine/_example/mapping-office-holders.yml", "engine/mapping.schema.json"),
    ("engine/_example/mapping-countries.yml", "engine/mapping.schema.json"),
    ("engine/_example/mapping-county-allocations.yml", "engine/mapping.schema.json"),
    ("seed/_example/manifest.yaml", "seed/manifest.schema.json"),
    ("seed/_example/_folder.yaml", "seed/folder.schema.json"),
    ("seed/_example/bootstrap.yaml", "seed/bootstrap.schema.json"),
    ("engine/_example/terms.yml", "engine/terms.schema.json"),
    ("engine/_example/job.json", "engine/job.schema.json"),
]


def _registry() -> Registry:
    registry: Registry = Registry()
    for path in SCHEMA_ROOT.glob("*/*.schema.json"):
        schema = json.loads(path.read_text(encoding="utf-8"))
        if "$id" in schema:
            registry = registry.with_resource(schema["$id"], Resource.from_contents(schema))
    return registry


def _load(path: Path) -> object:
    text = path.read_text(encoding="utf-8")
    return json.loads(text) if path.suffix == ".json" else yaml.safe_load(text)


@pytest.mark.parametrize(("example", "schema"), PAIRS, ids=[pair[0] for pair in PAIRS])
def test_example_validates(example: str, schema: str) -> None:
    validator = Draft202012Validator(
        json.loads((SCHEMA_ROOT / schema).read_text(encoding="utf-8")),
        registry=_registry(),
        format_checker=Draft202012Validator.FORMAT_CHECKER,
    )
    errors = [error.message for error in validator.iter_errors(_load(SCHEMA_ROOT / example))]
    assert errors == []


@pytest.mark.parametrize(("example", "schema"), PAIRS, ids=[pair[0] for pair in PAIRS])
def test_example_links_to_the_schema_it_defines(example: str, schema: str) -> None:
    """Editors validate a file from this public link: a `$schema` key in JSON, a yaml-language-server comment in YAML."""
    path = SCHEMA_ROOT / example
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".json":
        link = json.loads(text)["$schema"]
    else:
        found = re.search(r"^# yaml-language-server: \$schema=(\S+)$", text, re.MULTILINE)
        assert found, "missing yaml-language-server schema comment"
        link = found.group(1)
    assert link == f"https://res.alidantech.org/mzizi/public/schemas/{schema}"
    assert json.loads((SCHEMA_ROOT / schema).read_text(encoding="utf-8"))["$id"] == link


def test_every_schema_folder_has_an_example_folder() -> None:
    folders = {path.parent.name for path in SCHEMA_ROOT.glob("*/*.schema.json")}
    assert folders and all((SCHEMA_ROOT / folder / "_example").is_dir() for folder in folders)


def _rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def test_example_csv_files_match_the_generated_table_schemas() -> None:
    tables = load_tables(SCHEMA_ROOT)
    root = SCHEMA_ROOT / "database" / "_example" / "data"
    ids: dict[str, set[str]] = {}
    files = sorted(root.glob("*/*/*.csv"))
    assert files
    for file in files:
        table = tables[f"{file.parent.name}.{file.stem}"]  # the table is named by the path
        rows = _rows(file)
        header = set(rows[0])
        assert header <= set(table.columns), f"{file.name}: unknown columns {header - set(table.columns)}"
        supplied = {column.name for column in table.columns.values() if column.required}
        assert supplied <= header, f"{file.name}: missing {supplied - header}"
        ids[table.qualified_name] = {row["id"] for row in rows}
        for row in rows:
            for name, value in row.items():
                if table.columns[name].kind == "uuid":
                    assert UUID.match(value), f"{file.name}: {name} is not a UUID"
    by_id = {table.id: table.qualified_name for table in tables.values()}
    for file in files:
        table = tables[f"{file.parent.name}.{file.stem}"]
        for column in table.columns.values():
            if column.references and column.name in _rows(file)[0]:
                for row in _rows(file):
                    assert row[column.name] in ids[by_id[column.references[0]]], f"{file.name}: {column.name}"


def test_system_managed_columns_are_marked_and_not_required() -> None:
    values = load_tables(SCHEMA_ROOT)["reference.values"]
    for name in ("created_at", "updated_at", "version", "deleted_at"):
        assert values.columns[name].managed and not values.columns[name].required
    assert values.columns["id"].required and not values.columns["id"].managed
    assert values.columns["scheme_id"].references == ("#/schemas/reference.Scheme", "id")
    assert ("code",) in values.unique_keys
