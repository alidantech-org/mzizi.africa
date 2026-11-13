"""The git-ignored developer workspace (`.local/dev/`) and the run folders written into it."""

from __future__ import annotations

import json
import os
import shutil
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict

from mzizi_engine.devcli.types import ArgValues

WORKSPACE_ENV = "MZIZI_DEV_ROOT"
_SUBFOLDERS = ("inputs", "outputs", "manifests", "cache", "logs", "services", "browser-profile", "downloads")

_README = """# Mzizi developer workspace

Git-ignored scratch space for `mzizi` CLI runs. Safe to delete.

- `inputs/`: files you drop in (PDF, HTML, CSV, GeoJSON). Never modified by the CLI.
- `outputs/<run>/`: one folder per run (`run.json`, `result.json`, artifacts).
- `manifests/`: unofficial site/API structures and fetch policies for experiments.
- `cache/`, `browser-profile/`, `services/`, `logs/`: throwaway state.

Everything here is a dev run, not collected evidence.
"""

RunStatus = Literal["ok", "failed", "not_yet_added", "unavailable", "usage", "cancelled"]


class RunRecord(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    run_id: str
    command: str
    port: str | None
    arguments: dict[str, str]
    started_at: str
    finished_at: str | None = None
    status: RunStatus | None = None
    message: str | None = None
    dev_run: bool = True


def find_repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".git").exists() and (candidate / "pyproject.toml").exists():
            return candidate
    return start


class Workspace:
    def __init__(self, root: Path) -> None:
        self.root = root

    @classmethod
    def locate(cls, cwd: Path | None = None) -> Workspace:
        override = os.environ.get(WORKSPACE_ENV)
        if override:
            return cls(Path(override).expanduser().resolve())
        return cls(find_repo_root((cwd or Path.cwd()).resolve()) / ".local" / "dev")

    @property
    def inputs(self) -> Path:
        return self.root / "inputs"

    @property
    def outputs(self) -> Path:
        return self.root / "outputs"

    @property
    def downloads(self) -> Path:
        return self.root / "downloads"

    @property
    def browser_profile(self) -> Path:
        return self.root / "browser-profile"

    @property
    def manifests(self) -> Path:
        return self.root / "manifests"

    @property
    def log_file(self) -> Path:
        return self.root / "logs" / "mzizi.log"

    @property
    def recent_urls_file(self) -> Path:
        return self.root / "logs" / "recent-urls.txt"

    def exists(self) -> bool:
        return self.root.is_dir()

    def init(self) -> list[Path]:
        created: list[Path] = []
        for name in _SUBFOLDERS:
            folder = self.root / name
            if not folder.is_dir():
                created.append(folder)
            folder.mkdir(parents=True, exist_ok=True)
        readme = self.root / "README.md"
        if not readme.exists():
            readme.write_text(_README, encoding="utf-8")
        return created

    def contains(self, path: Path) -> bool:
        resolved = path.resolve()
        return self.inputs.resolve() in resolved.parents

    def remember_url(self, url: str) -> None:
        self.recent_urls_file.parent.mkdir(parents=True, exist_ok=True)
        known = self.recent_urls()
        merged = [url, *[u for u in known if u != url]][:30]
        self.recent_urls_file.write_text("\n".join(merged) + "\n", encoding="utf-8")

    def recent_urls(self) -> list[str]:
        try:
            return [line for line in self.recent_urls_file.read_text(encoding="utf-8").splitlines() if line]
        except OSError:
            return []

    def start_run(self, command: str, port: str | None, arguments: ArgValues) -> RunHandle:
        now = datetime.now(UTC)
        run_id = f"{now:%Y%m%d-%H%M%S}-{command.replace(' ', '-')}"
        folder = self.outputs / run_id
        suffix = 1
        while folder.exists():
            suffix += 1
            folder = self.outputs / f"{run_id}-{suffix}"
        folder.mkdir(parents=True)
        record = RunRecord(
            run_id=folder.name,
            command=command,
            port=port,
            arguments={k: str(v) for k, v in arguments.items() if v is not None},
            started_at=now.isoformat(timespec="seconds"),
        )
        handle = RunHandle(folder, record)
        handle.write()
        return handle

    def list_runs(self, limit: int = 20) -> list[RunRecord]:
        if not self.outputs.is_dir():
            return []
        runs: list[RunRecord] = []
        for folder in sorted((p for p in self.outputs.iterdir() if p.is_dir()), reverse=True)[:limit]:
            try:
                runs.append(RunRecord.model_validate_json((folder / "run.json").read_text(encoding="utf-8")))
            except (OSError, ValueError):
                continue
        return runs

    def run_folder(self, name: str) -> Path | None:
        if name == "last":
            runs = self.list_runs(1)
            return self.outputs / runs[0].run_id if runs else None
        candidate = self.outputs / name
        return candidate if candidate.is_dir() else None

    def clean_runs(self, keep: int) -> int:
        folders = (
            sorted((p for p in self.outputs.iterdir() if p.is_dir()), reverse=True) if self.outputs.is_dir() else []
        )
        for folder in folders[keep:]:
            shutil.rmtree(folder)
        return max(len(folders) - keep, 0)


class RunHandle:
    def __init__(self, folder: Path, record: RunRecord) -> None:
        self.folder = folder
        self.record = record

    def write(self) -> None:
        (self.folder / "run.json").write_text(self.record.model_dump_json(indent=2), encoding="utf-8")

    def save_result(self, result: object) -> Path:
        path = self.folder / "result.json"
        path.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
        return path

    def finish(self, status: RunStatus, message: str | None = None) -> None:
        self.record = self.record.model_copy(
            update={
                "status": status,
                "message": message,
                "finished_at": datetime.now(UTC).isoformat(timespec="seconds"),
            }
        )
        self.write()
