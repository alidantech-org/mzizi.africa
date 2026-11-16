"""The basic CLI against the real default runtime: list, run, fail clearly."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from typer.testing import CliRunner

from mzizi_cli.features.operations.parse import parse_payload
from mzizi_cli.orchestrator.app import app
from mzizi_cli.shared.exit_codes import ExitCode

runner = CliRunner()


def test_capabilities_lists_what_the_runtime_exposes() -> None:
    result = runner.invoke(app, ["capabilities", "--json"])
    assert result.exit_code == 0
    names = {item["name"] for item in json.loads(result.output)}
    assert {"extraction.csv", "scraping.links"} <= names


def test_run_calls_an_operation_with_a_payload_file(tmp_path: Path) -> None:
    file = tmp_path / "payload.json"
    file.write_text(json.dumps({"html": '<a href="/x">X</a>', "base_url": "https://a.org/"}))
    result = runner.invoke(app, ["run", "scraping.links", "--payload", str(file)])
    assert result.exit_code == 0
    assert json.loads(result.output)["links"][0]["url"] == "https://a.org/x"


def test_unknown_operations_and_bad_payloads_are_usage_errors(tmp_path: Path) -> None:
    assert runner.invoke(app, ["run", "nope.nothing"]).exit_code == ExitCode.USAGE
    bad = tmp_path / "bad.json"
    bad.write_text("[1, 2]")
    assert runner.invoke(app, ["run", "scraping.links", "--payload", str(bad)]).exit_code == ExitCode.USAGE


def test_a_failing_operation_exits_with_failure() -> None:
    assert runner.invoke(app, ["run", "scraping.links"]).exit_code == ExitCode.FAILED


def test_health_reports_a_running_runtime() -> None:
    result = runner.invoke(app, ["health"])
    assert result.exit_code == 0 and json.loads(result.output)["state"] == "running"


def test_parse_payload_accepts_only_json_objects() -> None:
    assert parse_payload('{"a": 1}') == {"a": 1}
    for text in ("[1]", "text", ""):
        with pytest.raises(ValueError):
            parse_payload(text)
