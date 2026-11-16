"""Tabs of the shared dev browser: one working tab per site, at most two tabs per site, one pop-up at a time.

Several commands can run at once, each on a different site, without sharing a tab. A command takes a lease on its
site (an exclusive file lock), so two commands never drive the same site's tab; commands for other sites are not
blocked. The registry remembers which browser tab belongs to which site so the next command reuses it.
"""

from __future__ import annotations

import fcntl
import json
import time
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path

from pydantic import BaseModel, ConfigDict

REGISTRY_FILE = "tabs.json"
LOCK_DIR = "tab-leases"
REGISTRY_LOCK = "tabs.lock"
MAX_TABS_PER_SITE = 2  # the working tab and one pop-up (`target=_blank`)
MAX_TABS_TOTAL = 24  # idle tabs beyond this are closed, least recently used first
LEASE_WAIT_SECONDS = 120.0
LEASE_POLL_SECONDS = 0.5


class SiteBusy(RuntimeError):
    """Another command holds this site's tab and did not release it in time."""


class TabEntry(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    host: str
    target_id: str
    last_used: float


class Registry(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    tabs: dict[str, TabEntry] = {}  # host -> its working tab


@contextmanager
def _locked(path: Path, wait: float = 5.0) -> Iterator[None]:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w") as handle:
        deadline = time.monotonic() + wait
        while True:
            try:
                fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except BlockingIOError:
                if time.monotonic() > deadline:
                    raise SiteBusy(f"could not lock {path.name} within {wait:.0f}s") from None
                time.sleep(LEASE_POLL_SECONDS / 5)
        try:
            yield
        finally:
            fcntl.flock(handle, fcntl.LOCK_UN)


class TabRegistry:
    def __init__(self, folder: Path) -> None:
        self.folder = folder

    def _read(self) -> Registry:
        file = self.folder / REGISTRY_FILE
        if not file.is_file():
            return Registry()
        try:
            return Registry.model_validate(json.loads(file.read_text(encoding="utf-8")))
        except ValueError:
            return Registry()

    def _write(self, registry: Registry) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        (self.folder / REGISTRY_FILE).write_text(registry.model_dump_json(), encoding="utf-8")

    def tab_for(self, host: str) -> TabEntry | None:
        return self._read().tabs.get(host)

    def remember(self, host: str, target_id: str) -> None:
        with _locked(self.folder / REGISTRY_LOCK):
            registry = self._read()
            tabs = {**registry.tabs, host: TabEntry(host=host, target_id=target_id, last_used=time.time())}
            self._write(Registry(tabs=tabs))

    def forget(self, live_target_ids: set[str]) -> list[str]:
        """Drops registry entries whose tab no longer exists; returns the hosts dropped."""
        with _locked(self.folder / REGISTRY_LOCK):
            registry = self._read()
            keep = {h: t for h, t in registry.tabs.items() if t.target_id in live_target_ids}
            dropped = sorted(set(registry.tabs) - set(keep))
            if dropped:
                self._write(Registry(tabs=keep))
            return dropped

    def idle_beyond_limit(self, leased: set[str]) -> list[TabEntry]:
        """The least recently used idle tabs above the total limit (a tab on lease is never listed)."""
        tabs = sorted(self._read().tabs.values(), key=lambda t: t.last_used)
        extra = max(len(tabs) - MAX_TABS_TOTAL, 0)
        return [t for t in tabs if t.host not in leased][:extra]

    @contextmanager
    def lease(self, host: str, wait: float = LEASE_WAIT_SECONDS) -> Iterator[None]:
        """Exclusive use of a site's tab until the block ends; other sites are unaffected."""
        safe = host.replace("/", "_").replace(":", "_") or "_"
        with _locked(self.folder / LOCK_DIR / f"{safe}.lock", wait):
            yield


class PopupGate:
    """At most one open pop-up per site: a second one is recorded and closed, its address kept for later."""

    def __init__(self, limit: int = MAX_TABS_PER_SITE - 1) -> None:
        self.limit, self.open = limit, 0
        self.seen: list[str] = []
        self.deferred: list[str] = []

    def opened(self, url: str) -> bool:
        """Records a pop-up; True when it may stay open."""
        self.seen.append(url)
        if self.open >= self.limit:
            self.deferred.append(url)
            return False
        self.open += 1
        return True

    def closed(self) -> None:
        self.open = max(self.open - 1, 0)
