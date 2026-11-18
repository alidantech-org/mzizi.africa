"""The engine's operational API (FastAPI). Local only: called by the NestJS API, repository scripts and agents.

It exposes health, capabilities, jobs, runs, an SSE event stream and manifest/seed operations. It makes no product
decisions, has no UI and no user accounts, and never writes domain schemas: results flow to NestJS through the outbox.
"""

from __future__ import annotations

import asyncio
import json
import secrets
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

import httpx
from fastapi import FastAPI, Header, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from mzizi_engine import __version__
from mzizi_engine.api.routes.catalog.seed_catalog import build_catalog_seed_catalog_router
from mzizi_engine.config import EngineConfig, ServerConfig
from mzizi_engine.config.explore import ExploreConfig
from mzizi_engine.runtime.assembly import DRAIN_TIMEOUT_SECONDS, build_default_runtime
from mzizi_engine.runtime.assembly.artifact_reader import artifact_reader
from mzizi_engine.runtime.assembly.run_operations import local_run_root
from mzizi_engine.runtime.contracts.config import RuntimeConfig
from mzizi_engine.runtime.executor.executor import Executor
from mzizi_engine.runtime.executor.memory_store import FileStore, MemoryStore, Store
from mzizi_engine.runtime.http.auth import (
    Authority,
    DatabaseServiceAuthority,
    Principal,
    TokenVerifier,
    oidc_verifier,
    require,
)
from mzizi_engine.runtime.http.explore import explore_router, media_router
from mzizi_engine.runtime.http.overview import SystemOverview, build_overview
from mzizi_engine.runtime.http.research import research_router
from mzizi_engine.runtime.http.scripts import scripts_router
from mzizi_engine.runtime.http.seed_catalog import RuntimeSeedCatalogService
from mzizi_engine.runtime.operations import OperationRegistry
from mzizi_engine.runtime.runs.artifacts import ArtifactReader
from mzizi_engine.runtime.runtime import EngineRuntime
from mzizi_engine.runtime.scripts.workspace import ScriptWorkspace


class JobRequest(BaseModel):
    kind: str
    input: dict[str, Any] = Field(default_factory=dict)
    idempotency_key: str | None = None
    run_id: str | None = None


class RunRequest(BaseModel):
    name: str


def _store(settings: ServerConfig) -> Store:
    state = ExploreConfig.load().state_file
    return FileStore(state) if state else MemoryStore()


def create_app(
    settings: ServerConfig | None = None,
    store: Store | None = None,
    registry: OperationRegistry | None = None,
    runtime: EngineRuntime | None = None,
    authority: Authority | None = None,
    verifier: TokenVerifier | None = None,
    callback_client: httpx.AsyncClient | None = None,
    research_reader: ArtifactReader | None = None,
) -> FastAPI:
    settings = settings or EngineConfig.load().server
    settings.check()
    if runtime is None:
        runtime = (
            EngineRuntime(RuntimeConfig(drain_timeout_seconds=DRAIN_TIMEOUT_SECONDS), registry)
            if registry is not None
            else build_default_runtime(settings)
        )
    registry = runtime.operations
    store = store or _store(settings)
    reader = research_reader or artifact_reader(registry)

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        runtime.start()
        app.state.executor = Executor(store, registry, settings, callback_client)
        await app.state.executor.start()
        workspace: ScriptWorkspace | None = None
        try:
            config = EngineConfig.load()
            if config.script_image_id is not None:
                workspace = await asyncio.to_thread(
                    ScriptWorkspace, local_run_root(config) / ".scripts", config.script_image_id, reader
                )
            app.state.script_workspace = workspace
            yield
        finally:
            try:
                if workspace is not None:
                    await asyncio.to_thread(workspace.close)
            finally:
                await app.state.executor.stop()
                await asyncio.to_thread(runtime.stop)

    selected_authority = authority or (
        DatabaseServiceAuthority(settings.database_service_url, settings.database_service_token)
        if settings.database_service_url and settings.database_service_token
        else None
    )
    if settings.auth == "oidc" and selected_authority is None:
        raise ValueError("authenticated engine mode requires DATABASE_SERVICE_URL and DATABASE_SERVICE_TOKEN")

    app = FastAPI(title="Mzizi engine", version=__version__, lifespan=lifespan)
    app.state.settings, app.state.registry, app.state.store = settings, registry, store
    app.state.runtime = runtime
    app.state.authority = selected_authority
    app.state.verifier = verifier or oidc_verifier(settings)

    @app.get("/", response_model=SystemOverview, include_in_schema=False)
    async def overview() -> SystemOverview:
        return build_overview(
            app, registry, version=__version__, runtime=runtime.state.value, store=settings.store, auth=settings.auth
        )

    @app.get("/health")
    async def health() -> dict:
        ex: Executor = app.state.executor
        return {
            "status": "ok",
            "service": "mzizi-engine",
            "version": __version__,
            "store": settings.store,
            "auth": settings.auth,
            "runtime": runtime.state.value,
            "packages": [c.model_dump(mode="json") for c in runtime.health().capabilities],
            "capabilities": len(registry.names()),
            "active_jobs": ex.active,
        }

    @app.get("/capabilities")
    async def capabilities(_: Principal = require("engine.read")) -> dict:
        return {"capabilities": [item.model_dump(mode="json") for item in registry.describe()]}

    app.include_router(
        build_catalog_seed_catalog_router(RuntimeSeedCatalogService(runtime)), dependencies=[require("engine.read")]
    )

    app.include_router(research_router(reader))
    explore_config = ExploreConfig.load()
    app.include_router(explore_router(explore_config))
    app.include_router(media_router(explore_config))
    app.include_router(scripts_router())

    @app.post("/internal/v1/capabilities/execute")
    async def execute_internal_capability(body: JobRequest, request: Request) -> dict:
        """Service-token endpoint for Temporal activities; accepts registered compute capabilities only."""
        expected = settings.service_token
        supplied = request.headers.get("authorization", "")
        if not expected:
            raise HTTPException(503, "Temporal capability service token is not configured")
        if not secrets.compare_digest(supplied.encode(), f"Bearer {expected}".encode()):
            raise HTTPException(403, "invalid service credential")
        allowed = {
            "extraction.pdf",
            "extraction.csv",
            "extraction.json",
            "extraction.geojson",
            "scraping.links",
            "manifest.validate_structure",
            "manifest.check_seeds",
        }
        if body.kind not in allowed:
            raise HTTPException(422, "unregistered Temporal capability")
        try:
            result = await app.state.executor._call(body.kind, body.input)
        except KeyError:
            raise HTTPException(422, "capability is not installed") from None
        return {"run_id": body.run_id, "idempotency_key": body.idempotency_key, "result": result}

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
        from mzizi_engine.runtime.assembly.default_operations import manifest_check_seeds

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

    return app
