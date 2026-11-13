"""The repository layout: active code, builds and tooling never depend on archived or removed paths."""

from __future__ import annotations

import re

import pytest

from mzizi_manifest.paths import REPO_ROOT

ACTIVE_ROOTS = ["source", "scripts", "dryv", "seed", "dryv.yaml", "pyproject.toml", "task.yaml"]
SUFFIXES = {".py", ".ts", ".tsx", ".json", ".yaml", ".yml", ".toml", ".sh", ".mjs", ".cjs"}
SKIP_DIRS = {"node_modules", ".venv", "__pycache__", ".git", "dist", ".next", ".dryv"}
SKIP_FILES = {
    "manifest.lock.json",
    "manifest.yaml",
    "bun.lock",
    "uv.lock",
    "package-lock.json",
}  # the manifest records historical relocated_from paths
FORBIDDEN = [
    re.compile(r"\.docs/_archives"),
    re.compile(r"source/backend/api-legacy"),
    re.compile(r"source/apps/api"),
    re.compile(r"source/backend/api-legacy/"),
    re.compile(r"backend/engine/(data|database)\b"),
    re.compile(r"source/backend/(files|intelligence|contracts)\b"),
    re.compile(r"\bmzizi_data\b"),
    re.compile(r"fixtures/(seed|reference|policy|patterns|research)\b"),
]


def active_files():
    for entry in ACTIVE_ROOTS:
        root = REPO_ROOT / entry
        paths = [root] if root.is_file() else root.rglob("*")
        for path in paths:
            if (
                path.is_file()
                and path.suffix in SUFFIXES
                and path.name not in SKIP_FILES
                and not (SKIP_DIRS & set(path.parts))
            ):
                yield path


def test_no_active_file_references_archived_or_removed_paths():
    hits = []
    for path in active_files():
        if path.name == "test_layout.py":
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for pattern in FORBIDDEN:
            if pattern.search(text):
                hits.append(f"{path.relative_to(REPO_ROOT)}: {pattern.pattern}")
    assert hits == []


def test_the_backend_holds_the_api_and_the_engine_and_the_old_implementations_are_gone():
    assert sorted(p.name for p in (REPO_ROOT / "source" / "backend").iterdir() if p.is_dir()) == ["api", "database", "engine", "pipelines"]
    for gone in (
        "source/apps/api",
        "source/backend/api-legacy",
        "source/backend/files",
        "source/backend/intelligence",
        "source/backend/contracts",
        "source/backend/engine/data",
        "source/backend/engine/database",
    ):
        assert not (REPO_ROOT / gone).exists(), gone
    assert (REPO_ROOT / "source" / "backend" / "api" / "package.json").exists()


def test_the_archive_is_marked_historical_and_excluded_from_test_collection():
    archive = REPO_ROOT / ".docs" / "_archives" / "2026-11-08-rewrite-snapshot"
    if not archive.exists():
        pytest.skip("rewrite-snapshot archive is not present in this checkout")
    readme = (archive / "README.md").read_text()
    assert (
        "Historical. Non-authoritative. Not executable." in readme
        and "3e2f8c5d7a6f12d1c44851951e752a0ccf1db7fb" in readme
    )
    assert (archive / "RELOCATION_INVENTORY.md").exists() and (archive / "source" / "backend" / "api-legacy").is_dir()
    assert ".docs" in (REPO_ROOT / "pyproject.toml").read_text()


def test_packages_do_not_import_the_engine_or_each_others_private_modules():
    packages = REPO_ROOT / "source" / "packages"
    names = {p.name for p in packages.iterdir() if p.is_dir()}
    for path in packages.rglob("src/**/*.py"):
        text = path.read_text()
        assert "mzizi_engine" not in text, path
        own = path.relative_to(packages).parts[0]
        for other in names - {own}:
            assert not re.search(
                rf"from mzizi_{other}\.(?!paths\b)[a-z_]+ import|import mzizi_{other}\.[a-z_]+", text
            ) or (other in ("manifest",) and "mzizi_manifest.paths" in text), (path, other)
