"""Domain patterns to expected sites (WEBSITE_DESIGN.md, families, domain patterns and similarity).

A pattern such as {county}.go.ke plus a set of subjects (the county-level units of a jurisdiction)
yields expected sites with candidate hostnames. A hostname is a candidate until a bounded probe
confirms it; domains are dated attributes of a site, never its identity. Expansion makes no network
requests; probing does, through the gated polite fetcher.
"""
from __future__ import annotations

import json
import re
import unicodedata
from dataclasses import dataclass, field
from datetime import date
from urllib.parse import urlparse

import psycopg

from . import domains, incidents
from .compliance import Denied, StopRun
from .fetch import PoliteFetcher, RobotsDisallowed

SLOT = re.compile(r"\{([a-z_][a-z0-9_]*)\}")


def _ascii(name: str) -> str:
    return unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower().replace("'", "").replace("’", "")


def slug_variants(name: str, rule: str) -> list[str]:
    """Candidate label spellings for a subject name, most likely first, without duplicates.

    Rules: lowercase-strip-county (drop the word county; joined, then hyphenated), lowercase-hyphen
    (hyphenated, then joined), initials (acronym of the words, then joined).
    """
    text = _ascii(name)
    if rule == "lowercase-strip-county":
        text = re.sub(r"\bcounty\b", " ", text)
    words = [w for w in re.split(r"[^a-z0-9]+", text) if w]
    if not words:
        return []
    joined, hyphen, acronym = "".join(words), "-".join(words), "".join(w[0] for w in words)
    order = {"lowercase-strip-county": [joined, hyphen], "lowercase-hyphen": [hyphen, joined], "initials": [acronym, joined]}.get(rule)
    if order is None:
        raise ValueError(f"unknown slug rule {rule!r}")
    seen: list[str] = []
    for variant in order:
        if variant not in seen:
            seen.append(variant)
    return seen


def hostnames(template: str, values: dict[str, list[str]]) -> list[str]:
    """Candidate hostnames for a template; slots take the variants of their values, in order."""
    slots = SLOT.findall(template)
    missing = [s for s in slots if s not in values]
    if missing:
        raise KeyError(f"no value for slot(s) {missing}")
    if not slots:
        return [template]
    candidates = [template]
    for slot in slots:
        candidates = [c.replace("{" + slot + "}", variant) for c in candidates for variant in values[slot]]
    return list(dict.fromkeys(candidates))


@dataclass
class Expected:
    site_id: str
    code: str
    subject_id: str
    subject_name: str
    candidates: list[str]
    created: bool


def _subjects(conn: psycopg.Connection, source: str, level: str | None, type_: str | None, jurisdiction_id: str | None) -> list[dict]:
    if source == "geography.units":
        return conn.execute(
            """SELECT u.id::text AS id, u.code, u.name FROM geography.units u JOIN reference.classifications c ON c.id = u.level_id
                WHERE u.is_current AND lower(c.label) = lower(%s) AND (%s::uuid IS NULL OR u.jurisdiction_id = %s::uuid) ORDER BY u.code""",
            (level, jurisdiction_id, jurisdiction_id),
        ).fetchall()
    if source == "governance.institutions":
        return conn.execute("SELECT id::text AS id, code, name FROM governance.institutions WHERE is_current AND (%s::uuid IS NULL OR jurisdiction_id = %s::uuid) ORDER BY code", (jurisdiction_id, jurisdiction_id)).fetchall()
    raise ValueError(f"unsupported subject source {source!r}")


def expand_pattern(conn: psycopg.Connection, pattern_id: str, jurisdiction_id: str | None = None) -> list[Expected]:
    """Creates expected sites, their family membership (basis pattern) and subject links; idempotent per subject."""
    pattern = conn.execute(
        "SELECT p.id::text AS id, p.template, p.variables, f.id::text AS family_id, f.code AS family_code, f.jurisdiction_id::text AS jurisdiction_id FROM website.domain_patterns p JOIN website.families f ON f.id = p.family_id WHERE p.id = %s",
        (pattern_id,),
    ).fetchone()
    if not pattern:
        raise LookupError(f"unknown pattern {pattern_id}")
    variables = json.loads(pattern["variables"])
    slots = SLOT.findall(pattern["template"])
    if len(slots) != 1:
        raise ValueError("this version expands patterns with exactly one slot")
    slot = slots[0]
    spec = variables[slot]
    jurisdiction_id = jurisdiction_id or pattern["jurisdiction_id"]
    out: list[Expected] = []
    for subject in _subjects(conn, spec["source"], spec.get("level"), spec.get("type"), jurisdiction_id):
        code = f"{pattern['family_code']}/{subject['code'].split('/')[-1]}"
        candidates = hostnames(pattern["template"], {slot: slug_variants(subject["name"], spec["slug"])})
        row = conn.execute("SELECT id::text AS id FROM website.sites WHERE code = %s", (code,)).fetchone()
        created = row is None
        if created:
            row = conn.execute(
                "INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, description, created_at, updated_at, version) VALUES (%s, %s, 'portal', 'expected', %s, %s, now(), now(), 1) RETURNING id::text AS id",
                (code, f"{subject['name']} (expected)", jurisdiction_id, f"Expected from pattern {pattern['template']}; not yet confirmed."),
            ).fetchone()
            conn.execute("INSERT INTO website.members (site_id, family_id, role, basis, score, created_at, updated_at, version) VALUES (%s, %s, 'member', 'pattern', 0.5, now(), now(), 1)", (row["id"], pattern["family_id"]))
            conn.execute("INSERT INTO website.subjects (site_id, target_kind, target_id, relation, created_at, updated_at, version) VALUES (%s, %s, %s, 'serves', now(), now(), 1)", (row["id"], spec["source"], subject["id"]))
            incidents.record_check(conn, row["id"], "reachability", "degraded", {"type": "expected", "pattern": pattern["template"], "candidates": candidates})
        domains.ensure_candidate_domains(conn, row["id"], candidates, "pattern", f"Candidate spelling from pattern {pattern['template']} (pattern {pattern['id']}); not yet probed.")
        out.append(Expected(row["id"], code, subject["id"], subject["name"], candidates, created))
    return out


@dataclass
class ProbeResult:
    site_id: str
    outcome: str  # reachable | unreachable | refused | stopped
    host: str | None = None
    status: int | None = None
    detail: dict = field(default_factory=dict)


def probe_site(conn: psycopg.Connection, fetcher: PoliteFetcher, site_id: str, candidates: list[str], today: date | None = None) -> ProbeResult:
    """One bounded GET of the home page per candidate hostname until one answers. 401, 403, 429, challenges and repeated errors stop the probe.

    Reachable: the site becomes `discovered` and gets a primary domain. Nothing else is collected.
    """
    today = today or date.today()
    tried: list[dict] = []
    for host in candidates:
        try:
            result = fetcher.get(f"https://{host}/", purpose="assess")
        except RobotsDisallowed:
            tried.append({"host": host, "result": "robots_disallow"})
            continue
        except Denied as denied:
            incidents.record_check(conn, site_id, "reachability", "failed", {"type": "probe", "tried": tried, "denied": denied.reasons})
            return ProbeResult(site_id, "refused", detail={"reasons": denied.reasons})
        except StopRun as stop:
            incidents.record_check(conn, site_id, "reachability", "failed", {"type": "probe", "tried": tried, "stopped": stop.kind})
            conn.execute("UPDATE website.sites SET status = 'paused', updated_at = now() WHERE id = %s", (site_id,))
            return ProbeResult(site_id, "stopped", detail={"kind": stop.kind})
        except Exception as error:  # DNS failure, timeout, TLS error: this spelling does not exist
            domains.mark_probed(conn, site_id, host, "unreachable", None, None, today)
            tried.append({"host": host, "result": type(error).__name__})
            continue
        location = result.headers.get("location")
        if 200 <= result.status < 400:
            domains.mark_probed(conn, site_id, host, "reachable" if result.status < 300 else "redirects", result.status, location, today)
            conn.execute("UPDATE website.sites SET status = 'discovered', first_seen_at = COALESCE(first_seen_at, now()), last_seen_at = now(), updated_at = now() WHERE id = %s", (site_id,))
            incidents.record_check(conn, site_id, "reachability", "ok", {"type": "probe", "host": host, "status": result.status, "redirect": location, "tried": tried})
            return ProbeResult(site_id, "reachable", host, result.status, {"redirect": location})
        domains.mark_probed(conn, site_id, host, "unreachable", result.status, None, today)
        tried.append({"host": host, "result": result.status})
    conn.execute("UPDATE website.sites SET status = 'rejected', updated_at = now() WHERE id = %s AND status = 'expected'", (site_id,))
    incidents.record_check(conn, site_id, "reachability", "failed", {"type": "probe", "tried": tried})
    return ProbeResult(site_id, "unreachable", detail={"tried": tried})
