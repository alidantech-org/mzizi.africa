import json
import uuid

import pytest

from mzizi_data import candidates, compliance, incidents, jobs, registry, runner
from mzizi_data.fetch import PoliteFetcher
from tests.helpers import EMPTY, HOST, LISTING_P1, UA, Site, make_fetcher, make_site

LISTING = "/publications/budgets"


def pages(p1=LISTING_P1, p2=EMPTY):
    return {f"{LISTING}?page=1": p1, f"{LISTING}?page=2": p2}


def run(conn, store, site, **kwargs):
    ctx = runner.build_context(conn, store, "ke/treasury", make_fetcher(conn, site, **kwargs))
    return ctx, runner.run_module(ctx, "budgets")


@pytest.fixture()
def prepared(conn, store):
    # each test uses its own site code so tests do not interact
    counter = {"n": 0}

    def make(**kwargs):
        counter["n"] += 1
        unique = uuid.uuid4().hex[:10]
        code = f"ke/treasury-{counter['n']}-{unique}"
        host = f"t{counter['n']}-{unique}.example.org"
        if "scope" not in kwargs:
            kwargs["scope"] = {"hosts": [host], "schemes": ["https"], "paths": {"allow": ["/publications/"]}, "fetchModes": ["http", "api"], "maxRequestsPerSecond": 0.5}
        return code, make_site(conn, store, code=code, host=host, **kwargs)

    return make


def go(conn, store, code, site, **kwargs):
    ctx = runner.build_context(conn, store, code, make_fetcher(conn, site, **kwargs))
    return ctx, runner.run_module(ctx, "budgets")


def test_happy_path_preserves_extracts_and_stages_candidates(conn, store, prepared):
    code, (site_id, version_id) = prepared()
    site = Site(pages())
    ctx, report = go(conn, store, code, site)
    assert (report.status, report.pages, report.items, report.created) == ("completed", 2, 3, 3)
    assert all(r.headers["user-agent"] == UA for r in site.requests)
    capture = conn.execute("SELECT site_id::text, domain_id IS NOT NULL AS d, structure_version_id::text AS v, assessment_id IS NOT NULL AS a, file_version_id IS NOT NULL AS f FROM source.captures WHERE site_id = %s ORDER BY retrieved_at LIMIT 1", (site_id,)).fetchone()
    assert capture == {"site_id": site_id, "d": True, "v": version_id, "a": True, "f": True}
    rows = conn.execute("SELECT c.payload, c.status FROM staging.candidates c JOIN staging.runs r ON r.id = c.run_id JOIN source.captures cap ON cap.id = r.capture_id WHERE cap.site_id = %s", (site_id,)).fetchall()
    assert len(rows) == 3 and {r["status"] for r in rows} == {"pending"}
    assert {r["payload"]["publishedOn"] for r in rows} == {"2023-06-14", "2022-06-09", "2021-06-10"}
    assert {r["payload"]["title"] for r in rows} >= {"Citizens Guide 2021/22"}  # whitespace collapsed by the mapping


def test_a_second_run_stages_nothing_new_but_keeps_new_evidence(conn, store, prepared):
    code, (site_id, _) = prepared()
    go(conn, store, code, Site(pages()))
    _, again = go(conn, store, code, Site(pages()))
    assert (again.created, again.unchanged) == (0, 3)
    assert conn.execute("SELECT count(*) AS n FROM source.captures WHERE site_id = %s", (site_id,)).fetchone()["n"] == 4  # two pages per run


def test_a_changed_value_supersedes_the_earlier_candidate(conn, store, prepared):
    code, (site_id, _) = prepared()
    go(conn, store, code, Site(pages()))
    changed = LISTING_P1.replace("14 June 2023", "15 June 2023")
    _, report = go(conn, store, code, Site(pages(p1=changed)))
    assert report.created == 1 and report.unchanged == 2
    statuses = [r["status"] for r in conn.execute("SELECT c.status FROM staging.candidates c JOIN staging.runs r ON r.id = c.run_id JOIN source.captures cap ON cap.id = r.capture_id WHERE cap.site_id = %s AND c.payload->>'title' LIKE 'Approved%%' ORDER BY c.created_at", (site_id,)).fetchall()]
    assert statuses == ["superseded", "pending"]


def test_no_assessment_means_no_content_request(conn, store, prepared):
    code, _ = prepared(with_assessment=False)
    site = Site(pages())
    _, report = go(conn, store, code, site)
    assert report.status == "denied" and not site.content_requests and not site.requests


def test_scope_violations_are_denied_before_any_request(conn, store, prepared):
    code, _ = prepared(scope={"hosts": ["someone-else.example.org"], "schemes": ["https"], "maxRequestsPerSecond": 0.5})
    site = Site(pages())
    _, report = go(conn, store, code, site)
    assert report.status == "denied" and "outside the approved scope" in report.stopped and not site.requests


def test_robots_disallow_skips_the_request(conn, store, prepared):
    code, _ = prepared()
    site = Site(pages(), robots="User-agent: *\nDisallow: /publications/\n")
    _, report = go(conn, store, code, site)
    assert report.status == "robots" and not site.content_requests


def test_requests_are_spaced_by_the_rate_limit(conn, store, prepared):
    code, _ = prepared()
    sleeps = []
    go(conn, store, code, Site(pages()), sleeps=sleeps)
    assert sleeps and all(s >= 1.9 for s in sleeps)  # 0.5 requests per second


@pytest.mark.parametrize("status", [401, 403, 429])
def test_access_refusal_stops_the_run_pauses_the_site_and_never_retries(conn, store, prepared, status):
    code, (site_id, _) = prepared()
    # a pending job for this site must be cancelled
    jobs.enqueue(conn, "extract", {"siteId": site_id, "n": status})
    conn.commit()
    site = Site(pages(), status={f"{LISTING}?page=1": status})
    ctx, report = go(conn, store, code, site)
    assert report.status == "stopped" and report.stopped.startswith(str(status))
    assert len(site.content_requests) == 1  # no retry around the restriction
    assert conn.execute("SELECT status FROM website.sites WHERE id = %s", (site_id,)).fetchone()["status"] == "paused"
    assert conn.execute("SELECT count(*) AS n FROM engine.jobs WHERE input->>'siteId' = %s AND status = 'cancelled'", (site_id,)).fetchone()["n"] == 1
    assert conn.execute("SELECT count(*) AS n FROM website.checks WHERE site_id = %s AND outcome = 'failed'", (site_id,)).fetchone()["n"] == 1
    with pytest.raises(compliance.StopRun):  # the circuit breaker stays open
        ctx.fetcher.get(f"https://{HOST}{LISTING}?page=1")


def test_an_access_challenge_page_stops_the_run(conn, store, prepared):
    code, (site_id, _) = prepared()
    site = Site(pages(p1="<html><title>Just a moment...</title><body>Checking your browser</body></html>"))
    _, report = go(conn, store, code, site)
    assert report.status == "stopped" and "access_challenge" in report.stopped


def test_repeated_server_errors_stop_the_run(conn, store, prepared):
    code, _ = prepared()
    site = Site(pages(), status={f"{LISTING}?page=1": 503})
    _, report = go(conn, store, code, site, retries=5)
    assert report.status == "stopped" and "repeated_5xx" in report.stopped
    assert len(site.content_requests) == 3


def test_structure_drift_pauses_the_module_without_staging_anything(conn, store, prepared):
    code, (site_id, version_id) = prepared()
    site = Site(pages(p1="<html><body><div class='new-layout'>moved</div></body></html>"))
    _, report = go(conn, store, code, site)
    assert report.status == "drift" and report.created == 0
    assert conn.execute("SELECT status FROM website.sites WHERE id = %s", (site_id,)).fetchone()["status"] == "degraded"
    check = conn.execute("SELECT kind, outcome, detail FROM website.checks WHERE site_id = %s AND kind = 'drift'", (site_id,)).fetchone()
    assert check["outcome"] == "degraded" and "expected at least 3 items" in json.loads(check["detail"])["problem"]
    assert conn.execute("SELECT count(*) AS n FROM source.captures WHERE site_id = %s", (site_id,)).fetchone()["n"] == 1  # the page that failed is still preserved


def test_a_fallback_selector_is_recorded_but_does_not_stop_the_run(conn, store, prepared):
    code, (site_id, _) = prepared()
    fallback = LISTING_P1.replace('<article class="pub">', '<li class="publication">').replace("</article>", "</li>")
    _, report = go(conn, store, code, Site(pages(p1=fallback)))
    assert report.status == "completed" and report.selector == 1 and report.created == 3
    assert conn.execute("SELECT count(*) AS n FROM website.checks WHERE site_id = %s AND kind = 'fit' AND outcome = 'degraded'", (site_id,)).fetchone()["n"] == 1


def test_unexpected_personal_data_quarantines_candidates(conn, store, prepared):
    code, (site_id, _) = prepared()
    leaky = LISTING_P1.replace("Citizens Guide 2021/22", "Citizens Guide 2021/22 contact jane@example.org")
    _, report = go(conn, store, code, Site(pages(p1=leaky)))
    assert report.quarantined == 1 and report.created == 3
    row = conn.execute("SELECT c.status, i.message FROM staging.candidates c JOIN staging.issues i ON i.candidate_id = c.id WHERE c.status = 'quarantined' AND c.payload->>'title' LIKE 'Citizens%%'").fetchone()
    assert "email" in row["message"]


def test_conditional_requests_use_the_cache(conn, store, prepared, tmp_path):
    code, _ = prepared()
    seen = []
    base = Site(pages())

    def handler(request):
        seen.append(dict(request.headers))
        if request.headers.get("if-none-match") == '"v1"' and request.url.path != "/robots.txt":
            import httpx
            return httpx.Response(304)
        return base(request)

    go(conn, store, code, handler, cache_dir=tmp_path / "cache")
    go(conn, store, code, handler, cache_dir=tmp_path / "cache")
    assert any(h.get("if-none-match") == '"v1"' for h in seen)


def test_oversized_responses_are_refused(conn, store, prepared):
    code, _ = prepared()
    ctx = runner.build_context(conn, store, code, make_fetcher(conn, Site(pages(p1=b"x" * 50))))
    object.__setattr__(ctx.fetcher.limits, "max_response_bytes", 10) if False else None
    ctx.fetcher.limits = compliance.Limits(0.5, 1, 10, 30, 2)
    assert runner.run_module(ctx, "budgets").status == "too_large"


def test_legal_drift_baseline_then_change_pauses_the_site(conn, store, prepared):
    code, (site_id, _) = prepared()
    first = incidents.legal_drift_check(conn, site_id, {"robots": b"User-agent: *\nDisallow:\n", "terms": b"v1"})
    assert first["baseline"] and not first["changed"]
    same = incidents.legal_drift_check(conn, site_id, {"robots": b"User-agent: *\nDisallow:\n", "terms": b"v1"})
    assert not same["changed"]
    changed = incidents.legal_drift_check(conn, site_id, {"robots": b"User-agent: *\nDisallow:\n", "terms": b"v2: no automated access"})
    assert changed["changed"] == ["terms"] and "incident" in changed
    assert conn.execute("SELECT status FROM website.sites WHERE id = %s", (site_id,)).fetchone()["status"] == "paused"


def test_published_versions_cannot_be_activated_unless_validated_and_reload_intact(conn, store, prepared):
    code, (site_id, version_id) = prepared()
    bundle = registry.load_bundle(conn, store, version_id)
    assert bundle.manifest["site"] == "example/treasury"
    registry.demote_version(conn, version_id, "test")
    with pytest.raises(ValueError):
        registry.activate_version(conn, version_id)
    with pytest.raises(ValueError):
        registry.publish_bundle(conn, store, bundle, "site", site_id, code, {}, status="active")


def test_effective_limits_take_the_most_conservative_value():
    limits = compliance.effective_limits({"rate": {"requests_per_second": 10, "max_concurrency": 50}, "retries": {"max": 99}, "limits": {"max_response_bytes": 10**12, "timeout_seconds": 999}}, gate_requests_per_second=0.25)
    assert limits.requests_per_second == 0.25 and limits.max_concurrency == 4 and limits.max_retries == 5 and limits.timeout_seconds == 120
    assert compliance.effective_limits({}).requests_per_second == 0.5


def test_personal_data_scanner():
    assert {"email", "phone", "national_id"} <= compliance.scan_personal_data({"contact": "mail a@b.co or call 0712345678", "note": "ID No: 12345678"})
    assert "national_id" in compliance.scan_personal_data({"national_id": "x"})
    assert compliance.scan_personal_data({"title": "Approved Estimates 2023/24"}) == set()
    assert compliance.unexpected_categories({"email"}, ["email"]) == set()
    assert compliance.unexpected_categories({"email"}, ["email"], ["email"]) == {"email"}


def test_a_redirect_is_reported_as_drift_and_not_followed(conn, store, prepared):
    code, (site_id, _) = prepared()
    import httpx

    def handler(request):
        if request.url.path == "/robots.txt":
            return httpx.Response(404)
        return httpx.Response(301, headers={"location": "https://elsewhere.example.net/new"})

    _, report = go(conn, store, code, handler)
    assert report.status == "drift" and "redirected" in report.stopped
    detail = json.loads(conn.execute("SELECT detail FROM website.checks WHERE site_id = %s AND kind = 'drift'", (site_id,)).fetchone()["detail"])
    assert detail["type"] == "redirect" and "elsewhere.example.net" in detail["location"]


def test_legal_observations_come_through_the_gated_fetcher(conn, store, prepared):
    code, (site_id, _) = prepared()
    site = Site(pages())
    ctx = runner.build_context(conn, store, code, make_fetcher(conn, site))
    observations = incidents.collect_legal_observations(ctx.fetcher, "https", ctx.domains[0]["hostname"])
    assert set(observations) == {"robots"} and b"Disallow" in observations["robots"]


def test_stop_cli_command(conn, store, prepared, database_url, monkeypatch):
    code, (site_id, _) = prepared()
    monkeypatch.setenv("DATABASE_URL", database_url)
    from mzizi_data.cli import main

    assert main(["stop", code, "--reason", "complaint received"]) == 0
    conn.rollback()
    assert conn.execute("SELECT status FROM website.sites WHERE id = %s", (site_id,)).fetchone()["status"] == "paused"
