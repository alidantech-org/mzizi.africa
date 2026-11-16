"""Port for sharing request permits between crawler workers."""

from contextlib import AbstractContextManager, nullcontext
from typing import Protocol


class RequestGovernor(Protocol):
    def permit(self, url: str) -> AbstractContextManager[None]: ...


_governor: RequestGovernor | None = None


def configure_governor(governor: RequestGovernor | None) -> None:
    global _governor
    _governor = governor


def active_governor() -> RequestGovernor | None:
    return _governor


def permit(url: str) -> AbstractContextManager[None]:
    return _governor.permit(url) if _governor is not None else nullcontext()
