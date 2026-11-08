import json
import os
import subprocess
from pathlib import Path

import httpx
import pytest

from mzizi_data import batch, compliance, fetch, registry, runner
from mzizi_data.seedroot import SEED_ROOT
from tests.helpers import UA, Site, make_fetcher

PILOTS = {
    "ke-iebc": SEED_ROOT / "ke" / "sites" / "ke-iebc",
    "ke-parliament": SEED_ROOT / "ke" / "sites" / "ke-parliament",
    "world-geoboundaries": SEED_ROOT / "global" / "sites" / "world-geoboundaries",
}
DATABASE_ENGINE = Path(__file__).resolve().parents[2] / "database"


@pytest.fixture(scope="module")
def pilots_db(database_url):
    out = subprocess.run(["bun", "src/cli.ts", "seed", "research"], cwd=DATABASE_ENGINE, env={**os.environ, "DATABASE_URL": database_url}, capture_output=True, text=True)
    assert out.returncode == 0, out.stderr
    return database_url


def test_user_agent_must_name_a_real_monitored_contact():
    with pytest.raises(compliance.IdentityMissing):
        compliance.resolve_user_agent({"identify": {"user_agent": "MziziBot/0.1 (+https://example.invalid/bot; contact@example.invalid)"}}, environ={})
    with pytest.raises(compliance.IdentityMissing):
        compliance.resolve_user_agent({}, environ={})
    assert compliance.resolve_user_agent({"identify": {"user_agent": "X/1 (+https://bot.mzizi.test; a@b.co)"}}, environ={"MZIZI_USER_AGENT": "MziziBot/1.0 (+https://bot.realhost.org/info; ops@realhost.org)"}).startswith("MziziBot/1.0")


def test_pilot_bundles_validate_and_the_dry_runs_find_real_items():
    for name, module, minimum in [("ke-iebc", "party-list", 5), ("ke-parliament", "budget-documents", 5), ("world-geoboundaries", "releases", 1)]:
        from mzizi_data.structure import bundle as b
        from mzizi_data.structure.validate import validate

        report = validate(b.load(PILOTS[name]))
        assert report.ok, report.errors
        assert report.dry_run[module]["items"] >= minimum and report.dry_run[module]["fieldErrors"] == 0


def test_registry_seed_holds_the_pilot_sites_with_their_domains(conn, pilots_db):
    rows = conn.execute("SELECT s.code, s.status, d.hostname, d.role FROM website.sites s JOIN website.domains d ON d.site_id = s.id WHERE s.code IN ('ke/iebc','ke/parliament','world/geoboundaries') ORDER BY s.code, d.role").fetchall()
    assert {(r["code"], r["hostname"]) for r in rows} == {("ke/iebc", "www.iebc.or.ke"), ("ke/parliament", "www.parliament.go.ke"), ("ke/parliament", "parliament.go.ke"), ("world/geoboundaries", "www.geoboundaries.org")}
    assert {r["status"] for r in rows} == {"profiled"}
    assert conn.execute("SELECT count(*) AS n FROM source.attributions a JOIN website.domains d ON d.id = a.target_id").fetchone()["n"] == 0  # registry rows are not claims


def test_submit_activate_demote_and_the_gate_stays_closed(conn, store, pilots_db):
    first = batch.submit(conn, store, PILOTS["ke-iebc"], agent="test-agent", model="test-model")
    conn.commit()
    assert (first.status, first.number) == ("validated", 1) and first.version_id
    method = conn.execute("SELECT m.kind, m.model, m.tool FROM website.structure_versions v JOIN source.methods m ON m.id = v.method_id WHERE v.id = %s", (first.version_id,)).fetchone()
    assert method == {"kind": "ai_assisted", "model": "test-model", "tool": "test-agent"}
    assert conn.execute("SELECT status FROM website.structure_versions WHERE id = %s", (first.version_id,)).fetchone()["status"] == "validated"
    assert registry.active_version(conn, "site", conn.execute("SELECT id::text AS id FROM website.sites WHERE code='ke/iebc'").fetchone()["id"]) is None  # publishing did not activate
    # the files round-trip with an intact hash
    assert registry.load_bundle(conn, store, first.version_id).manifest["site"] == "ke/iebc"
    batch.activate(conn, first.version_id)
    conn.commit()
    ctx = runner.build_context(conn, store, "ke/iebc", make_fetcher(conn, Site({})))
    report = runner.run_module(ctx, "party-list")
    assert report.status == "denied" and "legal status is not_reviewed" in report.stopped  # active, valid, and still not allowed to collect
    second = batch.submit(conn, store, PILOTS["ke-iebc"], agent="test-agent")
    assert second.number == 2
    batch.demote(conn, second.version_id, "superseded by a better recipe")
    assert [v["status"] for v in batch.list_versions(conn, "ke/iebc")][-1] == "rejected"


def test_an_invalid_bundle_is_kept_as_a_rejected_version_with_its_reasons(conn, store, pilots_db, tmp_path):
    import shutil

    broken = tmp_path / "ke-parliament"
    shutil.copytree(PILOTS["ke-parliament"], broken)
    text = (broken / "modules" / "budget-documents.yml").read_text().replace("kind:budget", "kind:unicorn")
    (broken / "modules" / "budget-documents.yml").write_text(text)
    result = batch.submit(conn, store, broken, agent="test-agent")
    conn.commit()
    assert result.status == "rejected" and any("unicorn" in e for e in result.errors)
    report = json.loads(conn.execute("SELECT validation_report FROM website.structure_versions WHERE id = %s", (result.version_id,)).fetchone()["validation_report"])
    assert report["ok"] is False
    with pytest.raises(ValueError):
        registry.activate_version(conn, result.version_id)


def test_an_unregistered_site_is_skipped_not_invented(conn, store, pilots_db, tmp_path):
    import shutil

    copy = tmp_path / "ghost"
    shutil.copytree(PILOTS["world-geoboundaries"], copy)
    (copy / "manifest.yml").write_text((copy / "manifest.yml").read_text().replace("site: world/geoboundaries", "site: world/ghost"))
    assert batch.submit(conn, store, copy, agent="test-agent").status == "skipped"


def test_the_iebc_pilot_runs_end_to_end_once_a_human_approves_the_source(conn, store, pilots_db):
    """With an approved assessment (test fixture), the real recipe reads the saved IEBC markup into absolute-URL candidates."""
    site = conn.execute("SELECT id::text AS id, jurisdiction_id::text AS jid FROM website.sites WHERE code = 'ke/iebc'").fetchone()
    version = batch.submit(conn, store, PILOTS["ke-iebc"], agent="test-agent")
    batch.activate(conn, version.version_id)
    conn.execute("UPDATE website.assessments SET is_current = false WHERE site_id = %s", (site["id"],))
    conn.execute(
        "INSERT INTO website.assessments (site_id, jurisdiction_id, status, source_type, access_basis, rights_holder, personal_data_categories, approved_scope, reviewed_by, reviewed_at, review_due_at, is_current, created_at, updated_at, version) VALUES (%s, %s, 'approved', 'official_website', 'published_terms', 'unknown', '[\"none_known\"]', %s, gen_random_uuid(), now(), now() + interval '1 year', true, now(), now(), 1)",
        (site["id"], site["jid"], json.dumps({"hosts": ["www.iebc.or.ke"], "schemes": ["https"], "paths": {"allow": ["/resources/"]}, "fetchModes": ["http"], "maxRequestsPerSecond": 0.2})),
    )
    if conn.execute("UPDATE website.dossiers SET launch_stage = 'pilot' WHERE jurisdiction_id = %s AND is_current", (site["jid"],)).rowcount == 0:
        conn.execute("INSERT INTO website.dossiers (jurisdiction_id, applicable_laws, launch_stage, is_current, created_at, updated_at, version) VALUES (%s, '[]', 'pilot', true, now(), now(), 1)", (site["jid"],))
    conn.commit()
    listing = (PILOTS["ke-iebc"] / "examples" / "party-list.html").read_text()
    web = Site({"/resources/?Party_list": listing, "/resources/?Party_list&page=2": "<html></html>"}, robots=None)
    ctx = runner.build_context(conn, store, "ke/iebc", make_fetcher(conn, lambda request: web(request) if request.url.query != b"Party_list" or True else None))
    report = runner.run_module(ctx, "party-list")
    assert report.status == "completed" and report.created == 8, report
    payloads = [r["payload"] for r in conn.execute("SELECT c.payload FROM staging.candidates c JOIN staging.runs r ON r.id = c.run_id JOIN source.captures cap ON cap.id = r.capture_id WHERE cap.site_id = %s", (site["id"],)).fetchall()]
    assert all(p["url"].startswith("https://www.iebc.or.ke/uploads/resources/") and p["url"].endswith(".pdf") for p in payloads)
    assert all(p["publishedOn"] for p in payloads)
    assert all(isinstance(p["publisherId"], dict) and "$ref" in p["publisherId"] for p in payloads)
