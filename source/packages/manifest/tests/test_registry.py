"""The cross-reference registry resolves codes, scopes and kinds, checks them against the contracts, and reports each problem
with file, field and code."""

from pathlib import Path

import pytest

from mzizi_manifest.features.registry.registry import Kind, can_see, scope_of
from mzizi_manifest.features.registry.scan import scan
from mzizi_manifest.orchestrator.cli import main

SCHEMA_ROOT = Path(__file__).resolve().parents[3] / "schema"
SEED_ROOT = SCHEMA_ROOT.parents[1] / "seed"


def write(root: Path, files: dict[str, str]) -> Path:
    for name, text in files.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    return root


def source(code: str, kind: str = "website", uses: str = "", extends: str = "") -> str:
    return f"code: {code}\nkind: {kind}\n{uses}{extends}policy: {{}}\n"


def mapping(code: str, table: str = "reference.countries") -> str:
    return f"code: {code}\ninputs: [a]\nyields:\n  - {{ as: x, table: {table}, key: [code], fields: {{}} }}\n"


def terms(code: str) -> str:
    return f"code: {code}\nterms: []\n"


# Compliant codes used below.
A = "ke.source.websites.a"
B = "ke.source.websites.b"
M_GLOBAL = "global.reference.countries.base"
M_KE = "ke.reference.countries.local"
V_KE = "ke.reference.patterns.names"


def problems(root: Path, *, mirror: bool = False) -> list[str]:
    return scan(root, mirror_paths=mirror).problems


def test_the_example_tree_resolves_every_code() -> None:
    result = scan(SCHEMA_ROOT, mirror_paths=False)
    assert result.problems == []
    kinds = {code: entry.kind for code, entry in result.registry.entries.items()}
    assert kinds["ke.source.websites.example-ministry"] is Kind.SOURCE
    assert kinds["global.reference.countries.example-statistics"] is Kind.MAPPING
    assert kinds["ke.reference.patterns.office-names"] is Kind.TERMS
    assert kinds["ke.finance.flows.county-allocations"] is Kind.MAPPING
    assert kinds["ke.engine.jobs.example-ministry-publications"] is Kind.JOB
    users = result.registry.users_of("ke.reference.patterns.office-names")
    assert [e.code for e in users] == ["ke.source.websites.example-ministry"]


def test_the_real_seed_tree_has_no_problems() -> None:
    assert scan(SEED_ROOT).problems == []


def test_a_valid_tree_with_a_module_mapping_and_global_sharing(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "sources/ke/source/websites/a/manifest.yml": source(
                A, uses=f"uses: {{ mappings: [{M_GLOBAL}], terms: [{V_KE}] }}\n"
            ),
            "sources/ke/source/websites/a/modules/x.yml": f"module: x\nmapping: {M_KE}\n",
            "mappings/global/reference/countries/base.yml": mapping(M_GLOBAL),
            "mappings/ke/reference/countries/local.yml": mapping(M_KE),
            "terms/ke/reference/patterns/names.yml": terms(V_KE),
        },
    )
    assert problems(root, mirror=True) == []


def test_unknown_codes_name_the_file_the_field_and_the_code(tmp_path: Path) -> None:
    root = write(
        tmp_path, {"sources/ke/a/manifest.yml": source(A, uses="uses: { mappings: [ke.reference.countries.nope] }\n")}
    )
    assert problems(root) == [
        "sources/ke/a/manifest.yml: uses.mappings[0]: unknown mapping code 'ke.reference.countries.nope'"
    ]


def test_duplicate_codes_are_rejected_and_name_both_files(tmp_path: Path) -> None:
    root = write(tmp_path, {"mappings/one.yml": mapping(M_KE), "mappings/two.yml": mapping(M_KE)})
    found = problems(root)
    assert len(found) == 1 and f"duplicate code {M_KE!r}" in found[0] and "mappings/one.yml" in found[0]


def test_a_reference_cycle_is_an_error(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "s/a/manifest.yml": source(A, extends=f"extends: {B}\n"),
            "s/b/manifest.yml": source(B, extends=f"extends: {A}\n"),
        },
    )
    assert f"reference cycle: {A} -> {B} -> {A}" in problems(root)


def test_a_manifest_may_not_use_another_country_and_global_may_not_use_a_country(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "s/a/manifest.yml": source(A, uses="uses: { mappings: [tz.reference.countries.m] }\n"),
            "s/g/manifest.yml": source("global.source.websites.g", uses=f"uses: {{ mappings: [{M_KE}] }}\n"),
            "m/tz.yml": mapping("tz.reference.countries.m"),
            "m/ke.yml": mapping(M_KE),
        },
    )
    found = problems(root)
    assert any(
        "'tz.reference.countries.m' is in scope 'tz', which 'ke.source.websites.a' (scope 'ke') may not use" in p
        for p in found
    )
    assert any(
        f"{M_KE!r} is in scope 'ke', which 'global.source.websites.g' (scope 'global') may not use" in p for p in found
    )


def test_a_code_of_the_wrong_kind_is_an_error(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {"s/a/manifest.yml": source(A, uses=f"uses: {{ terms: [{M_KE}] }}\n"), "m/m.yml": mapping(M_KE)},
    )
    assert any(f"{M_KE!r} is a mapping" in p and "not a terms" in p for p in problems(root))


@pytest.mark.parametrize(
    ("code", "expected"),
    [
        ("kenya.reference.countries.m", "must start with a scope"),
        ("ke.m", "needs at least <scope>.<area>.<name>"),
        ("ke.nowhere.countries.m", "'nowhere' is not a database group or system area"),
        ("ke.reference.nonsense.m", "'nonsense' is not a table of 'reference'"),
        ("ke.reference.countries", "is not a table of 'reference'"),
    ],
)
def test_a_code_must_name_a_real_scope_area_and_table(tmp_path: Path, code: str, expected: str) -> None:
    root = write(tmp_path, {"m/m.yml": mapping(code)})
    assert any(expected in p for p in problems(root)), problems(root)


def test_a_source_job_and_mapping_must_fit_their_kind(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "a.yml": source("ke.governance.holders.a"),
            "b.yml": source("ke.source.apis.b"),
            "d.yml": mapping("ke.governance.holders.d", table="official.individuals"),
            "e.json": '{"code": "ke.reference.patterns.e", "spec_version": 1, "stages": []}',
        },
    )
    found = problems(root)
    assert any("a website source code must be <scope>.source.websites.<name>" in p for p in found)
    assert any(
        "a website source code must be <scope>.source.websites.<name>, not 'ke.source.apis.b'" in p for p in found
    )
    assert any("a job spec code must be <scope>.engine.jobs.<name>" in p for p in found)
    assert any("named after the table it writes first (official.individuals)" in p for p in found)


def test_the_path_must_mirror_the_code(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "mappings/ke/reference/countries/local.yml": mapping(M_KE),
            "mappings/ke/elsewhere/local2.yml": mapping("ke.reference.countries.local2"),
            "sources/ke/source/websites/a/manifest.yml": source(A),
            "terms/ke/reference/patterns/wrong-name.yml": terms(V_KE),
        },
    )
    found = problems(root, mirror=True)
    assert len(found) == 2
    assert any(
        "mappings/ke/elsewhere/local2.yml: the path must mirror the code 'ke.reference.countries.local2'" in p
        for p in found
    )
    assert any("wrong-name.yml: the path must mirror the code" in p for p in found)


def test_engine_data_and_jobs_are_flat_and_only_a_non_global_scope_adds_a_folder(tmp_path: Path) -> None:
    web = "code: global.engine.web.classification\nversion: 1\nurl_kinds: {}\n"
    job = '{"code": "global.engine.jobs.nightly", "spec_version": 1, "stages": []}'
    scoped = "code: sw.engine.web.classification\nversion: 1\nurl_kinds: {}\n"
    root = write(
        tmp_path,
        {
            "engine/web/classification.yaml": web,
            "engine/jobs/nightly.json": job,
            "engine/sw/web/classification.yaml": scoped,
        },
    )
    result = scan(root)
    assert result.problems == []
    assert {e.kind for e in result.registry.entries.values()} == {Kind.ENGINE, Kind.JOB}


def test_engine_data_in_the_wrong_place_or_area_is_rejected(tmp_path: Path) -> None:
    web = "code: global.engine.web.classification\nversion: 1\nurl_kinds: {}\n"
    root = write(
        tmp_path,
        {
            "terms/global/web/classification.yaml": web,
            "engine/ke/jobs/x.json": '{"code": "global.engine.jobs.x", "spec_version": 1, "stages": []}',
            "engine/y.yaml": "code: global.reference.countries.y\nversion: 1\nurl_kinds: {}\n",
        },
    )
    found = problems(root, mirror=True)
    assert any("terms/global/web/classification.yaml: the path must mirror the code" in p for p in found)
    assert any(
        "engine/ke/jobs/x.json: the path must mirror the code 'global.engine.jobs.x': engine/jobs/x.<ext>" in p
        for p in found
    )
    assert any("engine data code must be <scope>.engine.<name>" in p for p in found)


def test_a_module_needs_one_owning_source_and_a_known_mapping(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "s/a/manifest.yml": source(A),
            "s/a/modules/x.yml": "module: x\nmapping: ke.reference.countries.missing\n",
            "orphan/modules/y.yml": f"module: y\nmapping: {M_KE}\n",
        },
    )
    found = problems(root)
    assert any("modules/x.yml: mapping: unknown mapping code 'ke.reference.countries.missing'" in p for p in found)
    assert any("orphan/modules/y.yml" in p and "no source manifest in a folder above it" in p for p in found)


def test_files_that_are_not_manifests_are_ignored_and_unreadable_ones_are_reported(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "manifest.yaml": "release: x\nentries: []\n",
            "_folder.yaml": "access: internal\n",
            "bad.yml": "a: [unclosed\n",
        },
    )
    found = problems(root)
    assert len(found) == 1 and found[0].startswith("bad.yml: unreadable")


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
    write(
        tmp_path, {"sources/ke/a/manifest.yml": source(A, uses="uses: { mappings: [ke.reference.countries.nope] }\n")}
    )
    assert main(["refs", str(tmp_path), "--no-paths"]) == 1
    assert "unknown mapping code 'ke.reference.countries.nope'" in capsys.readouterr().err
    assert main(["refs", str(SCHEMA_ROOT), "--no-paths"]) == 0
