"""Seed publication: manifest + folder metadata -> verified S3 objects -> registry records with provenance.

Outcomes per artifact (never a bare "success"):
  created        new logical item; bytes uploaded and verified
  deduplicated   new logical item that reuses an identical object in the same access boundary (no upload)
  recovered      bytes were already in the store but unregistered (an interrupted earlier run); registered after verifying them
  unchanged      the registered item already matches
  updated        a non-versioned (current) item now points at new immutable bytes
  conflict       the request contradicts registered state (an immutable release with different bytes, a revision race, a shared fixed key)
  failed         upload or verification failed; nothing was registered
  planned        dry run: what would happen (action field), nothing written

Publication modes (manifest entry field `publication_mode`, default `versioned`):
  versioned   an immutable release per manifest release; the same release with different bytes is a conflict
  current     a stable logical identity with a current-object pointer and revision check; bytes may change without a new version
  fixed_key   explicit overwrite of a declared key (`fixed_key`), allowed only if no other item uses it, journaled for recovery
Identity is always distinct per (manifest entry, file) even when bytes are shared. Nothing here deletes objects.
"""
from __future__ import annotations

import mimetypes
from dataclasses import dataclass, field
from pathlib import Path

from mzizi_manifest import seed_registry as seeds

from .access import AccessError, BUCKET, check_key_matches_access
from .hashing import sha256_hex
from .registry import ItemRecord, ObjectRecord, RegistryPort, RevisionConflict
from .store import ObjectStore, StoreError, verify_upload

TOOL = "mzizi-filesystem publish_seeds"
MODES = ("versioned", "current", "fixed_key")
NO_CACHE = "no-cache"


@dataclass
class Outcome:
    identity: str
    path: str
    outcome: str
    detail: str = ""
    action: str | None = None  # for dry runs
    key: str | None = None
    sha256: str | None = None
    verified: bool = False


@dataclass
class Report:
    release: str
    dry_run: bool
    outcomes: list[Outcome] = field(default_factory=list)

    def count(self, name: str) -> int:
        return sum(1 for o in self.outcomes if o.outcome == name)

    @property
    def ok(self) -> bool:
        return self.count("failed") == 0 and self.count("conflict") == 0

    def summary(self) -> dict[str, int]:
        names = sorted({o.outcome for o in self.outcomes})
        return {name: self.count(name) for name in names}


def _provenance(manifest: dict, entry: dict, file: dict, lock: dict) -> dict:
    effective = file["effective"]
    return {
        "seed": True,
        "artifact_role": effective["role"],
        "acquisition_class": effective["acquisition_class"],
        "preparation": effective["preparation"],
        "scope": effective["scope"],
        "review": effective["review"],
        "resolved_from": effective["resolved_from"],
        "file_override": effective["file_override"],
        "access_defaulted": effective["access_defaulted"],
        "manifest_entry": entry["id"],
        "manifest_release": manifest["release"],
        "manifest_sha256": lock["manifest_sha256"],
        "artifact_sha256": file["sha256"],
        "input_refs": [file["relocated_from"]] if file.get("relocated_from") else [],
        "loader": entry["loader"],
        "generator": {"tool": TOOL, "model": None, "note": "no model or generator version is recorded: none is known"},
        "intended_access": effective["access"],
    }


class _Publisher:
    def __init__(self, store: ObjectStore, registry: RegistryPort, root: Path, dry_run: bool, verify: str) -> None:
        self.store, self.registry, self.root, self.dry_run, self.verify = store, registry, root, dry_run, verify

    # ---- objects: dedup within the access boundary, upload, verify, register -------------------
    def ensure_object(self, access: str, key: str, data: bytes, content_type: str) -> tuple[ObjectRecord, str]:
        sha, size = sha256_hex(data), len(data)
        check_key_matches_access(key, access)
        found = self.registry.find_object(access, sha, size)
        if found:
            head = self.store.head(found.key)
            if head and head.size == size and (head.sha256 in (None, sha)):
                return found, "deduplicated"
            if self.dry_run:
                return found, "recovered"
            self.store.put(found.key, data, content_type, sha)
            verify_upload(self.store, found.key, data, self.verify)
            return found, "recovered"
        record = ObjectRecord(access, sha, size, BUCKET, key, content_type)
        head = self.store.head(key)
        if head is not None:
            if head.size == size and head.sha256 in (None, sha):
                if not self.dry_run:
                    verify_upload(self.store, key, data, self.verify)
                    self.registry.put_object(record)
                return record, "recovered"
            raise StoreError(f"{key} already holds different bytes ({head.size} bytes, hash {head.sha256}); refusing to overwrite a hash-qualified key")
        if self.dry_run:
            return record, "created"
        self.store.put(key, data, content_type, sha)
        verify_upload(self.store, key, data, self.verify)
        self.registry.put_object(record)
        return record, "created"

    def event(self, kind: str, identity: str, **detail) -> None:
        if not self.dry_run:
            self.registry.append_event({"kind": kind, "identity": identity, **detail})

    # ---- one artifact ---------------------------------------------------------------------------
    def publish(self, manifest: dict, lock: dict, entry: dict, file: dict) -> Outcome:
        identity = f"seed/{entry['id']}/{file['path']}"
        out = Outcome(identity, file["path"], "failed", key=file["object_key"], sha256=file["sha256"])
        mode = entry.get("publication_mode", "versioned")
        if mode not in MODES:
            out.detail = f"unknown publication_mode {mode!r}"
            return out
        data = (self.root / file["path"]).read_bytes()
        if sha256_hex(data) != file["sha256"]:
            out.detail = "the file changed after the lock was built; regenerate the lock"
            return out
        access = file["effective"]["access"]
        content_type = mimetypes.guess_type(file["path"])[0] or entry.get("media_type", "application/octet-stream")
        release = manifest["release"]
        try:
            check_key_matches_access(file["object_key"], access)
            item = self.registry.get_item(identity)
            ref = {"sha256": file["sha256"], "size": file["bytes"], "key": file["object_key"]}
            if mode == "fixed_key":
                return self._fixed_key(entry, file, identity, access, data, content_type, item, manifest, lock, out)
            if item and item.access != access:
                out.outcome, out.detail = "conflict", f"registered access {item.access!r} differs from the effective access {access!r}; reclassification is an explicit operation"
                return out
            if mode == "versioned" and item and release in item.versions:
                if item.versions[release]["sha256"] == file["sha256"]:
                    return self._confirm_unchanged(out, item.versions[release], access, data, content_type)
                out.outcome, out.detail = "conflict", f"release {release} is immutable and already registered with different bytes"
                self.event("conflict", identity, release=release)
                return out
            if mode == "current" and item and item.current and item.current["sha256"] == file["sha256"]:
                return self._confirm_unchanged(out, item.current, access, data, content_type)
            record, how = self.ensure_object(access, file["object_key"], data, content_type)
            ref = {"sha256": record.sha256, "size": record.size, "key": record.key}
            updated = item is not None and mode == "current"
            if self.dry_run:
                out.outcome, out.action = "planned", ("update" if updated else "create") + f" ({how})"
                return out
            new = item or ItemRecord(identity, mode, access, True, _provenance(manifest, entry, file, lock))
            new.provenance = _provenance(manifest, entry, file, lock)
            new.current = ref
            if mode == "versioned":
                new.versions[release] = ref
            self.registry.save_item(new, item.revision if item else None)
            out.outcome = "updated" if updated else ("recovered" if how == "recovered" else ("deduplicated" if how == "deduplicated" else "created"))
            out.key, out.verified = record.key, True
            self.event(out.outcome, identity, release=release, sha256=record.sha256, key=record.key)
            return out
        except RevisionConflict as error:
            out.outcome, out.detail = "conflict", f"concurrent change: {error}"
            return out
        except (StoreError, AccessError, OSError) as error:
            out.outcome, out.detail = "failed", str(error)
            self.event("failed", identity, error=str(error))
            return out

    def _confirm_unchanged(self, out: Outcome, ref: dict, access: str, data: bytes, content_type: str) -> Outcome:
        head = self.store.head(ref["key"])
        if head is None or head.size != ref["size"]:
            if self.dry_run:
                out.outcome, out.action = "planned", "recover (registered object missing from the store)"
                return out
            self.store.put(ref["key"], data, content_type, ref["sha256"])
            verify_upload(self.store, ref["key"], data, self.verify)
            out.outcome, out.detail, out.verified = "recovered", "registered object was missing from the store; re-uploaded and verified", True
            return out
        out.outcome, out.verified, out.key = "unchanged", True, ref["key"]
        return out

    def _fixed_key(self, entry, file, identity, access, data, content_type, item, manifest, lock, out) -> Outcome:
        key = entry.get("fixed_key")
        if not key or not entry.get("allow_overwrite"):
            out.detail = "fixed_key mode needs `fixed_key` and an explicit `allow_overwrite: true`"
            return out
        check_key_matches_access(key, access)
        others = [i for i in self.registry.items_using_key(key) if i != identity]
        if others:
            out.outcome, out.detail = "conflict", f"{key} is shared with {others}; an object used by other records is never overwritten"
            return out
        sha = file["sha256"]
        head = self.store.head(key)
        if item and item.current and item.current["sha256"] == sha and head and head.sha256 in (None, sha):
            out.outcome, out.verified, out.key = "unchanged", True, key
            return out
        if self.dry_run:
            out.outcome, out.action = "planned", "overwrite " + key
            return out
        events = self.registry.events(identity)
        pending = bool(events) and events[-1]["kind"] == "overwrite_started" and events[-1].get("sha256") == sha
        self.event("overwrite_started", identity, sha256=sha, key=key)
        if not (pending and head and head.sha256 in (None, sha) and head.size == len(data)):
            self.store.put(key, data, content_type, sha, cache_control=NO_CACHE)
        verify_upload(self.store, key, data, self.verify)
        record = ObjectRecord(access, sha, len(data), BUCKET, key, content_type)
        self.registry.replace_object(record)
        new = item or ItemRecord(identity, "fixed_key", access, True, {})
        new.provenance, new.current = _provenance(manifest, entry, file, lock), {"sha256": sha, "size": len(data), "key": key}
        self.registry.save_item(new, item.revision if item else None)
        self.event("overwrite_completed", identity, sha256=sha, key=key)
        out.outcome, out.verified, out.key = ("updated" if item else "created"), True, key
        out.detail = "fixed key overwritten; clients may cache the previous bytes (Cache-Control: no-cache is set); an interrupted overwrite resumes from the journal"
        return out


def publish_seeds(store: ObjectStore, registry: RegistryPort, seed_root: Path | None = None, dry_run: bool = True, entry_ids: set[str] | None = None, verify: str = "head") -> Report:
    """Validate the seed registry, then publish (or plan) every adopted artifact. Dry run is the default and writes nothing."""
    from mzizi_manifest.paths import SEED_ROOT

    root = seed_root or SEED_ROOT
    validation = seeds.validate_manifest(root)
    report = Report(release=(validation.manifest or {}).get("release", "?"), dry_run=dry_run)
    if validation.errors or not validation.manifest:
        report.outcomes.append(Outcome("manifest", "manifest.yaml", "failed", "; ".join(validation.errors[:5])))
        return report
    manifest = validation.manifest
    lock = seeds.build_lock(manifest, root)
    by_id = {e["id"]: e for e in manifest["entries"]}
    publisher = _Publisher(store, registry, root, dry_run, verify)
    for locked in lock["entries"]:
        if entry_ids and locked["id"] not in entry_ids:
            continue
        for file in locked["files"]:
            report.outcomes.append(publisher.publish(manifest, lock, by_id[locked["id"]], file))
    return report
