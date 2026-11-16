"""The cross-reference registry resolves codes, scopes and kinds, and reports each problem with file, field and code."""

from pathlib import Path

import pytest

from mzizi_manifest.features.registry.registry import Kind, can_see, scope_of
from mzizi_manifest.features.registry.scan import scan
from mzizi_manifest.orchestrator.cli import main

SCHEMA_ROOT = Path(__file__).resolve().parents[3] / "schema"


def write(root: Path, files: dict[str, str]) -> Path:
    for name, text in files.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    return root


def source(code: str, kind: str = "website", uses: str = "", extends: str = "") -> str:
    return f"code: {code}\nkind: {kind}\n{uses}{extends}policy: {{}}\n"


MAPPING = "code: {code}\ninputs: [a]\nyields: []\n"
VOCABULARY = "code: {code}\nterms: []\n"


def test_the_example_tree_resolves_every_code() -> None:
    result = scan(SCHEMA_ROOT)
    assert result.problems == []
    kinds = {code: entry.kind for code, entry in result.registry.entries.items()}
    assert kinds["ke.example-ministry"] is Kind.SOURCE
    assert kinds["global.reference.countries"] is Kind.MAPPING
    assert kinds["ke.office-patterns"] is Kind.VOCABULARY
    assert kinds["ke.county-allocations"] is Kind.EXTRACTION
    assert [e.code for e in result.registry.users_of("ke.office-patterns")] == ["ke.example-ministry"]


def test_a_valid_tree_with_a_module_mapping_and_global_sharing(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "sources/ke/a/manifest.yml": source("ke.a", uses="uses: { mappings: [global.m], vocabularies: [ke.v] }\n"),
            "sources/ke/a/modules/x.yml": "module: x\nmapping: ke.m2\n",
            "mappings/global/m.yml": MAPPING.format(code="global.m"),
            "mappings/ke/m2.yml": MAPPING.format(code="ke.m2"),
            "vocabularies/ke/v.yml": VOCABULARY.format(code="ke.v"),
        },
    )
    assert scan(root).problems == []


def test_unknown_codes_name_the_file_the_field_and_the_code(tmp_path: Path) -> None:
    root = write(tmp_path, {"sources/ke/a/manifest.yml": source("ke.a", uses="uses: { mappings: [ke.nope] }\n")})
    assert scan(root).problems == ["sources/ke/a/manifest.yml: uses.mappings[0]: unknown mapping code 'ke.nope'"]


def test_duplicate_codes_are_rejected_and_name_both_files(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {"mappings/ke/one.yml": MAPPING.format(code="ke.m"), "mappings/ke/two.yml": MAPPING.format(code="ke.m")},
    )
    problems = scan(root).problems
    assert len(problems) == 1 and "duplicate code 'ke.m'" in problems[0] and "mappings/ke/one.yml" in problems[0]


def test_a_reference_cycle_is_an_error(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "sources/ke/a/manifest.yml": source("ke.a", extends="extends: ke.b\n"),
            "sources/ke/b/manifest.yml": source("ke.b", extends="extends: ke.a\n"),
        },
    )
    assert any(p == "reference cycle: ke.a -> ke.b -> ke.a" for p in scan(root).problems)


def test_a_manifest_may_not_use_another_country_and_global_may_not_use_a_country(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "sources/ke/a/manifest.yml": source("ke.a", uses="uses: { mappings: [tz.m] }\n"),
            "sources/global/b/manifest.yml": source("global.b", uses="uses: { mappings: [ke.m] }\n"),
            "mappings/tz/m.yml": MAPPING.format(code="tz.m"),
            "mappings/ke/m.yml": MAPPING.format(code="ke.m"),
        },
    )
    problems = scan(root).problems
    assert any("'tz.m' is in scope 'tz', which 'ke.a' (scope 'ke') may not use" in p for p in problems)
    assert any("'ke.m' is in scope 'ke', which 'global.b' (scope 'global') may not use" in p for p in problems)


def test_a_code_of_the_wrong_kind_is_an_error(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "sources/ke/a/manifest.yml": source("ke.a", uses="uses: { vocabularies: [ke.m] }\n"),
            "mappings/ke/m.yml": MAPPING.format(code="ke.m"),
        },
    )
    assert any("'ke.m' is a mapping" in p and "not a vocabulary" in p for p in scan(root).problems)


def test_a_code_must_start_with_a_scope(tmp_path: Path) -> None:
    root = write(tmp_path, {"mappings/x/m.yml": MAPPING.format(code="kenya.m")})
    assert any("must start with a scope" in p for p in scan(root).problems)


def test_a_module_needs_one_owning_source_and_a_known_mapping(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "sources/ke/a/manifest.yml": source("ke.a"),
            "sources/ke/a/modules/x.yml": "module: x\nmapping: ke.missing\n",
            "orphan/modules/y.yml": "module: y\nmapping: ke.m\n",
        },
    )
    problems = scan(root).problems
    assert any("modules/x.yml: mapping: unknown mapping code 'ke.missing'" in p for p in problems)
    assert any("orphan/modules/y.yml" in p and "no source manifest in a folder above it" in p for p in problems)


def test_files_that_are_not_manifests_are_ignored_and_unreadable_ones_are_reported(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "manifest.yaml": "release: x\nentries: []\n",
            "_folder.yaml": "access: internal\n",
            "bad.yml": "a: [unclosed\n",
        },
    )
    problems = scan(root).problems
    assert len(problems) == 1 and problems[0].startswith("bad.yml: unreadable")


@pytest.mark.parametrize(
    ("user", "target", "visible"),
    [
        ("ke", "ke", True),
        ("ke", "global", True),
        ("ke", "tz", False),
        ("global", "global", True),
        ("global", "ke", False),
    ],
)
def test_scope_visibility(user: str, target: str, visible: bool) -> None:
    assert can_see(user, target) is visible
    assert scope_of("ke.official.x") == "ke"


def test_the_command_exits_nonzero_on_a_problem(tmp_path: Path, capsys: pytest.CaptureFixture[str]) -> None:
    write(tmp_path, {"sources/ke/a/manifest.yml": source("ke.a", uses="uses: { mappings: [ke.nope] }\n")})
    assert main(["refs", str(tmp_path)]) == 1
    assert "unknown mapping code 'ke.nope'" in capsys.readouterr().err
    assert main(["refs", str(SCHEMA_ROOT)]) == 0
