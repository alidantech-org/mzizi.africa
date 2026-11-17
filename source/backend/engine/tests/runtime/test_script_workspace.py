"""Exercise explicitly enabled script jobs through HTTP and a real local Docker runner."""

import os
import time
from datetime import UTC, datetime
from hashlib import sha256
from io import BytesIO
from pathlib import Path
from subprocess import run as command
from typing import cast
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from mzizi_engine.api.schemas.api.scripts.models.script_job import ScriptJob as WireScriptJob
from mzizi_engine.config import ServerConfig
from mzizi_engine.jsonvalue import Payload
from mzizi_engine.runtime.assembly.default_operations import build_operation_registry
from mzizi_engine.runtime.http.app import create_app
from mzizi_engine.runtime.runs.artifacts import ArtifactReader, ArtifactRef
from mzizi_engine.runtime.runs.contracts.records import ArtifactProvenance, RunRecord, RunState
from mzizi_engine.runtime.runs.encode import spec_hash
from mzizi_engine.runtime.runs.local_store import LocalRunStore
from mzizi_engine.runtime.runs.parse import parse_job_spec

TOKEN = {"Authorization": "Bearer script-test-token"}
ROUTE = "/v1/research/scripts"


def _terminal(client: TestClient, job_id: str) -> Payload:
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        response = client.get(f"{ROUTE}/{job_id}", headers=TOKEN)
        assert response.status_code == 200, response.text
        job = cast(Payload, response.json())
        if job["status"] != "running":
            return job
        time.sleep(0.05)
    pytest.fail("Script did not finish")


def test_scripts_require_explicit_configuration(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("MZIZI_ENV_FILE", "/dev/null")
    monkeypatch.delenv("ENGINE_SCRIPT_IMAGE_ID", raising=False)
    with TestClient(create_app(ServerConfig(auth="service", service_token="script-test-token"))) as client:
        body = {"language": "bash", "script": "printf ok"}
        assert client.post(ROUTE, json=body).status_code == 401
        assert client.post(ROUTE, headers=TOKEN, json=body).status_code == 503


def test_verified_csv_script_isolation_cancellation_and_restart(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    image = os.getenv("MZIZI_TEST_SCRIPT_IMAGE_ID")
    if not image:
        pytest.skip("Set MZIZI_TEST_SCRIPT_IMAGE_ID to a local Docker image ID with Python 3 and Bash")
    monkeypatch.setenv("MZIZI_ENV_FILE", "/dev/null")
    monkeypatch.setenv("ENGINE_SCRIPT_IMAGE_ID", image)
    monkeypatch.setenv("ENGINE_RUN_LOCAL_ROOT", str(tmp_path))
    monkeypatch.setenv("MZIZI_HOST_ONLY_TEST", "not available inside the workspace")

    registry = build_operation_registry()
    spec = parse_job_spec(
        '{"spec_version":1,"kind":"collection","name":"script-fixture","stages":[{"operation":"scraping.crawl",'
        '"params":{"url":"https://example.org/","out_dir":"unused"}}]}',
        registry,
    )
    run_id = uuid4()
    run = RunRecord(
        run_id=run_id, spec=spec, spec_hash=spec_hash(spec), requested_at=datetime.now(UTC), state=RunState.COMPLETED
    )
    store = LocalRunStore(tmp_path)
    record = store.put(
        run_id,
        "artifacts/table.csv",
        BytesIO(b"name,amount\nOne,7\n"),
        ArtifactProvenance(media_type="text/csv", stage="fixture"),
    )
    reader = ArtifactReader(lambda supplied: run if supplied == run_id else None, lambda _: store)
    artifact = ArtifactRef(run_id=run_id, path=record.path, sha256=record.sha256)
    python = """import os, socket
from pathlib import Path
from subprocess import run as command
assert os.getuid() == 65534
assert 'MZIZI_HOST_ONLY_TEST' not in os.environ
assert {name for _, name in socket.if_nameindex()} == {'lo'}
assert not Path('/var/run/docker.sock').exists()
source = Path('/workspace/input-0')
try:
    source.write_text('modified')
except OSError:
    pass
else:
    raise AssertionError('source was writable')
Path('/tmp/scratch').write_text('draft')
print(source.read_text().upper(), end='')
"""
    settings = ServerConfig(auth="service", service_token="script-test-token")
    with TestClient(create_app(settings, registry=registry, research_reader=reader)) as client:
        started = client.post(
            ROUTE,
            headers=TOKEN,
            json={"language": "python", "script": python, "inputs": [artifact.model_dump(mode="json", by_alias=True)]},
        )
        assert started.status_code == 202, started.text
        job_id = started.json()["id"]
        result = _terminal(client, job_id)
        assert WireScriptJob.model_validate(result).id.hex == job_id.replace("-", "")
        assert result["status"] == "succeeded", result
        assert result["stdout"] == "NAME,AMOUNT\nONE,7\n"
        assert result["stdoutSha256"] == sha256(b"NAME,AMOUNT\nONE,7\n").hexdigest()
        slow = client.post(
            ROUTE, headers=TOKEN, json={"language": "bash", "script": "printf ready; sleep 30", "timeoutSeconds": 30}
        )
        assert slow.status_code == 202, slow.text
        slow_id = slow.json()["id"]
        container = f"mzizi-script-{slow_id.replace('-', '')}"
        started_by = time.monotonic() + 10
        while time.monotonic() < started_by:
            probe = command(
                [
                    "docker",
                    "--host",
                    "unix:///var/run/docker.sock",
                    "inspect",
                    "--format",
                    "{{.State.Running}}",
                    container,
                ],
                capture_output=True,
                check=False,
                timeout=2,
            )
            if probe.stdout.strip() == b"true":
                break
            time.sleep(0.05)
        else:
            pytest.fail("Bash test container did not start")
        assert client.post(ROUTE, headers=TOKEN, json={"language": "bash", "script": "true"}).status_code == 409
        assert client.post(f"{ROUTE}/{slow_id}/cancel", headers=TOKEN).status_code == 200
        assert _terminal(client, slow_id)["status"] == "cancelled"
        timed = client.post(ROUTE, headers=TOKEN, json={"language": "bash", "script": "sleep 30", "timeoutSeconds": 1})
        assert timed.status_code == 202, timed.text
        assert _terminal(client, timed.json()["id"])["status"] == "timed_out"
        noisy = client.post(ROUTE, headers=TOKEN, json={"language": "python", "script": "print('A' * 300000)"})
        assert noisy.status_code == 202, noisy.text
        limited = _terminal(client, noisy.json()["id"])
        assert limited["status"] == "output_limit"
        assert isinstance(limited["stdout"], str) and len(limited["stdout"]) == 256 * 1024

    with store.open(run_id, record.path) as stream:
        assert stream.read() == b"name,amount\nOne,7\n"
    with TestClient(create_app(settings, registry=registry, research_reader=reader)) as client:
        assert client.get(f"{ROUTE}/{job_id}", headers=TOKEN).json() == result
    assert (tmp_path / ".scripts" / f"{job_id}.stdout").read_bytes() == b"NAME,AMOUNT\nONE,7\n"
