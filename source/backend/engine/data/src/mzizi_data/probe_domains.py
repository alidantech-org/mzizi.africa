"""Probe candidate domains through the collection gate and record DNS snapshots.

Only hosts the engine may assess without a person are probed: a suffix or an exact host from
fixtures/policy/trusted-domains.json. Every other host is skipped and reported as needing an assessment.
Each probe is one robots.txt request and one bounded GET of the home page, paced globally (0.2 requests per
second), identified, and stopped for that host on a challenge, 401, 403 or 429 (status `refused`).

Domain status and site status are separate. A domain is never deleted, and a confirmed domain is only
downgraded to `unreachable` after CONSECUTIVE_FAILURES consecutive failed probes.
"""
from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

import dns.exception
import dns.resolver
import httpx
import psycopg

from . import compliance, domains, fetch, gate
from .fetch import Denied, RobotsDisallowed, StopRun

CONSECUTIVE_FAILURES = 3
RECORD_TYPES = ("A", "AAAA", "CNAME", "NS", "MX", "TXT", "SOA")
CONFIRMED = ("reachable", "redirects", "moved")
POLICY_FILE = Path(__file__).resolve().parents[3] / "database" / "fixtures" / "policy" / "trusted-domains.json"


def load_trusted(path: Path = POLICY_FILE) -> tuple[list[str], set[str]]:
    data = json.loads(path.read_text())
    entries = data.get("suffixes", [])
    return [e["suffix"] for e in entries if "suffix" in e], {e["host"] for e in entries if "host" in e}


def is_trusted(host: str, suffixes: list[str], hosts: set[str]) -> bool:
    host = host.lower()
    return host in hosts or any(host.endswith(s) for s in suffixes)


class PacedTransport(httpx.BaseTransport):
    """Global pacing: at least `interval` seconds between any two requests, whichever host they go to."""

    def __init__(self, interval: float = 5.0, inner: httpx.BaseTransport | None = None, clock=time.monotonic, sleep=time.sleep):
        self.interval, self.inner, self.clock, self.sleep = interval, inner or httpx.HTTPTransport(), clock, sleep
        self._next = 0.0

    def handle_request(self, request: httpx.Request) -> httpx.Response:
        wait = self._next - self.clock()
        if wait > 0:
            self.sleep(wait)
        self._next = self.clock() + self.interval
        return self.inner.handle_request(request)


# ---------------------------------------------------------------------------------------------- DNS
def lookup(resolver: dns.resolver.Resolver, name: str, rtype: str) -> tuple[str, list[str]]:
    try:
        answer = resolver.resolve(name, rtype, raise_on_no_answer=True)
        return "NOERROR", sorted(r.to_text() for r in answer)
    except dns.resolver.NXDOMAIN:
        return "NXDOMAIN", []
    except dns.resolver.NoAnswer:
        return "NOANSWER", []
    except dns.resolver.NoNameservers:
        return "SERVFAIL", []
    except (dns.exception.Timeout, dns.exception.DNSException, OSError):
        return "TIMEOUT", []


def snapshot_dns(conn: psycopg.Connection, resolver: dns.resolver.Resolver, name: str, domain_id: str | None = None, zone_id: str | None = None, types=RECORD_TYPES) -> str:
    """Stores one dated snapshot row per record type; returns "nxdomain" when the name does not exist, else "exists"/"unknown"."""
    now = datetime.now(timezone.utc)
    resolver_name = ",".join(resolver.nameservers)
    outcome = "unknown"
    for rtype in types:
        rcode, values = lookup(resolver, name, rtype)
        conn.execute(
            'INSERT INTO website.dns_snapshots (domain_id, zone_id, record_type, "values", resolver, rcode, observed_at, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s, now())',
            (domain_id, zone_id, rtype, "\n".join(values), resolver_name, rcode, now),
        )
        if rcode == "NXDOMAIN":
            return "nxdomain"
        if rcode == "NOERROR":
            outcome = "exists"
    return outcome


# ------------------------------------------------------------------------------------------- status
def consecutive_failures(conn: psycopg.Connection, site_id: str, host: str) -> int:
    """Failed domain probes in a row for the host, newest first (the current one is recorded before this is called)."""
    rows = conn.execute("SELECT detail FROM website.checks WHERE site_id = %s AND kind = 'reachability' ORDER BY checked_at DESC, created_at DESC LIMIT 50", (site_id,)).fetchall()
    count = 0
    for row in rows:
        try:
            detail = json.loads(row["detail"] or "{}")
        except ValueError:
            continue
        if detail.get("type") != "domain_probe" or detail.get("host") != host:
            continue
        if detail.get("outcome") != "failed":
            break
        count += 1
    return count


def apply_result(conn: psycopg.Connection, site_id: str, host: str, outcome: str, http_status: int | None, redirect_to: str | None, reason: str) -> str:
    """Records one probe outcome (reachable, redirects, moved, unreachable, refused) on the domain; returns the status stored."""
    failed = outcome in ("unreachable",)
    detail = {"type": "domain_probe", "host": host, "outcome": "failed" if failed else outcome, "httpStatus": http_status, "redirectTo": redirect_to, "reason": reason}
    conn.execute(  # clock_timestamp so probes inside one transaction keep their order
        "INSERT INTO website.checks (site_id, kind, outcome, detail, checked_at, created_at, updated_at, version) VALUES (%s, 'reachability', %s, %s, clock_timestamp(), now(), now(), 1)",
        (site_id, "failed" if failed or outcome == "refused" else "ok", json.dumps(detail)),
    )
    current = conn.execute("SELECT status FROM website.domains WHERE site_id = %s AND hostname = %s", (site_id, host)).fetchone()
    current_status = current["status"] if current else "candidate"
    if failed and current_status in CONFIRMED and consecutive_failures(conn, site_id, host) < CONSECUTIVE_FAILURES:
        conn.execute("UPDATE website.domains SET last_probe_at = now(), last_http_status = %s, status_reason = %s, updated_at = now() WHERE site_id = %s AND hostname = %s",
                     (http_status, f"Probe failed ({reason}); status kept until {CONSECUTIVE_FAILURES} consecutive failures.", site_id, host))
        return current_status
    domains.ensure_candidate_domains(conn, site_id, [host], "pattern", "Added when probed.")
    conn.execute(
        """UPDATE website.domains SET status = %s, last_probe_at = now(), last_http_status = %s, redirect_to = %s, status_reason = %s,
                  observed_at = CASE WHEN %s IN ('reachable','redirects','moved') THEN now() ELSE observed_at END, updated_at = now()
            WHERE site_id = %s AND hostname = %s""",
        (outcome, http_status, redirect_to, reason, outcome, site_id, host),
    )
    if outcome in CONFIRMED:
        conn.execute("UPDATE website.sites SET status = 'discovered', first_seen_at = COALESCE(first_seen_at, now()), last_seen_at = now(), updated_at = now() WHERE id = %s AND status = 'expected'", (site_id,))
    return outcome


def classify_redirect(host: str, location: str) -> tuple[str, str]:
    target = urlparse(urljoin(f"https://{host}/", location)).netloc.lower()
    same = target == host or target.removeprefix("www.") == host.removeprefix("www.")
    return ("redirects" if same else "moved"), target


# ----------------------------------------------------------------------------------------- probing
def probe_host(conn: psycopg.Connection, client: httpx.Client, user_agent: str, site_id: str, host: str, trusted: tuple[list[str], set[str]]) -> tuple[str, str]:
    """Probes one host through the gate. Returns (status, reason)."""
    limits = compliance.effective_limits({"rate": {"requests_per_second": 0.2}, "limits": {"timeout_seconds": 15}, "retries": {"max": 1}})
    fetcher = fetch.PoliteFetcher(user_agent=user_agent, limits=limits, gate=lambda req: gate.check_collection(conn, req), site_id=site_id, client=client, sleep=time.sleep)
    try:
        result = fetcher.get(f"https://{host}/", purpose="assess")
    except RobotsDisallowed:
        return apply_result(conn, site_id, host, "refused", None, None, "robots.txt disallows the home page"), "robots"
    except Denied as denied:
        return apply_result(conn, site_id, host, "refused", None, None, "gate denied: " + "; ".join(denied.reasons)), "gate"
    except StopRun as stop:
        return apply_result(conn, site_id, host, "refused", None, None, f"stopped on {stop.kind}: {stop}"[:300]), stop.kind
    except Exception as error:
        return apply_result(conn, site_id, host, "unreachable", None, None, f"{type(error).__name__}: {error}"[:300]), "error"
    if result.status in (301, 302, 303, 307, 308):
        location = next((v for k, v in result.headers.items() if k.lower() == "location"), None)
        if location:
            status, target = classify_redirect(host, location)
            outcome = apply_result(conn, site_id, host, status, result.status, location, f"Answered {result.status} redirecting to {target}")
            if status == "moved" and is_trusted(target, *trusted):
                domains.ensure_candidate_domains(conn, site_id, [target], "redirect", f"Redirect target of {host} (answered {result.status}).")
            return outcome, "ok"
    if 200 <= result.status < 400:
        return apply_result(conn, site_id, host, "reachable", result.status, None, f"Answered {result.status}"), "ok"
    return apply_result(conn, site_id, host, "unreachable", result.status, None, f"Answered {result.status}"), "http"


def probe_all(conn: psycopg.Connection, user_agent: str, interval: float = 5.0, limit: int | None = None, log=print, transport: httpx.BaseTransport | None = None, resolver: dns.resolver.Resolver | None = None) -> dict:
    """Probes every unprobed candidate domain. Resumable: a probed domain has last_probe_at set and is not selected again."""
    trusted = load_trusted()
    resolver = resolver or dns.resolver.Resolver()
    resolver.lifetime = 6.0
    client = httpx.Client(follow_redirects=False, transport=transport or PacedTransport(interval))
    rows = conn.execute("SELECT d.id::text AS id, d.site_id::text AS site_id, d.hostname FROM website.domains d WHERE d.status = 'candidate' AND d.last_probe_at IS NULL ORDER BY d.hostname").fetchall()
    summary: dict = {"skipped_untrusted": [], "probed": 0}
    for row in rows[: limit or None]:
        host = row["hostname"]
        if not is_trusted(host, *trusted):
            conn.execute("UPDATE website.domains SET status_reason = 'Outside the trusted zones and exact hosts: needs an assessment before it is probed.', updated_at = now() WHERE id = %s", (row["id"],))
            summary["skipped_untrusted"].append(host)
            conn.commit()
            continue
        dns_state = snapshot_dns(conn, resolver, host, domain_id=row["id"])
        if dns_state == "nxdomain":
            status, why = apply_result(conn, row["site_id"], host, "unreachable", None, None, "DNS name does not exist (NXDOMAIN); no request was made"), "nxdomain"
        else:
            status, why = probe_host(conn, client, user_agent, row["site_id"], host, trusted)
        conn.commit()
        summary["probed"] += 1
        summary[status] = summary.get(status, 0) + 1
        log(f"{host}\t{status}\t{why}")
    return summary


def snapshot_zones(conn: psycopg.Connection, resolver: dns.resolver.Resolver | None = None) -> int:
    resolver = resolver or dns.resolver.Resolver()
    resolver.lifetime = 6.0
    count = 0
    for zone in conn.execute("SELECT id::text AS id, suffix FROM website.domain_zones ORDER BY suffix").fetchall():
        snapshot_dns(conn, resolver, zone["suffix"], zone_id=zone["id"])
        count += 1
    conn.commit()
    return count


def probe_report(conn: psycopg.Connection) -> dict:
    return {
        "domains_by_status": conn.execute("SELECT status::text AS status, count(*)::int AS n FROM website.domains GROUP BY 1 ORDER BY 2 DESC").fetchall(),
        "domains_by_zone_and_status": conn.execute("SELECT coalesce(z.suffix, '(none)') AS zone, d.status::text AS status, count(*)::int AS n FROM website.domains d LEFT JOIN website.domain_zones z ON z.id = d.zone_id GROUP BY 1, 2 ORDER BY 1, 2").fetchall(),
        "sites_by_status": conn.execute("SELECT status::text AS status, count(*)::int AS n FROM website.sites GROUP BY 1 ORDER BY 2 DESC").fetchall(),
        "refused": conn.execute("SELECT hostname, status_reason FROM website.domains WHERE status = 'refused' ORDER BY hostname").fetchall(),
        "dns_snapshots": conn.execute("SELECT count(*)::int AS n FROM website.dns_snapshots").fetchone()["n"],
        "needing_assessment": conn.execute("SELECT hostname FROM website.domains WHERE status = 'candidate' AND last_probe_at IS NULL ORDER BY hostname").fetchall(),
    }
