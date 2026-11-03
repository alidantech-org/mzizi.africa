"""Legal document extraction (Acts, Bills, Gazette notices) and mapping to instrument records; no network."""
import json

from mzizi_data.crawl import disposition_name, is_download_link
from mzizi_data.extractors import legal_pdf
from mzizi_data.imports import legal_documents

ACT = [
    "LAWS OF KENYA",
    "THE EXAMPLE FUND ACT",
    "CHAPTER 999A",
    "No. 7 of 2023",
    "[Date of commencement: 19th February, 2016.]",
    "ARRANGEMENT OF SECTIONS",
    "1. Short title",
    "2. Interpretation",
    "2A. Objects",
    "3. Fund",
    "THE EXAMPLE FUND ACT",
    "1. Short title",
    "This Act may be cited as the Example Fund Act.",
    "2. Interpretation",
    "In this Act, unless the context otherwise requires",
    "2A. Objects",
    "The objects of this Act are to fund examples.",
    "3. Fund",
    "There is established a Fund.",
    "SCHEDULE",
    "1. First item",
    "2. Second item",
]


def pages(lines):
    return ["\n".join(lines)]


def contents(out):
    return {s["key"]: json.loads(s["content"]) for s in out.segments}


def test_an_act_gives_an_instrument_and_its_sections_with_headings_from_the_arrangement():
    out = legal_pdf.parse(pages(ACT))
    assert out.status == "succeeded"
    c = contents(out)
    assert c["instrument"]["title"] == "Example Fund Act" and c["instrument"]["kind"] == "act"
    assert c["instrument"]["chapter"] == "999A" and c["instrument"]["commencement"] == "2016-02-19"
    assert [k for k in c if k != "instrument"] == ["s-1", "s-2", "s-2A", "s-3"]  # the schedule's own 1, 2 are not sections
    assert c["s-2A"]["heading"] == "Objects" and "fund examples" in c["s-2A"]["text"]


def test_sections_that_skip_a_number_are_refused_and_the_instrument_is_kept():
    broken = [line for line in ACT if line != "3. Fund"]
    broken.insert(broken.index("There is established a Fund."), "4. Fund")
    broken = [("4. Fund" if line == "3. Fund" else line) for line in ACT]
    out = legal_pdf.parse(pages(broken))
    assert out.status == "partial"
    assert [s["kind"] for s in out.segments] == ["instrument"]
    assert any(d["code"] == "sections_refused" for d in out.diagnostics)


def test_a_bill_is_a_draft_with_a_year_in_its_title():
    out = legal_pdf.parse(pages(["THE POLITICAL PARTIES (AMENDMENT) BILL, 2024", "A Bill for an Act of Parliament", "1. This Act may be cited as the Political Parties (Amendment) Act, 2024.", "2. Section 2 is amended."]))
    inst = contents(out)["instrument"]
    assert (inst["kind"], inst["year"]) == ("bill", 2024)
    records, provisions, _ = legal_documents.instrument_records({"url": "https://x.go.ke/a.pdf", "hash": "h", "title": "t"}, [(s["kind"], json.loads(s["content"])) for s in out.segments])
    assert records[0]["status"] == "draft" and records[0]["kindCode"] == "legal/instrument-kind/bill" and records[0]["issuerCode"] is None
    assert provisions[0]["provisionCode"] == f"{records[0]['instrumentCode']}/s-1"


def test_an_act_is_linked_to_parliament_and_a_space_glyph_is_repaired():
    spaced = [line.replace(" ", "!") if i > 11 else line for i, line in enumerate(ACT)]
    text, repaired = legal_pdf.repair("\n".join(["This!Act!may!be!cited!as!the!Example!Act, " * 1] * 40))
    assert repaired and "!" not in text
    out = legal_pdf.parse(pages(ACT))
    records, _, _ = legal_documents.instrument_records({"url": "https://x.go.ke/a.pdf", "hash": "h", "title": "t"}, [(s["kind"], json.loads(s["content"])) for s in out.segments])
    assert records[0]["instrumentCode"] == "ke/act/example-fund-act" and records[0]["issuerCode"] == "ke/parliament" and records[0]["status"] == "in_force"
    assert spaced  # kept for readability of the repair case


def test_a_gazette_issue_gives_one_notice_per_number_dated_by_the_issue():
    issue = ["THE KENYA GAZETTE", "Published by Authority of the Republic of Kenya", "Vol. CXXVIII—No. 45", "NAIROBI, 5th May, 2026", "GAZETTE NOTICE NO. 4410", "THE EXAMPLE ACT", "Notice is given that the Minister appoints Jane Doe.", "GAZETTE NOTICE NO. 4411", "Change of name."]
    out = legal_pdf.parse(pages(issue))
    c = contents(out)
    assert sorted(c) == ["notice-4410", "notice-4411"]
    assert c["notice-4410"]["issue"] == {"date": "2026-05-05", "number": 45, "volume": "CXXVIII"}
    records, provisions, _ = legal_documents.instrument_records({"url": "u", "hash": "h", "title": "t"}, [(s["kind"], json.loads(s["content"])) for s in out.segments])
    assert records[0]["instrumentCode"] == "ke/gazette-notice/cxxviii-45/4410" and records[0]["validFrom"] == "2026-05-05" and not provisions


def test_a_scan_without_text_is_reported_not_guessed():
    out = legal_pdf.parse(["", " "])
    assert out.status == "failed" and out.diagnostics[0]["code"] == "no_text"


def test_download_manager_links_count_as_files_and_the_stated_file_name_is_used():
    assert is_download_link("https://cob.go.ke/download/report/?wpdmdl=14825", {"pdf"})
    assert is_download_link("https://x.go.ke/a.pdf", {"pdf"}) and not is_download_link("https://cob.go.ke/download/report/", {"pdf"})
    assert disposition_name({"Content-Disposition": 'attachment; filename="Report%20Q1.pdf"'}) == "Report Q1.pdf"
    assert disposition_name({}) is None
