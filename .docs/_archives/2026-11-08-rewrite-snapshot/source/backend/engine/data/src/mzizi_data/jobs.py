"""Postgres job queue (DEC-DATA-ENGINE-DESIGN item 4): claim with SKIP LOCKED, bounded retries with backoff.

A job is idempotent on (kind, input hash, generation). Rerunning means a new generation, which
produces a new result; an existing result is never overwritten.
"""
from __future__ import annotations

import hashlib
import json
import random
import socket
from dataclasses import dataclass
from typing import Any, Callable

import psycopg
from psycopg.types.json import Jsonb


def input_hash(kind: str, payload: dict[str, Any]) -> str:
    return hashlib.sha256(json.dumps({"kind": kind, "input": payload}, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


@dataclass
class Job:
    id: str
    kind: str
    input: dict[str, Any]
    attempts: int
    max_attempts: int
    generation: int


def enqueue(conn: psycopg.Connection, kind: str, payload: dict[str, Any], max_attempts: int = 3, rerun: bool = False) -> tuple[str, bool]:
    """Returns (job id, created). Enqueueing the same input again is a no-op unless rerun is set, which starts a new generation."""
    digest = input_hash(kind, payload)
    current = conn.execute("SELECT id, generation FROM engine.jobs WHERE kind = %s AND input_hash = %s ORDER BY generation DESC LIMIT 1", (kind, digest)).fetchone()
    if current and not rerun:
        return str(current["id"]), False
    generation = (current["generation"] + 1) if current else 1
    row = conn.execute(
        "INSERT INTO engine.jobs (kind, input_hash, generation, input, max_attempts) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (kind, digest, generation, Jsonb(payload), max_attempts),
    ).fetchone()
    return str(row["id"]), True


def claim(conn: psycopg.Connection, worker: str | None = None, kinds: list[str] | None = None) -> Job | None:
    worker = worker or f"{socket.gethostname()}"
    row = conn.execute(
        """UPDATE engine.jobs SET status = 'running', locked_by = %s, locked_at = now(), attempts = attempts + 1, updated_at = now()
           WHERE id = (SELECT id FROM engine.jobs WHERE status = 'pending' AND run_after <= now() AND (%s::text[] IS NULL OR kind = ANY(%s))
                       ORDER BY run_after, created_at FOR UPDATE SKIP LOCKED LIMIT 1)
           RETURNING id, kind, input, attempts, max_attempts, generation""",
        (worker, kinds, kinds),
    ).fetchone()
    return Job(str(row["id"]), row["kind"], row["input"], row["attempts"], row["max_attempts"], row["generation"]) if row else None


def succeed(conn: psycopg.Connection, job: Job, result: dict[str, Any], result_file_version_id: str | None = None) -> None:
    conn.execute("UPDATE engine.jobs SET status = 'succeeded', result = %s, result_file_version_id = %s, locked_by = NULL, error = NULL, updated_at = now() WHERE id = %s", (Jsonb(result), result_file_version_id, job.id))


def fail(conn: psycopg.Connection, job: Job, error: str, retryable: bool = True) -> None:
    """Bounded retries with exponential backoff and jitter; a non-retryable error or the last attempt marks the job failed."""
    if retryable and job.attempts < job.max_attempts:
        delay = min(3600, 30 * 2 ** (job.attempts - 1)) * random.uniform(0.5, 1.5)
        conn.execute("UPDATE engine.jobs SET status = 'pending', run_after = now() + make_interval(secs => %s), locked_by = NULL, error = %s, updated_at = now() WHERE id = %s", (delay, error[:2000], job.id))
    else:
        conn.execute("UPDATE engine.jobs SET status = 'failed', locked_by = NULL, error = %s, updated_at = now() WHERE id = %s", (error[:2000], job.id))


class NonRetryable(Exception):
    """Raised by a handler when retrying cannot help (bad input, access refused)."""


def run_once(conn: psycopg.Connection, handlers: dict[str, Callable[[Job], tuple[dict[str, Any], str | None]]], worker: str | None = None) -> Job | None:
    """Claims and runs one job inside its own transaction scope; returns the job or None when the queue is empty."""
    job = claim(conn, worker, list(handlers))
    conn.commit()
    if job is None:
        return None
    try:
        result, file_version_id = handlers[job.kind](job)
        succeed(conn, job, result, file_version_id)
    except NonRetryable as error:
        conn.rollback()
        fail(conn, job, str(error), retryable=False)
    except Exception as error:
        conn.rollback()
        fail(conn, job, f"{type(error).__name__}: {error}")
    conn.commit()
    return job
