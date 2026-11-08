"""The registry port: where objects, logical items and publication events are recorded.

The PostgreSQL adapter waits for the filesystem schema design (task TSK-3EA8C40B0F60); until then the memory registry
(tests) and the JSON ledger (local, under seed/local, ignored by Git) implement the same port. Items carry a stable
logical identity; a current-object pointer and a revision allow conditional updates; versions pin immutable releases.
"""
from __future__ import annotations

import copy
import fcntl
import json
import os
import tempfile
from contextlib import contextmanager
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Protocol


class RevisionConflict(Exception):
    """The item changed since it was read (or already exists/does not exist as the writer assumed)."""


@dataclass(frozen=True)
class ObjectRecord:
    access: str
    sha256: str
    size: int
    bucket: str
    key: str
    content_type: str


@dataclass
class ItemRecord:
    identity: str
    mode: str  # versioned | current | fixed_key
    access: str
    seed: bool
    provenance: dict
    revision: int = 0
    current: dict | None = None  # {"sha256", "size", "key"}
    versions: dict[str, dict] = field(default_factory=dict)  # release -> {"sha256", "size", "key"}


class RegistryPort(Protocol):
    def find_object(self, access: str, sha256: str, size: int) -> ObjectRecord | None: ...
    def find_object_by_key(self, key: str) -> ObjectRecord | None: ...
    def put_object(self, record: ObjectRecord) -> None: ...
    def replace_object(self, record: ObjectRecord) -> None: ...
    def get_item(self, identity: str) -> ItemRecord | None: ...
    def items_using_key(self, key: str) -> list[str]: ...
    def save_item(self, item: ItemRecord, expected_revision: int | None) -> ItemRecord: ...
    def append_event(self, event: dict) -> None: ...
    def events(self, identity: str | None = None) -> list[dict]: ...


class MemoryRegistry:
    def __init__(self) -> None:
        self._objects: dict[tuple[str, str, int], ObjectRecord] = {}
        self._items: dict[str, ItemRecord] = {}
        self._events: list[dict] = []

    def find_object(self, access, sha256, size):
        return self._objects.get((access, sha256, size))

    def find_object_by_key(self, key):
        return next((o for o in self._objects.values() if o.key == key), None)

    def put_object(self, record):
        self._objects.setdefault((record.access, record.sha256, record.size), record)

    def replace_object(self, record):
        for k in [k for k, o in self._objects.items() if o.key == record.key]:
            del self._objects[k]
        self._objects[(record.access, record.sha256, record.size)] = record

    def get_item(self, identity):
        return copy.deepcopy(self._items.get(identity))

    def items_using_key(self, key):
        def uses(item: ItemRecord) -> bool:
            refs = [item.current, *item.versions.values()]
            return any(r and r["key"] == key for r in refs)

        return sorted(i.identity for i in self._items.values() if uses(i))

    def save_item(self, item, expected_revision):
        stored = self._items.get(item.identity)
        if (stored.revision if stored else None) != expected_revision:
            raise RevisionConflict(f"{item.identity}: expected revision {expected_revision}, stored {stored.revision if stored else None}")
        saved = copy.deepcopy(item)
        saved.revision = (expected_revision or 0) + 1
        self._items[item.identity] = saved
        return copy.deepcopy(saved)

    def append_event(self, event):
        self._events.append({"seq": len(self._events) + 1, **event})

    def events(self, identity=None):
        return [e for e in self._events if identity is None or e.get("identity") == identity]

    # persistence hooks used by the ledger
    def dump(self) -> dict:
        return {"objects": [asdict(o) for o in self._objects.values()], "items": [asdict(i) for i in self._items.values()], "events": self._events}

    def load(self, data: dict) -> None:
        self._objects = {(o["access"], o["sha256"], o["size"]): ObjectRecord(**o) for o in data.get("objects", [])}
        self._items = {i["identity"]: ItemRecord(**i) for i in data.get("items", [])}
        self._events = data.get("events", [])


class JsonLedgerRegistry:
    """A local file ledger: every operation reloads under an exclusive lock and writes atomically, so concurrent runs cannot lose updates."""

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)

    @contextmanager
    def _locked(self, write: bool):
        lock = self.path.with_suffix(self.path.suffix + ".lock")
        with open(lock, "w") as handle:
            fcntl.flock(handle, fcntl.LOCK_EX)
            memory = MemoryRegistry()
            if self.path.exists():
                memory.load(json.loads(self.path.read_text(encoding="utf-8")))
            yield memory
            if write:
                fd, tmp = tempfile.mkstemp(dir=self.path.parent, prefix=".ledger-")
                with os.fdopen(fd, "w", encoding="utf-8") as out:
                    json.dump(memory.dump(), out, indent=2, sort_keys=True)
                os.replace(tmp, self.path)

    def find_object(self, access, sha256, size):
        with self._locked(False) as m:
            return m.find_object(access, sha256, size)

    def find_object_by_key(self, key):
        with self._locked(False) as m:
            return m.find_object_by_key(key)

    def put_object(self, record):
        with self._locked(True) as m:
            m.put_object(record)

    def replace_object(self, record):
        with self._locked(True) as m:
            m.replace_object(record)

    def get_item(self, identity):
        with self._locked(False) as m:
            return m.get_item(identity)

    def items_using_key(self, key):
        with self._locked(False) as m:
            return m.items_using_key(key)

    def save_item(self, item, expected_revision):
        with self._locked(True) as m:
            return m.save_item(item, expected_revision)

    def append_event(self, event):
        with self._locked(True) as m:
            m.append_event(event)

    def events(self, identity=None):
        with self._locked(False) as m:
            return m.events(identity)
