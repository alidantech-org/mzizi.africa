"""Atomic host rate, concurrent request and UTC daily budget accounting."""

from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from threading import Event, Lock, Thread
from time import time
from typing import Protocol
from urllib.parse import urlsplit
from uuid import UUID, uuid4

from mzizi_engine.config.engine_config import GovernorConfig
from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.runs.control import RunCancelled

SECONDS_PER_DAY = 86400
DEFAULT_PERMIT_LEASE_SECONDS = 15
STATE_RETENTION_SECONDS = 2 * SECONDS_PER_DAY
POLL_SECONDS = 0.1


class ActivePermit(Frozen):
    id: UUID
    expires_at: float


class HostState(Frozen):
    tokens: float
    updated_at: float
    day: int
    used: int
    permits: tuple[ActivePermit, ...] = ()


@dataclass(frozen=True)
class HostSnapshot:
    revision: str
    state: HostState


class HostStateStore(Protocol):
    def read(self, host: str) -> HostSnapshot | None: ...
    def compare_and_set(self, host: str, previous: HostSnapshot | None, state: HostState) -> bool: ...


class MemoryHostStateStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._entries: dict[str, HostSnapshot] = {}

    def read(self, host: str) -> HostSnapshot | None:
        with self._lock:
            return self._entries.get(host)

    def compare_and_set(self, host: str, previous: HostSnapshot | None, state: HostState) -> bool:
        with self._lock:
            if self._entries.get(host) != previous:
                return False
            self._entries[host] = HostSnapshot(str(uuid4()), state)
            return True


class HostGovernor:
    def __init__(
        self,
        policy: GovernorConfig,
        store: HostStateStore,
        stop: Event,
        *,
        lease_seconds: int = DEFAULT_PERMIT_LEASE_SECONDS,
    ) -> None:
        self._policy, self._store, self._stop = policy, store, stop
        self._lease_seconds = lease_seconds

    def _acquire(self, host: str, permit_id: UUID) -> None:
        while not self._stop.is_set():
            previous = self._store.read(host)
            now = time()
            day = int(now // SECONDS_PER_DAY)
            current = previous.state if previous else HostState(tokens=1.0, updated_at=now, day=day, used=0)
            # Capacity one spaces starts even when several workers become eligible together.
            tokens = min(1.0, current.tokens + max(0.0, now - current.updated_at) * self._policy.requests_per_second)
            permits = tuple(item for item in current.permits if item.expires_at > now)
            used = current.used if current.day >= day else 0
            if tokens >= 1 and len(permits) < self._policy.concurrency and used < self._policy.daily_budget:
                updated = HostState(
                    tokens=tokens - 1,
                    updated_at=max(now, current.updated_at),
                    day=max(day, current.day),
                    used=used + 1,
                    permits=(*permits, ActivePermit(id=permit_id, expires_at=now + self._lease_seconds)),
                )
                if self._store.compare_and_set(host, previous, updated):
                    return
            self._stop.wait(POLL_SECONDS)
        raise RunCancelled("Stopped while waiting for a host permit")

    def _update_permit(self, host: str, permit_id: UUID, *, release: bool) -> bool:
        while True:
            previous = self._store.read(host)
            if previous is None:
                return False
            state = previous.state
            now = time()
            active = tuple(item for item in state.permits if item.expires_at > now)
            if all(item.id != permit_id for item in active):
                return False
            permits = tuple(item for item in active if item.id != permit_id)
            if not release:
                permits = (*permits, ActivePermit(id=permit_id, expires_at=now + self._lease_seconds))
            if self._store.compare_and_set(host, previous, state.model_copy(update={"permits": permits})):
                return True

    @contextmanager
    def permit(self, url: str) -> Iterator[None]:
        host = urlsplit(url).hostname
        if not host:
            raise ValueError("A host permit requires a network URL")
        permit_id = uuid4()
        host = host.rstrip(".").encode("idna").decode("ascii")
        self._acquire(host, permit_id)
        finished = Event()

        def renew() -> None:
            while not finished.wait(self._lease_seconds / 3):
                try:
                    if self._update_permit(host, permit_id, release=False):
                        continue
                except Exception:
                    self._stop.set()
                    return
                self._stop.set()
                return

        heartbeat = Thread(target=renew, name="host-permit", daemon=True)
        heartbeat.start()
        try:
            yield
        finally:
            finished.set()
            heartbeat.join()
            self._update_permit(host, permit_id, release=True)
