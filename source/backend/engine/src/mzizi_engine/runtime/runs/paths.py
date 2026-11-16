"""Shared run-store paths and cross-process locks for the local supervisor deployment."""

from collections.abc import Iterator
from contextlib import contextmanager
from fcntl import LOCK_EX, flock
from pathlib import Path
from uuid import UUID

AREAS = frozenset({"artifacts", "logs"})


def run_path(value: str, *, area_allowed: bool = False) -> tuple[str, ...]:
    parts = tuple(value.split("/"))
    if (
        parts[0] not in AREAS
        or (len(parts) < 2 and not area_allowed)
        or any(part in ("", ".", "..") for part in parts)
        or any(character in value for character in ("\\", "\x00"))
    ):
        raise ValueError("Expected a safe relative path under artifacts/ or logs/")
    return parts


def within(path: str, prefix: str) -> bool:
    return not prefix or path == prefix or path.startswith(prefix + "/")


@contextmanager
def run_lock(root: Path, run_id: UUID) -> Iterator[None]:
    root.mkdir(parents=True, exist_ok=True)
    with (root / str(run_id)).open("a") as lock:
        flock(lock, LOCK_EX)
        yield
