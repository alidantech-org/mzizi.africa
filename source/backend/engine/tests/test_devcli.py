"""The developer CLI: ports, stubs that explain themselves, prompts that fall back to errors, bounded path search."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from typer.testing import CliRunner

from mzizi_engine.capabilities import build_default_registry
from mzizi_engine.devcli.app import app
from mzizi_engine.devcli.catalog import COMMANDS
from mzizi_engine.devcli.pathsearch import SearchBudget, build_index
from mzizi_engine.devcli.ports import PORTS, PortState, all_statuses
from mzizi_engine.devcli.types import ExitCode

runner = CliRunner()


@pytest.fixture(autouse=True)
def workspace(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> Path:
    root = tmp_path / "dev"
    monkeypatch.setenv("MZIZI_DEV_ROOT", str(root))
    (root / "inputs").mkdir(parents=True)
    return root


def invoke(*args: str):
    return runner.invoke(app, ["--no-input", *args])


def test_every_command_points_at_a_declared_port() -> None:
    names = {p.capability for p in PORTS}
    assert all(c.port in names for c in COMMANDS if c.port)
    assert len({c.path for c in COMMANDS}) == len(COMMANDS)


def test_registered_capabilities_are_all_declared_as_ports_or_internal() -> None:
    declared = {p.capability for p in PORTS}
    undeclared = set(build_default_registry().names()) - declared
    assert undeclared <= {"engine.process_info", "source.gate", "filesystem.sync"}


def test_port_state_follows_the_registry() -> None:
    states = {s.port.capability: s.state for s in all_statuses()}
    assert states["extraction.pdf"] is PortState.READY
    assert states["fetch.policy"] is PortState.NOT_YET_ADDED


def test_unbuilt_command_exits_3_and_logs_why(workspace: Path) -> None:
    result = invoke("fetch", "policy", "--manifest", "m.yaml")
    assert result.exit_code == ExitCode.NOT_YET_ADDED
    assert "not been added yet" in result.output
    assert "fetch.policy" in (workspace / "logs" / "mzizi.log").read_text()


def test_missing_value_without_a_terminal_is_a_usage_error() -> None:
    result = invoke("extract", "pdf")
    assert result.exit_code == ExitCode.USAGE
    assert "--input" in result.output


def test_links_command_runs_the_real_capability(workspace: Path) -> None:
    (workspace / "inputs" / "p.html").write_text('<a href="/x">X</a>')
    result = invoke("--json", "scrape", "links", "p.html", "--base-url", "https://a.org/")
    assert result.exit_code == 0
    assert json.loads(result.output)["links"][0]["url"] == "https://a.org/x"


def test_status_json_lists_every_port() -> None:
    result = invoke("--json", "status")
    assert len(json.loads(result.output)) == len(PORTS)


def test_path_search_respects_its_entry_budget(tmp_path: Path) -> None:
    for i in range(200):
        (tmp_path / f"f{i}.pdf").write_text("x")
    index = build_index(
        [tmp_path], want_dirs=False, want_files=True, suffixes=(".pdf",), budget=SearchBudget(max_entries=50)
    )
    assert index.truncated and index.scanned <= 250
    assert build_index([tmp_path], want_dirs=False, want_files=True, suffixes=(".pdf",)).suggest("f19")


def test_long_results_are_previewed_without_parsing_the_truncated_json(workspace: Path) -> None:
    (workspace / "inputs" / "big.json").write_text(json.dumps([{"k": i} for i in range(300)]))
    result = invoke("extract", "json", "big.json")
    assert result.exit_code == 0
    assert "more lines" in result.output
