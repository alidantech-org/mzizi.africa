"""S3 store behavior with a stubbed client (no network), access-prefix rules and presign reachability."""
from __future__ import annotations

import pytest
from botocore.stub import Stubber

import boto3
from botocore.config import Config

from mzizi_filesystem import AccessError, S3ObjectStore, StoreError, check_key_matches_access, is_anonymously_readable, verify_upload
from mzizi_filesystem.store import MemoryObjectStore

ENV = {"S3_ENDPOINT": "http://192.168.100.13:18333", "S3_ACCESS_KEY": "test", "S3_SECRET_KEY": "test"}


def client(endpoint="http://192.168.100.13:18333"):
    return boto3.client("s3", endpoint_url=endpoint, aws_access_key_id="x", aws_secret_access_key="y", region_name="us-east-1", config=Config(signature_version="s3v4", s3={"addressing_style": "path"}))


def test_only_public_prefix_is_anonymous_and_keys_must_match_access():
    assert is_anonymously_readable("public/ke/a.pdf")
    for key in ("internal/seeds/a", "restricted/x", "private/x", "other/x", "publicity/x"):
        assert not is_anonymously_readable(key)
    check_key_matches_access("internal/seeds/a.csv", "internal")
    for key, access in (("public/a", "internal"), ("internal/a", "public"), ("/internal/a", "internal"), ("internal/../public/a", "internal")):
        with pytest.raises(AccessError):
            check_key_matches_access(key, access)
    with pytest.raises(AccessError):
        check_key_matches_access("internal/a", "secret")


def test_s3_store_uses_the_existing_bucket_only_and_needs_environment_credentials():
    with pytest.raises(StoreError, match="existing bucket"):
        S3ObjectStore(client=client(), bucket="another", environ=ENV)
    with pytest.raises(StoreError, match="S3_ENDPOINT"):
        S3ObjectStore(environ={})


def test_s3_head_put_and_missing_object_with_stubbed_responses():
    raw = client()
    store = S3ObjectStore(client=raw, bucket="mzizi", environ=ENV)
    with Stubber(raw) as stub:
        stub.add_client_error("head_object", service_error_code="404", http_status_code=404, expected_params={"Bucket": "mzizi", "Key": "internal/a"})
        assert store.head("internal/a") is None
        stub.add_response("put_object", {}, {"Bucket": "mzizi", "Key": "internal/a", "Body": b"abc", "ContentType": "text/plain", "Metadata": {"sha256": "h"}})
        store.put("internal/a", b"abc", "text/plain", "h")
        stub.add_response("head_object", {"ContentLength": 3, "Metadata": {"sha256": "h"}, "ContentType": "text/plain"}, {"Bucket": "mzizi", "Key": "internal/a"})
        head = store.head("internal/a")
        assert (head.size, head.sha256) == (3, "h")
        stub.assert_no_pending_responses()


def test_presigned_urls_use_the_public_endpoint_and_refuse_internal_hostnames():
    internal = client("http://object-storage:8333")
    with pytest.raises(StoreError, match="S3_PUBLIC_ENDPOINT is not set"):
        S3ObjectStore(client=internal, bucket="mzizi", environ=ENV).presign_get("private/x")
    docker = S3ObjectStore(client=internal, presign_client=client("http://object-storage:8333"), bucket="mzizi", public_endpoint="http://object-storage:8333", environ=ENV)
    with pytest.raises(StoreError, match="internal service name"):
        docker.presign_get("private/x")
    good = S3ObjectStore(client=internal, presign_client=client("https://res.alidantech.org"), bucket="mzizi", public_endpoint="https://res.alidantech.org", environ=ENV)
    url = good.presign_get("private/x", 60)
    assert url.startswith("https://res.alidantech.org/mzizi/private/x?") and "object-storage" not in url and "X-Amz-Signature" in url


def test_verify_upload_checks_length_hash_and_optionally_the_bytes():
    store = MemoryObjectStore()
    store.put("internal/a", b"abc", "text/plain", "wrong")
    with pytest.raises(StoreError, match="records hash"):
        verify_upload(store, "internal/a", b"abc")
    with pytest.raises(StoreError, match="not in the store"):
        verify_upload(store, "internal/missing", b"abc")
    from mzizi_filesystem import sha256_hex

    store.put("internal/b", b"abc", "text/plain", sha256_hex(b"abc"))
    verify_upload(store, "internal/b", b"abc", "get")
    store.put("internal/c", b"abx", "text/plain", sha256_hex(b"abc"))  # recorded hash is right, stored bytes are not
    verify_upload(store, "internal/c", b"abc")  # a head check trusts the recorded hash ...
    with pytest.raises(StoreError, match="do not match"):
        verify_upload(store, "internal/c", b"abc", "get")  # ... a get check does not
