"""Wikimedia pipeline with recorded-shape API responses: no network. A fake `get` answers by host and action."""
import json
import uuid
from types import SimpleNamespace
from urllib.parse import parse_qs, urlparse

from mzizi_data import jobs, reinforcement as r, wikimedia as w


def item(qid, label, p31=(), p17=(), p27=(), p39=(), aliases=(), images=None, extra=None, description=None):
    def statements(values):
        return [{"rank": "normal", "mainsnak": {"datavalue": {"type": "wikibase-entityid", "value": {"id": v}}}} for v in values]

    claims = {"P31": statements(p31), "P17": statements(p17), "P27": statements(p27), "P39": statements(p39), **(extra or {})}
    for prop, files in (images or {}).items():
        claims[prop] = [{"rank": "normal", "mainsnak": {"datavalue": {"type": "string", "value": f}}} for f in files]
    return {"id": qid, "labels": {"en": {"language": "en", "value": label}}, "aliases": {"en": [{"language": "en", "value": a} for a in aliases]}, "descriptions": {"en": {"value": description}} if description else {}, "claims": {k: v for k, v in claims.items() if v}}


WORLD = {
    "Q114": item("Q114", "Kenya", p31=["Q6256"], extra={"P297": [{"rank": "normal", "mainsnak": {"datavalue": {"type": "string", "value": "KE"}}}]}, images={"P41": ["Flag of Kenya.svg"], "P94": ["Coat of arms of Kenya.svg"]}),
    "Q6256": item("Q6256", "country"),
    "Q9999": item("Q9999", "Kisumu County", p31=["Q_county"], p17=["Q114"], images={"P41": ["Flag of Kisumu County.svg"]}),
    "Q9998": item("Q9998", "Kisumu", p31=["Q_city"], p17=["Q114"]),  # the city: not a county
    "Q8888": item("Q8888", "Kisumu", p31=["Q_county"], p17=["Q115"]),  # same name, another country
    "Q_county": item("Q_county", "county of Kenya"), "Q_city": item("Q_city", "city"),
    "Q1": item("Q1", "Jane Wanjiru Doe", p31=["Q5"], p27=["Q114"]),
    "Q2": item("Q2", "Jane Doe", p31=["Q5"], p27=["Q114"]),  # a second Kenyan with the same name tokens
    "Q3": item("Q3", "John Mwangi Kamau", p31=["Q5"], p27=["Q114"], images={"P18": ["John Kamau.jpg"]}),
    "Q4": item("Q4", "John Mwangi Kamau", p31=["Q5"], p27=["Q30"]),  # an American namesake
    "Q5": item("Q5", "human"),
    "Q7": item("Q7", "Orange Democratic Movement", p31=["Q_party"], p17=["Q114"], aliases=["ODM"], images={"P154": ["ODM logo.png"]}, description="political party in Kenya", extra={"P1813": [{"rank": "normal", "mainsnak": {"datavalue": {"type": "string", "value": "ODM"}}}]}),
    "Q_party": item("Q_party", "political party"),
}
COMMONS = {
    "Flag of Kisumu County.svg": {"LicenseShortName": "CC BY-SA 4.0", "LicenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "Artist": "<a href='x'>Some Author</a>", "AttributionRequired": "true", "Copyrighted": "True"},
    "John Kamau.jpg": {"LicenseShortName": "CC BY-NC 2.0", "Artist": "A. Photographer"},
    "ODM logo.png": {"LicenseShortName": "Public domain", "Copyrighted": "False"},
    "Flag of Kenya.svg": {"LicenseShortName": "Public domain", "Copyrighted": "False"},
}


class FakeApi:
    def __init__(self):
        self.requests = []

    def __call__(self, url):
        parsed = urlparse(url)
        q = {k: v[0] for k, v in parse_qs(parsed.query).items()}
        self.requests.append(url)
        if parsed.netloc == "www.wikidata.org" and q["action"] == "wbsearchentities":
            hits = [{"id": i} for i, e in WORLD.items() if w.norm(q["search"]) in {w.norm(n) for n in w.names(e)}]
            return SimpleNamespace(status=200, headers={}, body=json.dumps({"search": hits}).encode(), assessment_id=None)
        if parsed.netloc == "www.wikidata.org":
            ids = q["ids"].split("|")
            return SimpleNamespace(status=200, headers={}, body=json.dumps({"entities": {i: WORLD.get(i, {"id": i, "missing": ""}) for i in ids}}).encode(), assessment_id=None)
        if parsed.netloc == "commons.wikimedia.org":
            pages = {}
            for n, title in enumerate(q["titles"].split("|")):
                name = title.removeprefix("File:")
                if name in COMMONS:
                    pages[str(n)] = {"title": title, "imageinfo": [{"url": f"https://upload.wikimedia.org/wikipedia/commons/x/{name.replace(' ', '_')}", "descriptionurl": f"https://commons.wikimedia.org/wiki/{title.replace(' ', '_')}", "mime": "image/svg+xml", "size": 12, "extmetadata": {k: {"value": v} for k, v in COMMONS[name].items()}}]}
            return SimpleNamespace(status=200, headers={}, body=json.dumps({"query": {"pages": pages}}).encode(), assessment_id=None)
        if parsed.netloc == "upload.wikimedia.org":
            return SimpleNamespace(status=200, headers={"content-type": "image/svg+xml"}, body=b"<svg/>" + url.encode(), assessment_id=None)
        raise AssertionError(url)


def level(conn, code):
    jid = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()["id"]
    row = conn.execute("SELECT id FROM reference.classifications WHERE code = %s AND jurisdiction_id = %s", (f"geography/level/{code}", jid)).fetchone()
    return jid, row["id"]


def add_unit(conn, lv, code, name, **extra):
    jid, level_id = level(conn, lv)
    return conn.execute("INSERT INTO geography.units (code, name, kind, is_active, is_current, jurisdiction_id, level_id, created_at, updated_at, version) VALUES (%s, %s, 'territorial', true, true, %s, %s, now(), now(), 1) RETURNING id", (f"{code}-{uuid.uuid4().hex[:5]}", name, jid, level_id)).fetchone()["id"]


def add_person(conn, name):
    return conn.execute("INSERT INTO person.individuals (code, display_name, life_status, is_current, created_at, updated_at, version) VALUES (%s, %s, 'alive', true, now(), now(), 1) RETURNING id", (f"ke/p-{uuid.uuid4().hex[:6]}", name)).fetchone()["id"]


def test_free_licences_only():
    assert w.is_free_licence("CC BY-SA 4.0") and w.is_free_licence("CC0") and w.is_free_licence("Public domain") and w.is_free_licence("CC BY 3.0")
    assert not w.is_free_licence("CC BY-NC 2.0") and not w.is_free_licence("CC BY-ND 4.0") and not w.is_free_licence(None) and not w.is_free_licence("Fair use") and not w.is_free_licence("Some custom terms")
    assert w.is_free_licence("PD-textlogo", copyrighted="False")


def test_county_match_needs_country_and_instance_not_the_name_alone(conn):
    wm = w.Wikimedia(FakeApi())
    outcome, matches = w.find_item(wm, "geography.units", {"id": 1, "name": "Kisumu", "level_code": "geography/level/county"})
    assert outcome == "found" and [m.qid for m in matches] == ["Q9999"]  # the city and the foreign county share the name and are refused
    assert "country Kenya" in " ".join(matches[0].reasons)
    assert w.find_item(wm, "geography.units", {"id": 1, "name": "Atlantis", "level_code": "geography/level/county"}) == ("not_found", [])


def test_people_are_matched_on_human_citizenship_and_name_never_on_name_alone():
    wm = w.Wikimedia(FakeApi())
    assert w.find_item(wm, "person.individuals", {"id": 1, "display_name": "John Mwangi Kamau"})[1][0].qid == "Q3"  # the American namesake is refused
    outcome, matches = w.find_item(wm, "person.individuals", {"id": 1, "display_name": "Jane Wanjiru Doe"})
    assert outcome == "found" and matches[0].qid == "Q1"  # exact tokens beat the partial match
    assert w.find_item(wm, "person.individuals", {"id": 1, "display_name": "Mwangi"})[0] == "not_found"  # one token is not enough


def test_refill_routes_ids_and_markers_through_proposed_claims_and_coverage_counts_three_states(conn, store):
    unit = add_unit(conn, "county", "ke/kisumu", "Kisumu")
    ward = add_unit(conn, "ward", "ke/w", "Some Ward")
    api = FakeApi()
    r.REFILL_SOURCES.clear()
    r.register_refill("wikidata", w.wikidata_refill(conn, w.Wikimedia(api), store))
    gap = conn.execute("INSERT INTO engine.gaps (target_kind, target_id, field, refill_sources, priority) VALUES ('geography.units', %s, 'wikidata_id', '[\"wikidata\"]', 99) RETURNING id", (unit,)).fetchone()["id"]
    assert r.enqueue_refills(conn, 5, fields=["wikidata_id"]) >= 1
    while jobs.run_once(conn, {"refill": r.refill_handler(conn)}):
        pass
    claim = conn.execute("SELECT * FROM engine.claims WHERE target_id = %s AND field = 'wikidata_id'", (unit,)).fetchone()
    assert claim["value"] == "Q9999" and claim["review"] == "proposed"
    assert conn.execute("SELECT status FROM engine.gaps WHERE id = %s", (gap,)).fetchone()["status"] == "found"
    assert conn.execute("SELECT count(*) AS n FROM geography.units WHERE id = %s AND wikidata_id IS NOT NULL", (unit,)).fetchone()["n"] == 0  # never written directly
    attribution = conn.execute("SELECT a.relation, d.licence, c.file_version_id FROM source.attributions a JOIN source.documents d ON d.id = a.document_id JOIN source.captures c ON c.id = a.capture_id WHERE a.id = %s", (claim["attribution_id"],)).fetchone()
    assert attribution["relation"] == "supports" and attribution["licence"].startswith("CC0") and attribution["file_version_id"]

    # the marker is found once the id is the standing winner of its field
    conn.execute("INSERT INTO engine.gaps (target_kind, target_id, field, refill_sources, priority) VALUES ('geography.units', %s, 'flag_marker', '[\"wikidata\"]', 98)", (unit,))
    r.enqueue_refills(conn, 5, fields=["flag_marker"])
    while jobs.run_once(conn, {"refill": r.refill_handler(conn)}):
        pass
    assert conn.execute("SELECT value FROM engine.claims WHERE target_id = %s AND field = 'flag_marker'", (unit,)).fetchone()["value"] == "has"

    # coverage: unknown, has and none are different states; a ward has no flag expectation
    conn.execute("UPDATE reference.classifications SET flag_expected = 'none' WHERE code = 'geography/level/ward'")
    conn.execute("UPDATE reference.classifications SET flag_expected = 'has' WHERE code = 'geography/level/county'")
    other = add_unit(conn, "county", "ke/other", "Other")
    third = add_unit(conn, "county", "ke/third", "Third")
    conn.execute("UPDATE geography.units SET flag_marker = 'has' WHERE id = %s", (other,))
    conn.execute("UPDATE geography.units SET flag_marker = 'none' WHERE id = %s", (third,))
    row = next(c for c in r.coverage(conn, {"geography.units": {"flag_marker": ["wikidata"]}}))
    assert row["present"] == 1 and row["known_absent"] == 1 and row["unknown"] == row["total"] - 2
    assert conn.execute("SELECT count(*) AS n FROM geography.units WHERE id = %s", (ward,)).fetchone()["n"] == 1  # the ward exists but is not counted
    created = r.build_gaps(conn, {"geography.units": {"flag_marker": ["wikidata"]}})
    gaps = {str(g["target_id"]) for g in conn.execute("SELECT target_id FROM engine.gaps WHERE field = 'flag_marker'")}
    assert str(ward) not in gaps and str(other) not in gaps and str(third) not in gaps and created >= 0


def test_media_is_stored_only_with_a_free_licence_and_reported_otherwise(conn, store):
    free = add_unit(conn, "county", "ke/free", "Kisumu")
    person = add_person(conn, "John Mwangi Kamau")
    party = conn.execute("INSERT INTO political.parties (code, name, status, is_current, jurisdiction_id, created_at, updated_at, version) VALUES (%s, 'Orange Democratic Movement', 'active', true, (SELECT id FROM reference.jurisdictions WHERE code = 'ke'), now(), now(), 1) RETURNING id", (f"ke/odm-{uuid.uuid4().hex[:4]}",)).fetchone()["id"]
    conn.execute("UPDATE geography.units SET wikidata_id = 'Q9999', flag_marker = 'has' WHERE id = %s", (free,))
    conn.execute("UPDATE person.individuals SET wikidata_id = 'Q3', portrait_marker = 'has' WHERE id = %s", (person,))
    conn.execute("UPDATE political.parties SET wikidata_id = 'Q7', logo_marker = 'has' WHERE id = %s", (party,))
    report = w.fetch_media(conn, w.Wikimedia(FakeApi()), store)
    stored = {s["name"]: s for s in report.stored}
    assert set(stored) >= {"Kisumu", "Orange Democratic Movement"} and stored["Kisumu"]["licence"] == "CC BY-SA 4.0"
    assert any(s["name"] == "John Mwangi Kamau" and "no recorded free licence" in s["reason"] for s in report.skipped)  # CC BY-NC is not free
    att = conn.execute("SELECT role FROM filesystem.attachments WHERE target_kind = 'geography.units' AND target_id = %s", (free,)).fetchone()
    assert att["role"] == "flag"
    assert conn.execute("SELECT count(*) AS n FROM filesystem.attachments WHERE target_id = %s", (person,)).fetchone()["n"] == 0
    doc = conn.execute("SELECT d.licence, d.citation, d.url FROM source.attributions a JOIN source.documents d ON d.id = a.document_id WHERE a.target_id = %s AND a.target_field = 'flag'", (free,)).fetchone()
    assert doc["licence"] == "CC BY-SA 4.0" and "Some Author" in doc["citation"] and "Attribution required" in doc["citation"] and doc["url"].startswith("https://commons.wikimedia.org/wiki/File:")
    again = w.fetch_media(conn, w.Wikimedia(FakeApi()), store)
    assert not any(s["name"] == "Kisumu" for s in again.stored)  # already attached


def test_two_agreeing_and_two_disagreeing_sources_become_a_standing(conn):
    unit = add_unit(conn, "county", "ke/claims", "Claims")
    from mzizi_data.register import DocumentSpec, ensure_document, ensure_method, ensure_publisher

    method = ensure_method(conn, "extracted", "test", "pytest", "1")

    def attr(code, reliability):
        pub = ensure_publisher(conn, code, code)
        conn.execute("UPDATE source.publishers SET reliability = %s WHERE id = %s", (reliability, pub))
        doc = ensure_document(conn, DocumentSpec(pub, f"{code} page", "survey"))
        return conn.execute("INSERT INTO source.attributions (document_id, target_kind, target_id, target_field, relation, method_id, confidence, created_at, updated_at, version) VALUES (%s, 'geography.units', %s, 'wikidata_id', 'supports', %s, 1.0, now(), now(), 1) RETURNING id", (doc, unit, method)).fetchone()["id"]

    a, b, c, d = attr("c-a", 0.9), attr("c-b", 0.6), attr("c-c", 0.5), attr("c-d", 0.4)
    r.add_claim(conn, "geography.units", unit, "wikidata_id", "Q1", a)
    r.add_claim(conn, "geography.units", unit, "wikidata_id", "Q1", b)
    standing = conn.execute("SELECT * FROM engine.claim_standings WHERE target_id = %s", (unit,)).fetchone()
    assert standing["corroboration"] == 2 and not standing["disputed"]
    r.add_claim(conn, "geography.units", unit, "wikidata_id", "Q2", c)
    r.add_claim(conn, "geography.units", unit, "wikidata_id", "Q2", d)
    standing = conn.execute("SELECT s.*, c.value FROM engine.claim_standings s JOIN engine.claims c ON c.id = s.winning_claim_id WHERE s.target_id = %s", (unit,)).fetchone()
    assert standing["disputed"] and standing["distinct_values"] == 2 and standing["value"] == "Q1" and standing["corroboration"] == 2
    conn.execute("UPDATE engine.claims SET review = 'rejected' WHERE target_id = %s AND value = '\"Q1\"'", (unit,))
    r.rebuild_all_standings(conn)
    standing = conn.execute("SELECT s.*, c.value FROM engine.claim_standings s JOIN engine.claims c ON c.id = s.winning_claim_id WHERE s.target_id = %s", (unit,)).fetchone()
    assert standing["value"] == "Q2" and not standing["disputed"]


def test_county_named_by_its_first_part_and_dashes():
    WORLD["Q_tn"] = item("Q_tn", "Tharaka–Nithi County", p31=["Q_county"], p17=["Q114"])
    WORLD["Q_tt"] = item("Q_tt", "Taita–Taveta County", p31=["Q_county"], p17=["Q114"])
    wm = w.Wikimedia(FakeApi())
    assert w.find_item(wm, "geography.units", {"id": 1, "name": "Taita Taveta", "level_code": "geography/level/county"})[1][0].qid == "Q_tt"
    # the search is by name, so the fake finds by the full label; the judge is what accepts the shorter database name
    entity = WORLD["Q_tn"]
    match = w.judge("geography.units", {"id": 1, "name": "Tharaka", "level_code": "geography/level/county"}, entity, wm.entity_labels)
    assert match and match.score == 0.7 and "label contains the name" in match.reasons
    assert w.judge("geography.units", {"id": 1, "name": "Tharaka", "level_code": "geography/level/county"}, WORLD["Q8888"], wm.entity_labels) is None
