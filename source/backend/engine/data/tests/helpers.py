"""Builds a small registry (jurisdiction, site, domain, assessment, dossier, active structure) for runner tests."""
from __future__ import annotations

import json
from pathlib import Path

import httpx

from mzizi_data import compliance, fetch, gate, registry
from mzizi_data.structure import bundle as bundle_mod
from mzizi_data.structure.validate import validate

SAMPLES = Path(__file__).resolve().parents[1] / "samples"
HOST = "treasury.example.org"
UA = "MziziBot/1.0 (+https://mzizi.africa/bot; contact@mzizi.africa)"

LISTING_P1 = """<html><body>
<article class="pub"><a href="/publications/budgets/a.pdf">Approved Estimates 2023/24</a><span class="date">14 June 2023</span></article>
<article class="pub"><a href="/publications/budgets/b.pdf">Budget Statement 2022/23</a><span class="date">09 June 2022</span></article>
<article class="pub"><a href="/publications/budgets/c.pdf">Citizens Guide 2021/22</a><span class="date">10 June 2021</span></article>
</body></html>"""
EMPTY = "<html><body><main></main></body></html>"


def make_site(conn, store, code="ke/treasury", scope=None, status="approved", categories=None, with_assessment=True, with_dossier=True, sample="html-publications", host=HOST, rewrite_host=True):
    conn.execute("INSERT INTO reference.jurisdictions (code, name, kind, is_current, created_at, updated_at, version) VALUES ('ke', 'Kenya', 'modern_state', true, now(), now(), 1) ON CONFLICT DO NOTHING")
    jid = str(conn.execute("SELECT id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()["id"])
    row = conn.execute("SELECT id FROM website.sites WHERE code = %s", (code,)).fetchone()
    if row:
        site_id = str(row["id"])
        conn.execute("UPDATE website.sites SET status = 'active' WHERE id = %s", (site_id,))
    else:
        site_id = str(conn.execute("INSERT INTO website.sites (code, name, kind, status, jurisdiction_id, created_at, updated_at, version) VALUES (%s, %s, 'portal', 'active', %s, now(), now(), 1) RETURNING id", (code, "Test site", jid)).fetchone()["id"])
        conn.execute("INSERT INTO website.domains (site_id, hostname, scheme, role, valid_from, valid_from_precision, created_at, updated_at, version) VALUES (%s, %s, 'https', 'primary', '2015-01-01', 'year', now(), now(), 1)", (site_id, host))
    if with_assessment:
        conn.execute("UPDATE website.assessments SET is_current = false WHERE site_id = %s", (site_id,))
        scope = scope or {"hosts": [host], "schemes": ["https"], "paths": {"allow": ["/publications/"]}, "fetchModes": ["http", "api"], "maxRequestsPerSecond": 0.5}
        conn.execute(
            """INSERT INTO website.assessments (site_id, jurisdiction_id, status, source_type, access_basis, rights_holder, personal_data_categories, approved_scope, reviewed_by, reviewed_at, review_due_at, is_current, created_at, updated_at, version)
               VALUES (%s, %s, %s, 'official_website', 'published_terms', 'unknown', %s, %s, gen_random_uuid(), now(), now() + interval '1 year', true, now(), now(), 1)""",
            (site_id, jid, status, json.dumps(categories or ["none_known"]), json.dumps(scope)),
        )
    if with_dossier and not conn.execute("SELECT 1 FROM website.dossiers WHERE jurisdiction_id = %s AND is_current", (jid,)).fetchone():
        conn.execute("INSERT INTO website.dossiers (jurisdiction_id, applicable_laws, launch_stage, is_current, created_at, updated_at, version) VALUES (%s, '[]', 'pilot', true, now(), now(), 1)", (jid,))
    base = bundle_mod.load(SAMPLES / sample)
    files = dict(base.files)
    if rewrite_host:
        files["manifest.yml"] = files["manifest.yml"].replace("treasury.example.org", host)
    bundle = bundle_mod.from_files("test", files)
    version_id = registry.publish_bundle(conn, store, bundle, "site", site_id, code, validate(bundle).to_json())
    registry.activate_version(conn, version_id)
    conn.commit()
    return site_id, version_id


def make_fetcher(conn, handler, rps=0.5, sleeps=None, cache_dir=None, retries=2):
    def factory(site_id, policy, mode):
        clock_state = {"t": 0.0}
        def sleep(seconds):
            clock_state["t"] += seconds
            if sleeps is not None:
                sleeps.append(seconds)
        limits = compliance.effective_limits(policy)
        object.__setattr__(limits, "max_retries", retries) if False else None
        return fetch.PoliteFetcher(
            user_agent=policy["identify"]["user_agent"], limits=limits, gate=lambda request: gate.check_collection(conn, request), site_id=site_id, fetch_mode=mode,
            client=httpx.Client(transport=httpx.MockTransport(handler)), cache_dir=cache_dir, sleep=sleep, clock=lambda: clock_state["t"],
        )
    return factory


class Site:
    """A scripted site: routes by path, counts requests, records the headers it saw."""

    def __init__(self, pages=None, robots="User-agent: *\nDisallow: /private/\n", status=None):
        self.pages = pages or {}
        self.robots, self.status = robots, status or {}
        self.requests: list[httpx.Request] = []

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        path = request.url.path
        if path == "/robots.txt":
            return httpx.Response(200 if self.robots is not None else 404, text=self.robots or "")
        key = f"{path}?{request.url.query.decode()}" if request.url.query else path
        if key in self.status:
            return httpx.Response(self.status[key], text="x")
        if key in self.pages:
            body = self.pages[key]
            return httpx.Response(200, content=body if isinstance(body, bytes) else body.encode(), headers={"content-type": "text/html", "etag": '"v1"'})
        return httpx.Response(404, text="not found")

    @property
    def content_requests(self):
        return [r for r in self.requests if r.url.path != "/robots.txt"]
