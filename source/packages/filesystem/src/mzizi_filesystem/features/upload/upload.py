"""Two-step uploads: hand the client a presigned URL to a temporary key, then register the verified bytes.

The temporary key lives under `FilesystemConfig.temp_prefix`. Registration copies the bytes server-side to their real key, so
nothing large passes through this process, and the temporary object is removed afterwards.
"""

from __future__ import annotations

from uuid import uuid4

from pydantic import Field

from mzizi_filesystem.features.keys.keys import InvalidNameError, check_name
from mzizi_filesystem.features.register.contracts import Outcome, RegisterRequest, RegisterResult
from mzizi_filesystem.features.register.registrar import Registrar
from mzizi_filesystem.features.register.storage import StoredObject
from mzizi_filesystem.features.store.store import ObjectStore, StoreError
from mzizi_filesystem.shared.config import FilesystemConfig
from mzizi_filesystem.shared.contracts import Frozen


class UploadTicket(Frozen):
    temp_key: str
    url: str
    expires_seconds: int = Field(ge=1)


def begin_upload(
    store: ObjectStore, config: FilesystemConfig, file_name: str, content_type: str, expires_seconds: int
) -> UploadTicket:
    try:
        check_name(file_name)
    except InvalidNameError as problem:
        raise StoreError(str(problem)) from problem
    temp_key = f"{config.temp_prefix}{uuid4().hex}/{file_name}"
    return UploadTicket(
        temp_key=temp_key,
        url=store.presign_put(temp_key, content_type, expires_seconds),
        expires_seconds=expires_seconds,
    )


def finish_upload(
    registrar: Registrar, store: ObjectStore, config: FilesystemConfig, temp_key: str, request: RegisterRequest
) -> RegisterResult:
    """Register the uploaded bytes under the request's placement, then remove the temporary object."""
    if not temp_key.startswith(config.temp_prefix):
        raise StoreError(f"{temp_key} is not an upload key")
    if store.head(temp_key) is None:
        raise StoreError(f"nothing was uploaded to {temp_key}")
    result = registrar.register(request, StoredObject(key=temp_key))
    if result.outcome in (Outcome.CREATED, Outcome.UPDATED, Outcome.UNCHANGED, Outcome.DUPLICATE):
        store.delete(temp_key)
    return result


def discard_upload(store: ObjectStore, config: FilesystemConfig, temp_key: str) -> None:
    if not temp_key.startswith(config.temp_prefix):
        raise StoreError(f"{temp_key} is not an upload key")
    store.delete(temp_key)
