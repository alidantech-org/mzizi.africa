import json

import pytest

from mzizi_data.extractors import orpp_parties
from mzizi_data.imports import orpp_parties as importer

from .pdfmaker import make_pdf

COLS, CELL_W, CELL_H, X0, Y0 = 11, 55, 28, 5, 120


def register_pdf(header: list[str], rows: list[list[str]]) -> bytes:
    table = [header] + rows
    text = []
    for r, cells in enumerate(table):
        y = Y0 + (len(table) - 1 - r) * CELL_H + 10
        for c, value in enumerate(cells):
            if value:
                text.append((X0 + c * CELL_W + 3, y, value))
    return make_pdf([{"text": text, "grid": (X0, Y0, COLS, len(table), CELL_W, CELL_H)}])


FULL_HEADER = ["S/No", "Certificate", "Name", "Abbrev", "Issued", "Symbol", "Colors", "Postal", "Location", "Slogan", "Changes"]
FULL_ROWS = [
    ["1.", "1 001", "Alpha Pty", "AP", "", "Rose", "Red", "100-00100", "Nairobi", "Unite", ""],
    ["2.", "2 002", "Beta Un", "BU", "", "Tree", "Green", "200-00100", "Kisumu", "", ""],
]


def test_register_rows_become_records_with_certificate_numbers():
    out = orpp_parties.run(register_pdf(FULL_HEADER, FULL_ROWS), None)
    assert out.status == "succeeded"
    first, second = (json.loads(s["content"]) for s in out.segments)
    assert (first["name"], first["abbreviation"], first["certificateNumber"], first["register"], first["status"]) == ("Alpha Pty", "AP", "001", "full", "active")
    assert second["serial"] == 2 and second["certificateNumber"] == "002" and second["postalAddress"] == "200-00100"


def test_a_document_without_a_register_table_fails_instead_of_returning_nothing():
    assert orpp_parties.run(make_pdf([{"text": [(50, 700, "Nothing here")]}]), None).status == "failed"


def test_dates_are_parsed_only_when_complete():
    assert orpp_parties.parse_date("19th March 2012") == "2012-03-19"
    assert orpp_parties.parse_date("14th October, 2026") == "2026-10-14"
    assert orpp_parties.parse_date("March 2012") is None and orpp_parties.parse_date("31st February 2012") is None


def test_tidy_fixes_pdf_spacing_only():
    assert importer.tidy("Democratic Action Party- Kenya") == "Democratic Action Party - Kenya"
    assert importer.tidy("NAP- K", compact=True) == "NAP-K"
    assert importer.tidy("  Jubilee   Party ") == "Jubilee Party"


def rec(name, abbreviation, register="full", changes=None):
    return {"name": name, "abbreviation": abbreviation, "register": register, "changes": changes, "issueDate": None}


EXISTING = [
    {"id": "1", "code": "ke/party/uda", "name": "UDA", "abbreviation": "UDA"},
    {"id": "2", "code": "ke/party/ford-k", "name": "FORD - K", "abbreviation": "FORD - K"},
    {"id": "3", "code": "ke/party/wdm", "name": "WDM", "abbreviation": "WDM"},
    {"id": "4", "code": "ke/party/ind", "name": "IND", "abbreviation": "IND"},
]


def test_matching_uses_abbreviations_never_names_alone():
    records = [rec("United Democratic Alliance", "UDA"), rec("Forum for Restoration of Democracy - Kenya", "FORD-KENYA"), rec("Wiper Patriotic Front", "WPF", changes="Formerly Wiper Democratic Movement (WDM)"), rec("Union of Doctors Allies", "UDAL"), rec("Independent Movement", "IMV")]
    plan = importer.match_register(records, EXISTING)
    basis = {m["partyCode"]: m["basis"] for m in plan.matches}
    assert basis == {"ke/party/uda": "abbreviation", "ke/party/ford-k": "abbreviation-expansion", "ke/party/wdm": "former-name"}
    assert [r["abbreviation"] for r in plan.new] == ["UDAL", "IMV"]  # a similar name or abbreviation is not a link
    assert [c["stored"] for c in plan.conflicts] == ["ke/party/ind"]  # the label that is not a party is reported, not linked


def test_two_parties_sharing_an_abbreviation_are_a_conflict_not_a_merge():
    plan = importer.match_register([rec("Alpha Party", "AP"), rec("Another Party", "AP")], [])
    assert plan.new == [] and len(plan.conflicts) == 2


def test_a_party_in_both_registers_is_one_party_and_the_full_record_wins():
    full = [dict(rec("Imarisha Uchumi Party", "IUP"), issueDate="2026-10-12")]
    provisional = [dict(rec("Imarisha Uchumi Party", "IUP", "provisional"), issueDate="2025-05-15", partyCode="0112"), rec("Other Party", "OP", "provisional")]
    merged, report = importer.merge_registers(full, provisional)
    assert [m["abbreviation"] for m in merged] == ["IUP", "OP"] and merged[0]["register"] == "full" and merged[0]["provisionalDate"] == "2025-05-15"
    assert len(report) == 1


@pytest.mark.parametrize("name", ["AP"])
def test_staging_creates_candidates_for_new_parties_only_and_keeps_contacts_out(conn, store, tmp_path, name):
    jur = conn.execute("SELECT id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    conn.execute("DELETE FROM political.parties WHERE code LIKE 'ke/party/%'")
    conn.execute("INSERT INTO political.parties (code, name, abbreviation, status, jurisdiction_id, is_current, created_at, updated_at, version) VALUES ('ke/party/bu', 'BU', 'BU', 'active', %s, true, now(), now(), 1)", (jur["id"],))
    full = tmp_path / "abc123-full.pdf"
    prov = tmp_path / "abc123-prov.pdf"
    full.write_bytes(register_pdf(FULL_HEADER, FULL_ROWS))
    prov.write_bytes(register_pdf(["S/No", "Codes", "Party", "Abbrev", "Symbol", "Slogan", "Colours", "Date", "Status", "Email", ""], [["1.", "0109", "Gamma", "GP", "Owl", "Go", "Blue", "5 May", "Applied", "a@gp.ke", ""]]))
    for path in (full, prov):
        (tmp_path / (path.name + ".provenance.json")).write_text(json.dumps({"url": "https://orpp.or.ke/x.pdf", "retrieved_at": "2026-11-02T00:00:00+00:00"}))
    out = importer.stage_register(conn, store, full, prov, tmp_path / "plan.json")
    assert out.report["counts"]["matched"] == 1 and out.report["counts"]["new"] == 2
    assert {m["partyCode"] for m in out.report["matches"]} == {"ke/party/bu"}
    payloads = [r["payload"] for r in conn.execute("SELECT payload FROM staging.candidates WHERE run_id = %s", (out.run_id,)).fetchall()]
    assert {p["abbreviation"] for p in payloads} == {"AP", "GP"}
    assert {p["status"] for p in payloads} == {"active", "provisional"}
    assert "a@gp.ke" not in json.dumps(payloads) and "100-00100" not in json.dumps(payloads)
    assert conn.execute("SELECT count(*) AS n FROM staging.issues i JOIN staging.candidates c ON c.id = i.candidate_id WHERE c.run_id = %s", (out.run_id,)).fetchone()["n"] == 0
