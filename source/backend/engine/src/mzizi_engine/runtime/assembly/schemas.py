"""Publish the schema files to the public prefix of the object store, with no database involved."""

import hashlib
import urllib.error
import urllib.request
from enum import StrEnum

from mzizi_engine.config import EngineConfig
from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_filesystem.features.store.s3 import S3ObjectStore, S3Settings
from mzizi_manifest.features.publish.schema_publication import BASE_URL, KEY_PREFIX, plan
from mzizi_manifest.shared.paths import SCHEMA_ROOT

CACHE_CONTROL = "public, max-age=300"
FETCH_TIMEOUT_SECONDS = 15


class PublishAction(StrEnum):
    PLANNED = "planned"
    UPLOADED = "uploaded"
    UNCHANGED = "unchanged"
    #: An object under the public schema prefix that no schema file produces any more (an old URL).
    ORPHAN = "orphan"
    DELETED = "deleted"


class PublishedSchema(Frozen):
    key: str
    url: str
    action: PublishAction
    #: HTTP status of an anonymous read of the public URL, or None when it was not checked.
    public_status: int | None = None
    public_matches: bool | None = None


def _read_public(url: str) -> tuple[int, str | None]:
    try:
        with urllib.request.urlopen(url, timeout=FETCH_TIMEOUT_SECONDS) as response:
            return response.status, hashlib.sha256(response.read()).hexdigest()
    except urllib.error.HTTPError as problem:
        return problem.code, None
    except OSError:
        return 0, None


def publish_schemas(config: EngineConfig, *, dry_run: bool, prune: bool = False) -> tuple[PublishedSchema, ...]:
    """Upload every changed schema, then read each public URL anonymously to prove it resolves to the same bytes.

    Objects under the public prefix that no schema produces any more are reported as orphans and deleted only with `prune`.
    """
    items = plan(SCHEMA_ROOT)
    if dry_run:
        return tuple(PublishedSchema(key=i.key, url=i.url, action=PublishAction.PLANNED) for i in items)
    s3 = config.require_s3()
    if s3 is None:
        raise ValueError("Publishing schemas needs S3_ENDPOINT, S3_BUCKET, S3 credentials and S3_REGION")
    protected = config.filesystem.protected_prefixes if config.filesystem else ()
    store = S3ObjectStore(
        S3Settings(
            endpoint=s3.endpoint,
            public_endpoint=s3.public_endpoint,
            access_key=s3.access_key,
            secret_key=s3.secret_key,
            bucket=s3.bucket,
            region=s3.region,
        ),
        protected,
    )
    results = []
    for item in items:
        head = store.head(item.key)
        if head is not None and head.sha256 == item.sha256:
            action = PublishAction.UNCHANGED
        else:
            store.put(item.key, item.path.read_bytes(), item.content_type, item.sha256, CACHE_CONTROL)
            action = PublishAction.UPLOADED
        status, digest = _read_public(item.url)
        results.append(
            PublishedSchema(
                key=item.key,
                url=item.url,
                action=action,
                public_status=status,
                public_matches=digest == item.sha256 if digest else False,
            )
        )
    planned = {item.key for item in items}
    for key, _size in sorted(store.list_keys(f"{KEY_PREFIX}/")):
        if key in planned:
            continue
        if prune:
            store.delete(key)
        results.append(
            PublishedSchema(
                key=key,
                url=f"{BASE_URL}/{key.removeprefix(KEY_PREFIX + '/')}",
                action=PublishAction.DELETED if prune else PublishAction.ORPHAN,
            )
        )
    return tuple(results)
