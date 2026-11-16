"""Runtime operations for the filesystem package (composition root wiring, not filesystem logic). Each opens a connection, builds the orchestrator and returns plain results.

Handlers are module-level so they can run in worker processes. The caller's task decides placement; nothing here names a folder.
The actor, when present, is stamped into `created_by` by the engine from the authenticated principal.
"""

from __future__ import annotations

import base64
import os
from collections.abc import Callable
from pathlib import Path

from mzizi_engine.jsonvalue import Payload
from mzizi_engine.persistence.postgres.connection import connect
from mzizi_engine.persistence.postgres.filesystem import PostgresRegistry
from mzizi_engine.runtime.assembly.filesystem_settings import FilesystemSettings
from mzizi_engine.runtime.operations import Operation, OperationRegistry
from mzizi_filesystem import (
    Access,
    FilesystemOrchestrator,
    MediaCatalog,
    MemoryObjectStore,
    ObjectStore,
    RegisterRequest,
    S3ObjectStore,
)
from mzizi_filesystem.features.media.parse import load_media_formats
from mzizi_filesystem.features.register.storage import Source
from mzizi_filesystem.features.sync.sync import DirectorySpec
from mzizi_filesystem.shared.contracts import RelationRecord

VERSION = "0.1.0"
PACKAGE = "mzizi-filesystem"


def _store(settings: FilesystemSettings) -> ObjectStore:
    protected = settings.config.protected_prefixes
    if settings.s3 is None:
        return MemoryObjectStore(settings.config.bucket, settings.config.public_endpoint or "memory://", protected)
    return S3ObjectStore(settings.s3, protected)


def _run(payload: Payload, action: Callable[[FilesystemOrchestrator, FilesystemSettings], Payload]) -> Payload:
    settings = FilesystemSettings.from_env(os.environ)
    catalog = MediaCatalog(load_media_formats(settings.media_formats_path) if settings.media_formats_path else {})
    with connect(settings.database_url) as conn:
        orchestrator = FilesystemOrchestrator(settings.config, PostgresRegistry(conn), _store(settings), catalog)
        return action(orchestrator, settings)


def _actor(payload: Payload) -> dict[str, str]:
    actor = payload.get("actor")
    return {"actor": actor} if isinstance(actor, str) else {}


def _request(payload: Payload, key: str = "request") -> RegisterRequest:
    raw = payload.get(key)
    if not isinstance(raw, dict):
        raise ValueError(f"{key!r} must be an object")
    request = RegisterRequest.model_validate(raw, strict=False)
    return request.model_copy(update={"created_by": {**request.created_by, **_actor(payload)}})


def _under_input_root(settings: FilesystemSettings, relative: str) -> Path:
    if settings.input_root is None:
        raise ValueError(f"{'ENGINE_INPUT_ROOT'} must be set to read files by path")
    target = (settings.input_root / relative).resolve()
    if settings.input_root not in target.parents and target != settings.input_root:
        raise ValueError("path escapes the engine input root")
    return target


def _source(payload: Payload, settings: FilesystemSettings) -> Source:
    content = payload.get("content_base64")
    if isinstance(content, str):
        return base64.b64decode(content)
    path = payload.get("path")
    if isinstance(path, str):
        return _under_input_root(settings, path)
    raise ValueError("give content_base64 or path")


def _text(payload: Payload, key: str) -> str:
    value = payload.get(key)
    if not isinstance(value, str) or not value:
        raise ValueError(f"{key!r} is required")
    return value


def _optional_text(payload: Payload, key: str) -> str | None:
    value = payload.get(key)
    return value if isinstance(value, str) and value else None


def _seconds(payload: Payload) -> int:
    value = payload.get("expires_seconds")
    return value if isinstance(value, int) and not isinstance(value, bool) and value > 0 else 900


def register(payload: Payload) -> Payload:
    return _run(payload, lambda fs, s: fs.register(_request(payload), _source(payload, s)).model_dump(mode="json"))


def sync_directory(payload: Payload) -> Payload:
    def act(fs: FilesystemOrchestrator, settings: FilesystemSettings) -> Payload:
        raw = payload.get("spec")
        if not isinstance(raw, dict):
            raise ValueError("'spec' must be an object")
        spec = DirectorySpec.model_validate(raw, strict=False)
        spec = spec.model_copy(update={"created_by": {**spec.created_by, **_actor(payload)}})
        report = fs.sync_directory(
            _under_input_root(settings, _text(payload, "root")), spec, dry_run=payload.get("apply") is not True
        )
        return {
            "dry_run": report.dry_run,
            "ok": report.ok,
            "items": [item.model_dump(mode="json") for item in report.items],
        }

    return _run(payload, act)


def upload_begin(payload: Payload) -> Payload:
    return _run(
        payload,
        lambda fs, s: fs.begin_upload(
            _text(payload, "file_name"), _text(payload, "content_type"), _seconds(payload)
        ).model_dump(mode="json"),
    )


def upload_finish(payload: Payload) -> Payload:
    return _run(
        payload, lambda fs, s: fs.finish_upload(_text(payload, "temp_key"), _request(payload)).model_dump(mode="json")
    )


def download(payload: Payload) -> Payload:
    return _run(
        payload, lambda fs, s: fs.download_link(_text(payload, "version_id"), _seconds(payload)).model_dump(mode="json")
    )


def relate(payload: Payload) -> Payload:
    def act(fs: FilesystemOrchestrator, settings: FilesystemSettings) -> Payload:
        raw = payload.get("relation")
        if not isinstance(raw, dict):
            raise ValueError("'relation' must be an object")
        return {"created": fs.relate(RelationRecord.model_validate(raw, strict=False))}

    return _run(payload, act)


def lineage(payload: Payload) -> Payload:
    def act(fs: FilesystemOrchestrator, settings: FilesystemSettings) -> Payload:
        version = _text(payload, "version_id")
        limit = payload.get("limit")
        return {
            "ancestry": [
                r.model_dump(mode="json") for r in fs.ancestry(version, limit if isinstance(limit, int) else 50)
            ],
            "derivatives": [r.model_dump(mode="json") for r in fs.derivatives(version)],
        }

    return _run(payload, act)


def change_access(payload: Payload) -> Payload:
    return _run(
        payload,
        lambda fs, s: fs.change_access(
            _text(payload, "folder_id"), Access(_text(payload, "access")), _text(payload, "authorization")
        ).model_dump(mode="json"),
    )


def move_folder(payload: Payload) -> Payload:
    return _run(
        payload,
        lambda fs, s: fs.move_folder(
            _text(payload, "folder_id"), _optional_text(payload, "new_parent_id"), _optional_text(payload, "new_name")
        ).model_dump(mode="json"),
    )


def move_file(payload: Payload) -> Payload:
    return _run(
        payload,
        lambda fs, s: fs.move_file(
            _text(payload, "file_id"), _optional_text(payload, "new_folder_id"), _optional_text(payload, "new_name")
        ).model_dump(mode="json"),
    )


_OBJECT: Payload = {"type": "object"}

_OPERATIONS: tuple[tuple[str, str, Callable[[Payload], Payload]], ...] = (
    (
        "filesystem.register",
        "Register bytes (content_base64 or a path under the input root) at a caller-chosen placement",
        register,
    ),
    (
        "filesystem.sync_directory",
        "Register a directory tree under caller-chosen folders (dry run unless apply is true)",
        sync_directory,
    ),
    ("filesystem.upload_begin", "Presigned upload URL to a temporary key", upload_begin),
    ("filesystem.upload_finish", "Register uploaded bytes at a caller-chosen placement", upload_finish),
    ("filesystem.download", "Presigned download link for a registered version", download),
    ("filesystem.relate", "Record that one version was derived from another", relate),
    ("filesystem.lineage", "Ancestry and derivatives of a version", lineage),
    (
        "filesystem.change_access",
        "Give a folder and its subtree a new access class (needs a recorded authorization)",
        change_access,
    ),
    ("filesystem.move_folder", "Move or rename a folder; bytes follow the new registry path", move_folder),
    ("filesystem.move_file", "Move or rename a file; bytes follow the new registry path", move_file),
)


def register_filesystem(registry: OperationRegistry) -> None:
    for name, description, handler in _OPERATIONS:
        registry.register(Operation(name, VERSION, PACKAGE, description, handler, _OBJECT, concurrency=1))
