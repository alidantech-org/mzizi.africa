"""Object stores: the interface, an in-memory store for tests and the S3 (SeaweedFS) store.

Configuration comes from the existing environment only (never from files in Git):
  S3_ENDPOINT          endpoint this process reaches the store at (laptop http://192.168.100.13:18333, Docker http://object-storage:8333)
  S3_PUBLIC_ENDPOINT   endpoint clients must use in presigned URLs (an internal Docker hostname is refused for presigning)
  S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET (default mzizi), S3_REGION (default us-east-1)
"""

from __future__ import annotations

import os
from collections.abc import Iterator, Mapping
from dataclasses import dataclass
from typing import Any, BinaryIO, Protocol
from urllib.parse import urlparse

from .access import BUCKET, REGION
from .hashing import sha256_hex


@dataclass(frozen=True)
class ObjectHead:
    size: int
    sha256: str | None
    content_type: str | None = None


class StoreError(RuntimeError):
    pass


class ObjectStore(Protocol):
    bucket: str

    def head(self, key: str) -> ObjectHead | None: ...
    def put(self, key: str, data: bytes, content_type: str, sha256: str, cache_control: str | None = None) -> None: ...
    def put_path(self, key: str, path: str, content_type: str, sha256: str) -> None: ...
    def get(self, key: str) -> bytes: ...
    def open_stream(self, key: str) -> BinaryIO: ...
    def copy(self, source_key: str, dest_key: str, content_type: str, sha256: str) -> None: ...
    def delete(self, key: str) -> None: ...
    def presign_get(self, key: str, expires_seconds: int = 900) -> str: ...
    def presign_put(self, key: str, content_type: str, expires_seconds: int = 900) -> str: ...
    def list_keys(self, prefix: str = "") -> Iterator[tuple[str, int]]: ...
    def delete_many(self, keys: list[str]) -> int: ...
    def list_multipart(self, prefix: str) -> list[dict]: ...
    def abort_multipart(self, key: str, upload_id: str) -> None: ...


class MemoryObjectStore:
    """Deterministic in-memory store with fault injection, used by the mocked-S3 tests."""

    def __init__(self, bucket: str = BUCKET, public_endpoint: str = "https://res.alidantech.org") -> None:
        self.bucket = bucket
        self.public_endpoint = public_endpoint
        self.objects: dict[str, tuple[bytes, str, str, str | None]] = {}
        self.puts: list[str] = []
        self.deleted: list[str] = []
        self.aborted: list[tuple[str, str]] = []
        self.multiparts: list[dict] = []
        self.fail_next_puts = 0
        self.corrupt_next_puts = 0

    def head(self, key: str) -> ObjectHead | None:
        found = self.objects.get(key)
        return ObjectHead(len(found[0]), found[2], found[1]) if found else None

    def put(self, key: str, data: bytes, content_type: str, sha256: str, cache_control: str | None = None) -> None:
        from .keys import is_protected

        if is_protected(key):
            raise StoreError(f"refusing to write protected key {key}")
        if self.fail_next_puts:
            self.fail_next_puts -= 1
            raise StoreError("injected put failure")
        if self.corrupt_next_puts:
            self.corrupt_next_puts -= 1
            data = data[:-1]
        self.puts.append(key)
        self.objects[key] = (data, content_type, sha256, cache_control)

    def put_path(self, key: str, path: str, content_type: str, sha256: str) -> None:
        with open(path, "rb") as handle:
            self.put(key, handle.read(), content_type, sha256)

    def get(self, key: str) -> bytes:
        if key not in self.objects:
            raise StoreError(f"no such key {key}")
        return self.objects[key][0]

    def open_stream(self, key: str) -> BinaryIO:
        import io

        return io.BytesIO(self.get(key))

    def copy(self, source_key: str, dest_key: str, content_type: str, sha256: str) -> None:
        self.put(dest_key, self.get(source_key), content_type, sha256)

    def delete(self, key: str) -> None:
        from .keys import is_protected

        if is_protected(key):
            raise StoreError(f"refusing to delete protected key {key}")
        self.deleted.append(key)
        self.objects.pop(key, None)

    def list_keys(self, prefix: str = "") -> Iterator[tuple[str, int]]:
        return iter(sorted((k, len(v[0])) for k, v in self.objects.items() if k.startswith(prefix)))

    def delete_many(self, keys: list[str]) -> int:
        for key in keys:
            self.delete(key)
        return len(keys)

    def presign_get(self, key: str, expires_seconds: int = 900) -> str:
        return f"{self.public_endpoint}/{self.bucket}/{key}?expires={expires_seconds}"

    def presign_put(self, key: str, content_type: str, expires_seconds: int = 900) -> str:
        return f"{self.public_endpoint}/{self.bucket}/{key}?upload=1&expires={expires_seconds}"

    def list_multipart(self, prefix: str) -> list[dict]:
        return [m for m in self.multiparts if m["Key"].startswith(prefix)]

    def abort_multipart(self, key: str, upload_id: str) -> None:
        self.multiparts = [m for m in self.multiparts if not (m["Key"] == key and m["UploadId"] == upload_id)]
        self.aborted.append((key, upload_id))


def _internal_host(host: str) -> bool:
    """A single-label hostname (such as the Docker service name object-storage) cannot be reached by outside clients."""
    return "." not in host and host not in ("localhost",) and not host.replace(":", "").isdigit()


class S3ObjectStore:
    """boto3-backed store for the existing SeaweedFS S3 service. Never creates buckets or changes configuration."""

    def __init__(
        self,
        client: Any = None,
        presign_client: Any = None,
        bucket: str | None = None,
        public_endpoint: str | None = None,
        environ: Mapping[str, str] | None = None,
    ) -> None:
        env = environ if environ is not None else os.environ
        self.bucket = bucket or env.get("S3_BUCKET", BUCKET)
        if self.bucket != BUCKET:
            raise StoreError(f"only the existing bucket {BUCKET!r} may be used, not {self.bucket!r}")
        self.public_endpoint = public_endpoint or env.get("S3_PUBLIC_ENDPOINT")
        self._client = client or self._make_client(env, env.get("S3_ENDPOINT"))
        self._presign_client = presign_client or (
            self._make_client(env, self.public_endpoint) if self.public_endpoint else None
        )

    @staticmethod
    def _make_client(env: Mapping[str, str], endpoint: str | None) -> Any:
        import boto3
        from botocore.config import Config

        if not endpoint or not env.get("S3_ACCESS_KEY") or not env.get("S3_SECRET_KEY"):
            raise StoreError("S3_ENDPOINT, S3_ACCESS_KEY and S3_SECRET_KEY must be set in the environment")
        return boto3.client(
            "s3",
            endpoint_url=endpoint,
            aws_access_key_id=env["S3_ACCESS_KEY"],
            aws_secret_access_key=env["S3_SECRET_KEY"],
            region_name=env.get("S3_REGION", REGION),
            config=Config(
                signature_version="s3v4",
                s3={"addressing_style": "path"},
                retries={"max_attempts": 3, "mode": "standard"},
            ),
        )

    def head(self, key: str) -> ObjectHead | None:
        from botocore.exceptions import ClientError

        try:
            response = self._client.head_object(Bucket=self.bucket, Key=key)
        except ClientError as error:
            if error.response.get("Error", {}).get("Code") in ("404", "NoSuchKey", "NotFound"):
                return None
            raise StoreError(str(error)) from error
        return ObjectHead(
            int(response["ContentLength"]), (response.get("Metadata") or {}).get("sha256"), response.get("ContentType")
        )

    def put(self, key: str, data: bytes, content_type: str, sha256: str, cache_control: str | None = None) -> None:
        self._writable(key)
        extra = {"CacheControl": cache_control} if cache_control else {}
        self._client.put_object(
            Bucket=self.bucket, Key=key, Body=data, ContentType=content_type, Metadata={"sha256": sha256}, **extra
        )

    def put_path(self, key: str, path: str, content_type: str, sha256: str) -> None:
        """Streaming upload (multipart automatically for large files); the file is never loaded into memory."""
        self._writable(key)
        self._client.upload_file(
            path, self.bucket, key, ExtraArgs={"ContentType": content_type, "Metadata": {"sha256": sha256}}
        )

    def get(self, key: str) -> bytes:
        return self._client.get_object(Bucket=self.bucket, Key=key)["Body"].read()

    def open_stream(self, key: str) -> BinaryIO:
        return self._client.get_object(Bucket=self.bucket, Key=key)["Body"]

    @staticmethod
    def _writable(key: str) -> None:
        from .keys import is_protected

        if is_protected(key):
            raise StoreError(f"refusing to write protected key {key}")

    def copy(self, source_key: str, dest_key: str, content_type: str, sha256: str) -> None:
        self._writable(dest_key)
        self._client.copy(
            {"Bucket": self.bucket, "Key": source_key},
            self.bucket,
            dest_key,
            ExtraArgs={"ContentType": content_type, "Metadata": {"sha256": sha256}, "MetadataDirective": "REPLACE"},
        )

    def delete(self, key: str) -> None:
        from .keys import is_protected

        if is_protected(key):
            raise StoreError(f"refusing to delete protected key {key}")
        self._client.delete_object(Bucket=self.bucket, Key=key)

    def list_keys(self, prefix: str = "") -> Iterator[tuple[str, int]]:
        """(key, size) of every object under the prefix, paginated."""
        for page in self._client.get_paginator("list_objects_v2").paginate(Bucket=self.bucket, Prefix=prefix):
            for item in page.get("Contents", []):
                yield item["Key"], int(item["Size"])

    def delete_many(self, keys: list[str]) -> int:
        """Batch delete (1000 per request). Refuses any key under a protected prefix before sending anything."""
        from .keys import is_protected

        protected = [k for k in keys if is_protected(k)]
        if protected:
            raise StoreError(f"refusing to delete protected keys, for example {protected[0]}")
        done = 0
        for start in range(0, len(keys), 1000):
            batch = keys[start : start + 1000]
            out = self._client.delete_objects(
                Bucket=self.bucket, Delete={"Objects": [{"Key": k} for k in batch], "Quiet": True}
            )
            if out.get("Errors"):
                raise StoreError(f"delete failed for {len(out['Errors'])} keys, first: {out['Errors'][0]}")
            done += len(batch)
        return done

    def list_multipart(self, prefix: str) -> list[dict]:
        out = self._client.list_multipart_uploads(Bucket=self.bucket, Prefix=prefix)
        return [
            {"Key": u["Key"], "UploadId": u["UploadId"], "Initiated": u.get("Initiated")}
            for u in out.get("Uploads", [])
        ]

    def abort_multipart(self, key: str, upload_id: str) -> None:
        try:
            self._client.abort_multipart_upload(Bucket=self.bucket, Key=key, UploadId=upload_id)
        except Exception as error:
            # Cleanup retries may repeat after the store accepted the first abort but
            # the database acknowledgement was lost. Missing uploads are already clean.
            response = getattr(error, "response", {})
            code = response.get("Error", {}).get("Code") if isinstance(response, Mapping) else None
            status = response.get("ResponseMetadata", {}).get("HTTPStatusCode") if isinstance(response, Mapping) else None
            if code not in ("NoSuchUpload", "NoSuchKey", "NotFound", "404") and status != 404:
                raise

    def presign_put(self, key: str, content_type: str, expires_seconds: int = 900) -> str:
        return self._require_public_endpoint().generate_presigned_url(
            "put_object",
            Params={"Bucket": self.bucket, "Key": key, "ContentType": content_type},
            ExpiresIn=expires_seconds,
        )

    def _require_public_endpoint(self) -> Any:
        """The client that signs URLs for the public endpoint; refuses when only the internal endpoint is configured."""
        if self._presign_client is None:
            raise StoreError("S3_PUBLIC_ENDPOINT is not set: refusing to sign a URL with the internal endpoint")
        host = urlparse(self.public_endpoint or "").hostname or ""
        if _internal_host(host):
            raise StoreError(
                f"public endpoint host {host!r} looks like an internal service name; clients cannot reach it"
            )
        return self._presign_client

    def presign_get(self, key: str, expires_seconds: int = 900) -> str:
        """A presigned download URL signed against the public endpoint, so the host is reachable by the intended client."""
        return self._require_public_endpoint().generate_presigned_url(
            "get_object", Params={"Bucket": self.bucket, "Key": key}, ExpiresIn=expires_seconds
        )


def verify_upload(store: ObjectStore, key: str, data: bytes, mode: str = "head") -> None:
    """Confirms a stored object is what was meant: length and recorded hash (head), or the bytes themselves (get)."""
    expected = sha256_hex(data)
    head = store.head(key)
    if head is None:
        raise StoreError(f"verification failed: {key} is not in the store")
    if head.size != len(data):
        raise StoreError(f"verification failed: {key} has {head.size} bytes, expected {len(data)}")
    if head.sha256 is not None and head.sha256 != expected:
        raise StoreError(f"verification failed: {key} records hash {head.sha256}, expected {expected}")
    if mode == "get" and sha256_hex(store.get(key)) != expected:
        raise StoreError(f"verification failed: bytes read back from {key} do not match")
