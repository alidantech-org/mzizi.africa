"""Settings of the read-only explorer (database viewer and file viewer): the read-only database URL and the folders it may show."""

from __future__ import annotations

import os
from collections.abc import Mapping
from pathlib import Path

from pydantic import BaseModel, ConfigDict


class ExploreConfig(BaseModel):
    """`DATABASE_URL` is the read-only role; `ENGINE_STATE_FILE` keeps job history across restarts (optional)."""

    model_config = ConfigDict(frozen=True)

    read_url: str | None
    roots: dict[str, Path]
    state_file: Path | None

    @classmethod
    def from_env(cls, env: Mapping[str, str], repository: Path, runs: Path) -> ExploreConfig:
        folders = {
            "seed": Path(os.environ.get("MZIZI_SEED_ROOT") or repository / ".dev" / "seed"),
            "dev": repository / ".dev",
            "runs": runs,
            "docs": repository / ".docs",
            "media": repository / ".dev" / "media",
        }
        state = env.get("ENGINE_STATE_FILE")
        return cls(
            read_url=env.get("DATABASE_URL") or None,
            roots={name: path.resolve() for name, path in folders.items() if path.is_dir()},
            state_file=Path(state) if state else None,
        )

    @classmethod
    def load(cls) -> ExploreConfig:
        """Uses the same repository and run folders the rest of the engine does; call after `EngineConfig.load()`."""
        from mzizi_engine.config.engine_config import EngineConfig
        from mzizi_engine.runtime.assembly.run_operations import local_run_root

        repository = next(
            (
                p
                for p in Path(__file__).resolve().parents
                if (p / "dryv.yaml").is_file() and (p / "pyproject.toml").is_file()
            ),
            Path.cwd(),
        )
        return cls.from_env(os.environ, repository, local_run_root(EngineConfig.load()))
