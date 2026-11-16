"""The S3 adapter. Every setting arrives typed from the caller; nothing is read from the environment here."""

from __future__ import annotations

from collections.abc import Iterator, Mapping
from typing import Any, BinaryIO
from urllib.parse import urlparse

from pydantic import Field

from mzizi_filesystem.features.keys.keys import is_protected
from mzizi_filesystem.features.store.store import MultipartUpload, ObjectHead, StoreError
from mzizi_filesystem.shared.contracts import Frozen


class S3Settings(Frozen):
    endpoint: str = Field(min_length=1)
    #: The endpoint clients must use in presigned URLs; `None` disables presigning.
    public_endpoint: str | None
    access_key: str = Field(min_length=1, repr=False)
    secret_key: str = Field(min_length=1, repr=False)
    bucket: str = Field(min_length=1)
    region: str = Field(min_length=1)


def _internal_host(host: str) -> bool:
    """A single-label hostname (such as the Docker service name object-storage) cannot be reached by outside clients."""
    return "." not in host and host not in ("localhost",) and not host.replace(":", "").isdigit()


class S3ObjectStore:
    """boto3-backed store for an S3-compatible service (SeaweedFS). Never creates buckets or changes configuration."""

    def __init__(
        self,
        settings: S3Settings,
        protected_prefixes: tuple[str, ...],
        client: Any = None,
        presign_client: Any = None,
    ) -> None:
        self.bucket = settings.bucket
        self.public_endpoint = settings.public_endpoint
        self._protected = protected_prefixes
        self._client = client or self._make_client(settings, settings.endpoint)
        self._presign_client = presign_client or (
            self._make_client(settings, settings.public_endpoint) if settings.public_endpoint else None
        )

    @staticmethod
    def _make_client(settings: S3Settings, endpoint: str) -> Any:
        import boto3
        from botocore.config import Config

        return boto3.client(
            "s3",
            endpoint_url=endpoint,
            aws_access_key_id=settings.access_key,
            aws_secret_access_key=settings.secret_key,
            region_name=settings.region,
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

    def _writable(self, key: str) -> None:
        if is_protected(key, self._protected):
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
        if is_protected(key, self._protected):
            raise StoreError(f"refusing to delete protected key {key}")
        self._client.delete_object(Bucket=self.bucket, Key=key)

    def list_keys(self, prefix: str = "") -> Iterator[tuple[str, int]]:
        """(key, size) of every object under the prefix, paginated."""
        for page in self._client.get_paginator("list_objects_v2").paginate(Bucket=self.bucket, Prefix=prefix):
            for item in page.get("Contents", []):
                yield item["Key"], int(item["Size"])

    def delete_many(self, keys: list[str]) -> int:
        """Batch delete (1000 per request). Refuses any key under a protected prefix before sending anything."""
        protected = [k for k in keys if is_protected(k, self._protected)]
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

    def list_multipart(self, prefix: str) -> list[MultipartUpload]:
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
            status = (
                response.get("ResponseMetadata", {}).get("HTTPStatusCode") if isinstance(response, Mapping) else None
            )
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
            raise StoreError("no public endpoint is configured: refusing to sign a URL with the internal endpoint")
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
