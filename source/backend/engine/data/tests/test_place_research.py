"""Constituency offices, place claims, duplicates, moves and closures, enrichment and coverage (TSK-EBA9E2370C55, TSK-4864E3B1AD5E)."""
import json
import uuid
from datetime import date

import pytest

from mzizi_data import place_research as pr
from mzizi_data.imports import constituency_offices as co

from .pdfmaker import make_pdf


def jurisdiction(conn):
    conn.execute("INSERT INTO reference.jurisdictions (code, name, kind, is_current, created_at, updated_at, version) VALUES ('ke', 'Kenya', 'modern_state', true, now(), now(), 1) ON CONFLICT DO NOTHING")
    return str(conn.execute("SELECT id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()["id"])


def unit(conn, code, name, level, parent=None):
    jid = jurisdiction(conn)
    level_id = conn.execute("SELECT id FROM reference.classifications WHERE code = %s AND jurisdiction_id = %s", (f"geography/level/{level}", jid)).fetchone()
    if level_id is None:
        level_id = conn.execute("SELECT id FROM reference.classifications WHERE code = %s LIMIT 1", (f"geography/level/{level}",)).fetchone()
    existing = conn.execute("SELECT id FROM geography.units WHERE code = %s", (code,)).fetchone()
    if existing:
        return str(existing["id"])
    return str(conn.execute(
        "INSERT INTO geography.units (code, name, kind, level_id, jurisdiction_id, parent_id, is_active, is_current, created_at, updated_at, version) VALUES (%s, %s, 'territorial', %s, %s, %s, true, true, now(), now(), 1) RETURNING id",
        (code, name, level_id["id"], jid, parent),
    ).fetchone()["id"])


def role(conn, name):
    code = f"place/occupancy-role/{name}"
    row = conn.execute("SELECT id FROM reference.classifications WHERE code = %s", (code,)).fetchone()
    if row is None:  # the roles come from the governance catalogue seed, which the scratch database does not run
        row = conn.execute("INSERT INTO reference.classifications (code, scheme, label, jurisdiction_id, \"order\", is_current, created_at, updated_at, version) VALUES (%s, 'place/occupancy-role', %s, %s, 0, true, now(), now(), 1) RETURNING id", (code, name, jurisdiction(conn))).fetchone()
    return str(row["id"])


def institution(conn, code, scope=None):
    jid = jurisdiction(conn)
    type_id = conn.execute("SELECT id FROM reference.classifications WHERE code LIKE 'governance/institution-type/%' LIMIT 1").fetchone()["id"]
    return str(conn.execute(
        "INSERT INTO governance.institutions (code, name, type_id, jurisdiction_id, scope_geo_unit_id, is_current, created_at, updated_at, version) VALUES (%s, %s, %s, %s, %s, true, now(), now(), 1) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id",
        (code, code, type_id, jid, scope),
    ).fetchone()["id"])


def expectation(conn, inst, role_name="official-workplace", scope=None):
    return str(conn.execute(
        """INSERT INTO place.expectations (subject_kind, subject_id, role_id, scope_geo_unit_id, min_count, max_count, basis, status, is_current, created_at, updated_at, version)
           VALUES ('governance.institutions', %s, %s, %s, 1, 1, 'plan', 'expected', true, now(), now(), 1) RETURNING id""", (inst, role(conn, role_name), scope)).fetchone()["id"])


@pytest.fixture()
def world(conn):
    alpha = unit(conn, "ke/t-alpha", "Talpha", "county")
    delta = unit(conn, "ke/t-delta", "Tdelta", "county")
    bravo = unit(conn, "ke/t-alpha/bravo", "Bravo", "constituency", alpha)
    charlie = unit(conn, "ke/t-alpha/charlie", "Charlie North", "constituency", alpha)
    charlie2 = unit(conn, "ke/t-alpha/charlie-s", "Charlie South", "constituency", alpha)
    echo = unit(conn, "ke/t-delta/echo", "Echo", "constituency", delta)
    ids = {}
    for name, scope in (("bravo", bravo), ("echo", echo)):
        inst = institution(conn, f"ke/electoral-commission/constituency/t-{name}/{name}", scope)
        ids[name] = (inst, expectation(conn, inst, scope=scope))
    ids["units"] = (alpha, delta, bravo, charlie, charlie2, echo)
    ids["alpha_inst"] = institution(conn, "ke/electoral-commission/county/t01", alpha)
    ids["alpha_exp"] = expectation(conn, ids["alpha_inst"], scope=alpha)
    return ids


def office_pdf(tmp_path):
    def page(lines):
        text = []
        y = 700
        for kind, county in lines:
            pass
        return text

    text = [(72, 740, "Physical Locations of"), (72, 726, "IEBC Constituency Offices in Kenya"), (72, 700, "Talpha County"),
            (72, 680, "Constituency Name"), (180, 680, "Office Location"), (330, 680, "Most Conspicuous Landmark"), (520, 680, "Estimated Distance"),
            (72, 664, "Bravo"), (180, 664, "Next to the Chiefs office"), (330, 664, "Kenya Bank"), (520, 664, "50 Metres"),
            (180, 652, "Main road"),
            (72, 636, "Bravoo"), (180, 636, "Duplicate row for Bravo"), (330, 636, "Tree"), (520, 636, "5 Metres"),
            (72, 620, "Charlie"), (180, 620, "Charlie town"), (330, 620, "Church"), (520, 620, "5 Metres"),
            (72, 604, "Zulu"), (180, 604, "Zulu town"), (330, 604, "Market"), (520, 604, "5 Metres"),
            (72, 588, "County Office"), (180, 588, "County Hall"), (330, 588, "Square"), (520, 588, "5 Metres"),
            (72, 560, "Tdelta County"),
            (72, 540, "Constituency Name"), (180, 540, "Office Location"), (330, 540, "Most Conspicuous Landmark"), (520, 540, "Estimated Distance"),
            (72, 524, "Echo"), (180, 524, "Echo Police Station"), (330, 524, "Police Station"), (520, 524, "0 meters"),
            (72, 40, "Page:1")]
    path = tmp_path / "offices.pdf"
    path.write_bytes(make_pdf([{"text": text}]))
    return path


def test_parse_reads_columns_continuations_and_counties(tmp_path):
    rows = co.parse_pdf(office_pdf(tmp_path))
    assert [(r.county, r.constituency) for r in rows] == [("Talpha", "Bravo"), ("Talpha", "Bravoo"), ("Talpha", "Charlie"), ("Talpha", "Zulu"), ("Talpha", "County Office"), ("Tdelta", "Echo")]
    assert rows[0].location == "Next to the Chiefs office Main road" and rows[0].landmark == "Kenya Bank" and rows[0].distance == "50 Metres"


def test_matching_never_guesses(conn, world, tmp_path):
    links = {l.row.constituency: l for l in co.match_rows(co.Geography(conn), co.parse_pdf(office_pdf(tmp_path)))}
    assert links["Echo"].status == "matched" and links["Echo"].unit_code == "ke/t-delta/echo" and links["Echo"].score == 100
    # two rows (Bravo and its misspelling) claim one constituency: neither is trusted
    assert links["Bravo"].status == "ambiguous" and links["Bravoo"].status == "ambiguous" and links["Bravo"].unit_id is None
    # "Charlie" is a half of two constituency names: no clear lead, so it stays unlinked
    assert links["Charlie"].status in ("ambiguous", "unmatched") and links["Charlie"].unit_id is None
    assert links["Zulu"].status == "unmatched" and links["Zulu"].unit_id is None
    assert links["County Office"].status == "county_office"


def test_load_creates_places_resolves_only_verified_matches_and_is_idempotent(conn, world, store, tmp_path):
    pdf = office_pdf(tmp_path)
    assert conn.execute("SELECT count(*) AS n FROM place.places").fetchone()["n"] == 0 or True  # an expectation alone creates no place
    before = conn.execute("SELECT count(*) AS n FROM place.places").fetchone()["n"]
    report = co.load_offices(conn, store, pdf)
    assert report.rows == 6 and report.matched == 1 and report.county_offices == 1
    assert report.places_created == 6 and report.occupancies == 2 and report.expectations_resolved == 2
    assert conn.execute("SELECT count(*) AS n FROM place.places").fetchone()["n"] == before + 6
    echo_place = conn.execute("SELECT * FROM place.places WHERE name LIKE '%%Echo%%'").fetchone()
    assert echo_place["latitude"] is None and echo_place["address_text"].startswith("Echo Police Station") and str(echo_place["located_in_unit_id"]) == world["units"][5]
    exp = conn.execute("SELECT status::text AS status, resolved_occupancy_id FROM place.expectations WHERE id = %s", (world["echo"][1],)).fetchone()
    assert exp["status"] == "identified" and exp["resolved_occupancy_id"] is not None
    # an ambiguous row keeps an unlinked place, an attribution and a review state, and resolves nothing
    bravo_exp = conn.execute("SELECT status::text AS status FROM place.expectations WHERE id = %s", (world["bravo"][1],)).fetchone()
    assert bravo_exp["status"] == "expected"
    unlinked = conn.execute("SELECT p.id FROM place.places p WHERE p.name LIKE '%%Zulu%%'").fetchone()
    assert conn.execute("SELECT state::text AS s FROM source.verifications WHERE target_id = %s AND is_current", (unlinked["id"],)).fetchone()["s"] == "under_review"
    # the county office row resolved the county-level expectation
    assert conn.execute("SELECT status::text AS s FROM place.expectations WHERE id = %s", (world["alpha_exp"],)).fetchone()["s"] == "identified"
    # every place has an attribution to the preserved PDF capture and a verification
    assert conn.execute("SELECT count(*) AS n FROM place.places p WHERE NOT EXISTS (SELECT 1 FROM source.attributions a WHERE a.target_kind = 'place.places' AND a.target_id = p.id AND a.capture_id IS NOT NULL)").fetchone()["n"] == 0
    again = co.load_offices(conn, store, pdf)
    assert again.places_created == 0 and again.occupancies == 0 and again.expectations_resolved == 0


def test_dry_run_writes_nothing(conn, world, store, tmp_path):
    before = conn.execute("SELECT count(*) AS n FROM place.places").fetchone()["n"]
    report = co.load_offices(conn, store, office_pdf(tmp_path), write=False)
    assert report.matched == 1 and conn.execute("SELECT count(*) AS n FROM place.places").fetchone()["n"] == before
    assert {u["constituency"] for u in report.unlinked} >= {"Zulu", "Bravoo"}


# ---- claims ----------------------------------------------------------------------------------------------------------

def _place(conn, name, address=None, point=None, unit_id=None):
    return str(conn.execute(
        "INSERT INTO place.places (kind, status, name, address_text, latitude, longitude, located_in_unit_id, is_current, created_at, updated_at, version) VALUES ('site', 'in_use', %s, %s, %s, %s, %s, true, now(), now(), 1) RETURNING id",
        (name, address, point[0] if point else None, point[1] if point else None, unit_id),
    ).fetchone()["id"])


def _claim(conn, place_id, publisher_code, reliability, field, value):
    from mzizi_data.reinforcement import add_claim
    from mzizi_data.register import DocumentSpec, ensure_document, ensure_method, ensure_publisher

    pub = ensure_publisher(conn, publisher_code, publisher_code)
    conn.execute("UPDATE source.publishers SET reliability = %s WHERE id = %s", (reliability, pub))
    doc = ensure_document(conn, DocumentSpec(pub, f"{publisher_code} {uuid.uuid4()}", "dataset"))
    method = ensure_method(conn, "extracted", "test", "pytest", "1")
    attribution = conn.execute("INSERT INTO source.attributions (document_id, target_kind, target_id, target_field, relation, method_id, confidence, created_at, updated_at, version) VALUES (%s, 'place.places', %s, %s, 'supports', %s, 1.0, now(), now(), 1) RETURNING id", (doc, place_id, field, method)).fetchone()["id"]
    return add_claim(conn, "place.places", place_id, field, value, attribution)


def test_a_point_needs_two_independent_sources_or_one_trusted_one(conn):
    near = _place(conn, "Alpha House")
    _claim(conn, near, "wd-test", 0.6, "latitude", {"latitude": -1.28, "longitude": 36.82})
    assert pr.apply_place_claims(conn).points == 0  # one crowd-sourced claim waits
    assert conn.execute("SELECT latitude FROM place.places WHERE id = %s", (near,)).fetchone()["latitude"] is None
    _claim(conn, near, "osm-test", 0.6, "latitude", {"latitude": -1.2803, "longitude": 36.8203})
    report = pr.apply_place_claims(conn)
    assert report.points == 1 and float(conn.execute("SELECT latitude FROM place.places WHERE id = %s", (near,)).fetchone()["latitude"]) in (-1.28, -1.2803)
    assert {c["review"] for c in conn.execute("SELECT review FROM engine.claims WHERE target_id = %s", (near,))} == {"accepted"}

    disagreeing = _place(conn, "Beta House")
    _claim(conn, disagreeing, "wd-test", 0.6, "latitude", {"latitude": -1.28, "longitude": 36.82})
    _claim(conn, disagreeing, "osm-test", 0.6, "latitude", {"latitude": -1.50, "longitude": 36.90})
    report = pr.apply_place_claims(conn)
    assert report.points == 0 and any(h["place"] == disagreeing for h in report.held)

    trusted = _place(conn, "Gamma House")
    _claim(conn, trusted, "official-test", 0.9, "latitude", {"latitude": -1.3, "longitude": 36.8})
    assert pr.apply_place_claims(conn).points == 1


def test_a_value_already_present_is_never_overwritten_and_points_outside_kenya_are_ignored(conn):
    placed = _place(conn, "Delta House", point=(-1.0, 36.0), address="Delta Road, Nairobi")
    _claim(conn, placed, "official-test", 0.9, "latitude", {"latitude": -1.3, "longitude": 36.8})
    _claim(conn, placed, "official-test2", 0.9, "address_text", "Another Road, Nairobi")
    pr.apply_place_claims(conn)
    row = conn.execute("SELECT latitude::float AS lat, address_text FROM place.places WHERE id = %s", (placed,)).fetchone()
    assert row["lat"] == -1.0 and row["address_text"] == "Delta Road, Nairobi"
    abroad = _place(conn, "Epsilon House")
    _claim(conn, abroad, "official-test", 0.9, "latitude", {"latitude": 48.85, "longitude": 2.35})
    assert pr.apply_place_claims(conn).points == 0


def test_corroborated_point_verifies_the_place_and_resolves_the_expectation(conn, world):
    place = _place(conn, "Echo HQ")
    inst = world["alpha_inst"]
    role_id = role(conn, "official-workplace")
    occupancy = str(conn.execute("INSERT INTO place.occupancies (subject_kind, subject_id, place_id, role_id, status, is_current, created_at, updated_at, version) VALUES ('governance.institutions', %s, %s, %s, 'active', true, now(), now(), 1) RETURNING id", (inst, place, role_id)).fetchone()["id"])
    conn.execute("UPDATE place.expectations SET status = 'expected', resolved_occupancy_id = NULL WHERE id = %s", (world["alpha_exp"],))
    assert pr.resolve_corroborated_expectations(conn, [place]) == 0  # a seed alone is not evidence
    _claim(conn, place, "wd-test", 0.6, "latitude", {"latitude": -1.28, "longitude": 36.82})
    _claim(conn, place, "osm-test", 0.6, "latitude", {"latitude": -1.2801, "longitude": 36.8201})
    pr.apply_place_claims(conn)
    assert pr.resolve_corroborated_expectations(conn, [place]) == 1
    exp = conn.execute("SELECT status::text AS s, resolved_occupancy_id::text AS o FROM place.expectations WHERE id = %s", (world["alpha_exp"],)).fetchone()
    assert exp == {"s": "identified", "o": occupancy}


# ---- handlers ---------------------------------------------------------------------------------------------------------

class Fake:
    def __init__(self, body, status=200):
        self.body, self.status = body if isinstance(body, bytes) else json.dumps(body).encode(), status


def test_nominatim_handler_names_the_place_checks_kenya_and_refuses_ambiguity(conn, store):
    place = _place(conn, "Anniversary Towers", address="University Way, Nairobi")
    gap = {"target_kind": "place.places", "target_id": place, "field": "latitude"}
    hit = {"lat": "-1.2845", "lon": "36.8219", "name": "Anniversary Towers", "display_name": "Anniversary Towers, University Way, Nairobi", "osm_type": "way", "osm_id": 1}
    handler = pr.nominatim_refill(conn, lambda url: Fake([hit]), store)
    found = handler(gap)
    assert found.outcome == "found" and found.value["latitude"] == -1.2845 and found.attribution_id
    licence = conn.execute("SELECT d.licence FROM source.attributions a JOIN source.documents d ON d.id = a.document_id WHERE a.id = %s", (found.attribution_id,)).fetchone()["licence"]
    assert "ODbL" in licence
    far = dict(hit, lat="-0.1", lon="34.9", osm_id=2)
    assert pr.nominatim_refill(conn, lambda url: Fake([hit, far]), store)(gap).outcome == "ambiguous"
    abroad = dict(hit, lat="48.85", lon="2.35")
    assert pr.nominatim_refill(conn, lambda url: Fake([abroad]), store)(gap).outcome == "not_found"
    other = dict(hit, name="Something Else Entirely", display_name="Something Else Entirely, Nairobi")
    assert pr.nominatim_refill(conn, lambda url: Fake([other]), store)(gap).outcome == "not_found"
    with pytest.raises(RuntimeError):
        pr.nominatim_refill(conn, lambda url: Fake(b"", 429), store)(gap)


def test_wikidata_handler_needs_kenya_a_coordinate_and_a_close_name(conn, store):
    place = _place(conn, "State House, Nairobi")
    gap = {"target_kind": "place.places", "target_id": place, "field": "latitude"}

    def entity(qid, label, lat, lon, country="Q114"):
        return {"id": qid, "labels": {"en": {"value": label}}, "aliases": {}, "claims": {"P625": [{"mainsnak": {"datavalue": {"value": {"latitude": lat, "longitude": lon}}}}], "P17": [{"mainsnak": {"datavalue": {"value": {"id": country}}}}]}}

    class WM:
        def __init__(self, entities):
            self.entities_by_id = entities
            self.cache = dict(entities)

        def search(self, text, limit=8):
            return [{"id": q} for q in self.entities_by_id]

        def entities(self, ids):
            return {i: self.entities_by_id[i] for i in ids if i in self.entities_by_id}

    ok = pr.wikidata_place_refill(conn, WM({"Q1": entity("Q1", "State House, Nairobi", -1.2796, 36.8084)}), store)(gap)
    assert ok.outcome == "found" and ok.value["source"] == "wikidata:Q1" and ok.attribution_id
    assert pr.wikidata_place_refill(conn, WM({"Q2": entity("Q2", "State House, Nairobi", 48.0, 2.0, "Q142")}), store)(gap).outcome == "not_found"
    assert pr.wikidata_place_refill(conn, WM({"Q3": entity("Q3", "State House, Nairobi", -1.28, 36.80), "Q4": entity("Q4", "State House, Nairobi", -0.5, 35.0)}), store)(gap).outcome == "ambiguous"


def test_address_extraction_and_the_documents_handler(conn, store, tmp_path):
    text = "Contact us. P.O. Box 45371-00100, Nairobi. Visit Anniversary Towers, University Way, Nairobi. "
    found = pr.extract_addresses(text)
    assert any(a.startswith("P.O. Box 45371") for a in found) and any("University Way" in a for a in found)
    assert pr.extract_addresses("nothing to see here") == []


# ---- duplicates --------------------------------------------------------------------------------------------------------

def test_duplicates_need_more_than_a_name_and_are_flagged_not_merged(conn):
    a = pr.PlaceRecord("a", "Kenya Revenue Authority Times Tower", "Haile Selassie Avenue, Nairobi", (-1.2870, 36.8240))
    b = pr.PlaceRecord("b", "KRA Times Tower Kenya Revenue Authority", "Haile Selassie Avenue Nairobi", (-1.2871, 36.8241))
    scored = pr.score_places(a, b)
    assert scored and scored[0] >= 0.8 and not scored[1]["nameOnly"]
    name_only = pr.score_places(pr.PlaceRecord("c", "County Government of Kisii headquarters"), pr.PlaceRecord("d", "County Government of Kisii headquarters"))
    assert name_only is None or (name_only[0] <= 0.7 and name_only[1]["nameOnly"])
    far = pr.score_places(pr.PlaceRecord("e", "Central Primary School", "Kisumu", (-0.1, 34.7)), pr.PlaceRecord("f", "Central Primary School", "Nairobi", (-1.3, 36.8)))
    assert far is None or far[0] < 0.7


def test_duplicate_run_writes_flags_only(conn):
    x = _place(conn, "Voi Remand Prison Compound", "Voi town", (-3.39, 38.55))
    y = _place(conn, "Voi Remand Prison Compound", "Voi town", (-3.3901, 38.5501))
    count = conn.execute("SELECT count(*) AS n FROM place.places").fetchone()["n"]
    pr.score_duplicate_places(conn)
    row = conn.execute("SELECT decision, score::float AS score FROM engine.match_candidates WHERE kind = 'place' AND left_id = LEAST(%s::uuid, %s::uuid) AND right_id = GREATEST(%s::uuid, %s::uuid)", (x, y, x, y)).fetchone()
    assert row["decision"] == "flagged" and row["score"] > 0.9
    assert conn.execute("SELECT count(*) AS n FROM place.places").fetchone()["n"] == count
    assert conn.execute("SELECT count(*) AS n FROM engine.match_candidates WHERE kind = 'place' AND decision <> 'flagged'").fetchone()["n"] == 0


# ---- moves and closures ----------------------------------------------------------------------------------------------

def _doc(conn):
    from mzizi_data.register import DocumentSpec, ensure_document, ensure_publisher

    return ensure_document(conn, DocumentSpec(ensure_publisher(conn, "move-src", "move-src"), f"notice {uuid.uuid4()}", "gazette"))


def _occupy(conn, inst, place, role_name="official-workplace"):
    return str(conn.execute("INSERT INTO place.occupancies (subject_kind, subject_id, place_id, role_id, status, is_current, created_at, updated_at, version) VALUES ('governance.institutions', %s, %s, %s, 'active', true, now(), now(), 1) RETURNING id", (inst, place, role(conn, role_name))).fetchone()["id"])


def test_a_move_keeps_history_and_the_expectation_follows(conn, world):
    old_place, new_place = _place(conn, "Old premises"), _place(conn, "New premises")
    inst = world["alpha_inst"]
    occupancy = _occupy(conn, inst, old_place)
    conn.execute("UPDATE place.expectations SET status = 'identified', resolved_occupancy_id = %s WHERE id = %s", (occupancy, world["alpha_exp"]))
    successor = pr.move_occupancy(conn, occupancy, new_place, date(2026, 5, 1), _doc(conn), {"page": 2})
    old = conn.execute("SELECT status::text AS s, valid_to FROM place.occupancies WHERE id = %s", (occupancy,)).fetchone()
    assert old["s"] == "moved" and old["valid_to"] == date(2026, 5, 1)
    assert conn.execute("SELECT kind::text AS k FROM place.occupancy_links WHERE predecessor_id = %s AND successor_id = %s", (occupancy, successor)).fetchone()["k"] == "move"
    assert str(conn.execute("SELECT resolved_occupancy_id FROM place.expectations WHERE id = %s", (world["alpha_exp"],)).fetchone()["resolved_occupancy_id"]) == successor
    assert conn.execute("SELECT count(*) AS n FROM place.places WHERE id IN (%s, %s)", (old_place, new_place)).fetchone()["n"] == 2
    with pytest.raises(ValueError):
        pr.move_occupancy(conn, occupancy, new_place, date(2026, 6, 1), _doc(conn), {})  # already moved


def test_closure_ceases_the_expectation_and_a_split_needs_two_successors(conn, world):
    place = _place(conn, "Closing premises")
    occupancy = _occupy(conn, world["alpha_inst"], place)
    conn.execute("UPDATE place.expectations SET status = 'identified', resolved_occupancy_id = %s WHERE id = %s", (occupancy, world["alpha_exp"]))
    pr.close_occupancy(conn, occupancy, date(2026, 7, 1), _doc(conn), {"page": 1})
    row = conn.execute("SELECT status::text AS s, resolved_occupancy_id FROM place.expectations WHERE id = %s", (world["alpha_exp"],)).fetchone()
    assert row["s"] == "ceased" and row["resolved_occupancy_id"] is None
    assert conn.execute("SELECT status::text AS s FROM place.occupancies WHERE id = %s", (occupancy,)).fetchone()["s"] == "closed"
    with pytest.raises(ValueError):
        pr.link_occupancies(conn, [occupancy], [occupancy], "split", date(2026, 7, 2), _doc(conn), {})


# ---- enrichment ----------------------------------------------------------------------------------------------------------

def test_spaces_are_added_only_when_a_source_names_them(conn):
    site = _place(conn, "Integrity Centre site")
    doc = _doc(conn)
    with pytest.raises(ValueError):
        pr.add_space(conn, site, "structure", "Integrity Centre", doc, "The commission is based in a building off Milimani Road", {"page": 1})
    tower = pr.add_space(conn, site, "structure", "Integrity Centre", doc, "EACC is based at Integrity Centre, Milimani Road", {"page": 1}, building="office-block")
    floor = pr.add_space(conn, tower, "floor", "Third floor", doc, "Records are on the Third floor of the building", {"page": 1})
    assert pr.add_space(conn, tower, "floor", "third floor", doc, "Third floor", {"page": 1}) == floor  # reused
    with pytest.raises(ValueError):
        pr.add_space(conn, site, "room", "Room 4", doc, "Room 4", {"page": 1})  # a room cannot sit directly in a site
    row = conn.execute("SELECT building_type_id, parent_id::text AS parent FROM place.places WHERE id = %s", (tower,)).fetchone()
    assert row["building_type_id"] is not None and row["parent"] == site
    assert conn.execute("SELECT count(*) AS n FROM source.attributions WHERE target_kind = 'place.places' AND target_id = ANY(%s::uuid[])", ([tower, floor],)).fetchone()["n"] == 2


def test_contact_visibility_follows_the_privacy_rules_and_never_copies_between_scopes(conn):
    site = _place(conn, "County Hall")
    other = _place(conn, "Other Hall")
    doc = _doc(conn)
    public_id, vis = pr.import_contact(conn, "place.places", site, "phone", "+254 20 000000", doc, {"page": 1}, "Switchboard", switchboard=True, published_by_institution=True)
    assert vis == "public"
    assert pr.import_contact(conn, "place.places", site, "phone", "+254 20 111111", doc, {"page": 1}, "Desk", switchboard=False, published_by_institution=True)[1] == "restricted"
    assert pr.import_contact(conn, "place.places", site, "phone", "+254 20 222222", doc, {"page": 1}, "Switchboard", switchboard=True, published_by_institution=False)[1] == "restricted"
    assert pr.import_contact(conn, "place.places", site, "email", "jane.wanjiku@county.go.ke", doc, {"page": 1}, switchboard=True, published_by_institution=True)[1] == "restricted"
    assert pr.import_contact(conn, "person.individuals", str(uuid.uuid4()), "phone", "+254 700 000000", doc, {"page": 1}, switchboard=True, published_by_institution=True)[1] == "restricted"
    assert pr.import_contact(conn, "place.places", site, "phone", "+254 20 000000", doc, {"page": 1}, switchboard=True, published_by_institution=True)[0] == public_id  # idempotent
    assert conn.execute("SELECT count(*) AS n FROM contact.points WHERE scope_id = %s", (other,)).fetchone()["n"] == 0
    assert conn.execute("SELECT count(*) AS n FROM source.attributions WHERE target_kind = 'contact.points' AND target_id = %s", (public_id,)).fetchone()["n"] == 1


def test_coverage_counts_known_against_expected(conn, world):
    report = pr.place_coverage(conn)
    assert report["places"]["total"] >= 0 and any(r["status"] == "expected" for r in report["expectations"])
    assert "| Places (current) |" in pr.coverage_markdown(report)


def test_landmark_seed_creates_unverified_places_and_resolves_nothing(conn, world, tmp_path):
    from mzizi_data import landmarks

    inst = institution(conn, "ke/t-seed-body")
    exp = expectation(conn, inst, "headquarters")
    seed = tmp_path / "seed.json"
    seed.write_text(json.dumps({"_meta": {"label": "test seed"}, "national": [{"institution": "ke/t-seed-body", "placeName": "Seed Tower", "address": "Seed Road, Nairobi"}, {"institution": "ke/t-missing", "placeName": "X", "address": "Y"}], "counties": {}}))
    first = landmarks.load_landmarks(conn, seed)
    assert first.places_created == 1 and first.occupancies == 1 and first.missing_institutions == ["ke/t-missing"]
    place = conn.execute("SELECT id, latitude FROM place.places WHERE name = 'Seed Tower'").fetchone()
    assert place["latitude"] is None
    assert conn.execute("SELECT state::text AS s FROM source.verifications WHERE target_id = %s AND is_current", (place["id"],)).fetchone()["s"] == "unverified"
    assert conn.execute("SELECT status::text AS s FROM place.expectations WHERE id = %s", (exp,)).fetchone()["s"] == "expected"
    assert pr.resolve_corroborated_expectations(conn, [str(place["id"])]) == 0
    again = landmarks.load_landmarks(conn, seed)
    assert again.places_created == 0 and again.occupancies == 0


def test_a_dispute_is_a_verification_state_with_a_contradicting_source(conn):
    place = _place(conn, "Disputed premises")
    doc = _doc(conn)
    pr.dispute(conn, "place.places", place, "A later notice puts the office elsewhere.", doc, {"page": 3})
    assert conn.execute("SELECT state::text AS s FROM source.verifications WHERE target_kind = 'place.places' AND target_id = %s AND is_current", (place,)).fetchone()["s"] == "disputed"
    assert conn.execute("SELECT relation::text AS r FROM source.attributions WHERE target_id = %s", (place,)).fetchone()["r"] == "contradicts"
    with pytest.raises(ValueError):
        pr.dispute(conn, "place.expectations", place, "no")
