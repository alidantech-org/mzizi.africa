"""The port every package orchestrator is registered through: the runtime starts and stops it, nothing more."""

from __future__ import annotations

from typing import Protocol


class RuntimeCapability(Protocol):
    """A package's orchestrator, as the runtime sees it. Its work is reached through typed methods, not through here."""

    def start(self) -> None: ...

    def stop(self) -> None: ...
