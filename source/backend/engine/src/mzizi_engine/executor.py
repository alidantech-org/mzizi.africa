"""The one execution boundary: queue, admission limits, retries, cancellation, progress events and the callback outbox.

Everything that runs does so through `Executor.submit`. I/O-bound capabilities run on threads under the event loop;
CPU-bound ones run in worker processes (the GIL would serialize threads). Per-capability semaphores bound concurrency
and a single queue feeds a fixed number of dispatch tasks. Packages never schedule themselves.
"""
from __future__ import annotations

import asyncio
import multiprocessing
from concurrent.futures import ProcessPoolExecutor
from datetime import datetime, timezone
from typing import Any

import httpx

from .capabilities import CapabilityRegistry
from .config import Settings
from .store import Store

NON_RETRYABLE = (ValueError, KeyError, TypeError)
TARGET = "nestjs"
OUTBOX_MAX_ATTEMPTS = 8


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class Executor:
    def __init__(self, store: Store, registry: CapabilityRegistry, settings: Settings, callback_client: httpx.AsyncClient | None = None, dispatchers: int = 8) -> None:
        self.store, self.registry, self.settings = store, registry, settings
        self._client = callback_client
        self._dispatchers = dispatchers
        self._queue: asyncio.Queue[str] = asyncio.Queue()
        self._tasks: list[asyncio.Task] = []
        self._running: dict[str, asyncio.Task] = {}
        self._cancelled: set[str] = set()
        self._semaphores: dict[str, asyncio.Semaphore] = {}
        self._subscribers: set[asyncio.Queue] = set()
        self._pool: ProcessPoolExecutor | None = None
        self._outbox_wake = asyncio.Event()
        self.active = 0
        self.peak_active = 0

    # ---- lifecycle ----------------------------------------------------------------------------
    async def start(self) -> None:
        interrupted = await asyncio.to_thread(self.store.requeue_interrupted)
        if interrupted:
            await self._emit("engine.recovered", None, None, {"requeued": interrupted})
        for job in await asyncio.to_thread(self.store.queued_jobs):
            self._queue.put_nowait(job["id"])
        self._pool = ProcessPoolExecutor(max_workers=self.settings.process_workers, mp_context=multiprocessing.get_context("spawn"))
        self._tasks = [asyncio.create_task(self._dispatch()) for _ in range(self._dispatchers)]
        if self.settings.callback_url or self._client:
            self._tasks.append(asyncio.create_task(self._outbox_loop()))

    async def stop(self) -> None:
        for task in [*self._tasks, *self._running.values()]:
            task.cancel()
        await asyncio.gather(*self._tasks, return_exceptions=True)
        if self._pool:
            self._pool.shutdown(wait=False, cancel_futures=True)
        if self._client and self.settings.callback_url and not getattr(self._client, "_externally_owned", False):
            await self._client.aclose()

    # ---- events ---------------------------------------------------------------------------------
    def subscribe(self) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue(maxsize=1000)
        self._subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue) -> None:
        self._subscribers.discard(queue)

    async def _emit(self, kind: str, job_id: str | None, run_id: str | None, data: dict) -> dict:
        targets = [TARGET] if (self.settings.callback_url or self._client) else []
        event = await asyncio.to_thread(self.store.add_event, kind, job_id, run_id, data, targets)
        for queue in list(self._subscribers):
            try:
                queue.put_nowait(event)
            except asyncio.QueueFull:
                self._subscribers.discard(queue)  # a slow watcher reconnects with Last-Event-ID and replays from the store
        self._outbox_wake.set()
        return event

    # ---- submit / cancel -----------------------------------------------------------------------
    async def submit(self, kind: str, payload: dict, idempotency_key: str | None = None, requested_by: str | None = None, run_id: str | None = None) -> tuple[dict, bool]:
        self.registry.get(kind)  # KeyError for an unregistered capability
        job, created = await asyncio.to_thread(self.store.create_job, kind, payload, idempotency_key, requested_by, run_id, self.settings.max_attempts)
        if created:
            await self._emit("job.queued", job["id"], run_id, {"kind": kind})
            self._queue.put_nowait(job["id"])
        return job, created

    async def cancel(self, job_id: str) -> dict | None:
        job = await asyncio.to_thread(self.store.get_job, job_id)
        if job is None or job["status"] in ("succeeded", "failed", "cancelled"):
            return job
        self._cancelled.add(job_id)
        task = self._running.get(job_id)
        if task:
            task.cancel()  # a job already inside a worker process finishes there; its result is discarded
        else:
            job = await asyncio.to_thread(self.store.update_job, job_id, status="cancelled", finished_at=_now())
            await self._emit("job.cancelled", job_id, job["run_id"], {})
        return await asyncio.to_thread(self.store.get_job, job_id)

    # ---- workers -----------------------------------------------------------------------------------
    def _semaphore(self, kind: str) -> asyncio.Semaphore:
        if kind not in self._semaphores:
            capability = self.registry.get(kind)
            limit = self.settings.limits.get(kind) or capability.concurrency or self.settings.default_concurrency
            self._semaphores[kind] = asyncio.Semaphore(limit)
        return self._semaphores[kind]

    async def _dispatch(self) -> None:
        while True:
            job_id = await self._queue.get()
            try:
                task = asyncio.create_task(self._run(job_id))
                self._running[job_id] = task
                await asyncio.wait({task})
            finally:
                self._running.pop(job_id, None)
                self._queue.task_done()

    async def _call(self, kind: str, payload: dict) -> dict:
        capability = self.registry.get(kind)
        loop = asyncio.get_running_loop()
        if capability.cpu_bound and self._pool is not None:
            return await loop.run_in_executor(self._pool, capability.handler, payload)
        return await asyncio.to_thread(capability.handler, payload)

    async def _run(self, job_id: str) -> None:
        job = await asyncio.to_thread(self.store.get_job, job_id)
        if job is None or job["status"] != "queued" or job_id in self._cancelled:
            return
        run_id = job["run_id"]
        try:
            await self._semaphore(job["kind"]).acquire()
        except asyncio.CancelledError:  # cancelled while waiting for admission: it never started
            await asyncio.to_thread(self.store.update_job, job_id, status="cancelled", finished_at=_now())
            await self._emit("job.cancelled", job_id, run_id, {})
            return
        try:
            self.active += 1
            self.peak_active = max(self.peak_active, self.active)
            try:
                for attempt in range(job["attempts"] + 1, job["max_attempts"] + 1):
                    await asyncio.to_thread(self.store.update_job, job_id, status="running", attempts=attempt, started_at=_now())
                    await self._emit("job.started", job_id, run_id, {"attempt": attempt})
                    try:
                        result = await self._call(job["kind"], job["input"])
                    except asyncio.CancelledError:
                        await asyncio.to_thread(self.store.update_job, job_id, status="cancelled", finished_at=_now())
                        await self._emit("job.cancelled", job_id, run_id, {})
                        return
                    except Exception as error:  # noqa: BLE001 - capability failures are job outcomes
                        retry = attempt < job["max_attempts"] and not isinstance(error, NON_RETRYABLE)
                        await self._emit("job.failed" if not retry else "job.retrying", job_id, run_id, {"attempt": attempt, "error": f"{type(error).__name__}: {error}"})
                        if not retry:
                            await asyncio.to_thread(self.store.update_job, job_id, status="failed", error=f"{type(error).__name__}: {error}", finished_at=_now())
                            return
                        await asyncio.sleep(self.settings.retry_base_seconds * 2 ** (attempt - 1))
                        continue
                    await asyncio.to_thread(self.store.update_job, job_id, status="succeeded", result=result, finished_at=_now())
                    await self._emit("job.succeeded", job_id, run_id, {"result": result})
                    return
            finally:
                self.active -= 1
        finally:
            self._semaphore(job["kind"]).release()

    # ---- outbox: deliver events to the NestJS API with retries ------------------------------------------
    async def deliver_due(self) -> int:
        url = self.settings.callback_url or "http://nestjs.invalid/callbacks"
        delivered = 0
        for row in await asyncio.to_thread(self.store.due_outbox):
            headers = {"Idempotency-Key": f"event-{row['event_seq']}", "Content-Type": "application/json"}
            if self.settings.callback_token:
                headers["Authorization"] = f"Bearer {self.settings.callback_token}"
            try:
                client = self._client or httpx.AsyncClient(timeout=10)
                response = await client.post(url, json={"event": row["event"]}, headers=headers)
                ok = 200 <= response.status_code < 300
                error = f"HTTP {response.status_code}"
            except httpx.HTTPError as exc:
                ok, error = False, f"{type(exc).__name__}: {exc}"
            if ok:
                await asyncio.to_thread(self.store.mark_delivered, row["id"])
                delivered += 1
            else:
                backoff = min(300.0, self.settings.retry_base_seconds * 2 ** row["attempts"])
                await asyncio.to_thread(self.store.mark_failed, row["id"], error, backoff, OUTBOX_MAX_ATTEMPTS)
        return delivered

    async def _outbox_loop(self) -> None:
        while True:
            try:
                await asyncio.wait_for(self._outbox_wake.wait(), timeout=1.0)
            except asyncio.TimeoutError:
                pass
            self._outbox_wake.clear()
            try:
                await self.deliver_due()
            except Exception:  # noqa: BLE001 - the loop must survive transient failures
                await asyncio.sleep(1.0)
