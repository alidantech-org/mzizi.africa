"""Candidate domain records for sites (offline; no network request is made).

Every candidate hostname of a site gets a `website.domains` row with status `candidate`, an origin
(how the hostname was found), a reason, its registry zone and, for subdomains, a parent domain. Rows are
only ever added or have empty links filled: an existing row keeps its status and facts, so a confirmed
domain is never downgraded by a later expansion or backfill.
"""
from __future__ import annotations

from datetime import date

import psycopg


def zone_for(conn: psycopg.Connection, host: str) -> dict | None:
    """The longest registry zone suffix the hostname sits under (go.ke before ke), or None."""
    return conn.execute(
        "SELECT id::text AS id, suffix FROM website.domain_zones WHERE %s LIKE '%%.' || suffix ORDER BY length(suffix) DESC LIMIT 1",
        (host,),
    ).fetchone()


def ensure_candidate_domains(conn: psycopg.Connection, site_id: str, hosts: list[str], origin: str, reason: str, today: date | None = None) -> int:
    """Adds a candidate row for each hostname the site does not have yet; returns how many were created.

    The first spelling is the primary domain unless the site already has one; the others are aliases.
    """
    today = today or date.today()
    created = 0
    for host in hosts:
        host = host.lower().strip(".")
        if conn.execute("SELECT 1 FROM website.domains WHERE site_id = %s AND hostname = %s", (site_id, host)).fetchone():
            continue
        has_primary = conn.execute("SELECT 1 FROM website.domains WHERE site_id = %s AND role = 'primary'", (site_id,)).fetchone()
        zone = zone_for(conn, host)
        is_apex = None if zone is None else host.count(".") == zone["suffix"].count(".") + 1
        conn.execute(
            """INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, status, status_reason, origin, is_apex, zone_id, created_at, updated_at, version)
               VALUES (%s, %s, 'https', %s, %s, 'exact', 'candidate', %s, %s, %s, %s, now(), now(), 1)""",
            (site_id, host, "alias" if has_primary else "primary", today, reason, origin, is_apex, zone["id"] if zone else None),
        )
        created += 1
    return created


def mark_probed(conn: psycopg.Connection, site_id: str, host: str, status: str, http_status: int | None, redirect_to: str | None, today: date | None = None) -> None:
    """Records a probe result on the host's domain row (creating a primary row if the host was not a candidate).

    A confirmed state is never downgraded by a failed probe: `unreachable` only replaces `candidate`.
    """
    today = today or date.today()
    ensure_candidate_domains(conn, site_id, [host], "pattern", "Added when probed.", today)
    if status == "reachable":  # the spelling that answered becomes the primary domain
        conn.execute("UPDATE website.domains SET role = 'alias', updated_at = now() WHERE site_id = %s AND role = 'primary' AND hostname <> %s", (site_id, host.lower()))
        conn.execute("UPDATE website.domains SET role = 'primary', updated_at = now() WHERE site_id = %s AND hostname = %s", (site_id, host.lower()))
    keep_confirmed = "AND status = 'candidate'" if status == "unreachable" else ""
    conn.execute(
        f"""UPDATE website.domains SET status = %s, last_probe_at = now(), last_http_status = %s, redirect_to = %s,
                   observed_at = CASE WHEN %s = 'unreachable' THEN observed_at ELSE now() END,
                   status_reason = %s, updated_at = now() WHERE site_id = %s AND hostname = %s {keep_confirmed}""",
        (status, http_status, redirect_to, status, f"Probe answered {http_status}" if http_status else "Probe failed before an HTTP answer", site_id, host.lower()),
    )


def link_domains(conn: psycopg.Connection) -> dict:
    """Fills empty zone, apex and parent links on every domain; never changes a link already set."""
    zones = conn.execute(
        """UPDATE website.domains d SET zone_id = z.id, updated_at = now()
             FROM (SELECT DISTINCT ON (d2.id) d2.id AS did, z2.id FROM website.domains d2 JOIN website.domain_zones z2 ON d2.hostname LIKE '%.' || z2.suffix
                   WHERE d2.zone_id IS NULL ORDER BY d2.id, length(z2.suffix) DESC) z
            WHERE d.id = z.did"""
    ).rowcount
    apex = conn.execute(
        """UPDATE website.domains d SET is_apex = (length(d.hostname) - length(replace(d.hostname, '.', ''))) = (length(z.suffix) - length(replace(z.suffix, '.', ''))) + 1, updated_at = now()
             FROM website.domain_zones z WHERE d.zone_id = z.id AND d.is_apex IS NULL"""
    ).rowcount
    parents = conn.execute(
        """UPDATE website.domains d SET parent_domain_id = p.id, updated_at = now()
             FROM (SELECT DISTINCT ON (c.id) c.id AS cid, q.id FROM website.domains c JOIN website.domains q ON q.hostname = substring(c.hostname FROM position('.' IN c.hostname) + 1) AND q.id <> c.id
                   WHERE c.parent_domain_id IS NULL AND c.is_apex = false ORDER BY c.id, (q.status = 'reachable') DESC, q.created_at) p
            WHERE d.id = p.cid"""
    ).rowcount
    return {"zones": zones, "apex": apex, "parents": parents}


def backfill_from_checks(conn: psycopg.Connection) -> dict:
    """Creates candidate rows for expected sites from their reachability-check candidate lists, marks domains already
    observed through a profiled site as reachable (only candidates are touched), then links zones and parents."""
    created = 0
    rows = conn.execute(
        "SELECT DISTINCT ON (c.site_id) c.site_id::text AS site_id, c.detail FROM website.checks c WHERE c.kind = 'reachability' AND c.detail LIKE '%expected%' ORDER BY c.site_id, c.checked_at"
    ).fetchall()
    for row in rows:
        detail = row["detail"] if isinstance(row["detail"], dict) else __import__("json").loads(row["detail"])
        hosts = detail.get("candidates") or []
        if detail.get("pattern"):
            origin, reason = "pattern", f"Candidate spelling from pattern {detail['pattern']}; not yet probed."
        else:
            origin, reason = "seed_research", f"Candidate hostname from {detail.get('source') or 'seed research'}; not yet probed."
        created += ensure_candidate_domains(conn, row["site_id"], hosts, origin, reason)
    confirmed = conn.execute(
        """UPDATE website.domains SET status = 'reachable', origin = COALESCE(origin, 'manual'), updated_at = now(),
                  status_reason = 'Content was fetched through this hostname when the site was profiled (observed_at is set); no separate probe result is recorded.'
            WHERE status = 'candidate' AND observed_at IS NOT NULL"""
    ).rowcount
    return {"created": created, "marked_reachable": confirmed, **link_domains(conn)}


def report(conn: psycopg.Connection) -> dict:
    def by(sql: str) -> dict:
        return {str(r["k"]): r["n"] for r in conn.execute(sql).fetchall()}

    return {
        "total": conn.execute("SELECT count(*)::int AS n FROM website.domains").fetchone()["n"],
        "by_status": by("SELECT status::text AS k, count(*)::int AS n FROM website.domains GROUP BY 1 ORDER BY 1"),
        "by_origin": by("SELECT coalesce(origin::text, 'none') AS k, count(*)::int AS n FROM website.domains GROUP BY 1 ORDER BY 1"),
        "by_zone": by("SELECT coalesce(z.suffix, 'none') AS k, count(*)::int AS n FROM website.domains d LEFT JOIN website.domain_zones z ON z.id = d.zone_id GROUP BY 1 ORDER BY 2 DESC"),
        "with_parent": conn.execute("SELECT count(*)::int AS n FROM website.domains WHERE parent_domain_id IS NOT NULL").fetchone()["n"],
        "sites_without_domain": conn.execute("SELECT count(*)::int AS n FROM website.sites s WHERE NOT EXISTS (SELECT 1 FROM website.domains d WHERE d.site_id = s.id)").fetchone()["n"],
    }
