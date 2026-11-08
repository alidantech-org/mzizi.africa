"""Hansard and order-paper parsing and the classifier's sitting rule; no network."""
import json

from mzizi_data.extractors import sitting_pdf
from mzizi_data.imports import sittings
from mzizi_data.semantics import classify

HANSARD = """REPUBLIC OF KENYA
THIRTEENTH PARLIAMENT
NATIONAL ASSEMBLY
THE HANSARD
21st October 2026 Vol. V No. 96
Wednesday, 21st October 2026
(The House met at 2.30 p.m.)
[The Speaker (Hon. Moses Wetang’ula) in the Chair]
Hon. Speaker: Proceed.
Hon. Naomi Waqo (Marsabit County, UDA): Thank you. I beg to move that the Pest Control Products Bill (National Assembly Bill No. 48 of 2025) be read.
Hon. (Dr) Ojiambo Oundo (Funyula, ODM): I support.
Hon. Naomi Waqo (Marsabit County, UDA): Again.
Division. Ayes: 190 Noes: 42 the Question was carried. """ + "x " * 60

ORDER = "REPUBLIC OF KENYA\nTHIRTEENTH PARLIAMENT – (FIFTH SESSION)\nTHE NATIONAL ASSEMBLY\nORDERS OF THE DAY\nTUESDAY, NOVEMBER 03, 2026 AT 2.30 P.M.\nORDER OF BUSINESS\n" + "PRAYERS " * 20


def record(out):
    return json.loads(out.segments[0]["content"])


def test_hansard_gives_date_house_presiding_speakers_and_division():
    out = sitting_pdf.parse([HANSARD])
    r = record(out)
    assert (r["house"], r["date"], r["volume"], r["number"]) == ("national-assembly", "2026-10-21", "V", 96)
    assert r["presiding"] == {"role": "Speaker", "name": "Moses Wetang’ula"}
    assert [(s["name"], s["area"], s["party"], s["contributions"]) for s in r["speakers"]] == [("Naomi Waqo", "Marsabit County", "UDA", 2), ("Ojiambo Oundo", "Funyula", "ODM", 1)]
    assert r["divisions"][0]["ayes"] == 190 and r["divisions"][0]["noes"] == 42
    assert r["bills"] == ["Pest Control Products Bill (National Assembly Bill No. 48 of 2025)"]


def test_a_division_larger_than_the_house_is_refused():
    out = sitting_pdf.parse([HANSARD.replace("Ayes: 190 Noes: 42", "Ayes: 300 Noes: 100")])
    assert out.status == "failed" and "exceeds the 349 members" in out.diagnostics[0]["message"]


def test_an_order_paper_date_comes_from_its_heading_and_it_is_planned():
    r = record(sitting_pdf.parse([ORDER]))
    assert (r["documentKind"], r["date"], r["startTime"]) == ("order_paper", "2026-11-03", "2.30 P.M.")
    event = sittings.to_event(r)
    assert event["status"] == "planned" and event["eventCode"] == "ke/sitting/national-assembly/2026-11-03/230pm/order-paper"


def test_a_sitting_without_a_date_is_refused():
    assert sitting_pdf.parse(["THE NATIONAL ASSEMBLY\nORDERS OF THE DAY\n" + "x " * 80]).status == "failed"


def test_order_papers_and_hansard_are_not_classified_as_the_bills_they_list():
    page = ORDER + "\nTHE REVENUE BILL, 2026\nA Bill for an Act of Parliament\nBill, 2026 Bills No. 4 of 2026"
    from mzizi_data.semantics import Extracted

    result = classify(None, ["ORDER-PAPER.pdf"], None, Extracted([page], "test"))
    assert result.kind == "order_paper"
    assert classify(None, ["h.pdf"], None, Extracted([HANSARD], "test")).kind == "hansard"
