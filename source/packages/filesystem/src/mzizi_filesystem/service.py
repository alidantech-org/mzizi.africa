"""Content registration: stream-hash, decide duplicates and name conflicts, store at the readable key, verify, register.

Every path that creates content (sync, direct uploads, derived files) goes through `FilesystemService.register`.
The object key is the registry path (see `keys.py`), so a key is written only when it is empty, already holds the same bytes, or
holds the current bytes of the same file after those bytes were preserved. S3 and PostgreSQL do not share a transaction; the order
makes interruption safe: superseded bytes are copied to the version folder and verified, the new bytes are written and verified,
then the registry rows commit atomically. Every step is repeatable, and a rerun after a crash finishes the registration.
"""

from __future__ import annotations

import io
from dataclasses import dataclass, field
from pathlib import Path

import psycopg

from . import catalog
from .access import check_key_matches_access
from .authz import Authorizer, OperatorAuthorizer
from .hashing import hash_file, hash_stream
from .keys import NameError_, archive_key, check_name, current_key, is_protected, sibling_name
from .repository import Conflict, PermissionDenied, Repository
from .store import ObjectStore, StoreError

MANDATORY_CLASSIFICATION = ("artifact_role", "acquisition_class", "preparation")
ON_DUPLICATE = ("keep_both", "reuse_existing", "reject")
ON_NAME_CONFLICT = ("new_version", "keep_both", "reject")


@dataclass
class Registration:
    outcome: str  # created | unchanged | updated | duplicate | conflict | failed | planned | denied | blocked
    detail: str = ""
    action: str | None = None
    file_id: str | None = None
    version_id: str | None = None
    revision: int | None = None
    key: str | None = None
    name: str | None = None
    sha256: str | None = None
    size: int | None = None
    recovered: bool = False
    duplicate_of: str | None = None  # registry path of a file that already holds these bytes in the same access class
    server_copied: bool = False  # the object was created by a server-side copy of duplicate_of instead of an upload
    archived_key: str | None = None  # where the superseded version was preserved
    verified: bool = False
    pruned: list[dict] = field(default_factory=list)


class FilesystemService:
    def __init__(
        self, repo: Repository, store: ObjectStore, authorizer: Authorizer | None = None, verify: str = "head"
    ) -> None:
        self.repo, self.store, self.authorizer, self.verify = repo, store, authorizer or OperatorAuthorizer(), verify

    # ---- provenance snapshot ----------------------------------------------------------------------------
    def provenance(self, folder_id: str, extra: dict | None = None) -> dict:
        eff = self.repo.effective(folder_id)
        resolved = {}
        for fld, fid in (eff["resolved_from"] or {}).items():
            folder = self.repo.get_folder(fid)
            resolved[fld] = {"folder_id": fid, "code": folder["code"] if folder else None}
        snap = {
            "seed": eff["is_seed"],
            "artifact_role": eff["artifact_role"],
            "acquisition_class": eff["acquisition_class"],
            "preparation": eff["preparation"],
            "intended_access": eff["access"],
            "access_defaulted": eff["access_defaulted"],
            "jurisdiction_code": eff["jurisdiction_code"],
            "resolved_from": resolved,
            "registered_in_folder": self.repo.folder_path(folder_id),
        }
        extra = dict(extra or {})
        overrides = extra.pop("effective_overrides", None)
        if overrides:
            snap.update(overrides)
            snap["overridden_fields"] = sorted(overrides)
        snap.update(extra)
        return snap

    # ---- registration -------------------------------------------------------------------------------------
    def register(
        self,
        folder_id: str,
        name: str,
        source: Path | bytes,
        *,
        code: str | None = None,
        retention: str = "preserve_history",
        actor: str | None = None,
        provenance_extra: dict | None = None,
        declared_type: str | None = None,
        pin_reason: str | None = None,
        dry_run: bool = False,
        require_classification: bool = True,
        original_filename: str | None = None,
        on_duplicate: str = "keep_both",
        on_name_conflict: str = "new_version",
    ) -> Registration:
        """Registers `source` as the file `name` in the folder.

        on_duplicate (the same bytes already exist as another file of the same access class, and this would be a new file):
          keep_both       store this file at its own readable key (a server-side copy, no upload)
          reuse_existing  create nothing; return the existing file with outcome `duplicate`
          reject          outcome `conflict`
        on_name_conflict (a file with this name exists in the folder and holds different bytes):
          new_version     record a new revision of that file (default)
          keep_both       store the newcomer beside it as <stem>~<sha8><ext>
          reject          outcome `conflict`
        """
        out = Registration("failed", name=name)
        try:
            if on_duplicate not in ON_DUPLICATE or on_name_conflict not in ON_NAME_CONFLICT:
                raise ValueError(f"unknown policy on_duplicate={on_duplicate!r} on_name_conflict={on_name_conflict!r}")
            check_name(name)
            eff = self.repo.effective(folder_id)
            missing = [f for f in MANDATORY_CLASSIFICATION if eff[f] is None]
            if require_classification and missing:
                out.outcome, out.detail = (
                    "blocked",
                    f"no {', '.join(missing)} resolved for the folder; classify it before registration",
                )
                return out
            access = eff["access"]
            if isinstance(source, Path):
                sha, size = hash_file(source)
                with open(source, "rb") as handle:
                    head = handle.read(4096)
            else:
                sha, size = hash_stream(io.BytesIO(source))
                head = source[:4096]
            out.sha256, out.size = sha, size
            try:
                ext, ctype = catalog.resolve(name, head, declared_type)
            except catalog.ContentTypeError as error:
                out.outcome, out.detail = "failed", str(error)
                return out
            file = self.repo.file_by_code(code) if code else None
            if file is None:
                file = self.repo.find_file(folder_id, name)
                if file is not None and code and file["code"] not in (None, code):
                    out.outcome, out.detail = (
                        "conflict",
                        f"{name} already exists in the folder with a different identity ({file['code']})",
                    )
                    return out
            current = self.repo.get_version(file["current_version_id"]) if file and file["current_version_id"] else None
            same_bytes = bool(current and current["sha256"] == sha and current["size_bytes"] == size)
            if file is not None and not same_bytes and on_name_conflict != "new_version":
                if on_name_conflict == "reject":
                    out.outcome, out.detail = "conflict", f"{name} already exists in the folder with different content"
                    return out
                original_filename, name, code = original_filename or name, sibling_name(name, sha), None
                out.name = name
                file = self.repo.find_file(folder_id, name)
                current = (
                    self.repo.get_version(file["current_version_id"]) if file and file["current_version_id"] else None
                )
                same_bytes = bool(current and current["sha256"] == sha and current["size_bytes"] == size)
            self._authorize(actor, folder_id, file)
            folder_path = self.repo.folder_path(folder_id) if file is None else self.repo.folder_path(file["folder_id"])
            key = current_key(access, folder_path, file["name"] if file else name)
            check_key_matches_access(key, access)
            if is_protected(key):
                raise StoreError(f"{key} is inside a protected archive and cannot be registered")
            out.key = key
            if same_bytes and file is not None and current is not None:
                return self._unchanged(out, file, current, source, ctype, dry_run)
            twin = self.repo.find_same_content(access, sha, size, file["id"] if file else None)
            if twin is not None:
                out.duplicate_of = twin["path"]
                if file is None and on_duplicate == "reuse_existing":
                    out.outcome, out.detail = "duplicate", f"identical content is already registered as {twin['path']}"
                    out.file_id, out.version_id, out.revision, out.key, out.verified = (
                        twin["file_id"],
                        twin["id"],
                        twin["revision"],
                        twin["s3_key"],
                        True,
                    )
                    return out
                if file is None and on_duplicate == "reject":
                    out.outcome, out.detail = "conflict", f"identical content is already registered as {twin['path']}"
                    return out
            old_key = None
            if file is not None and current is not None:
                keep_old = file["retention"] == "preserve_history" or self.repo.version_protected(current["id"])
                old_key = archive_key(access, folder_path, file["name"], current["revision"]) if keep_old else None
            if dry_run:
                out.outcome = "planned"
                out.action = (
                    ("update" if file else "create")
                    + (f" (server-side copy of {twin['path']})" if twin else "")
                    + (f" (previous revision kept at {old_key})" if old_key else "")
                )
                return out
            out.recovered, out.server_copied = self._place(key, source, sha, size, ctype, current, old_key, twin)
            out.verified, out.archived_key = True, old_key
            version = {
                "s3_key": key,
                "sha256": sha,
                "size_bytes": size,
                "extension": ext,
                "content_type": ctype,
                "original_filename": original_filename or name,
                "provenance": self.provenance(folder_id, provenance_extra),
                "pin_reason": pin_reason,
            }
            if file is None:
                file, ver = self.repo.create_file_with_version(folder_id, name, code, retention, version, actor)
                out.outcome = "created"
            else:
                # the superseded row always leaves the readable key; when it is not kept it is pruned in the same transaction
                file_retention = file["retention"]
                file, ver, pruned = self.repo.add_version(
                    file["id"],
                    file["revision"],
                    version,
                    actor,
                    archive_key(access, folder_path, file["name"], current["revision"]) if current else None,
                )
                if file_retention != retention:
                    out.detail = f"stored retention {file_retention} kept (configuration asks for {retention}); change it explicitly"
                out.outcome, out.pruned = "updated", pruned
            out.file_id, out.version_id, out.revision = file["id"], ver["id"], ver["revision"]
        except NameError_ as error:
            out.outcome, out.detail = "failed", str(error)
        except Conflict as error:
            out.outcome, out.detail = "conflict", str(error)
        except PermissionDenied as error:
            out.outcome, out.detail = "denied", str(error)
        except (StoreError, OSError) as error:
            out.outcome, out.detail = "failed", str(error)
        except psycopg.Error as error:
            out.outcome, out.detail = (
                ("conflict" if getattr(error, "sqlstate", "") in ("23505",) else "failed"),
                f"{type(error).__name__}: {error}".splitlines()[0],
            )
        except Exception as error:
            out.outcome, out.detail = "failed", f"{type(error).__name__}: {error}"
        return out

    def _authorize(self, actor: str | None, folder_id: str, file: dict | None) -> None:
        if file is None:
            self.authorizer.for_new_child(actor, "filesystem.edit", "filesystem.files", folder_id)
        else:
            self.authorizer.for_record(actor, "filesystem.edit", "filesystem.files", file["id"])

    def _unchanged(
        self, out: Registration, file: dict, current: dict, source: Path | bytes, ctype: str, dry_run: bool
    ) -> Registration:
        out.file_id, out.version_id, out.revision, out.key = (
            file["id"],
            current["id"],
            current["revision"],
            current["s3_key"],
        )
        if self._holds(current["s3_key"], current["sha256"], current["size_bytes"]):
            out.outcome, out.verified = "unchanged", True
            return out
        if dry_run:
            out.outcome, out.action = "planned", "recover (registered content is missing from the store)"
            return out
        if self.store.head(current["s3_key"]) is not None:
            raise StoreError(
                f"{current['s3_key']} holds bytes that differ from its registered version; run `mzizi-filesystem verify` and resolve it by hand"
            )
        self._write(current["s3_key"], source, current["sha256"], current["size_bytes"], ctype)
        out.outcome, out.recovered, out.verified = "unchanged", True, True
        out.detail = "registered content was missing from the store; re-uploaded and verified"
        return out

    # ---- storage ------------------------------------------------------------------------------------------
    def _holds(self, key: str, sha: str, size: int) -> bool:
        """True when the key holds exactly these bytes. An object without a recorded hash is read back and hashed."""
        head = self.store.head(key)
        if head is None or head.size != size:
            return False
        if head.sha256 is not None:
            return head.sha256 == sha
        with self.store.open_stream(key) as stream:
            return hash_stream(stream) == (sha, size)

    def _write(self, key: str, source: Path | bytes, sha: str, size: int, ctype: str) -> None:
        if isinstance(source, Path):
            self.store.put_path(key, str(source), ctype, sha)
        else:
            self.store.put(key, source, ctype, sha)
        if not self._holds(key, sha, size):
            raise StoreError(f"verification failed: {key} does not hold the uploaded bytes")
        if self.verify == "get":
            with self.store.open_stream(key) as stream:
                if hash_stream(stream) != (sha, size):
                    raise StoreError(f"verification failed: bytes read back from {key} do not match")

    def _place(
        self,
        key: str,
        source: Path | bytes,
        sha: str,
        size: int,
        ctype: str,
        current: dict | None,
        old_key: str | None,
        twin: dict | None,
    ) -> tuple[bool, bool]:
        """Puts the new bytes at the readable key without ever losing or overwriting unknown bytes. Returns (recovered, server_copied)."""
        if self._holds(key, sha, size):  # an interrupted earlier run already wrote them
            if old_key and current and not self._holds(old_key, current["sha256"], current["size_bytes"]):
                raise StoreError(
                    f"{key} already holds the new bytes but the superseded revision is missing from {old_key}"
                )
            return True, False
        if self.store.head(key) is not None:
            if not (
                current and current["s3_key"] == key and self._holds(key, current["sha256"], current["size_bytes"])
            ):
                raise StoreError(
                    f"{key} holds an object that is not the registered current version of this file; refusing to overwrite it"
                )
            if old_key and not self._holds(old_key, current["sha256"], current["size_bytes"]):
                if self.store.head(old_key) is not None:
                    raise StoreError(f"{old_key} holds unexpected bytes; refusing to overwrite it")
                self.store.copy(key, old_key, current["content_type"], current["sha256"])
                if not self._holds(old_key, current["sha256"], current["size_bytes"]):
                    raise StoreError(f"verification failed after preserving the superseded revision at {old_key}")
        if twin is not None and self._holds(twin["s3_key"], sha, size):
            self.store.copy(twin["s3_key"], key, ctype, sha)
            if not self._holds(key, sha, size):
                raise StoreError(f"verification failed after copying {twin['s3_key']} to {key}")
            return False, True
        self._write(key, source, sha, size, ctype)
        return False, False
