"""The engine's operational API (FastAPI). Local only: called by the NestJS API, repository scripts and agents.

It exposes health, capabilities, jobs, runs, an SSE event stream and manifest/seed operations. It makes no product
decisions, has no UI and no user accounts, and never writes domain schemas: results flow to NestJS through the outbox.
"""

from __future__ import annotations

import asyncio
import json
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import httpx
from fastapi import FastAPI, Header, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from . import __version__
from .auth import Authority, DatabaseAuthority, Principal, TokenVerifier, oidc_verifier, require
from .capabilities import CapabilityRegistry, build_default_registry
from .config import Settings
from .executor import Executor
from .filesystem_api import router as filesystem_router
from .store import MemoryStore, PostgresStore, Store


class JobRequest(BaseModel):
    kind: str
    input: dict[str, Any] = Field(default_factory=dict)
    idempotency_key: str | None = None
    run_id: str | None = None


class RunRequest(BaseModel):
    name: str


def _store(settings: Settings) -> Store:
    if settings.store == "postgres":
        from mzizi_database import connect

        url = settings.database_url
        return PostgresStore(lambda: connect(url, autocommit=True))
    return MemoryStore()


def create_app(
    settings: Settings | None = None,
    store: Store | None = None,
    registry: CapabilityRegistry | None = None,
    authority: Authority | None = None,
    verifier: TokenVerifier | None = None,
    callback_client: httpx.AsyncClient | None = None,
) -> FastAPI:
    settings = settings or Settings.from_env()
    settings.check()
    registry = registry or build_default_registry()
    store = store or _store(settings)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        app.state.executor = Executor(store, registry, settings, callback_client)
        await app.state.executor.start()
        yield
        await app.state.executor.stop()

    app = FastAPI(title="Mzizi engine", version=__version__, lifespan=lifespan)
    app.state.settings, app.state.registry, app.state.store = settings, registry, store
    app.state.authority = authority or (DatabaseAuthority(settings.database_url) if settings.database_url else None)
    app.state.verifier = verifier or oidc_verifier(settings)

    @app.get("/health")
    async def health() -> dict:
        ex: Executor = app.state.executor
        return {
            "status": "ok",
            "service": "mzizi-engine",
            "version": __version__,
            "store": settings.store,
            "auth": settings.auth,
            "capabilities": len(registry.names()),
            "active_jobs": ex.active,
        }

    @app.get("/capabilities")
    async def capabilities(_: Principal = require("engine.read")) -> dict:
        return {"capabilities": registry.describe()}

    @app.post("/v1/runs", status_code=201)
    async def create_run(body: RunRequest, principal: Principal = require("engine.edit")) -> dict:
        return await asyncio.to_thread(store.create_run, body.name, principal.account_id)

    @app.get("/v1/runs/{run_id}")
    async def get_run(run_id: str, _: Principal = require("engine.read")) -> dict:
        run = await asyncio.to_thread(store.get_run, run_id)
        if run is None:
            raise HTTPException(404, "no such run")
        return run

    @app.post("/v1/jobs", status_code=202)
    async def submit_job(body: JobRequest, principal: Principal = require("engine.edit")) -> dict:
        payload = dict(body.input)
        if body.kind.startswith("filesystem."):
            payload["actor"] = (
                principal.account_id
            )  # the actor is the authenticated principal, never a client-supplied value
            payload["database_url"] = settings.database_url
        try:
            job, created = await app.state.executor.submit(
                body.kind, payload, body.idempotency_key, principal.account_id, body.run_id
            )
        except KeyError:
            raise HTTPException(422, f"unknown capability {body.kind!r}; see GET /capabilities") from None
        return {**job, "created": created}

    @app.get("/v1/jobs")
    async def list_jobs(
        status: str | None = None, limit: int = Query(100, le=500), _: Principal = require("engine.read")
    ) -> dict:
        return {"jobs": await asyncio.to_thread(store.list_jobs, status, limit)}

    @app.get("/v1/jobs/{job_id}")
    async def get_job(job_id: str, _: Principal = require("engine.read")) -> dict:
        job = await asyncio.to_thread(store.get_job, job_id)
        if job is None:
            raise HTTPException(404, "no such job")
        return job

    @app.post("/v1/jobs/{job_id}/cancel")
    async def cancel_job(job_id: str, _: Principal = require("engine.edit")) -> dict:
        job = await app.state.executor.cancel(job_id)
        if job is None:
            raise HTTPException(404, "no such job")
        return job

    @app.post("/v1/manifests/validate")
    async def validate_manifests(_: Principal = require("engine.read")) -> dict:
        from .capabilities import manifest_check_seeds

        return await asyncio.to_thread(manifest_check_seeds, {})

    @app.get("/v1/events")
    async def events(
        request: Request,
        after: int | None = None,
        job_id: str | None = None,
        once: bool = False,
        last_event_id: str | None = Header(default=None),
        _: Principal = require("engine.read"),
    ) -> StreamingResponse:
        """Server-sent events. Resume with `after` or the Last-Event-ID header: missed events replay from the store first. `once=true` ends after the replay (for scripts and tests)."""
        cursor = after if after is not None else int(last_event_id) if last_event_id and last_event_id.isdigit() else 0
        queue = app.state.executor.subscribe()

        def frame(event: dict) -> str:
            return f"id: {event['seq']}\nevent: {event['kind']}\ndata: {json.dumps(event, default=str)}\n\n"

        async def stream() -> AsyncIterator[str]:
            nonlocal cursor
            try:
                yield ": connected\n\n"
                for event in await asyncio.to_thread(store.events_after, cursor, job_id):
                    cursor = event["seq"]
                    yield frame(event)
                while not once and not await request.is_disconnected():
                    try:
                        event = await asyncio.wait_for(queue.get(), timeout=15)
                    except TimeoutError:
                        yield ": keepalive\n\n"
                        continue
                    if event["seq"] <= cursor or (job_id and event["job_id"] != job_id):
                        continue
                    cursor = event["seq"]
                    yield frame(event)
            finally:
                app.state.executor.unsubscribe(queue)

        return StreamingResponse(
            stream(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
        )

    app.include_router(filesystem_router)
    return app
