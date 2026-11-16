"""Every `_example/` document validates against its schema, and the example CSV files match the generated table schemas."""

import csv
import json
import re
from pathlib import Path

import pytest
import yaml
from jsonschema import Draft202012Validator
from referencing import Registry, Resource

SCHEMA_ROOT = Path(__file__).resolve().parents[3] / "schema"
UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")

#: (example file, schema file) pairs, relative to `source/schema/`.
PAIRS = [
    ("sources/_example/website-bundle/manifest.yml", "sources/source.schema.json"),
    ("sources/_example/api-source.yml", "sources/source.schema.json"),
    ("sources/_example/website-bundle/modules/documents.yml", "sources/module.schema.json"),
    ("sources/_example/api-module.yml", "sources/module.schema.json"),
    ("sources/_example/website-bundle/mappings/documents.yml", "mapping/mapping.schema.json"),
    ("mapping/_example/office-holders.yml", "mapping/mapping.schema.json"),
    ("seed/_example/manifest.yaml", "seed/manifest.schema.json"),
    ("seed/_example/_folder.yaml", "seed/folder.schema.json"),
    ("seed/_example/bootstrap.yaml", "seed/bootstrap.schema.json"),
    ("vocabulary/_example/terms.yml", "vocabulary/terms.schema.json"),
    ("extraction/_example/table.json", "extraction/table.schema.json"),
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


def _tables() -> dict[str, dict]:
    found: dict[str, dict] = {}
    for path in (SCHEMA_ROOT / "database").glob("*.schema.json"):
        for table in json.loads(path.read_text(encoding="utf-8"))["tables"]:
            found[table["table"]] = table
    return found


def _rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def test_example_csv_files_match_the_generated_table_schemas() -> None:
    tables = _tables()
    root = SCHEMA_ROOT / "database" / "_example" / "data"
    ids: dict[str, set[str]] = {}
    files = sorted(root.glob("*/*/*.csv"))
    assert files
    for file in files:
        domain, table_name = file.parent.name, file.stem
        table = tables[f"{domain}.{table_name}"]  # the table is named by the path
        columns = {column["name"]: column for column in table["columns"]}
        rows = _rows(file)
        header = set(rows[0])
        assert header <= set(columns), f"{file.name}: unknown columns {header - set(columns)}"
        assert {name for name, column in columns.items() if column["required"]} <= header
        ids[table["table"]] = {row["id"] for row in rows}
        for row in rows:
            for name, value in row.items():
                if columns[name]["type"] == "uuid":
                    assert UUID.match(value), f"{file.name}: {name} is not a UUID"
    by_id = {table["id"]: table["table"] for table in tables.values()}
    for file in files:
        table = tables[f"{file.parent.name}.{file.stem}"]
        for column in table["columns"]:
            target = column.get("references")
            if target and column["name"] in _rows(file)[0]:
                for row in _rows(file):
                    assert row[column["name"]] in ids[by_id[target["tableId"]]], f"{file.name}: {column['name']}"


def test_every_schema_id_is_its_public_url_and_every_file_is_planned_for_publication() -> None:
    from mzizi_manifest.features.publish.schema_publication import id_problems, plan

    assert id_problems(SCHEMA_ROOT) == []
    planned = plan(SCHEMA_ROOT)
    assert {item.key for item in planned} >= {
        "public/schemas/mapping/mapping.schema.json",
        "public/schemas/database/reference.schema.json",
    }
    assert all(
        "_example" not in item.key and item.url.endswith(item.key.removeprefix("public/schemas/")) for item in planned
    )
