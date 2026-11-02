from pathlib import Path

import pytest

from mzizi_data.structure import bundle as b
from mzizi_data.structure import transforms
from mzizi_data.structure.effective import effective_modules, substitute
from mzizi_data.structure.validate import validate

SAMPLES = Path(__file__).resolve().parents[1] / "samples"


def load(name):
    return b.load(SAMPLES / name)


def test_html_sample_is_valid_and_dry_run_finds_items():
    report = validate(load("html-publications"))
    assert report.ok, report.errors
    assert report.dry_run["budgets"]["items"] == 3
    assert report.dry_run["budgets"]["selector"] == 0  # highest-confidence selector matched
    assert report.dry_run["budgets"]["fieldErrors"] == 0, report.warnings


def test_json_api_sample_is_valid():
    report = validate(load("json-catalogue"))
    assert report.ok, report.errors
    assert report.dry_run["datasets"]["items"] == 2


def test_site_extending_a_family_resolves_modules_and_variables():
    family, site = load("family-county"), load("site-nairobi")
    report = validate(site, family)
    assert report.ok, report.errors
    modules = effective_modules(site, family)
    assert "tenders" in modules
    assert substitute(modules["tenders"]["discover"]["listing"]["url"], {"tenders_path": "/tenders/open"}) == "/tenders/open"
    with pytest.raises(KeyError):
        substitute("${missing}", {})


def mutate(name, path, text):
    bundle = load(name)
    files = dict(bundle.files)
    files[path] = text
    return b.from_files("mutated", files)


def test_unknown_tag_is_rejected():
    original = (SAMPLES / "html-publications/modules/budgets.yml").read_text()
    report = validate(mutate("html-publications", "modules/budgets.yml", original.replace("kind:budget", "kind:unicorn")))
    assert any("unknown tag 'kind:unicorn'" in e for e in report.errors)


def test_unknown_transform_and_unknown_mapping_field_are_rejected():
    mapping = (SAMPLES / "html-publications/mappings/budgets.yml").read_text()
    report = validate(mutate("html-publications", "mappings/budgets.yml", mapping.replace("collapse_whitespace", "shell_exec")))
    assert any("unknown transform 'shell_exec'" in e for e in report.errors)
    report = validate(mutate("html-publications", "mappings/budgets.yml", mapping.replace("publishedOn:", "madeUpField:")))
    assert any("has no field 'madeUpField'" in e for e in report.errors)


def test_secrets_are_rejected_anywhere_in_the_bundle():
    original = (SAMPLES / "html-publications/modules/budgets.yml").read_text()
    for leak in ["password: hunter2", "Authorization: Bearer abc.def.ghi", "cookie: session=abc123"]:
        report = validate(mutate("html-publications", "modules/budgets.yml", original + "\n# " + leak + "\n"))
        assert any("never hold secrets" in e for e in report.errors), leak


def test_authentication_is_not_supported():
    manifest = (SAMPLES / "html-publications/manifest.yml").read_text()
    report = validate(mutate("html-publications", "manifest.yml", manifest.replace("auth: none", "auth: basic")))
    assert not report.ok


def test_unknown_keys_are_rejected_closed_schema():
    manifest = (SAMPLES / "html-publications/manifest.yml").read_text()
    report = validate(mutate("html-publications", "manifest.yml", manifest + "run_script: rm -rf /\n"))
    assert not report.ok


def test_dry_run_fails_when_the_page_no_longer_matches():
    report = validate(mutate("html-publications", "examples/budgets.html", "<html><body><p>moved</p></body></html>"))
    assert any("dry run found 0 items" in e for e in report.errors)


def test_notes_are_required():
    report = validate(mutate("html-publications", "NOTES.md", "short"))
    assert any("NOTES.md" in e for e in report.errors)


def test_url_outside_policy_scope_is_rejected():
    original = (SAMPLES / "html-publications/modules/budgets.yml").read_text()
    report = validate(mutate("html-publications", "modules/budgets.yml", original.replace("/publications/budgets", "/admin/budgets")))
    assert any("outside policy.scope.paths.allow" in e for e in report.errors)


def test_transform_library():
    assert transforms.apply("fiscal_year", "FY2023-24") == "2023/24"
    assert transforms.apply({"fy_start": 7}, "2023/24") == "2023-07-01"
    assert transforms.apply({"decimal": {"thousands": ","}}, "KES 1,234,567.50") == "1234567.50"
    assert transforms.apply({"date": "%d %B %Y"}, "14 June 2023") == "2023-06-14"
    with pytest.raises(ValueError):
        transforms.apply("fiscal_year", "2023/30")
    with pytest.raises(ValueError):
        transforms.apply({"lookup": {"a": 1}}, "b")
