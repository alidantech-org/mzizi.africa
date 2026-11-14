"""The git-ignored developer workspace (`.dev/`) and the run folders written into it."""

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
KEEP_RUNS = 50

_README = """# Mzizi developer workspace

Git-ignored. Folders appear only when something is first written into them.

- `websites/<country>/<group>/<host>/`: everything about one site (`scraped/`, `extracted/`, `drafts/`).
- `runs/<date>/`: one-off commands that are not tied to a site (the newest 50 are kept).
- `browser/`: browser profiles and the shared window state. `logs/`, `cache/`: throwaway state.
- `inputs/`: files you drop in. `secure/`, `stack/`: keys and dev-stack settings.

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
        return cls(find_repo_root((cwd or Path.cwd()).resolve()) / ".dev")

    @property
    def inputs(self) -> Path:
        return self.root / "inputs"

    @property
    def runs(self) -> Path:
        return self.root / "runs"

    @property
    def browser_profile(self) -> Path:
        return self.root / "browser" / "profiles"

    @property
    def log_file(self) -> Path:
        return self.root / "logs" / "mzizi.log"

    @property
    def recent_urls_file(self) -> Path:
        return self.root / "logs" / "recent-urls.txt"

    def exists(self) -> bool:
        return self.root.is_dir()

    def init(self) -> list[Path]:
        """Creates only the workspace root and its README; every other folder appears on first write."""
        created = [] if self.root.is_dir() else [self.root]
        self.root.mkdir(parents=True, exist_ok=True)
        readme = self.root / "README.md"
        if not readme.exists():
            readme.write_text(_README, encoding="utf-8")
        return created

    def contains(self, path: Path) -> bool:
        resolved = path.resolve()
        return self.inputs.resolve() in resolved.parents

    def trusted(self, path: Path) -> bool:
        """Inside the dev workspace (inputs, runs): files the CLI itself manages."""
        return self.root.resolve() in path.resolve().parents

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
        run_id = f"{now:%H%M%S}-{command.replace(' ', '-')}"
        day = self.runs / f"{now:%Y-%m-%d}"
        folder = day / run_id
        suffix = 1
        while folder.exists():
            suffix += 1
            folder = day / f"{run_id}-{suffix}"
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
        self.clean_runs(KEEP_RUNS)  # run records are small and disposable: the newest are kept, so the folder cannot grow
        return handle

    def _run_folders(self) -> list[Path]:
        """Run folders, newest first (`runs/<date>/<time>-<command>`)."""
        if not self.runs.is_dir():
            return []
        days = sorted((d for d in self.runs.iterdir() if d.is_dir()), reverse=True)
        return [f for day in days for f in sorted((p for p in day.iterdir() if p.is_dir()), reverse=True)]

    def list_runs(self, limit: int = 20) -> list[RunRecord]:
        runs: list[RunRecord] = []
        for folder in self._run_folders()[:limit]:
            try:
                runs.append(RunRecord.model_validate_json((folder / "run.json").read_text(encoding="utf-8")))
            except (OSError, ValueError):
                continue
        return runs

    def run_folder(self, name: str) -> Path | None:
        if name == "last":
            for folder in self._run_folders()[:50]:
                try:
                    if RunRecord.model_validate_json((folder / "run.json").read_text()).status == "ok":
                        return folder
                except (OSError, ValueError):
                    continue
            return None
        return next((f for f in self._run_folders() if f.name == name), None)

    def clean_runs(self, keep: int) -> int:
        folders = self._run_folders()
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
