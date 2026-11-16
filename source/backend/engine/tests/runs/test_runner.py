"""In-process runs keep operation payloads and record terminal and interrupted states."""

import json
from collections.abc import Generator
from pathlib import Path
from typing import Literal

import pytest
from fake_ledger import FakeLedger

from mzizi_engine.config import EngineConfig
from mzizi_engine.runtime.assembly.specs import register_specs
from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.contracts.config import RuntimeConfig
from mzizi_engine.runtime.operations import OperationRegistry, Requirement, operation
from mzizi_engine.runtime.runs.context import build_worker_context
from mzizi_engine.runtime.runs.contracts.records import RunState
from mzizi_engine.runtime.runs.local_store import LocalRunStore
from mzizi_engine.runtime.runs.parse import parse_job_spec
from mzizi_engine.runtime.runs.runner import run_in_process
from mzizi_engine.runtime.runtime import EngineRuntime


class Request(Frozen):
    mode: Literal["empty", "error", "crash"]


class Output(Frozen):
    files: tuple[str, ...] = ()


class Crash(BaseException):
    """A stand-in for interruption before the handler can report an error."""


def _execute(request: Request) -> Output:
    if request.mode == "crash":
        raise Crash
    if request.mode == "error":
        raise ValueError("page content that must stay out of the event log")
    return Output()


@pytest.fixture
def runtime() -> Generator[EngineRuntime, None, None]:
    registry = OperationRegistry()
    spec = operation("scraping.crawl", "fixture", Request, _execute, requires=frozenset({Requirement.USER_AGENT}))
    register_specs(registry, (spec,), "fixture", "1")
    runtime = EngineRuntime(RuntimeConfig(drain_timeout_seconds=0.1), registry)
    runtime.start()
    yield runtime
    runtime.stop()


@pytest.mark.parametrize("mode", ["empty", "error", "crash"])
def test_run_records_stage_outcome_without_leaking_error_contents(
    mode: Literal["empty", "error", "crash"], runtime: EngineRuntime, tmp_path: Path
) -> None:
    spec = parse_job_spec(
        json.dumps(
            {
                "spec_version": 1,
                "kind": "test",
                "name": "test",
                "stages": [{"operation": "scraping.crawl", "params": {"mode": mode}}],
            }
        ),
        runtime.operations,
    )
    config = EngineConfig.from_env({"MZIZI_USER_AGENT": "test"})
    context = build_worker_context(spec, runtime.operations, config)
    ledger, store = FakeLedger(), LocalRunStore(tmp_path)
    if mode == "empty":
        result = run_in_process(runtime, spec, context, ledger, store)
        assert result.outputs == ({"files": []},)
        assert result.record == ledger.record
        assert ledger.record.state is RunState.COMPLETED and len(ledger.summaries) == 1
    else:
        with pytest.raises(ValueError if mode == "error" else Crash):
            run_in_process(runtime, spec, context, ledger, store)
        assert ledger.record is not None
        assert ledger.record.state is (RunState.FAILED if mode == "error" else RunState.WORKING)
        assert len(ledger.summaries) == (1 if mode == "error" else 0)
    assert ledger.record is not None
    assert len(store.list(ledger.record.run_id, "logs")) == len(ledger.events)
    assert "page content" not in str(ledger.events)
