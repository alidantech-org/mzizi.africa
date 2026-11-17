"""The developer CLI: ports, stubs that explain themselves, prompts that fall back to errors, bounded path search."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from typer.testing import CliRunner

from mzizi_cli.features.catalog import COMMANDS
from mzizi_cli.features.ports import PORTS, PortState, all_statuses
from mzizi_cli.orchestrator.app import app
from mzizi_cli.shared.types import ExitCode
from mzizi_engine.runtime.assembly import build_default_runtime

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
    undeclared = set(build_default_runtime().operations.names()) - declared
    assert undeclared <= {
        "engine.process_info",
        "source.gate",
        "filesystem.sync",
        "filesystem.sync_source_files",
        "catalog.seed_tables",  # HTTP only: the seed contract catalog
        "extraction.folder",  # a job stage; the CLI extracts one file at a time
        "patterns.rank",  # a job stage; ranking runs inside a folder extraction
    }


def test_port_state_follows_the_registry() -> None:
    states = {s.port.capability: s.state for s in all_statuses(build_default_runtime().operations.names())}
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


def test_long_results_are_previewed_without_parsing_the_truncated_json(workspace: Path) -> None:
    (workspace / "inputs" / "big.json").write_text(json.dumps([{"k": i} for i in range(300)]))
    result = invoke("extract", "json", "big.json")
    assert result.exit_code == 0
    assert "more lines" in result.output


def test_stream_csv_uses_logical_records_and_does_not_drop_the_header(workspace: Path) -> None:
    (workspace / "inputs" / "records.csv").write_text('id,label\r\n1,"first\nrecord"\r\n2,last\r\n', encoding="utf-8")
    result = invoke("--json", "extract", "stream", "records.csv", "--chunk-size", "2")
    assert result.exit_code == 0, result.output
    report = json.loads(result.output)
    assert report["complete"] and report["records"] == 3 and report["chunks"] == 2
    journal = Path(report["journal"])
    entries = [json.loads(line) for line in journal.read_text().splitlines()]
    assert [(e["first_record"], e["last_record"]) for e in entries] == [(1, 2), (3, 3)]
    first = (journal.parent / entries[0]["chunk"]).read_text().splitlines()
    assert json.loads(first[0])["value"] == ["id", "label"]
    assert json.loads(first[1]) == {"number": 2, "sheet": None, "value": ["1", "first\nrecord"]}


def test_stream_malformed_input_keeps_only_published_chunks(workspace: Path) -> None:
    (workspace / "inputs" / "bad.csv").write_text('1,ok\n2,ok\n3,next\n4,"unclosed\n')
    result = invoke("extract", "stream", "bad.csv", "--chunk-size", "2")
    assert result.exit_code == ExitCode.FAILED
    (journal,) = list((workspace / "runs").rglob("chunks.jsonl"))
    assert len(journal.read_text().splitlines()) == 1
    assert (journal.parent / "records-000001.jsonl").is_file()
    assert not (journal.parent / "records-000002.jsonl").exists()
    assert not (journal.parent / "result.json").exists()


def test_stream_can_publish_gzip_record_chunks(workspace: Path) -> None:
    import gzip

    (workspace / "inputs" / "data.json").write_text('[{"a":1},{"b":2}]')
    result = invoke("--json", "extract", "stream", "data.json", "--gzip", "--chunk-size", "1")
    assert result.exit_code == 0, result.output
    journal = Path(json.loads(result.output)["journal"])
    chunks = [json.loads(line)["chunk"] for line in journal.read_text().splitlines()]
    assert chunks == ["records-000001.jsonl.gz", "records-000002.jsonl.gz"]
    assert json.loads(gzip.decompress((journal.parent / chunks[1]).read_bytes())) == {
        "number": 2,
        "sheet": None,
        "value": {"b": 2},
    }
