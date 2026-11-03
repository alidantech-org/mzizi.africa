import uuid

import httpx

from mzizi_data import domains, probe_domains
from tests.helpers import UA


def make_site(conn, hosts):
    code = f"ke/probe-{uuid.uuid4().hex[:8]}"
    site = str(conn.execute("INSERT INTO website.sites (code, name, kind, status, created_at, updated_at, version) VALUES (%s, %s, 'portal', 'expected', now(), now(), 1) RETURNING id", (code, code)).fetchone()["id"])
    domains.ensure_candidate_domains(conn, site, hosts, "pattern", "test")
    return site


def status_of(conn, site, host):
    return conn.execute("SELECT status::text AS s, last_http_status AS h, redirect_to AS r FROM website.domains WHERE site_id = %s AND hostname = %s", (site, host)).fetchone()


class FakeClient:
    """httpx client backed by a handler; the probe uses the gate, robots.txt and the real fetcher."""
    def __init__(self, handler):
        self.client = httpx.Client(transport=httpx.MockTransport(handler), follow_redirects=False)


def run(conn, site, host, handler):
    return probe_domains.probe_host(conn, FakeClient(handler).client, UA, site, host, ([".go.ke"], set()))


def ok_robots(handler):
    return lambda request: httpx.Response(404) if request.url.path == "/robots.txt" else handler(request)


def test_trusted_rule_accepts_go_ke_and_exact_hosts_only():
    assert probe_domains.is_trusted("nakuru.go.ke", [".go.ke"], set())
    assert probe_domains.is_trusted("orpp.or.ke", [".go.ke"], {"orpp.or.ke"})
    assert not probe_domains.is_trusted("kplc.co.ke", [".go.ke"], {"orpp.or.ke"})
    assert not probe_domains.is_trusted("evilgo.ke", [".go.ke"], set())


def test_reachable_redirect_and_moved(conn):
    a, b, c = (make_site(conn, [h]) for h in ("a.go.ke", "b.go.ke", "c.go.ke"))
    assert run(conn, a, "a.go.ke", ok_robots(lambda r: httpx.Response(200, text="home")))[0] == "reachable"
    assert run(conn, b, "b.go.ke", ok_robots(lambda r: httpx.Response(301, headers={"location": "https://www.b.go.ke/"})))[0] == "redirects"
    assert run(conn, c, "c.go.ke", ok_robots(lambda r: httpx.Response(302, headers={"location": "https://new-c.go.ke/home"})))[0] == "moved"
    assert status_of(conn, c, "c.go.ke")["r"] == "https://new-c.go.ke/home"
    assert status_of(conn, c, "new-c.go.ke")["s"] == "candidate"  # redirect target kept as a candidate alias, not deleted
    assert conn.execute("SELECT status::text AS s FROM website.sites WHERE id = %s", (a,)).fetchone()["s"] == "discovered"


def test_refusal_and_challenge_stop_the_host_and_record_refused(conn):
    a, b = make_site(conn, ["f.go.ke"]), make_site(conn, ["g.go.ke"])
    assert run(conn, a, "f.go.ke", lambda r: httpx.Response(404) if r.url.path == "/robots.txt" else httpx.Response(429))[0] == "refused"
    assert run(conn, b, "g.go.ke", ok_robots(lambda r: httpx.Response(403)))[0] == "refused"
    assert status_of(conn, a, "f.go.ke")["s"] == "refused"
    assert conn.execute("SELECT status::text AS s FROM website.sites WHERE id = %s", (a,)).fetchone()["s"] == "expected"


def test_robots_disallow_is_refused(conn):
    a = make_site(conn, ["r.go.ke"])
    robots = lambda r: httpx.Response(200, text="User-agent: *\nDisallow: /") if r.url.path == "/robots.txt" else httpx.Response(200)
    assert run(conn, a, "r.go.ke", robots)[0] == "refused"


def test_confirmed_domain_needs_consecutive_failures_to_downgrade(conn):
    a = make_site(conn, ["d.go.ke"])
    assert run(conn, a, "d.go.ke", ok_robots(lambda r: httpx.Response(200)))[0] == "reachable"
    for i in range(2):
        assert run(conn, a, "d.go.ke", ok_robots(lambda r: httpx.Response(404)))[0] == "reachable"
    assert run(conn, a, "d.go.ke", ok_robots(lambda r: httpx.Response(404)))[0] == "unreachable"


def test_candidate_fails_once_to_unreachable_and_is_never_deleted(conn):
    a = make_site(conn, ["e.go.ke"])
    assert run(conn, a, "e.go.ke", ok_robots(lambda r: httpx.Response(404)))[0] == "unreachable"
    assert status_of(conn, a, "e.go.ke")["h"] == 404


def test_probe_all_skips_untrusted_zones_and_snapshots_dns(conn, monkeypatch):
    site = make_site(conn, ["h.go.ke", "h.co.ke"])
    conn.execute("UPDATE website.domains SET last_probe_at = now() WHERE status = 'candidate' AND site_id <> %s", (site,))
    monkeypatch.setattr(probe_domains, "snapshot_dns", lambda c, res, name, domain_id=None, zone_id=None, types=probe_domains.RECORD_TYPES: "nxdomain" if name.startswith("h.go") else "exists")
    summary = probe_domains.probe_all(conn, UA, transport=httpx.MockTransport(lambda r: httpx.Response(200)), log=lambda m: None)
    assert summary["skipped_untrusted"] == ["h.co.ke"] and summary["unreachable"] == 1
    assert status_of(conn, site, "h.co.ke")["s"] == "candidate"
    assert status_of(conn, site, "h.go.ke")["s"] == "unreachable"


def test_dns_snapshot_rows(conn):
    class R:
        nameservers = ["9.9.9.9"]
    did = str(conn.execute("SELECT id FROM website.domains WHERE site_id = %s", (make_site(conn, ["s.go.ke"]),)).fetchone()["id"])
    original = probe_domains.lookup
    probe_domains.lookup = lambda res, name, rtype: ("NOERROR", ["1.2.3.4"]) if rtype == "A" else ("NOANSWER", [])
    try:
        assert probe_domains.snapshot_dns(conn, R(), "s.go.ke", domain_id=did) == "exists"
    finally:
        probe_domains.lookup = original
    rows = conn.execute("SELECT record_type, \"values\" AS v, rcode FROM website.dns_snapshots WHERE domain_id = %s", (did,)).fetchall()
    assert len(rows) == 7 and {r["record_type"]: r["v"] for r in rows}["A"] == "1.2.3.4"


def test_retry_timeouts_probes_only_timed_out_domains_with_the_longer_timeout(conn, monkeypatch):
    slow, gone = make_site(conn, ["slow.go.ke"]), make_site(conn, ["gone.go.ke"])
    conn.execute("UPDATE website.domains SET last_probe_at = now() WHERE status = 'candidate'")
    conn.execute("UPDATE website.domains SET status = 'unreachable', status_reason = 'ReadTimeout: The read operation timed out' WHERE hostname = 'slow.go.ke'")
    conn.execute("UPDATE website.domains SET status = 'unreachable', status_reason = 'ConnectError: [Errno -5] No address associated with hostname' WHERE hostname = 'gone.go.ke'")
    seen = []
    monkeypatch.setattr(probe_domains, "snapshot_dns", lambda *a, **k: seen.append(a) or "exists")
    summary = probe_domains.probe_all(conn, UA, transport=httpx.MockTransport(lambda r: httpx.Response(404) if r.url.path == "/robots.txt" else httpx.Response(200)), log=lambda m: None, retry_timeouts=True, timeout_seconds=45)
    assert summary["probed"] == 1 and summary["reachable"] == 1 and not seen
    assert status_of(conn, slow, "slow.go.ke")["s"] == "reachable" and status_of(conn, gone, "gone.go.ke")["s"] == "unreachable"
    assert conn.execute("SELECT role::text AS r FROM website.domains WHERE hostname = 'slow.go.ke'").fetchone()["r"] == "primary"
