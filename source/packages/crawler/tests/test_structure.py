"""Bundle validation, using the example website bundle under `source/schema/sources/_example/`."""

import pytest

from mzizi_crawler.shared.bundles import bundle as b
from mzizi_crawler.shared.bundles.effective import effective_modules, substitute
from mzizi_crawler.shared.bundles.validate import validate, validate_ranking
from mzizi_crawler.shared.scraping import transforms
from mzizi_manifest.shared.paths import SCHEMA_ROOT

EXAMPLE = SCHEMA_ROOT / "sources" / "_example" / "website-bundle"


def load():
    return b.load(EXAMPLE)


def mutate(path, text):
    files = dict(load().files)
    files[path] = text
    return b.from_files("mutated", files)


def read(path):
    return (EXAMPLE / path).read_text()


def test_example_bundle_is_valid_and_dry_run_finds_items():
    report = validate(load())
    assert report.ok, report.errors
    assert report.dry_run["documents"]["items"] == 3
    assert report.dry_run["documents"]["selector"] == 0  # highest-confidence selector matched
    assert report.dry_run["documents"]["fieldErrors"] == 0, report.warnings


def test_a_site_extending_an_abstract_family_resolves_modules_and_variables():
    family = b.from_files(
        "family",
        {
            "manifest.yml": read("manifest.yml").replace(
                "code: ke.example-ministry", "code: ke.county-family\nabstract: true"
            ),
            "modules/tenders.yml": "module: tenders\ndiscover:\n  listing:\n    url: ${tenders_path}\n    items: { css: li }\nextract:\n  fields:\n    title: { from: link_text }\n",
            "NOTES.md": "x" * 100,
        },
    )
    site = b.from_files(
        "site",
        {
            "manifest.yml": read("manifest.yml").replace(
                "modules: [documents]",
                "modules: []\nextends: ke.county-family\nvars: { tenders_path: /publications/tenders }",
            ),
            "NOTES.md": "x" * 100,
        },
    )
    modules = effective_modules(site, family)
    assert "tenders" in modules
    assert (
        substitute(modules["tenders"]["discover"]["listing"]["url"], {"tenders_path": "/publications/tenders"})
        == "/publications/tenders"
    )
    with pytest.raises(KeyError):
        substitute("${missing}", {})


def test_unknown_transform_and_unknown_mapping_column_are_rejected():
    mapping = read("mappings/documents.yml")
    transformed = mapping.replace("{ from: slug }", "{ from: slug, transform: shell_exec }")
    assert any(
        "unknown transform 'shell_exec'" in e for e in validate(mutate("mappings/documents.yml", transformed)).errors
    )
    renamed = mapping.replace("published_on:", "made_up_column:")
    assert any(
        "has no column 'made_up_column'" in e for e in validate(mutate("mappings/documents.yml", renamed)).errors
    )


def test_a_mapping_may_only_use_stored_tables_inputs_and_yields():
    mapping = read("mappings/documents.yml")
    assert any(
        "is not a stored table" in e
        for e in validate(
            mutate("mappings/documents.yml", mapping.replace("source.documents", "source.nothing"))
        ).errors
    )
    assert any(
        "not in inputs" in e
        for e in validate(
            mutate("mappings/documents.yml", mapping.replace("from: title", "from: unknown_field"))
        ).errors
    )


def test_secrets_are_rejected_anywhere_in_the_bundle():
    original = read("modules/documents.yml")
    for leak in ["password: hunter2", "Authorization: Bearer abc.def.ghi", "cookie: session=abc123"]:
        report = validate(mutate("modules/documents.yml", original + "\n# " + leak + "\n"))
        assert any("never hold secrets" in e for e in report.errors), leak


def test_authentication_is_only_a_named_binding_never_basic():
    report = validate(mutate("manifest.yml", read("manifest.yml").replace("auth: none", "auth: basic")))
    assert not report.ok


def test_unknown_keys_are_rejected_closed_schema():
    assert not validate(mutate("manifest.yml", read("manifest.yml") + "run_script: rm -rf /\n")).ok


def test_dry_run_fails_when_the_page_no_longer_matches():
    report = validate(mutate("examples/documents.html", "<html><body><p>moved</p></body></html>"))
    assert any("dry run found 0 items" in e for e in report.errors)


def test_notes_are_required():
    assert any("NOTES.md" in e for e in validate(mutate("NOTES.md", "short")).errors)


def test_url_outside_policy_scope_is_rejected():
    original = read("modules/documents.yml")
    report = validate(mutate("modules/documents.yml", original.replace("/publications/documents", "/admin/documents")))
    assert any("outside policy.scope.paths.allow" in e for e in report.errors)


def test_a_module_reading_a_field_the_mapping_needs_but_does_not_extract_is_rejected():
    original = read("modules/documents.yml")
    report = validate(mutate("modules/documents.yml", original.replace("    slug:", "    slug_removed:")))
    assert any("reads fields it does not extract" in e for e in report.errors)


def test_transform_library():
    assert transforms.apply("fiscal_year", "FY2023-24") == "2023/24"
    assert transforms.apply({"fy_start": 7}, "2023/24") == "2023-07-01"
    assert transforms.apply({"decimal": {"thousands": ","}}, "KES 1,234,567.50") == "1234567.50"
    assert transforms.apply({"date": "%d %B %Y"}, "14 June 2023") == "2023-06-14"
    with pytest.raises(ValueError):
        transforms.apply("fiscal_year", "2023/30")
    with pytest.raises(ValueError):
        transforms.apply({"lookup": {"a": 1}}, "b")


def test_an_invalid_selector_is_a_validation_error_not_a_crash():
    original = read("modules/documents.yml")
    report = validate(
        mutate("modules/documents.yml", original.replace('css: "article.pub"', 'css: "div:has(> a > b)"'))
    )
    assert any("selector error" in e for e in report.errors)


def test_ranking_rules_validate_and_must_target_stored_tables():
    good = {
        "rules": [
            {"target": "source.documents", "label": "report", "conditions": [{"signal": "section", "contains": ["a"]}]}
        ]
    }
    assert validate_ranking(good) == []
    bad = {"rules": [{"target": "nope.table", "label": "x", "conditions": [{"signal": "section", "contains": ["a"]}]}]}
    assert validate_ranking(bad) == ["ranking.yml: unknown target 'nope.table'"]
