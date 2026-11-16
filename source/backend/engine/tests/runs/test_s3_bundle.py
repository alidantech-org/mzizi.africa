"""Seal, release and expire a bundle on disposable SeaweedFS and scratch databases."""

from collections.abc import Iterator
from contextlib import closing
from datetime import UTC, datetime, timedelta
from io import BytesIO
from pathlib import Path
from uuid import UUID, uuid4

import boto3
import pytest
from botocore.config import Config
from pymongo import MongoClient

from mzizi_engine.config import EngineConfig
from mzizi_engine.persistence.mongo.run_ledger import MongoRunLedger
from mzizi_engine.persistence.postgres.connection import connect
from mzizi_engine.persistence.postgres.reference import PostgresReference
from mzizi_engine.runtime.assembly.default_operations import build_operation_registry
from mzizi_engine.runtime.assembly.release import PlacementEntry, ReleaseManifest, plan_release, release_run
from mzizi_engine.runtime.assembly.run_storage import run_store
from mzizi_engine.runtime.runs.contracts.records import (
    ArtifactProvenance,
    ReleaseApproval,
    RunRecord,
    RunState,
    StageReceipt,
)
from mzizi_engine.runtime.runs.encode import spec_hash
from mzizi_engine.runtime.runs.lifecycle import expire_run, seal_run
from mzizi_engine.runtime.runs.parse import parse_job_spec
from mzizi_engine.runtime.runs.s3_store import S3RunStore
from mzizi_filesystem import Access, Retention
from mzizi_filesystem.features.placement.contracts import Placement

ENDPOINT = "http://127.0.0.1:32768"
POSTGRES = "postgres://postgres@127.0.0.1:5432/mzizi_phase3_scratch"
MONGO = "mongodb://127.0.0.1:27017"


@pytest.fixture
def s3_config(tmp_path: Path) -> Iterator[EngineConfig]:
    enabled = EngineConfig.load(Path("/dev/null"))
    if (
        enabled.s3 is None
        or enabled.s3.endpoint != ENDPOINT
        or enabled.s3.bucket != "mzizi-phase3-tests"
        or enabled.postgres is None
        or enabled.postgres.url != POSTGRES
        or enabled.mongo is None
        or enabled.mongo.url != MONGO
        or enabled.mongo.database != "mzizi_runs_test"
    ):
        pytest.skip("requires dedicated Phase 3 SeaweedFS, scratch Postgres, and local Mongo opt-in")
    bucket = "mzizi-phase3-" + uuid4().hex
    database = "mzizi_phase3_" + uuid4().hex
    client = boto3.client(
        "s3",
        endpoint_url=ENDPOINT,
        aws_access_key_id="isolated",
        aws_secret_access_key="isolated",
        region_name="us-east-1",
        config=Config(s3={"addressing_style": "path"}),
    )
    client.create_bucket(Bucket=bucket)
    try:
        yield EngineConfig.from_env(
            {
                "ENGINE_RUN_STORE": "s3",
                "ENGINE_RUN_LOCAL_ROOT": str(tmp_path),
                "ENGINE_RUN_LOG_RETENTION_DAYS": "2",
                "S3_ENDPOINT": ENDPOINT,
                "S3_BUCKET": bucket,
                "S3_ACCESS_KEY": "isolated",
                "S3_SECRET_KEY": "isolated",
                "S3_REGION": "us-east-1",
                "DATABASE_WRITE_URL": POSTGRES,
                "MZIZI_MONGO_URL": MONGO,
                "MZIZI_MONGO_DATABASE": database,
                "FILESYSTEM_PROTECTED_PREFIXES": "-",
                "FILESYSTEM_RESERVED_ROOTS": "tmp",
                "FILESYSTEM_TEMP_PREFIX": "private/tmp/",
            }
        )
    finally:
        with MongoClient[dict[str, str]](MONGO) as mongo:
            mongo.drop_database(database)
        for page in client.get_paginator("list_objects_v2").paginate(Bucket=bucket):
            keys = [{"Key": item["Key"]} for item in page.get("Contents", [])]
            if keys:
                client.delete_objects(Bucket=bucket, Delete={"Objects": keys})
        client.delete_bucket(Bucket=bucket)
        client.close()


def test_seal_multipart_promote_lineage_and_expire(s3_config: EngineConfig) -> None:
    registry = build_operation_registry()
    spec = parse_job_spec(
        '{"spec_version":1,"kind":"test","name":"fixture","stages":[{"operation":"scraping.crawl",'
        '"params":{"out_dir":"scratch","url":"http://127.0.0.1/"}}]}',
        registry,
    )
    store = run_store(s3_config)
    assert isinstance(store, S3RunStore)
    now = datetime.now(UTC)
    identifier = uuid4()
    record = RunRecord(
        run_id=identifier,
        spec_hash=spec_hash(spec),
        spec=spec,
        state=RunState.COMPLETED,
        requested_at=now,
        started_at=now,
        finished_at=now,
        stages_completed=1,
        run_store="s3",
    )
    ledger = MongoRunLedger(s3_config.require_mongo(), registry, log_retention_days=2)
    ledger.initialize()
    try:
        ledger.create(record)
        raw = store.put(
            identifier,
            "artifacts/raw.txt",
            BytesIO(b"evidence\n" * 1_100_000),
            ArtifactProvenance(media_type="text/plain", stage="crawl"),
        )
        assert s3_config.s3 is not None
        with closing(
            boto3.client(
                "s3",
                endpoint_url=ENDPOINT,
                aws_access_key_id="isolated",
                aws_secret_access_key="isolated",
                region_name="us-east-1",
                config=Config(s3={"addressing_style": "path"}),
            )
        ) as client:
            etag = client.head_object(Bucket=s3_config.s3.bucket, Key=store.object_key(identifier, raw.path))["ETag"]
            assert "-" in etag.strip('"')
        derived = store.put(
            identifier,
            "artifacts/derived.txt",
            BytesIO(b"derived\n"),
            ArtifactProvenance(media_type="text/plain", stage="crawl", derived_from=(raw.path,)),
        )
        log = store.put(
            identifier,
            "logs/event.jsonl.gz",
            BytesIO(b"test log"),
            ArtifactProvenance(media_type="application/gzip", stage="run"),
        )
        for item in (raw, derived):
            ledger.record_artifact(identifier, item)
        store.write_receipt(identifier, StageReceipt(index=0, files=(raw, derived)))
        manifest = seal_run(ledger, store, identifier, "fixture")
        assert seal_run(ledger, store, identifier, "fixture") == manifest
        assert {item.sha256 for item in manifest.files} == {raw.sha256, derived.sha256}
        assert manifest.logs[0].sha256 == log.sha256
        with pytest.raises(FileExistsError, match="sealed"):
            store.put(
                identifier,
                "artifacts/late.txt",
                BytesIO(b"late"),
                ArtifactProvenance(media_type="text/plain", stage="crawl"),
            )
        suffix = identifier.hex[:10]
        with connect(POSTGRES) as db:
            roles = PostgresReference(db).role_ids(("phase3_fixture", "phase3_derived_from"), create=True)
        destinations = ReleaseManifest(
            relation_kind_id=UUID(roles["phase3_derived_from"]),
            entries=tuple(
                PlacementEntry(
                    path=item.path,
                    placement=Placement(
                        folders=(f"phase3-{access.value}-{suffix}",),
                        file_name=name,
                        access=access,
                        retention=Retention.PRESERVE_HISTORY,
                        role_id=roles["phase3_fixture"],
                        authorization="Isolated loopback release for test",
                    ),
                )
                for item, name, access in (
                    (raw, "raw.txt", Access.PRIVATE),
                    (derived, "derived.txt", Access.PUBLIC),
                )
            ),
        )
        planned = plan_release(identifier, destinations, s3_config)
        assert len(planned.plan.files) == 2
        approval = ReleaseApproval(
            approver="fixture reviewer",
            method="human",
            reason="authorized test evidence",
            plan_hash=planned.plan_hash,
        )
        with pytest.raises(ValueError, match="approval is for a different release plan"):
            release_run(identifier, destinations, approval.model_copy(update={"plan_hash": "0" * 64}), s3_config)
        assert release_run(identifier, destinations, approval, s3_config).promoted == 2
        assert release_run(identifier, destinations, approval, s3_config).already_promoted
        with connect(POSTGRES) as db:
            assert db.execute(
                "select count(*) as n from filesystem.file_versions where s3_key like %s", (f"%{suffix}/%",)
            ).fetchone() == {"n": 2}
            assert db.execute(
                "select count(*) as n from filesystem.file_relations r join filesystem.file_versions v "
                "on v.id=r.derived_version_id where v.s3_key like %s",
                (f"%{suffix}/%",),
            ).fetchone() == {"n": 1}
        promoted = ledger.read(identifier)
        assert promoted is not None and promoted.state == RunState.PROMOTED and promoted.approval == approval
        assert expire_run(ledger, store, promoted, now=now + timedelta(days=3), run_days=1, log_days=2)
        assert store.list(identifier) == () and store.read_manifest(identifier) is None
        with MongoClient[dict[str, str]](MONGO) as mongo:
            permanent = mongo[s3_config.require_mongo().database]["run_summaries"].find_one(str(identifier))
            assert permanent is not None and permanent["manifestHash"] == promoted.manifest_hash
        assert ledger.read(identifier) is not None
    finally:
        ledger.close()


@pytest.mark.parametrize("operation", ["scraping.crawl", "site.watch"])
def test_kill_after_upload_replays_receipt_without_refetching(
    operation: str, s3_config: EngineConfig, monkeypatch: pytest.MonkeyPatch
) -> None:
    import json
    import sys
    from gzip import decompress
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
    from signal import SIGKILL
    from subprocess import run
    from threading import Thread

    from mzizi_engine.runtime.assembly.workers import submit_worker_run
    from mzizi_engine.runtime.runs.control import RunControl

    requests: list[str] = []

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            requests.append(self.path)
            robots = self.path == "/robots.txt"
            body = (
                b"User-agent: *\nDisallow:\n"
                if robots
                else b"<html><head><title>Fixture</title></head><body>hello</body></html>"
            )
            self.send_response(200)
            self.send_header("Content-Type", "text/plain" if robots else "text/html")
            self.end_headers()
            self.wfile.write(body)

    assert s3_config.s3 is not None and s3_config.runs.local_root is not None
    settings = {
        "MZIZI_ENV_FILE": "/dev/null",
        "ENGINE_ACTIVITY_STORE": "files",
        "ENGINE_RUN_STORE": "s3",
        "ENGINE_RUN_LOCAL_ROOT": str(s3_config.runs.local_root),
        "ENGINE_RUN_LOG_RETENTION_DAYS": "2",
        "S3_ENDPOINT": ENDPOINT,
        "S3_BUCKET": s3_config.s3.bucket,
        "S3_ACCESS_KEY": "isolated",
        "S3_SECRET_KEY": "isolated",
        "S3_REGION": "us-east-1",
        "MZIZI_MONGO_URL": MONGO,
        "MZIZI_MONGO_DATABASE": s3_config.require_mongo().database,
        "MZIZI_USER_AGENT": "MziziTest/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)",
        "ENGINE_HOST_REQUESTS_PER_SECOND": "5",
        "ENGINE_HOST_CONCURRENCY": "1",
        "ENGINE_HOST_DAILY_BUDGET": "10",
        "ENGINE_RUN_LEASE_SECONDS": "10",
    }
    for key, value in settings.items():
        monkeypatch.setenv(key, value)
    monkeypatch.delenv("ENGINE_REDIS_URL", raising=False)
    settings_config = EngineConfig.from_env(settings)
    registry = build_operation_registry()
    store = run_store(settings_config)
    assert isinstance(store, S3RunStore)
    ledger = MongoRunLedger(settings_config.require_mongo(), registry, log_retention_days=2)
    control = RunControl(ledger, 10, 3, 0, store, gzip_logs=True)
    harness = """
import os, signal, sys
from uuid import UUID
from mzizi_engine.config import EngineConfig
from mzizi_engine.runtime.assembly.workers import execute_worker
from mzizi_engine.runtime.runs.control import RunControl
RunControl.checkpoint = lambda *args: os.kill(os.getpid(), signal.SIGKILL)
execute_worker(UUID(sys.argv[1]), UUID(sys.argv[2]), EngineConfig.load())
"""
    try:
        with ThreadingHTTPServer(("127.0.0.1", 0), Handler) as server:
            thread = Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                url = f"http://127.0.0.1:{server.server_port}/page"
                params = {"url": url, "out_dir": "unused", "sitemap": False, "delay": 0, "max_pages": 1}
                if operation == "site.watch":
                    params.update({"download": False, "hunt": False})
                wire = json.dumps(
                    {
                        "spec_version": 1,
                        "kind": "collection",
                        "name": "crash-fixture",
                        "stages": [{"operation": operation, "params": params}],
                    }
                ).encode()
                created = submit_worker_run(wire, settings_config)
                first = control.claim(created)
                assert first is not None and first.lease_id is not None
                killed = run(
                    [sys.executable, "-c", harness, str(first.run_id), str(first.lease_id)],
                    check=False,
                    timeout=30,
                )
                assert killed.returncode == -SIGKILL
                interrupted = ledger.read(first.run_id)
                assert interrupted is not None and interrupted.stages_completed == 0
                receipt = store.read_receipt(first.run_id, 0)
                assert receipt is not None and receipt.files
                assert any(item.derived_from for item in receipt.files)
                retried = control.recover(interrupted, "fixture crash")
                assert retried is not None
                second = control.claim(retried)
                assert second is not None and second.lease_id is not None
                run(
                    [
                        sys.executable,
                        "-m",
                        "mzizi_engine.cli.main",
                        "worker",
                        "--run",
                        str(second.run_id),
                        "--lease",
                        str(second.lease_id),
                    ],
                    check=True,
                    timeout=30,
                )
                sealed = ledger.read(second.run_id)
                assert sealed is not None and sealed.state == RunState.SEALED and sealed.stages_completed == 1
                assert sealed.attempts == 2
                assert requests.count("/page") == 1
                assert store.list(second.run_id, "artifacts") == tuple(
                    sorted(receipt.files, key=lambda item: item.path)
                )
                for log in store.list(second.run_id, "logs"):
                    assert log.path.endswith(".jsonl.gz")
                    with store.open(second.run_id, log.path) as stream:
                        assert json.loads(decompress(stream.read()))["run_id"] == str(second.run_id)
                assert not (s3_config.runs.local_root / "worker-scratch" / str(second.run_id)).exists()
            finally:
                server.shutdown()
                thread.join()
    finally:
        ledger.close()
