"""The file viewer and the CSV preparation: paths stay in their root, files are viewed by kind, copies never overwrite."""

from pathlib import Path

import pytest

from mzizi_engine.runtime.explore.files import FileRoots, FilesError
from mzizi_engine.runtime.explore.prepare import ColumnPlan, PrepareRequest, prepare, save_text


@pytest.fixture
def roots(tmp_path: Path) -> FileRoots:
    dev = tmp_path / "dev"
    (dev / "runs").mkdir(parents=True)
    (dev / "runs" / "rows.csv").write_text("name,fee\n  Road works  ,1000\n,\nSchool,20\n", encoding="utf-8")
    (dev / "note.md").write_text("# Title\n\ntext", encoding="utf-8")
    (dev / "module.yml").write_text("a: 1\nwhen: 2026-01-02\n", encoding="utf-8")
    return FileRoots({"dev": dev})


def test_listing_a_file_path_lists_its_folder(roots: FileRoots) -> None:
    listing = roots.list("dev", "runs/rows.csv")
    assert listing.path == "runs" and [e.name for e in listing.entries] == ["rows.csv"]


def test_paths_cannot_leave_their_root(roots: FileRoots) -> None:
    with pytest.raises(FilesError) as error:
        roots.view("dev", "../outside")
    assert error.value.status == 400


def test_views_by_kind(roots: FileRoots) -> None:
    csv_view = roots.view("dev", "runs/rows.csv")
    assert csv_view.header == ("name", "fee") and csv_view.total_rows == 3
    assert roots.view("dev", "note.md").kind == "markdown"
    assert roots.view("dev", "module.yml").parsed == {
        "a": 1,
        "when": "2026-01-02",
    }  # dates become text, still valid JSON


def test_prepare_cleans_renames_and_skips_empty_rows(roots: FileRoots) -> None:
    request = PrepareRequest(
        root="dev",
        path="runs/rows.csv",
        columns=[ColumnPlan(source="name", name="tender", clean=["trim", "upper"]), ColumnPlan(source="fee")],
    )
    result = prepare(roots, request)
    assert result.header == ("tender", "fee")
    assert result.rows == (("ROAD WORKS", "1000"), ("SCHOOL", "20"))
    assert result.dropped_rows == 1


def test_prepare_rejects_unknown_columns_and_steps(roots: FileRoots) -> None:
    with pytest.raises(FilesError):
        prepare(roots, PrepareRequest(root="dev", path="runs/rows.csv", columns=[ColumnPlan(source="nope")]))
    with pytest.raises(FilesError):
        prepare(
            roots,
            PrepareRequest(root="dev", path="runs/rows.csv", columns=[ColumnPlan(source="name", clean=["bogus"])]),
        )


def test_saved_copies_never_replace_a_file(roots: FileRoots) -> None:
    request = PrepareRequest(root="dev", path="runs/rows.csv", columns=[ColumnPlan(source="name")], save_as="clean.csv")
    assert prepare(roots, request).saved == "prepared/clean.csv"
    with pytest.raises(FilesError) as error:
        prepare(roots, request)
    assert error.value.status == 409


def test_edits_are_limited_to_the_dev_root_and_known_names(roots: FileRoots) -> None:
    assert save_text(roots, "sources/x/source.yml", "code: x\n", overwrite=False) == "sources/x/source.yml"
    with pytest.raises(FilesError):
        save_text(roots, "sources/x/source.yml", "code: y\n", overwrite=False)
    for bad in ("../escape.yml", "run.sh"):
        with pytest.raises(FilesError):
            save_text(roots, bad, "x", overwrite=True)
