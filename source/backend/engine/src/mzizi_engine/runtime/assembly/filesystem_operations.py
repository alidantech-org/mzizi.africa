"""Runtime operations for the filesystem package (composition root wiring, not filesystem logic). Each opens a connection, builds the orchestrator and returns plain results.

Handlers are module-level so they can run in worker processes. The caller's task decides placement; nothing here names a folder.
The actor, when present, is stamped into `created_by` by the engine from the authenticated principal.
"""

from __future__ import annotations

import base64
from collections.abc import Callable
from pathlib import Path

from mzizi_engine.config import EngineConfig
from mzizi_engine.jsonvalue import Payload
from mzizi_engine.persistence.postgres.connection import Connection, connect
from mzizi_engine.persistence.postgres.filesystem import PostgresRegistry
from mzizi_engine.runtime.operations import Operation, OperationRegistry, Requirement
from mzizi_filesystem import (
    Access,
    FilesystemConfig,
    FilesystemOrchestrator,
    MediaCatalog,
    MemoryObjectStore,
    ObjectStore,
    RegisterRequest,
    S3ObjectStore,
    S3Settings,
)
from mzizi_filesystem.features.media.parse import load_media_formats
from mzizi_filesystem.features.register.storage import Source
from mzizi_filesystem.features.sync.sync import DirectorySpec

VERSION = "0.1.0"
PACKAGE = "mzizi-filesystem"


class _Wiring:
    """What a `filesystem.*` operation needs, built from the engine configuration: package settings and the file store."""

    def __init__(self, config: EngineConfig) -> None:
        postgres, rules, s3 = config.require_filesystem()
        s3 = None if config.memory_store else s3  # the in-memory store wins when it is selected
        self.database_url = postgres.url
        self.input_root = config.crawler.input_root
        self.media_formats_path = rules.media_formats_path
        self.config = FilesystemConfig(
            bucket=s3.bucket if s3 else "memory",
            region=s3.region if s3 else "memory",
            public_endpoint=s3.public_endpoint if s3 else None,
            protected_prefixes=rules.protected_prefixes,
            reserved_roots=rules.reserved_roots,
            temp_prefix=rules.temp_prefix,
        )
        self.store: ObjectStore = (
            S3ObjectStore(
                S3Settings(
                    endpoint=s3.endpoint,
                    public_endpoint=s3.public_endpoint,
                    access_key=s3.access_key,
                    secret_key=s3.secret_key,
                    bucket=s3.bucket,
                    region=s3.region,
                ),
                rules.protected_prefixes,
            )
            if s3
            else MemoryObjectStore(self.config.bucket, "memory://", rules.protected_prefixes)
        )


def _open(payload: Payload, action: Callable[[FilesystemOrchestrator, _Wiring, Connection], Payload]) -> Payload:
    """Open the connection and the orchestrator from the engine configuration and run one action inside the connection."""
    wiring = _Wiring(EngineConfig.load())
    catalog = MediaCatalog(load_media_formats(wiring.media_formats_path) if wiring.media_formats_path else {})
    with connect(wiring.database_url) as conn:
        orchestrator = FilesystemOrchestrator(wiring.config, PostgresRegistry(conn), wiring.store, catalog)
        return action(orchestrator, wiring, conn)


def _run(payload: Payload, action: Callable[[FilesystemOrchestrator, _Wiring], Payload]) -> Payload:
    return _open(payload, lambda fs, wiring, _: action(fs, wiring))


def _actor(payload: Payload) -> dict[str, str]:
    actor = payload.get("actor")
    return {"actor": actor} if isinstance(actor, str) else {}


def _request(payload: Payload, key: str = "request") -> RegisterRequest:
    raw = payload.get(key)
    if not isinstance(raw, dict):
        raise ValueError(f"{key!r} must be an object")
    request = RegisterRequest.model_validate(raw, strict=False)
    return request.model_copy(update={"created_by": {**request.created_by, **_actor(payload)}})


def _under_input_root(settings: _Wiring, relative: str) -> Path:
    if settings.input_root is None:
        raise ValueError("ENGINE_INPUT_ROOT must be set to read files by path")
    target = (settings.input_root / relative).resolve()
    if settings.input_root not in target.parents and target != settings.input_root:
        raise ValueError("path escapes the engine input root")
    return target


def _source(payload: Payload, settings: _Wiring) -> Source:
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
    def act(fs: FilesystemOrchestrator, settings: _Wiring) -> Payload:
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
    (
        "filesystem.change_access",
        "Give a folder and its subtree a new access class (needs a recorded authorization)",
        change_access,
    ),
    ("filesystem.move_folder", "Move or rename a folder; bytes follow the new registry path", move_folder),
    ("filesystem.move_file", "Move or rename a file; bytes follow the new registry path", move_file),
)


def register_filesystem(registry: OperationRegistry) -> None:
    requires = frozenset({Requirement.POSTGRES, Requirement.S3})
    for name, description, handler in _OPERATIONS:
        registry.register(
            Operation(name, VERSION, PACKAGE, description, handler, _OBJECT, concurrency=1, requires=requires)
        )
