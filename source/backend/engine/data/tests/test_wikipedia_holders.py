"""Wikipedia office-holder extractor: layouts are read by position from the end of the row, unreadable rows are skipped, never guessed."""
import json

from mzizi_data.extractors import wikipedia_holders as w
from mzizi_data.imports.office_holders import find_constituency, name_tokens, pkey


def page(text: str) -> bytes:
    return json.dumps({"parse": {"revid": 7, "wikitext": {"*": text}}}).encode()


MPS_2017 = """==List of members==
=== Members elected from constituencies ===
{| class="wikitable sortable"
|-
! Constituency !! Member !! Party
|-
| [[Ainabkoi Constituency|Ainabkoi]] || [[William Chepkut]] || Independent
|-
| rowspan="2" |[[Baringo South Constituency|Baringo South]] || [[Grace Jelagat Kipchoim]] (2017–18) || Jubilee Party
|-
| [[Charles Kamuren]] (2018–2022){{refn|group=note|by-election}} || Jubilee Party
|}
===Woman representatives===
{| class="wikitable sortable"
|-
! County !! Member !! Party
|-
| [[West Pokot County|West Pokot]] || [[Lilian Tomitom]] || Jubilee Party
|}
===Nominated members===
{| class="wikitable sortable"
|-
! Member !! Party
|-
|  [[Wilson Sossion]]|| Orange Democratic Movement
|}
"""


def test_mps_2017_rows_and_rowspan_continuation():
    out = w.run(page(MPS_2017), "mps-2017")
    records = [json.loads(s["content"]) for s in out.segments]
    assert out.status == "succeeded"
    assert [(r["seat"], r["displayName"], r.get("area")) for r in records] == [
        ("constituency", "William Chepkut", "Ainabkoi"), ("constituency", "Grace Jelagat Kipchoim", "Baringo South"), ("constituency", "Charles Kamuren", "Baringo South"),
        ("woman", "Lilian Tomitom", "West Pokot"), ("nominated", "Wilson Sossion", None)]
    by = {r["displayName"]: r for r in records}
    assert (by["Grace Jelagat Kipchoim"]["validFrom"], by["Grace Jelagat Kipchoim"]["validTo"]) == ("2017", "2018")
    assert (by["Charles Kamuren"]["validFrom"], by["Charles Kamuren"]["validTo"]) == ("2018", "2022")
    assert by["William Chepkut"]["validFrom"] == "2017" and by["William Chepkut"]["validTo"] == "2022"


def test_unknown_profile_fails_and_empty_page_fails():
    assert w.run(page("nothing"), "mps-2017").status == "failed"
    assert w.run(page("x"), "nope").status == "failed"


def test_curated_passthrough():
    out = w.run(json.dumps({"holders": [{"seat": "president", "officeCode": "ke/presidency/president", "displayName": "A B", "validFrom": "2013"}]}).encode(), "curated")
    assert json.loads(out.segments[0]["content"])["officeCode"] == "ke/presidency/president"


def test_name_tokens_ignore_order_and_honorifics():
    assert name_tokens("Hon. Kaluma George Peter Opondo") >= name_tokens("George Kaluma")
    assert pkey("United Republican Party (Kenya)") == "unitedrepublican"
