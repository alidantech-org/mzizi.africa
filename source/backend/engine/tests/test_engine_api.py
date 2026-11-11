"""The engine API: health, capabilities, jobs (queue, retries, cancel, limits, worker processes), SSE replay, outbox, auth."""

from __future__ import annotations

import asyncio
import base64
import json
import os
import threading
import time

import httpx
import pytest
from engine_helpers import settings, wait_for

from mzizi_engine.capabilities import Capability, build_default_registry
from mzizi_engine.config import Settings
from mzizi_engine.executor import Executor
from mzizi_engine.store import MemoryStore


def job_done(client, job_id):
    return wait_for(
        lambda: (j := client.get(f"/v1/jobs/{job_id}").json())["status"] in ("succeeded", "failed", "cancelled") and j
    )


def csv_payload(text: str) -> dict:
    return {"content_base64": base64.b64encode(text.encode()).decode()}


def test_health_and_capabilities_list_the_registered_package_capabilities(make_client):
    client = make_client()
    health = client.get("/health").json()
    assert health["status"] == "ok" and health["service"] == "mzizi-engine" and health["capabilities"] >= 10
    names = [c["name"] for c in client.get("/capabilities").json()["capabilities"]]
    for expected in (
        "extraction.pdf",
        "extraction.csv",
        "scraping.links",
        "manifest.check_seeds",
        "filesystem.sync",
        "source.gate",
        "engine.process_info",
    ):
        assert expected in names
    capability = next(c for c in client.get("/capabilities").json()["capabilities"] if c["name"] == "extraction.pdf")
    assert capability["package"] == "mzizi-extraction" and capability["cpu_bound"] is True


def test_a_job_runs_a_package_capability_and_records_the_result(make_client):
    client = make_client()
    created = client.post("/v1/jobs", json={"kind": "extraction.csv", "input": csv_payload("code,name\nA,Alpha\n")})
    assert created.status_code == 202
    done = job_done(client, created.json()["id"])
    assert done["status"] == "succeeded" and done["result"]["segments"][0]["content"] == {"code": "A", "name": "Alpha"}
    links = client.post(
        "/v1/jobs",
        json={"kind": "scraping.links", "input": {"html": '<a href="/x">X</a>', "base_url": "https://example.org/"}},
    ).json()
    assert job_done(client, links["id"])["result"]["links"] == [{"url": "https://example.org/x", "text": "X"}]


def test_unknown_capabilities_are_rejected_and_idempotency_returns_the_same_job(make_client):
    client = make_client()
    assert client.post("/v1/jobs", json={"kind": "not.registered"}).status_code == 422
    body = {"kind": "extraction.json", "input": csv_payload('[{"a":1}]'), "idempotency_key": "k-1"}
    first, second = client.post("/v1/jobs", json=body).json(), client.post("/v1/jobs", json=body).json()
    assert first["id"] == second["id"] and first["created"] is True and second["created"] is False


def test_cpu_bound_capabilities_run_in_worker_processes(make_client):
    client = make_client()
    jobs = [client.post("/v1/jobs", json={"kind": "engine.process_info"}).json()["id"] for _ in range(3)]
    pids = {job_done(client, j)["result"]["pid"] for j in jobs}
    assert os.getpid() not in pids and pids


def test_retryable_failures_retry_with_backoff_and_non_retryable_ones_fail_at_once(make_client):
    attempts = {"flaky": 0, "bad": 0}

    def flaky(payload):
        attempts["flaky"] += 1
        if attempts["flaky"] < 3:
            raise RuntimeError("transient")
        return {"ok": True}

    def bad(payload):
        attempts["bad"] += 1
        raise ValueError("invalid input")

    registry = build_default_registry()
    registry.register(Capability("test.flaky", "1", "tests", "fails twice", flaky, {}))
    registry.register(Capability("test.bad", "1", "tests", "always invalid", bad, {}))
    client = make_client(registry)
    good = job_done(client, client.post("/v1/jobs", json={"kind": "test.flaky"}).json()["id"])
    assert good["status"] == "succeeded" and good["attempts"] == 3
    failed = job_done(client, client.post("/v1/jobs", json={"kind": "test.bad"}).json()["id"])
    assert failed["status"] == "failed" and failed["attempts"] == 1 and "ValueError" in failed["error"]


def test_a_running_job_can_be_cancelled_and_a_queued_job_never_starts(make_client):
    gate = threading.Event()
    registry = build_default_registry()
    registry.register(
        Capability("test.slow", "1", "tests", "blocks", lambda payload: gate.wait(5) or {}, {}, concurrency=1)
    )
    client = make_client(registry)
    running = client.post("/v1/jobs", json={"kind": "test.slow"}).json()["id"]
    queued = client.post("/v1/jobs", json={"kind": "test.slow"}).json()["id"]
    wait_for(lambda: client.get(f"/v1/jobs/{running}").json()["status"] == "running")
    assert client.post(f"/v1/jobs/{queued}/cancel").json()["status"] in ("queued", "cancelled")
    assert client.post(f"/v1/jobs/{running}/cancel").status_code == 200
    assert job_done(client, running)["status"] == "cancelled"
    gate.set()
    wait_for(lambda: client.get(f"/v1/jobs/{queued}").json()["status"] == "cancelled")


def test_per_capability_concurrency_limits_bound_parallelism(make_client):
    registry = build_default_registry()
    registry.register(
        Capability("test.sleep", "1", "tests", "sleeps", lambda payload: time.sleep(0.15) or {}, {}, concurrency=2)
    )
    client = make_client(registry)
    ids = [client.post("/v1/jobs", json={"kind": "test.sleep"}).json()["id"] for _ in range(6)]
    for i in ids:
        job_done(client, i)
    assert client.app.state.executor.peak_active == 2


def test_events_are_ordered_and_replay_from_a_cursor_for_watchers(make_client):
    client = make_client()
    job = client.post("/v1/jobs", json={"kind": "extraction.csv", "input": csv_payload("a\n1\n")}).json()
    job_done(client, job["id"])

    def read(url):
        frames = client.get(url).text.split("\n\n")
        return [
            dict(line.split(": ", 1) for line in f.split("\n") if ": " in line and not line.startswith(":"))
            for f in frames
            if f.strip() and not f.startswith(":")
        ]

    events = read("/v1/events?after=0&once=true")
    kinds = [e["event"] for e in events]
    assert kinds[:1] == ["job.queued"] and "job.started" in kinds and kinds[-1] == "job.succeeded"
    ids = [int(e["id"]) for e in events]
    assert ids == sorted(ids) and len(set(ids)) == len(ids)
    resumed = read(f"/v1/events?after={ids[1]}&once=true")
    assert [int(e["id"]) for e in resumed] == ids[2:]
    assert json.loads(events[0]["data"])["job_id"] == job["id"]
    assert read(f"/v1/events?job_id={job['id']}&once=true") == events


def test_interrupted_jobs_are_requeued_and_finish_after_a_restart():
    store = MemoryStore()
    registry = build_default_registry()
    job, _ = store.create_job("extraction.csv", csv_payload("a\n1\n"), None, None, None, 3)
    store.update_job(job["id"], status="running")  # the engine died while it ran

    async def scenario():
        ex = Executor(store, registry, settings())
        await ex.start()
        for _ in range(200):
            if store.get_job(job["id"])["status"] == "succeeded":
                break
            await asyncio.sleep(0.02)
        kinds = [e["kind"] for e in store.events]
        await ex.stop()
        return kinds

    kinds = asyncio.run(scenario())
    assert store.get_job(job["id"])["status"] == "succeeded" and "engine.recovered" in kinds


def test_the_outbox_delivers_with_an_idempotency_key_retries_and_stops_after_the_limit():
    store = MemoryStore()
    calls = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append((request.headers["idempotency-key"], request.headers.get("authorization")))
        return httpx.Response(500 if len(calls) == 1 else 200)

    async def scenario():
        client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
        ex = Executor(
            store,
            build_default_registry(),
            settings(callback_url="http://nestjs.local/callbacks", callback_token="svc-token", retry_base_seconds=0.0),
            client,
        )
        await ex._emit("job.succeeded", None, None, {"x": 1})
        first = await ex.deliver_due()
        second = await ex.deliver_due()
        return first, second

    first, second = asyncio.run(scenario())
    assert (first, second) == (0, 1) and calls[0] == ("event-1", "Bearer svc-token") and calls[1][0] == "event-1"
    assert [o["status"] for o in store.outbox.values()] == ["delivered"]

    dead_store = MemoryStore()

    async def always_failing():
        client = httpx.AsyncClient(transport=httpx.MockTransport(lambda r: httpx.Response(503)))
        ex = Executor(
            dead_store,
            build_default_registry(),
            settings(callback_url="http://nestjs.local/callbacks", retry_base_seconds=0.0),
            client,
        )
        await ex._emit("job.failed", None, None, {})
        for _ in range(10):
            await ex.deliver_due()

    asyncio.run(always_failing())
    assert [o["status"] for o in dead_store.outbox.values()] == ["dead"] and next(iter(dead_store.outbox.values()))[
        "attempts"
    ] == 8


class FakeAuthority:
    def __init__(self, accounts, permissions):
        self.accounts, self.permissions = accounts, permissions

    async def resolve(self, issuer, subject):
        return self.accounts.get((issuer, subject), (None, "unknown_identity"))

    async def can(self, account_id, permission):
        return permission in self.permissions.get(account_id, set())


def test_authentication_and_authorization_use_the_auth_schema_contract(make_client):
    async def verifier(token):
        if token == "bad":
            from fastapi import HTTPException

            raise HTTPException(401, "invalid or expired token")
        return "https://sso.example.test", token

    authority = FakeAuthority(
        {
            ("https://sso.example.test", "reader"): ("acct-r", "ok"),
            ("https://sso.example.test", "editor"): ("acct-e", "ok"),
            ("https://sso.example.test", "blocked"): ("acct-b", "account_not_active"),
        },
        {"acct-r": {"engine.read"}, "acct-e": {"engine.read", "engine.edit"}, "acct-b": {"engine.read"}},
    )
    client = make_client(
        settings=settings(auth="oidc", issuer="https://sso.example.test"), authority=authority, verifier=verifier
    )
    bearer = lambda t: {"Authorization": f"Bearer {t}"}
    assert client.get("/health").status_code == 200
    assert client.get("/capabilities").status_code == 401
    assert client.get("/capabilities", headers=bearer("bad")).status_code == 401
    assert client.get("/capabilities", headers=bearer("stranger")).status_code == 401
    assert client.get("/capabilities", headers=bearer("blocked")).status_code == 403
    assert client.get("/capabilities", headers=bearer("reader")).status_code == 200
    assert (
        client.post(
            "/v1/jobs", json={"kind": "extraction.csv", "input": csv_payload("a\n1\n")}, headers=bearer("reader")
        ).status_code
        == 403
    )
    submitted = client.post(
        "/v1/jobs", json={"kind": "extraction.csv", "input": csv_payload("a\n1\n")}, headers=bearer("editor")
    )
    assert submitted.status_code == 202 and submitted.json()["requested_by"] == "acct-e"


def test_a_sync_through_the_engine_is_a_dry_run_by_default_and_the_actor_cannot_be_spoofed(make_client):
    from mzizi_database import rewrite_url

    client = make_client(settings=settings(database_url=rewrite_url()))
    job = client.post("/v1/filesystem/sync", json={"manifest": "manifest.yaml"}).json()
    done = job_done(client, job["id"])
    assert (
        done["status"] == "succeeded"
        and done["result"]["dry_run"] is True
        and done["result"]["ok"] is True
        and done["result"]["files"]
    )
    assert done["input"]["actor"] is None
    spoof = client.post(
        "/v1/jobs",
        json={
            "kind": "filesystem.sync",
            "input": {
                "manifest": str(__import__("mzizi_manifest").paths.SEED_ROOT / "manifest.yaml"),
                "actor": "someone-else",
            },
        },
    ).json()
    assert job_done(client, spoof["id"])["input"]["actor"] is None
    assert client.post("/v1/filesystem/sync", json={"manifest": "../../etc/passwd"}).status_code == 422
    check = client.post("/v1/manifests/validate").json()
    assert check["ok"] is True and check["entries"] > 40


def test_settings_refuse_unauthenticated_mode_off_loopback():
    with pytest.raises(ValueError, match="loopback"):
        Settings(auth="off", host="0.0.0.0").check()
    Settings(auth="off", host="127.0.0.1").check()
    assert Settings.from_env(
        {"ENGINE_CAPABILITY_LIMITS": "extraction.pdf=2,scraping.links=5", "DATABASE_URL": "postgres://x/mzizi_new"}
    ).limits == {"extraction.pdf": 2, "scraping.links": 5}
