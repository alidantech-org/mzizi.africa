"""Incident handling and legal drift (LEGALITY_SAFETY_AND_COMPLIANCE.md section 10).

On a credible restriction, complaint, unexpected sensitive data or expiry: stop the affected
collection, prevent scheduled jobs, quarantine candidates and record the event. Evidence is preserved
(files stay restricted); nothing is deleted here.
"""
from __future__ import annotations

import hashlib
import json
from typing import Any, Callable

import psycopg
from psycopg.types.json import Jsonb  # noqa: F401


def record_check(conn: psycopg.Connection, site_id: str, kind: str, outcome: str, detail: dict, structure_version_id: str | None = None) -> str:
    return str(
        conn.execute(
            "INSERT INTO website.checks (site_id, structure_version_id, kind, outcome, detail, checked_at, created_at, updated_at, version) VALUES (%s, %s, %s, %s, %s, now(), now(), now(), 1) RETURNING id",
            (site_id, structure_version_id, kind, outcome, json.dumps(detail, default=str)),
        ).fetchone()["id"]
    )


def stop_collection(conn: psycopg.Connection, site_id: str, reason: str, kind: str = "manual") -> dict[str, int]:
    """Pauses the site, cancels its pending jobs, quarantines its unpromoted candidates and records the incident."""
    conn.execute("UPDATE website.sites SET status = 'paused', updated_at = now() WHERE id = %s", (site_id,))
    cancelled = conn.execute("UPDATE engine.jobs SET status = 'cancelled', updated_at = now(), error = %s WHERE status = 'pending' AND input->>'siteId' = %s", (f"collection stopped: {reason}"[:500], site_id)).rowcount
    quarantined = conn.execute(
        """UPDATE staging.candidates c SET status = 'quarantined'
             FROM staging.runs r JOIN source.captures cap ON cap.id = r.capture_id
            WHERE c.run_id = r.id AND cap.site_id = %s AND c.status IN ('pending','invalid','in_review','approved')""",
        (site_id,),
    ).rowcount
    record_check(conn, site_id, "drift", "failed", {"type": "incident", "kind": kind, "reason": reason, "cancelledJobs": cancelled, "quarantinedCandidates": quarantined})
    return {"cancelledJobs": cancelled, "quarantinedCandidates": quarantined}


def _digest(body: bytes) -> str:
    return hashlib.sha256(body).hexdigest()


def legal_drift_check(conn: psycopg.Connection, site_id: str, observations: dict[str, bytes], on_change: str = "pause") -> dict[str, Any]:
    """Compares hashes of robots.txt, terms and licence pages with the last recorded ones.

    The first observation is a baseline; a change records a drift check and, by default, pauses the
    site until a human renews the assessment (a changed legal condition can restrict a technically
    healthy site).
    """
    last = conn.execute("SELECT detail FROM website.checks WHERE site_id = %s AND kind = 'drift' AND detail::jsonb->>'type' = 'legal' ORDER BY checked_at DESC LIMIT 1", (site_id,)).fetchone()
    previous = json.loads(last["detail"])["hashes"] if last else None
    hashes = {name: _digest(body) for name, body in sorted(observations.items())}
    changed = sorted(name for name in hashes if previous is not None and previous.get(name) != hashes[name])
    outcome = "ok" if not changed else "degraded"
    record_check(conn, site_id, "drift", outcome, {"type": "legal", "hashes": hashes, "changed": changed, "baseline": previous is None})
    result: dict[str, Any] = {"baseline": previous is None, "changed": changed}
    if changed and on_change == "pause":
        result["incident"] = stop_collection(conn, site_id, f"legal conditions changed: {', '.join(changed)}", kind="legal_drift")
    return result


def collect_legal_observations(fetcher, scheme: str, host: str, extra_urls: dict[str, str] | None = None) -> dict[str, bytes]:
    """Fetches robots.txt and any registered terms or licence pages through the same gated, polite fetcher (assess purpose)."""
    observations: dict[str, bytes] = {}
    for name, url in {"robots": f"{scheme}://{host}/robots.txt", **(extra_urls or {})}.items():
        result = fetcher.get(url, purpose="assess", _robots=True)
        observations[name] = result.body if result.status == 200 else f"status {result.status}".encode()
    return observations
