"""The cross-reference registry resolves codes, scopes and kinds, checks codes against the glossary, and reports each problem
with file, field and code."""

from pathlib import Path

import pytest

from mzizi_manifest.features.registry.registry import Kind, can_see
from mzizi_manifest.features.registry.scan import scan
from mzizi_manifest.orchestrator.cli import main

SCHEMA_ROOT = Path(__file__).resolve().parents[3] / "schema"

A = "pg.src.srs.ke.a"
B = "pg.src.srs.ke.b"
M_GLOBAL = "sys.map.ref.cty.global.base"
M_KE = "sys.map.ref.cty.ke.local"
V_KE = "sys.trm.ke.names"


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


def problems(root: Path, *, mirror: bool = False) -> list[str]:
    return scan(root, mirror_paths=mirror).problems


def test_the_example_tree_resolves_every_code() -> None:
    result = scan(SCHEMA_ROOT, mirror_paths=False)
    assert result.problems == []
    kinds = {code: entry.kind for code, entry in result.registry.entries.items()}
    assert kinds["pg.src.srs.ke.example-ministry"] is Kind.SOURCE
    assert kinds["sys.map.ref.cty.global.example-statistics"] is Kind.MAPPING
    assert kinds["sys.trm.ke.office-names"] is Kind.TERMS
    assert kinds["sys.map.fin.flw.ke.county-allocations"] is Kind.MAPPING
    assert kinds["sys.eng.job.ke.example-ministry-publications"] is Kind.JOB
    users = result.registry.users_of("sys.trm.ke.office-names")
    assert [e.code for e in users] == ["pg.src.srs.ke.example-ministry"]


def test_a_valid_tree_with_a_module_mapping_and_global_sharing(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "sources/srs/ke/a/manifest.yml": source(A, uses=f"uses: {{ mappings: [{M_GLOBAL}], terms: [{V_KE}] }}\n"),
            "sources/srs/ke/a/modules/x.yml": f"module: x\nmapping: {M_KE}\n",
            "mappings/ref/cty/global/base.yml": mapping(M_GLOBAL),
            "mappings/ref/cty/ke/local.yml": mapping(M_KE),
            "terms/ke/names.yml": terms(V_KE),
        },
    )
    assert problems(root, mirror=True) == []


def test_unknown_codes_name_the_file_the_field_and_the_code(tmp_path: Path) -> None:
    missing = "sys.map.ref.cty.ke.nope"
    root = write(tmp_path, {"sources/a/manifest.yml": source(A, uses=f"uses: {{ mappings: [{missing}] }}\n")})
    assert problems(root) == [f"sources/a/manifest.yml: uses.mappings[0]: unknown mapping code {missing!r}"]


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
    tz = "sys.map.ref.cty.tz.m"
    root = write(
        tmp_path,
        {
            "s/a/manifest.yml": source(A, uses=f"uses: {{ mappings: [{tz}] }}\n"),
            "s/g/manifest.yml": source("pg.src.srs.global.g", uses=f"uses: {{ mappings: [{M_KE}] }}\n"),
            "m/tz.yml": mapping(tz),
            "m/ke.yml": mapping(M_KE),
        },
    )
    found = problems(root)
    assert any(f"{tz!r} is in scope 'tz', which {A!r} (scope 'ke') may not use" in p for p in found)
    assert any(
        f"{M_KE!r} is in scope 'ke', which 'pg.src.srs.global.g' (scope 'global') may not use" in p for p in found
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
        ("sys.map.ref_cty.ke.m", "use a dash, not an underscore"),
        ("sys.map.ref.cty.ke.North-America", "must be lowercase words joined by dashes"),
        ("sys.map.ref.cty", "must look like sys.map.<schema short>.<table short>.<scope>.<name>"),
        ("sys.map.ref.nope.ke.m", "ref.nope is not a schema and table short"),
        ("sys.map.ref.cty.kenya.m", "'kenya' must be 'global' or a country code"),
        ("pg.map.ref.cty.ke.m", "must look like sys.map"),
    ],
)
def test_a_mapping_code_must_say_what_it_is(tmp_path: Path, code: str, expected: str) -> None:
    root = write(tmp_path, {"m/m.yml": mapping(code)})
    assert any(expected in p for p in problems(root)), problems(root)


def test_a_source_job_and_mapping_must_fit_their_kind(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "a.yml": source("pg.src.cap.ke.a", kind="website"),
            "b.yml": source("pg.src.doc.ke.b", kind="api"),
            "d.yml": mapping("sys.map.ofc.ind.ke.d"),
            "e.json": '{"code": "sys.eng.run.ke.e", "spec_version": 1, "stages": []}',
            "f.yml": terms("sys.trm.ke.f"),
        },
    )
    found = problems(root)
    assert any("a website source code must use the short of source.sources, not 'cap'" in p for p in found)
    assert any("an api source code must use the short of source.sources, not 'doc'" in p for p in found)
    assert any("a mapping is named after the table it writes first (reference.countries)" in p for p in found)
    assert any("a job spec code must be sys.eng.job.<scope>.<name>" in p for p in found)
    assert not any("f.yml" in p for p in found)


def test_the_path_must_mirror_the_code(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "mappings/ref/cty/ke/local.yml": mapping(M_KE),
            "mappings/elsewhere/local2.yml": mapping("sys.map.ref.cty.ke.local2"),
            "sources/srs/ke/a/manifest.yml": source(A),
            "terms/ke/wrong-name.yml": terms(V_KE),
        },
    )
    found = problems(root, mirror=True)
    assert len(found) == 2
    assert any(
        "mappings/elsewhere/local2.yml: the path must mirror the code 'sys.map.ref.cty.ke.local2'" in p for p in found
    )
    assert any("wrong-name.yml: the path must mirror the code" in p for p in found)


def test_engine_data_and_jobs_live_in_a_flat_engine_folder(tmp_path: Path) -> None:
    web = "code: sys.eng.web.classification\nversion: 1\nurl_kinds: {}\n"
    job = '{"code": "sys.eng.job.ke.nightly", "spec_version": 1, "stages": []}'
    root = write(tmp_path, {"engine/web/classification.yaml": web, "engine/job/ke/nightly.json": job})
    result = scan(root)
    assert result.problems == []
    assert {e.kind for e in result.registry.entries.values()} == {Kind.ENGINE, Kind.JOB}
    wrong = write(tmp_path / "wrong", {"terms/global/web/classification.yaml": web, "engine/ke/nightly.json": job})
    found = problems(wrong, mirror=True)
    assert any("terms/global/web/classification.yaml: the path must mirror the code" in p for p in found)
    assert any(
        "engine/ke/nightly.json: the path must mirror the code 'sys.eng.job.ke.nightly': engine/job/ke/nightly.<ext>"
        in p
        for p in found
    )


def test_a_module_needs_one_owning_source_and_a_known_mapping(tmp_path: Path) -> None:
    root = write(
        tmp_path,
        {
            "s/a/manifest.yml": source(A),
            "s/a/modules/x.yml": "module: x\nmapping: sys.map.ref.cty.ke.missing\n",
            "orphan/modules/y.yml": f"module: y\nmapping: {M_KE}\n",
        },
    )
    found = problems(root)
    assert any("modules/x.yml: mapping: unknown mapping code 'sys.map.ref.cty.ke.missing'" in p for p in found)
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


def test_the_command_exits_nonzero_on_a_problem(tmp_path: Path, capsys: pytest.CaptureFixture[str]) -> None:
    missing = "sys.map.ref.cty.ke.nope"
    write(tmp_path, {"sources/a/manifest.yml": source(A, uses=f"uses: {{ mappings: [{missing}] }}\n")})
    assert main(["refs", str(tmp_path), "--no-paths"]) == 1
    assert f"unknown mapping code {missing!r}" in capsys.readouterr().err
    assert main(["refs", str(SCHEMA_ROOT), "--no-paths"]) == 0
