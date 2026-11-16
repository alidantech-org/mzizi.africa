"""Download links and streams for registered versions. Who may download is the caller's decision."""

from __future__ import annotations

from typing import BinaryIO

from pydantic import Field

from mzizi_filesystem.features.registry.ports import RegistryRepository
from mzizi_filesystem.features.store.store import ObjectStore, StoreError
from mzizi_filesystem.shared.contracts import Frozen, VersionRecord


class DownloadLink(Frozen):
    version_id: str
    url: str
    s3_key: str
    sha256: str
    size_bytes: int = Field(ge=0)
    expires_seconds: int = Field(ge=1)


def _version(repository: RegistryRepository, version_id: str) -> VersionRecord:
    version = repository.get_version(version_id)
    if version is None:
        raise StoreError(f"version {version_id} does not exist")
    return version


def download_link(
    repository: RegistryRepository, store: ObjectStore, version_id: str, expires_seconds: int
) -> DownloadLink:
    version = _version(repository, version_id)
    return DownloadLink(
        version_id=version.id,
        url=store.presign_get(version.s3_key, expires_seconds),
        s3_key=version.s3_key,
        sha256=version.sha256,
        size_bytes=version.size_bytes,
        expires_seconds=expires_seconds,
    )


def open_version(repository: RegistryRepository, store: ObjectStore, version_id: str) -> tuple[BinaryIO, VersionRecord]:
    version = _version(repository, version_id)
    return store.open_stream(version.s3_key), version
