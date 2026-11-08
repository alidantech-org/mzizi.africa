import json

from mzizi_data.extractors import iebc_commissioners, klrc_constitution, ngcdf_api, parliament_members
from mzizi_data.imports.members import enrich, slug
from mzizi_data.imports.ngcdf import constituency_index

MPS = """<html><body><table class="cols-7"><thead><tr><th>Member of Parliament</th><th></th><th>County</th><th>Constituency</th><th>Party</th><th>Status</th><th></th></tr></thead><tbody>
<tr class="mp"><td></td><td><a href="/x"><img src="/sites/default/files/default_images/person-outline.png"></a></td><td></td><td></td><td></td><td></td><td>More...</td></tr>
<tr class="mp"><td>HON. MEJJADONK, BENJAMIN GATHIRU</td><td><a href="/the-national-assembly/hon-m"><img src="/sites/default/files/2022-09/m.jpg"></a></td><td>NAIROBI</td><td>EMBAKASI CENTRAL</td><td>UDA</td><td>Elected</td><td>More...</td></tr>
<tr class="mp"><td>HON. (DR.) AMOLLO PAUL OTIENDE, CS, CBS</td><td></td><td>SIAYA</td><td>RARIEDA</td><td>ODM</td><td>Elected</td><td>More...</td></tr>
</tbody></table></body></html>"""


def test_member_lists_read_public_office_facts_and_skip_placeholders():
    out = parliament_members.run(MPS.encode(), "national-assembly")
    assert out.status == "succeeded" and "1 placeholder" in out.diagnostics[0]["message"]
    first, second = (json.loads(s["content"]) for s in out.segments)
    assert first["displayName"] == "Benjamin Gathiru Mejjadonk" and first["familyName"] == "Mejjadonk" and first["party"] == "UDA"
    assert first["photoPath"].endswith("m.jpg")
    assert second["displayName"] == "Amollo Paul Otiende" and second["familyName"] is None  # order is only claimed when a comma gives it


def test_member_records_get_stable_codes():
    record = json.loads(parliament_members.run(MPS.encode(), "national-assembly").segments[0]["content"])
    out = enrich(record)
    assert out["personCode"] == "ke/person/benjamin-gathiru-mejjadonk" and out["officeCode"] == "ke/national-assembly/embakasi-central" and out["partyCode"] == "ke/party/uda"
    assert slug("King'ola Patrick") == "kingola-patrick"


def test_ngcdf_api_rows_are_text_with_iso_dates():
    allocations = ngcdf_api.run(json.dumps({"PAYLOAD": [{"Allocations": "CHANGAMWE"}, {"Amount": "192,613,248.00", "FY": "2026/2027"}, {"Amount": "", "FY": "2025/2026"}]}).encode(), "allocations")
    assert [json.loads(s["content"])["amount"] for s in allocations.segments] == ["192,613,248.00"]
    disbursements = ngcdf_api.run(json.dumps({"PAYLOAD": [{"Disbursement": "CHANGAMWE"}, {"Date": "Sep 2, 2026", "Amount": "15,000,000.00", "FY": "2026/2027"}]}).encode(), "disbursements")
    assert json.loads(disbursements.segments[0]["content"])["date"] == "2026-09-02"
    assert ngcdf_api.run(b"{}", None).status == "failed"


def test_constituency_list_gives_county_and_id():
    page = b'<table><tr><td>30</td><td>Baringo County</td><td>159. Baringo-Central, 158. Baringo-North</td></tr></table>'
    assert constituency_index(page) == {159: ("Baringo", "Baringo-Central"), 158: ("Baringo", "Baringo-North")}


ARTICLE = b'<html><body><span class="category-name" title="Category: Chapter One - Sovereignty of the People"></span><h2 itemprop="headline"> Article 1. Sovereignty of the people </h2><div itemprop="articleBody"><p>(1) All sovereign power belongs to the people of Kenya.</p><p>(2) The people may exercise it directly.</p></div></body></html>'


def test_constitution_article_is_kept_verbatim_under_its_chapter():
    out = klrc_constitution.run(ARTICLE, None)
    content = json.loads(out.segments[0]["content"])
    assert content["number"] == "1" and content["heading"] == "Sovereignty of the people" and content["chapter"] == 1 and content["kind"] == "article"
    assert content["text"].splitlines()[0].startswith("(1) All sovereign power")
    assert klrc_constitution.run(b"<html><body><h1>listing</h1></body></html>", None).status == "failed"


def test_iebc_commissioners_page():
    page = b"<html><body>Commissioners Erastus Edung Ethekon, HSC Chairperson Read more Fahima Araphat Abdallah, OGW Vice Chairperson Read more Dr. Alutalala Mukhwana Commissioner Read more footer</body></html>"
    out = iebc_commissioners.run(page, None)
    rows = [json.loads(s["content"]) for s in out.segments]
    assert [(r["displayName"], r["role"]) for r in rows] == [("Erastus Edung Ethekon", "Chairperson"), ("Fahima Araphat Abdallah", "Vice Chairperson"), ("Alutalala Mukhwana", "Commissioner")]
