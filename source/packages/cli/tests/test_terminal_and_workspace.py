"""Path search budgets, run folders and the gateway port, with no engine."""

from __future__ import annotations

import threading
from pathlib import Path

from mzizi_cli.features.terminal.pathsearch import SearchBudget, build_index
from mzizi_cli.features.workspace.workspace import Workspace
from mzizi_cli.shared.gateway import CapabilityInfo, EngineGateway
from mzizi_cli.shared.jsonvalue import Payload, as_int


def test_path_search_respects_its_entry_budget(tmp_path: Path) -> None:
    for i in range(200):
        (tmp_path / f"f{i}.pdf").write_text("x")
    index = build_index(
        [tmp_path], want_dirs=False, want_files=True, suffixes=(".pdf",), budget=SearchBudget(max_entries=50)
    )
    assert index.truncated and index.scanned <= 250
    assert build_index([tmp_path], want_dirs=False, want_files=True, suffixes=(".pdf",)).suggest("f19")


def test_runs_started_at_the_same_moment_get_different_folders(tmp_path: Path) -> None:
    workspace = Workspace(tmp_path)
    folders: list[str] = []

    def start() -> None:
        folders.append(workspace.start_run("site watch", None, {}).folder.name)

    threads = [threading.Thread(target=start) for _ in range(12)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    assert len(set(folders)) == 12


def test_as_int_reads_only_real_integers() -> None:
    assert as_int(3) == 3 and as_int(True, 7) == 7 and as_int("3", 5) == 5 and as_int(None) == 0


class FakeGateway:
    def describe(self) -> tuple[CapabilityInfo, ...]:
        return (
            CapabilityInfo(
                name="x", version="1", package="p", description="d", cpu_bound=False, input_schema={"type": "object"}
            ),
        )

    def names(self) -> tuple[str, ...]:
        return ("x",)

    def invoke(self, name: str, payload: Payload) -> Payload:
        return {"echo": payload["value"]}


def test_a_fake_gateway_satisfies_the_port() -> None:
    gateway: EngineGateway = FakeGateway()
    assert gateway.names() == ("x",) and gateway.invoke("x", {"value": 2}) == {"echo": 2}
