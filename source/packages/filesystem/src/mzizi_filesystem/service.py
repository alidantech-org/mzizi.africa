"""Content registration: stream-hash, find compatible stored bytes, upload, verify, register file and version.

Every path that creates content (sync, direct uploads, generated extraction outputs) goes through `FilesystemService.register`.
S3 and PostgreSQL do not share a transaction. The order makes interruption safe: content is written to an immutable
hash-addressed key and verified first; the registry rows then commit atomically. A crash between the two leaves an unreferenced
key that the next run finds by hash and registers (outcome `recovered`); nothing is ever deleted by registration.
"""
from __future__ import annotations

import io
from dataclasses import dataclass, field
from pathlib import Path

import psycopg

from . import catalog
from .access import check_key_matches_access
from .authz import Authorizer, OperatorAuthorizer
from .hashing import content_key, hash_file, hash_stream, sha256_hex
from .repository import Conflict, PermissionDenied, Repository
from .store import ObjectStore, StoreError, verify_upload

MANDATORY_CLASSIFICATION = ("artifact_role", "acquisition_class", "preparation")


@dataclass
class Registration:
    outcome: str  # created | unchanged | updated | conflict | failed | planned | denied | blocked
    detail: str = ""
    action: str | None = None
    file_id: str | None = None
    version_id: str | None = None
    revision: int | None = None
    key: str | None = None
    sha256: str | None = None
    size: int | None = None
    recovered: bool = False
    reused_storage: bool = False
    verified: bool = False
    pruned: list[dict] = field(default_factory=list)


class FilesystemService:
    def __init__(self, repo: Repository, store: ObjectStore, authorizer: Authorizer | None = None, verify: str = "head") -> None:
        self.repo, self.store, self.authorizer, self.verify = repo, store, authorizer or OperatorAuthorizer(), verify

    # ---- provenance snapshot ----------------------------------------------------------------------------
    def provenance(self, folder_id: str, extra: dict | None = None) -> dict:
        eff = self.repo.effective(folder_id)
        resolved = {}
        for fld, fid in (eff["resolved_from"] or {}).items():
            folder = self.repo.get_folder(fid)
            resolved[fld] = {"folder_id": fid, "seed_code": folder["seed_code"] if folder else None}
        snap = {
            "seed": eff["is_seed"], "artifact_role": eff["artifact_role"], "acquisition_class": eff["acquisition_class"], "preparation": eff["preparation"],
            "intended_access": eff["access"], "access_defaulted": eff["access_defaulted"], "jurisdiction_code": eff["jurisdiction_code"],
            "resolved_from": resolved, "registered_in_folder": self.repo.folder_path(folder_id),
        }
        extra = dict(extra or {})
        overrides = extra.pop("effective_overrides", None)
        if overrides:
            snap.update(overrides)
            snap["overridden_fields"] = sorted(overrides)
        snap.update(extra)
        return snap

    # ---- registration -------------------------------------------------------------------------------------
    def register(self, folder_id: str, name: str, source: Path | bytes, *, registry_code: str | None = None, retention: str = "preserve_history", actor: str | None = None,
                 provenance_extra: dict | None = None, declared_type: str | None = None, pin_reason: str | None = None, dry_run: bool = False,
                 require_classification: bool = True, original_filename: str | None = None) -> Registration:
        out = Registration("failed")
        try:
            eff = self.repo.effective(folder_id)
            missing = [f for f in MANDATORY_CLASSIFICATION if eff[f] is None]
            if require_classification and missing:
                out.outcome, out.detail = "blocked", f"no {', '.join(missing)} resolved for the folder; classify it before registration"
                return out
            access = eff["access"]
            # hash by streaming, remember a small head for content-type verification
            if isinstance(source, Path):
                sha, size = hash_file(source)
                with open(source, "rb") as handle:
                    head = handle.read(4096)
            else:
                sha, size = hash_stream(io.BytesIO(source)), None
                sha, size = sha[0], sha[1]
                head = source[:4096]
            out.sha256, out.size = sha, size
            try:
                ext, ctype = catalog.resolve(name, head, declared_type)
            except catalog.ContentTypeError as error:
                out.outcome, out.detail = "failed", str(error)
                return out
            file = self.repo.file_by_code(registry_code) if registry_code else None
            if file is None:
                file = self.repo.find_file(folder_id, name)
                if file is not None and registry_code and file["registry_code"] not in (None, registry_code):
                    out.outcome, out.detail = "conflict", f"{name} already exists in the folder with a different identity ({file['registry_code']})"
                    return out
            self._authorize(actor, folder_id, file)
            current = self.repo.get_version(file["current_version_id"]) if file and file["current_version_id"] else None
            if current and current["sha256"] == sha and current["size_bytes"] == size:
                return self._unchanged(out, file, current, source, ctype, dry_run)
            existing_key = self.repo.find_reusable_key(access, sha, size)
            key = existing_key or content_key(access, sha)
            check_key_matches_access(key, access)
            out.key, out.reused_storage = key, existing_key is not None
            action = "update" if file else "create"
            if dry_run:
                out.outcome, out.action = "planned", f"{action}{' (reuse stored bytes)' if existing_key else ''}"
                return out
            out.recovered = self._ensure_content(key, source, sha, size, ctype)
            out.verified = True
            version = {"s3_key": key, "sha256": sha, "size_bytes": size, "extension": ext, "content_type": ctype, "original_filename": original_filename or name,
                       "provenance": self.provenance(folder_id, provenance_extra), "pin_reason": pin_reason}
            if file is None:
                file, ver = self.repo.create_file_with_version(folder_id, name, registry_code, retention, version, actor)
                out.outcome = "created"
            else:
                file, ver, pruned = self.repo.add_version(file["id"], file["revision"], version, actor)
                if file["retention"] != retention:
                    out.detail = f"stored retention {file['retention']} kept (configuration asks for {retention}); change it explicitly"
                out.outcome, out.pruned = "updated", pruned
            out.file_id, out.version_id, out.revision = file["id"], ver["id"], ver["revision"]
        except Conflict as error:
            out.outcome, out.detail = "conflict", str(error)
        except PermissionDenied as error:
            out.outcome, out.detail = "denied", str(error)
        except (StoreError, OSError) as error:
            out.outcome, out.detail = "failed", str(error)
        except psycopg.Error as error:
            out.outcome, out.detail = ("conflict" if getattr(error, "sqlstate", "") in ("23505",) else "failed"), f"{type(error).__name__}: {error}".splitlines()[0]
        except Exception as error:  # noqa: BLE001 - one artifact failing must never abort a whole run; it is reported and retried
            out.outcome, out.detail = "failed", f"{type(error).__name__}: {error}"
        return out

    def _authorize(self, actor, folder_id, file) -> None:
        if file is None:
            self.authorizer.for_new_child(actor, "filesystem.edit", "filesystem.files", folder_id)
        else:
            self.authorizer.for_record(actor, "filesystem.edit", "filesystem.files", file["id"])

    def _unchanged(self, out: Registration, file, current, source, ctype, dry_run) -> Registration:
        head = self.store.head(current["s3_key"])
        if head is None or head.size != current["size_bytes"]:
            if dry_run:
                out.outcome, out.action = "planned", "recover (registered content is missing from the store)"
                return out
            self._ensure_content(current["s3_key"], source, current["sha256"], current["size_bytes"], current["content_type"])
            out.outcome, out.recovered, out.verified = "unchanged", True, True
            out.detail = "registered content was missing from the store; re-uploaded and verified"
        else:
            out.outcome, out.verified = "unchanged", True
        out.file_id, out.version_id, out.revision, out.key = file["id"], current["id"], current["revision"], current["s3_key"]
        return out

    def _ensure_content(self, key: str, source: Path | bytes, sha: str, size: int, ctype: str) -> bool:
        """Make sure the immutable key holds exactly these bytes. Returns True when the bytes were already there (interrupted earlier run)."""
        head = self.store.head(key)
        if head is not None:
            if head.size == size and head.sha256 in (None, sha):
                return True
            raise StoreError(f"{key} already holds different bytes ({head.size} bytes, hash {head.sha256}); refusing to overwrite a hash-addressed key")
        if isinstance(source, Path):
            self.store.put_path(key, str(source), ctype, sha)
            head = self.store.head(key)
            if head is None or head.size != size or head.sha256 not in (None, sha):
                raise StoreError(f"verification failed: {key} does not match the uploaded file")
            if self.verify == "get":
                from .hashing import hash_stream as _hs
                with self.store.open_stream(key) as stream:
                    got, got_size = _hs(stream)
                if got != sha or got_size != size:
                    raise StoreError(f"verification failed: bytes read back from {key} do not match")
        else:
            self.store.put(key, source, ctype, sha)
            verify_upload(self.store, key, source, self.verify)
        return False
