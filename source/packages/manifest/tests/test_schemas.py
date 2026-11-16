"""The authored schemas under `source/schema/` are valid and accept and reject the documents they should."""

import json
from pathlib import Path

import pytest
from jsonschema import Draft202012Validator
from referencing import Registry, Resource

SCHEMA_ROOT = Path(__file__).resolve().parents[3] / "schema"
FOLDERS = ("database", "sources", "mapping", "seed", "vocabulary", "engine", "extraction")
UA = "MziziBot/1.0 (+https://mzizi.africa/bot; contact@mzizi.africa)"
POLICY = {
    "scope": {"hosts": ["example.org"]},
    "rate": {"requests_per_second": 1},
    "identify": {"user_agent": UA},
    "robots": "respect",
    "auth": "none",
}


def _files() -> list[Path]:
    return sorted(path for folder in FOLDERS for path in (SCHEMA_ROOT / folder).glob("*.schema.json"))


def _registry() -> Registry:
    registry: Registry = Registry()
    for path in _files():
        schema = json.loads(path.read_text(encoding="utf-8"))
        if "$id" in schema:  # vocabulary/web.schema.json is generated from a typed model and has no id
            registry = registry.with_resource(schema["$id"], Resource.from_contents(schema))
    return registry


def _errors(schema_path: str, document: object) -> list[str]:
    schema = json.loads((SCHEMA_ROOT / schema_path).read_text(encoding="utf-8"))
    validator = Draft202012Validator(schema, registry=_registry(), format_checker=Draft202012Validator.FORMAT_CHECKER)
    return [error.message for error in validator.iter_errors(document)]


def _website(**extra: object) -> dict:
    return {"code": "ke.iebc", "kind": "website", "modules": ["party-list"], "policy": POLICY, **extra}


def _api(**extra: object) -> dict:
    api = {
        "base_url": "https://api.example.org",
        "endpoints": {"countries": {"path": "/v1/countries", "items": {"jsonpath": "$.data[*]"}}},
    }
    return {"code": "global.example-api", "kind": "api", "api": {**api, **extra}, "policy": POLICY}


@pytest.mark.parametrize("path", _files(), ids=lambda p: f"{p.parent.name}/{p.name}")
def test_every_schema_is_valid_and_has_an_unversioned_id(path: Path) -> None:
    schema = json.loads(path.read_text(encoding="utf-8"))
    Draft202012Validator.check_schema(schema)
    if "$id" in schema:
        assert schema["$id"].endswith(f"/{path.parent.name}/{path.name}")
        assert "/v1/" not in schema["$id"]
    assert ".v1." not in path.name


def test_a_website_and_an_api_source_validate() -> None:
    assert _errors("sources/source.schema.json", _website(uses={"mappings": ["ke.official.party-list"]})) == []
    assert _errors("sources/source.schema.json", _api()) == []


@pytest.mark.parametrize(
    "document",
    [
        _website(unknown_field=True),
        {**_website(), "modules": None},
        {**_api(), "kind": "website"},
        {key: value for key, value in _api().items() if key != "api"},
        _api(base_url="http://api.example.org"),
        _api(base_url="https://user:pw@api.example.org"),
        _api(headers={"Authorization": "Bearer abc"}),
        _api(headers={"x-api-key": "abc"}),
        _api(auth={"binding": "token", "value": "abc"}),
        _api(endpoints={"x": {"method": "POST", "path": "/x", "items": {"jsonpath": "$"}}}),
        _api(endpoints={"x": {"path": "/x", "items": {"jsonpath": "$"}, "paginate": {"type": "cursor"}}}),
    ],
    ids=[
        "unknown",
        "bad-modules",
        "kind-mismatch",
        "missing-api",
        "http",
        "url-credentials",
        "auth-header",
        "key-header",
        "literal-secret",
        "post",
        "cursor-pagination",
    ],
)
def test_invalid_sources_are_rejected(document: object) -> None:
    assert _errors("sources/source.schema.json", document)


def test_a_credential_is_only_ever_named() -> None:
    document = _api(auth={"binding": "world-bank-key", "placement": "header", "parameter": "X-Key"})
    assert _errors("sources/source.schema.json", document) == []


def test_modules_may_name_a_mapping_and_an_endpoint() -> None:
    module = {
        "module": "countries",
        "mapping": "global.reference.countries",
        "discover": {"endpoint": {"name": "countries"}},
        "extract": {"fields": {"name": {"from": {"jsonpath": "$.name"}}}},
    }
    assert _errors("sources/module.schema.json", module) == []
    assert _errors("sources/module.schema.json", {**module, "mapping": "Bad Code"})


def _mapping() -> dict:
    return {
        "code": "ke.official.office-holders",
        "describe": "A person holding a public office for a period.",
        "inputs": ["name", "office_code", "start_date"],
        "yields": [
            {
                "as": "person",
                "table": "official.individuals",
                "key": ["code"],
                "fields": {"full_name": {"from": "name"}},
            },
            {
                "as": "holder",
                "table": "governance.holders",
                "key": ["individual_id", "office_id"],
                "fields": {
                    "individual_id": {"ref": "person.id"},
                    "office_id": {"lookup": {"table": "governance.offices", "by": "code", "from": "office_code"}},
                    "started_on": {"from": "start_date"},
                },
            },
        ],
    }


def test_a_mapping_may_yield_several_tables() -> None:
    assert _errors("mapping/mapping.schema.json", _mapping()) == []


def test_a_mapping_needs_real_looking_tables_keys_and_one_value_source() -> None:
    bad_table = _mapping()
    bad_table["yields"][0]["table"] = "Individuals"
    no_key = _mapping()
    del no_key["yields"][0]["key"]
    two_sources = _mapping()
    two_sources["yields"][0]["fields"]["full_name"] = {"from": "name", "const": "x"}
    for document in (bad_table, no_key, two_sources):
        assert _errors("mapping/mapping.schema.json", document)


def test_the_seed_manifest_registers_files_and_never_names_loaders() -> None:
    manifest = {
        "release": "2026-11-16.1",
        "bucket": "mzizi",
        "region": "us-east-1",
        "logical_root": "/seed",
        "root_code": "seed",
        "entries": [{"id": "data.global.reference", "glob": "data/global/reference/*.csv", "depends_on": []}],
    }
    assert _errors("seed/manifest.schema.json", manifest) == []
    assert _errors("seed/manifest.schema.json", {**manifest, "schema_version": 2})
    loader = {**manifest, "entries": [{"id": "x", "path": "a.csv", "loader": "auth.baseline"}]}
    assert _errors("seed/manifest.schema.json", loader)


def test_folder_descriptors_need_authorization_for_public_and_a_code_for_a_jurisdiction() -> None:
    assert (
        _errors("seed/folder.schema.json", {"scope": {"kind": "jurisdiction", "code": "ke"}, "access": "internal"})
        == []
    )
    assert _errors("seed/folder.schema.json", {"scope": {"kind": "jurisdiction"}})
    assert _errors("seed/folder.schema.json", {"access": "public"})


def test_bootstrap_names_environment_variables_only() -> None:
    document = {
        "role": "admin",
        "scope": "platform",
        "identity": {"issuer_env": "AUTH_BOOTSTRAP_ISSUER", "subject_env": "AUTH_BOOTSTRAP_SUBJECT"},
    }
    assert _errors("seed/bootstrap.schema.json", document) == []
    document["identity"]["subject_env"] = "someone@example.org"
    assert _errors("seed/bootstrap.schema.json", document)


def test_a_term_list_validates() -> None:
    document = {"code": "ke.office-patterns", "terms": [{"value": "governor", "aliases": ["county governor"]}]}
    assert _errors("vocabulary/terms.schema.json", document) == []
    assert _errors("vocabulary/terms.schema.json", {"code": "ke.office-patterns", "terms": []})
