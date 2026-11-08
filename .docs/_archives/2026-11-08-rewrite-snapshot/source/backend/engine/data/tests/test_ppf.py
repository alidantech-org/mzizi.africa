import json

from mzizi_data.extractors import ppf_distribution
from mzizi_data.imports import ppf

from .pdfmaker import make_pdf


def pdf_of(lines: list[str]) -> bytes:
    return make_pdf([{"text": [(40, 760 - 16 * i, line) for i, line in enumerate(lines)]}])


TABLE = [
    "Table 1.1 Distribution of FY 2013/2014 Political Parties Fund",
    "S/No. Party Name Kshs.",
    "1. Alpha Party (AP) 60,000,000.00",
    "2. Beta Union (BU) 40,000,000.00",
    "Table 1.2 Distribution of FY 2014/2015 Political Parties Fund",
    "1. Alpha Party (AP) 90,000,000.50",
]


def rows(out):
    return [json.loads(s["content"]) for s in out.segments]


def test_each_table_is_read_under_its_financial_year():
    out = ppf_distribution.run(pdf_of(TABLE), None)
    assert out.status == "succeeded"
    assert [(r["fiscalYear"], r["serial"], r["partyName"], r["amount"]) for r in rows(out)] == [
        ("fy/ke/2013/14", 1, "Alpha Party (AP)", "60,000,000.00"),
        ("fy/ke/2013/14", 2, "Beta Union (BU)", "40,000,000.00"),
        ("fy/ke/2014/15", 1, "Alpha Party (AP)", "90,000,000.50"),
    ]


def test_a_table_with_a_missing_row_is_refused_and_the_others_are_kept():
    broken = TABLE[:2] + ["1. Alpha Party (AP) 60,000,000.00", "3. Gamma Party (GP) 40,000,000.00"] + TABLE[4:]
    out = ppf_distribution.run(pdf_of(broken), None)
    assert out.status == "partial"
    assert {r["fiscalYear"] for r in rows(out)} == {"fy/ke/2014/15"}
    assert any(d["code"] == "table_refused" and "fy/ke/2013/14" in d["message"] for d in out.diagnostics)


def test_a_stated_party_count_must_equal_the_rows_read():
    notice = [
        "the following two (2) political parties are eligible to receive funds from the Political Parties Fund during the Financial Year 2026/2027 as follows:",
        "S/No Code Name of the Party Total",
        "1 1 Alpha Party 7,203,075",
        "2 7 Beta Union 837,759",
    ]
    ok = ppf_distribution.run(pdf_of(notice), None)
    assert ok.status == "succeeded" and rows(ok)[1]["partyCode"] == "7" and rows(ok)[0]["fiscalYear"] == "fy/ke/2026/27"
    short = ppf_distribution.run(pdf_of([notice[0].replace("two (2)", "three (3)")] + notice[1:]), None)
    assert short.status == "failed" and any("states 3 parties" in d["message"] for d in short.diagnostics)


def test_a_zero_amount_is_refused():
    out = ppf_distribution.run(pdf_of(TABLE[:2] + ["1. Alpha Party (AP) 0.00"]), None)
    assert out.status == "failed"


def test_spaced_out_amounts_are_closed_up_without_touching_other_numbers():
    assert ppf_distribution.unspace("2. Orange Democratic Movement 1 3 1 , 3 1 0 , 7 9 9 . 5 1") == "2. Orange Democratic Movement 131,310,799.51"
    assert ppf_distribution.unspace("1 1 Peoples Liberation Party 7,203,075") == "1 1 Peoples Liberation Party 7,203,075"


PARTIES = [
    {"code": "ke/party/odm", "name": "Orange Democratic Movement", "abbreviation": "ODM", "registry_identifier": "021"},
    {"code": "ke/party/mabadiliko", "name": "Mabadiliko Party of Kenya", "abbreviation": "MPK", "registry_identifier": "092"},
    {"code": "ke/party/plp", "name": "People’s Liberation Party", "abbreviation": "PLP", "registry_identifier": "001"},
    {"code": "ke/party/wpf", "name": "Wiper Patriotic Front", "abbreviation": "WPF", "registry_identifier": "012"},
]
ALIASES = ppf.aliases_from([{"partyCode": "ke/party/wpf", "changes": "Formerly Wiper Democratic Movement (WDM)"}, {"partyCode": "ke/party/plp", "changes": "Formerly National Rainbow Coalition- Kenya (NARC- KENYA)"}])


def test_parties_are_linked_by_code_name_former_name_or_one_flagged_variant_never_by_guess():
    link = lambda name, code=None: ppf.link_party({"partyName": name, "partyCode": code}, PARTIES, ALIASES)  # noqa: E731
    assert link("anything", "21") == ("ke/party/odm", "party-code")
    assert link("Orange Democratic Movement (ODM)") == ("ke/party/odm", "name")
    assert link("Wiper- Democratic Movement") == ("ke/party/wpf", "former-name")
    assert link("Wiper Democratic Movement- Kenya(WIPER-K)") == ("ke/party/wpf", "former-name")
    assert link("Mabandiliko Party of Kenya") == ("ke/party/mabadiliko", "spelling-variant")
    assert link("The National Alliance (TNA)") == (None, "unlinked")  # a party that merged away is not guessed into another
    assert link("Democratic Movement of Kenya") == (None, "unlinked")
