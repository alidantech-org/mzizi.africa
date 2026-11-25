"""Exercise the engine-only research operations through the authenticated HTTP API."""

import json
import time
from pathlib import Path
from typing import cast

import pytest
from fastapi.testclient import TestClient

from mzizi_engine.config import ServerConfig
from mzizi_engine.jsonvalue import Payload
from mzizi_engine.runtime.http.app import create_app

TOKEN = {"Authorization": "Bearer test-engine-key"}


def _replay(client: TestClient, suite: str) -> Payload:
    response = client.post(
        "/v1/jobs",
        headers=TOKEN,
        json={"kind": "scraping.replay", "input": {"expectations": suite}},
    )
    assert response.status_code == 202, response.text
    job_id = response.json()["id"]
    deadline = time.monotonic() + 5
    while time.monotonic() < deadline:
        saved = client.get(f"/v1/jobs/{job_id}", headers=TOKEN)
        assert saved.status_code == 200, saved.text
        job = cast(Payload, saved.json())
        if job["status"] in ("succeeded", "failed"):
            return job
        time.sleep(0.01)
    pytest.fail("Replay did not finish")


def test_replay_returns_a_report_and_rejects_workspace_escape(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    workspace = tmp_path / "workspace"
    workspace.mkdir()
    monkeypatch.setenv("ENGINE_INPUT_ROOT", str(workspace))
    capture = workspace / "page.html"
    html = "<html><main><h1>Evidence</h1></main></html>"
    capture.write_text(html, encoding="utf-8")
    suite = workspace / "suite.json"
    view: Payload = {"html": "page.html", "url": "https://example.org/", "selectors": [{"selector": "h1", "count": 1}]}

    def write_suite() -> None:
        suite.write_text(json.dumps({"views": [view]}), encoding="utf-8")

    with TestClient(create_app(ServerConfig(auth="service", service_token="test-engine-key"))) as client:
        listing = client.get("/capabilities", headers=TOKEN)
        replay = next(row for row in listing.json()["capabilities"] if row["name"] == "scraping.replay")
        assert replay["input_schema"]["required"] == ["expectations"]
        write_suite()
        job = _replay(client, "suite.json")
        assert job["status"] == "succeeded", job
        assert isinstance(job["result"], dict) and job["result"]["passed"] is True
        view["tables"] = 1
        write_suite()
        job = _replay(client, "suite.json")
        assert job["status"] == "succeeded", job
        assert isinstance(job["result"], dict) and job["result"]["passed"] is False
        (tmp_path / "outside.html").write_text(html, encoding="utf-8")
        (workspace / "symlink.html").symlink_to(tmp_path / "outside.html")
        for reference in ("../outside.html", "symlink.html"):
            view["html"] = reference
            write_suite()
            job = _replay(client, "suite.json")
            assert job["status"] == "failed", job
            assert "inside the engine input workspace" in str(job["error"])
        assert _replay(client, str(suite))["status"] == "failed"
        suite.write_text("{}", encoding="utf-8")
        assert _replay(client, "suite.json")["status"] == "failed"
    assert capture.read_text(encoding="utf-8") == html
    assert not (workspace / "coverage.json").exists()
