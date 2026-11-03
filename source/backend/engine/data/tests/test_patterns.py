import re
import json
import uuid

import httpx
import pytest

from mzizi_data import compliance, fetch, fingerprint, gate, patterns
from tests.helpers import UA

COUNTY_HOME = """<html><head><meta name="generator" content="WordPress 6.4"><link href="https://fonts.googleapis.com/x.css" rel="stylesheet"><script src="https://cdn.example.org/jq.js"></script></head>
<body class="wp-site"><header class="site-header"><nav class="main-nav"><a href="/about">About Us</a><a href="/tenders">Tenders</a><a href="/downloads">Downloads</a><a href="/news">News</a><a href="/contact">Contact</a></nav></header>
<main class="site-main"><article class="post"><a href="/files/budget.pdf">Budget</a><a href="/files/plan.pdf">Plan</a></article></main><footer class="site-footer"></footer></body></html>"""
COUNTY_HOME_B = COUNTY_HOME.replace("Downloads", "Documents").replace("budget.pdf", "estimates.pdf")
OTHER = """<html><head><meta name="generator" content="Custom CMS"><script src="https://static.other.example/app.js"></script></head>
<body class="portal"><div class="top"><div class="menu"><a href="/data">Open Data</a><a href="/api">API</a></div></div>
<section class="grid"><table class="results"><tr><td>1</td></tr></table></section></body></html>"""


def test_slug_variants_cover_the_spellings_county_sites_use():
    assert patterns.slug_variants("Taita Taveta", "lowercase-strip-county") == ["taitataveta", "taita-taveta"]
    assert patterns.slug_variants("Murang'a County", "lowercase-strip-county") == ["muranga"]
    assert patterns.slug_variants("Elgeyo-Marakwet", "lowercase-strip-county") == ["elgeyomarakwet", "elgeyo-marakwet"]
    assert patterns.slug_variants("Kenya National Bureau of Statistics", "initials")[0] == "knbos"
    with pytest.raises(ValueError):
        patterns.slug_variants("x", "no-such-rule")


def test_hostname_templates():
    assert patterns.hostnames("{county}.go.ke", {"county": ["taitataveta", "taita-taveta"]}) == ["taitataveta.go.ke", "taita-taveta.go.ke"]
    assert patterns.hostnames("{county}assembly.go.ke", {"county": ["nairobi"]}) == ["nairobiassembly.go.ke"]
    with pytest.raises(KeyError):
        patterns.hostnames("{county}.go.ke", {})


def family_pattern(conn, template="{county}.go.ke", level="county"):
    conn.execute("INSERT INTO reference.jurisdictions (code, name, kind, is_current, created_at, updated_at, version) VALUES ('ke', 'Kenya', 'modern_state', true, now(), now(), 1) ON CONFLICT DO NOTHING")
    jid = str(conn.execute("SELECT id FROM reference.jurisdictions WHERE code='ke'").fetchone()["id"])
    code = f"ke/test-{uuid.uuid4().hex[:6]}"
    fam = str(conn.execute("INSERT INTO website.families (code, name, kind, status, jurisdiction_id, created_at, updated_at, version) VALUES (%s, 'County sites', 'geographic_unit', 'active', %s, now(), now(), 1) RETURNING id", (code, jid)).fetchone()["id"])
    pat = str(conn.execute("INSERT INTO website.domain_patterns (family_id, template, scheme, domain_role, variables, status, created_at, updated_at, version) VALUES (%s, %s, 'https', 'primary', %s, 'proposed', now(), now(), 1) RETURNING id", (fam, template, json.dumps({"county": {"source": "geography.units", "level": level, "slug": "lowercase-strip-county"}}))).fetchone()["id"])
    lvl = conn.execute("INSERT INTO reference.classifications (jurisdiction_id, scheme, code, label, \"order\", is_current, created_at, updated_at, version) VALUES (%s, 'geography/level', %s, %s, 1, true, now(), now(), 1) ON CONFLICT DO NOTHING RETURNING id", (jid, f"geography/level/{level}", level)).fetchone()
    level_id = str(lvl["id"]) if lvl else str(conn.execute("SELECT id FROM reference.classifications WHERE code = %s", (f"geography/level/{level}",)).fetchone()["id"])
    return jid, fam, pat, code, level_id


def add_unit(conn, jid, level_id, code, name):
    return str(conn.execute("INSERT INTO geography.units (code, name, kind, is_active, is_current, jurisdiction_id, level_id, created_at, updated_at, version) VALUES (%s, %s, 'territorial', true, true, %s, %s, now(), now(), 1) RETURNING id", (code, name, jid, level_id)).fetchone()["id"])


def test_expansion_creates_expected_sites_with_membership_subjects_and_candidates_once(conn):
    jid, fam, pat, fcode, level_id = family_pattern(conn)
    suffix = uuid.uuid4().hex[:5]
    add_unit(conn, jid, level_id, f"ke/taita-taveta-{suffix}", "Taita Taveta")
    add_unit(conn, jid, level_id, f"ke/kisumu-{suffix}", "Kisumu")
    first = patterns.expand_pattern(conn, pat, jid)
    names = {e.subject_name: e for e in first if e.code.endswith(suffix)}
    assert names["Taita Taveta"].candidates == ["taitataveta.go.ke", "taita-taveta.go.ke"] and names["Kisumu"].candidates == ["kisumu.go.ke"]
    assert all(e.created for e in names.values())
    site = names["Kisumu"].site_id
    assert conn.execute("SELECT status FROM website.sites WHERE id = %s", (site,)).fetchone()["status"] == "expected"
    assert conn.execute("SELECT basis FROM website.members WHERE site_id = %s AND family_id = %s", (site, fam)).fetchone()["basis"] == "pattern"
    assert conn.execute("SELECT relation FROM website.subjects WHERE site_id = %s", (site,)).fetchone()["relation"] == "serves"
    # every spelling variant is a candidate domain row until probed
    rows = conn.execute("SELECT hostname, status, origin, role FROM website.domains WHERE site_id = %s ORDER BY role", (names["Taita Taveta"].site_id,)).fetchall()
    assert sorted([(r["hostname"], r["status"], r["origin"], r["role"]) for r in rows]) == sorted([("taitataveta.go.ke", "candidate", "pattern", "primary"), ("taita-taveta.go.ke", "candidate", "pattern", "alias")])
    assert conn.execute("SELECT count(*) AS n FROM website.domains WHERE site_id = %s", (site,)).fetchone()["n"] == 1
    again = patterns.expand_pattern(conn, pat, jid)
    assert not any(e.created for e in again if e.code.endswith(suffix))
    assert conn.execute("SELECT count(*) AS n FROM website.domains WHERE site_id = %s", (names["Taita Taveta"].site_id,)).fetchone()["n"] == 2


def test_candidate_rows_never_downgrade_a_confirmed_domain_and_link_zone_and_parent(conn):
    from mzizi_data import domains

    jid, fam, pat, fcode, level_id = family_pattern(conn)
    suffix = uuid.uuid4().hex[:5]
    add_unit(conn, jid, level_id, f"ke/nyeri-{suffix}", "Nyeri")
    site = next(e for e in patterns.expand_pattern(conn, pat, jid) if e.code.endswith(suffix)).site_id
    conn.execute("UPDATE website.domains SET status = 'reachable' WHERE site_id = %s", (site,))
    zone = f"{suffix}.ke"
    conn.execute("INSERT INTO website.domain_zones (suffix, created_at, updated_at, version) VALUES (%s, now(), now(), 1)", (zone,))
    assert domains.ensure_candidate_domains(conn, site, ["nyeri.go.ke", f"portal.nyeri.{zone}", f"nyeri.{zone}"], "pattern", "again") == 2
    assert domains.ensure_candidate_domains(conn, site, ["nyeri.go.ke", f"portal.nyeri.{zone}", f"nyeri.{zone}"], "pattern", "again") == 0
    assert conn.execute("SELECT status FROM website.domains WHERE site_id = %s AND hostname = 'nyeri.go.ke'", (site,)).fetchone()["status"] == "reachable"
    domains.link_domains(conn)
    sub = conn.execute("SELECT d.is_apex, d.zone_id IS NOT NULL AS z, p.hostname AS parent FROM website.domains d LEFT JOIN website.domains p ON p.id = d.parent_domain_id WHERE d.site_id = %s AND d.hostname = %s", (site, f"portal.nyeri.{zone}")).fetchone()
    assert (sub["is_apex"], sub["z"], sub["parent"]) == (False, True, f"nyeri.{zone}")


def probe_setup(conn, handler, sleeps=None, allow=True):
    jid, fam, pat, fcode, level_id = family_pattern(conn, template="{county}.go.ke")
    suffix = uuid.uuid4().hex[:5]
    add_unit(conn, jid, level_id, f"ke/taita-taveta-{suffix}", "Taita Taveta")
    expected = next(e for e in patterns.expand_pattern(conn, pat, jid) if e.code.endswith(suffix))
    conn.commit()
    state = {"t": 0.0}
    def sleep(seconds):
        state["t"] += seconds
        sleeps is not None and sleeps.append(seconds)
    limits = compliance.effective_limits({"rate": {"requests_per_second": 0.5}})
    fetcher = fetch.PoliteFetcher(user_agent=UA, limits=limits, gate=lambda request: gate.check_collection(conn, request), site_id=expected.site_id, client=httpx.Client(transport=httpx.MockTransport(handler)), sleep=sleep, clock=lambda: state["t"])
    return expected, fetcher


def test_probe_confirms_the_first_spelling_that_answers_and_adds_the_domain(conn):
    seen = []
    def handler(request):
        seen.append(request.url.host)
        if request.url.path == "/robots.txt":
            return httpx.Response(404)
        return httpx.Response(200, text="<html>home</html>") if request.url.host == "taita-taveta.go.ke" else httpx.Response(404)
    expected, fetcher = probe_setup(conn, handler)
    result = patterns.probe_site(conn, fetcher, expected.site_id, expected.candidates)
    assert (result.outcome, result.host) == ("reachable", "taita-taveta.go.ke")
    assert conn.execute("SELECT status FROM website.sites WHERE id = %s", (expected.site_id,)).fetchone()["status"] == "discovered"
    rows = {d["hostname"]: (d["status"], d["role"]) for d in conn.execute("SELECT hostname, status, role FROM website.domains WHERE site_id = %s", (expected.site_id,)).fetchall()}
    assert rows == {"taita-taveta.go.ke": ("reachable", "primary"), "taitataveta.go.ke": ("unreachable", "alias")}
    assert conn.execute("SELECT outcome FROM website.checks WHERE site_id = %s AND kind = 'reachability' ORDER BY checked_at DESC LIMIT 1", (expected.site_id,)).fetchone()["outcome"] == "ok"


def test_probe_rejects_a_site_when_no_spelling_answers(conn):
    expected, fetcher = probe_setup(conn, lambda request: httpx.Response(404, text="nothing") if request.url.path != "/robots.txt" else httpx.Response(404))
    result = patterns.probe_site(conn, fetcher, expected.site_id, expected.candidates)
    assert result.outcome == "unreachable"
    assert conn.execute("SELECT status FROM website.sites WHERE id = %s", (expected.site_id,)).fetchone()["status"] == "rejected"


def test_probe_stops_and_pauses_on_a_refusal_and_never_tries_the_next_spelling(conn):
    seen = []
    def handler(request):
        seen.append(request.url.host)
        return httpx.Response(404) if request.url.path == "/robots.txt" else httpx.Response(403, text="forbidden")
    expected, fetcher = probe_setup(conn, handler)
    result = patterns.probe_site(conn, fetcher, expected.site_id, expected.candidates)
    assert result.outcome == "stopped" and result.detail["kind"] == "403"
    assert conn.execute("SELECT status FROM website.sites WHERE id = %s", (expected.site_id,)).fetchone()["status"] == "paused"
    assert len([h for h in seen if h == "taitataveta.go.ke"]) == 2 and "taita-taveta.go.ke" not in seen  # robots + home of the first spelling only


def test_probes_are_spaced_by_the_rate_limit(conn):
    sleeps = []
    expected, fetcher = probe_setup(conn, lambda request: httpx.Response(404), sleeps=sleeps)
    patterns.probe_site(conn, fetcher, expected.site_id, expected.candidates)
    assert sleeps and all(s >= 1.9 for s in sleeps)


def test_probe_is_refused_for_a_site_whose_legal_status_forbids_contact(conn):
    expected, fetcher = probe_setup(conn, lambda request: httpx.Response(200, text="x"))
    jid = str(conn.execute("SELECT id FROM reference.jurisdictions WHERE code='ke'").fetchone()["id"])
    conn.execute("INSERT INTO website.assessments (site_id, jurisdiction_id, status, source_type, access_basis, rights_holder, personal_data_categories, approved_scope, is_current, created_at, updated_at, version) VALUES (%s, %s, 'rejected', 'official_website', 'published_terms', 'unknown', '[]', '{\"hosts\":[]}', true, now(), now(), 1)", (expected.site_id, jid))
    result = patterns.probe_site(conn, fetcher, expected.site_id, expected.candidates)
    assert result.outcome == "refused"


def test_fingerprints_rank_similar_sites_and_suggest_family_and_relation(conn):
    def site(prefix):
        return str(conn.execute("INSERT INTO website.sites (code, name, kind, status, created_at, updated_at, version) VALUES (%s, %s, 'portal', 'active', now(), now(), 1) RETURNING id", (f"ke/{prefix}-{uuid.uuid4().hex[:6]}", prefix)).fetchone()["id"])
    a, b, c = site("county-a"), site("county-b"), site("portal-c")
    fam = str(conn.execute("INSERT INTO website.families (code, name, kind, status, created_at, updated_at, version) VALUES (%s, 'Counties', 'geographic_unit', 'active', now(), now(), 1) RETURNING id", (f"ke/fam-{uuid.uuid4().hex[:6]}",)).fetchone()["id"])
    conn.execute("INSERT INTO website.members (site_id, family_id, role, basis, created_at, updated_at, version) VALUES (%s, %s, 'member', 'agent', now(), now(), 1)", (a, fam))
    for sid, html in ((a, COUNTY_HOME), (b, COUNTY_HOME_B), (c, OTHER)):
        fingerprint.store_fingerprint(conn, sid, html)
    fa, fb, fc = (fingerprint.latest_features(conn, s) for s in (a, b, c))
    assert fingerprint.similarity(fa, fb) > 0.6 > 0.3 > fingerprint.similarity(fa, fc)
    suggestions = fingerprint.suggest(conn, b)
    kinds = {(s.kind, s.other_id) for s in suggestions}
    assert ("membership", fam) in kinds and ("relation", a) in kinds and not any(s.other_id == c for s in suggestions)
    assert conn.execute("SELECT basis FROM website.members WHERE site_id = %s AND family_id = %s", (b, fam)).fetchone()["basis"] == "fingerprint"
    tags = {r["tag"] for r in conn.execute("SELECT tag FROM website.traits WHERE owner_id = %s", (b,)).fetchall()}
    assert {"platform:wordpress", "section:downloads", "section:tenders", "section:news"} <= tags or {"platform:wordpress", "section:tenders", "section:news"} <= tags
    # suggestions are idempotent
    again = fingerprint.suggest(conn, b)
    assert conn.execute("SELECT count(*) AS n FROM website.relations WHERE from_id = %s AND to_id = %s", (b, a)).fetchone()["n"] == 1
    assert not any(s.kind == "membership" for s in again)


def test_all_47_published_county_names_expand_to_unique_valid_hostnames():
    from pathlib import Path

    data = json.loads((Path(__file__).parent / "data" / "geoboundaries" / "KEN-ADM1-simplified.geojson").read_text())
    names = [f["properties"]["shapeName"] for f in data["features"]]
    assert len(names) == 47
    hosts = [h for n in names for h in patterns.hostnames("{county}.go.ke", {"county": patterns.slug_variants(n, "lowercase-strip-county")})]
    assert len(set(hosts)) == len(hosts)
    assert all(re.fullmatch(r"[a-z0-9-]+\.go\.ke", h) for h in hosts)


SPELL = {"ngcdf.go.ke": {"source": "https://ngcdf.go.ke/constituency/", "retrievedAt": "2026-11-02", "labels": ["kitutuchache-south", "juja", "dagoretti-north"],
                          "overrides": {"Kitutu Chache South": "kitutuchache-south"}, "overrideNotes": {"Kitutu Chache South": "Directory joins Chache."},
                          "unmapped": {"dagoretti-north": "Dagoretti"}, "nonConstituencyHosts": ["www"]}}


def ngcdf_site(conn, jid, level_id, name, hosts):
    uid = add_unit(conn, jid, level_id, f"ke/{uuid.uuid4().hex[:8]}", name)
    code = f"ke/ngcdf/{uuid.uuid4().hex[:8]}"
    site = str(conn.execute("INSERT INTO website.sites (code, name, kind, status, created_at, updated_at, version) VALUES (%s, %s, 'portal', 'expected', now(), now(), 1) RETURNING id", (code, name)).fetchone()["id"])
    conn.execute("INSERT INTO website.subjects (site_id, target_kind, target_id, relation, created_at, updated_at, version) VALUES (%s, 'geography.units', %s, 'serves', now(), now(), 1)", (site, uid))
    from mzizi_data import domains
    domains.ensure_candidate_domains(conn, site, hosts, "pattern", "test")
    return site


def test_spelling_override_comes_first_in_expansion_candidates():
    assert patterns.spelling_for("{constituency}.ngcdf.go.ke", "Kitutu Chache South", SPELL) == "kitutuchache-south"
    assert patterns.spelling_for("{constituency}.ngcdf.go.ke", "Juja", SPELL) is None


def test_apply_directory_adds_listed_hosts_marks_unlisted_variants_and_is_idempotent(conn):
    jid, fam, pat, fcode, level_id = family_pattern(conn, "{county}.go.ke", "constituency")
    chache = ngcdf_site(conn, jid, level_id, "Kitutu Chache South", ["kitutuchachesouth.ngcdf.go.ke", "kitutu-chache-south.ngcdf.go.ke"])
    juja = ngcdf_site(conn, jid, level_id, "Juja", ["juja.ngcdf.go.ke", "jujaa.ngcdf.go.ke"])
    dag = ngcdf_site(conn, jid, level_id, "Dagoretti", ["dagoretti.ngcdf.go.ke"])
    conn.execute("UPDATE website.domains SET status = 'reachable' WHERE hostname = 'juja.ngcdf.go.ke'")
    first = patterns.apply_directory(conn, spellings=SPELL)
    assert first["added"] == 1 and first["unmapped_attached"] == 1 and first["marked_not_listed"] >= 3
    row = conn.execute("SELECT origin::text AS o, status::text AS s FROM website.domains WHERE hostname = 'kitutuchache-south.ngcdf.go.ke' AND site_id = %s", (chache,)).fetchone()
    assert row["o"] == "page_link" and row["s"] == "candidate"
    assert conn.execute("SELECT status::text AS s FROM website.domains WHERE hostname = 'jujaa.ngcdf.go.ke'").fetchone()["s"] == "unreachable"
    assert conn.execute("SELECT status::text AS s FROM website.domains WHERE hostname = 'juja.ngcdf.go.ke'").fetchone()["s"] == "reachable"  # listed and confirmed: untouched
    assert conn.execute("SELECT count(*)::int AS n FROM website.domains WHERE site_id = %s", (dag,)).fetchone()["n"] == 2
    second = patterns.apply_directory(conn, spellings=SPELL)
    assert second["added"] == 0 and second["unmapped_attached"] == 0
