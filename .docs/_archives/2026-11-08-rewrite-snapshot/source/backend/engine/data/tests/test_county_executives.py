import json

from mzizi_data.extractors import wikidata_county_executives as ex
from mzizi_data.imports import county_executives as ce
from mzizi_data.imports import county_sites as cs


def claim(position, start=None, end=None):
    q = {}
    if start:
        q["P580"] = [{"datavalue": {"value": {"time": f"+{start}T00:00:00Z", "precision": 11}}}]
    if end:
        q["P582"] = [{"datavalue": {"value": {"time": f"+{end}T00:00:00Z", "precision": 11}}}]
    return {"mainsnak": {"datavalue": {"value": {"id": position}}}, "qualifiers": q}


def entity(name, claims):
    return {"labels": {"en": {"value": name}}, "claims": {"P31": [{"mainsnak": {"datavalue": {"value": {"id": "Q5"}}}}], "P39": claims}}


def test_two_terms_merge_and_open_term_stays_open():
    bundle = {"files": {"governor-x.json": {"county": "ke/x", "kind": "governor", "position": {"id": "Q1", "alsoIds": ["Q2"]}, "entities": {"Q10": entity("A B", [claim("Q1", "2013-03-27", "2017-08-01"), claim("Q2", "2017-08-01")])}}}, "labels": {}}
    out = ex.run(json.dumps(bundle).encode(), None)
    rec = json.loads(out.segments[0].__getitem__("content") if isinstance(out.segments[0], dict) else out.segments[0]["content"])
    assert rec["from"] == "2013-03-27" and rec["to"] is None


def test_party_alias_and_unmatched():
    p = ce.Parties.__new__(ce.Parties)
    p.by = {"wdm": "ke/party/wdm", "orange democratic movement": "ke/party/odm"}
    assert p.find("Wiper Democratic Movement") == ("ke/party/wdm", "alias")
    assert p.find("Orange Democratic Movement")[0] == "ke/party/odm"
    assert p.find("Nonexistent Party") == (None, "unmatched")


def test_reason_codes():
    assert ce.reason_code("death") == "died" and ce.reason_code("resignation") == "resigned" and ce.reason_code(None) is None


def test_site_leaders(tmp_path):
    (tmp_path / "p0.html").write_text("<html><body><p>Deputy Governor: Hon. Jane Wanjiru Doe</p><p>County Secretary - Dr. John Otieno Ouma</p><p>Deputy Governor Services</p></body></html>")
    found = {(x["kind"], x["name"]) for x in cs.leaders(tmp_path)}
    assert ("deputy-governor", "Jane Wanjiru Doe") in found and ("county-secretary", "John Otieno Ouma") in found
    assert not any("Services" in n for _, n in found)
