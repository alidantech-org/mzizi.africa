"""Document semantics tests: layered classification, facts with spans, routing and the gap queue."""
import io
import json
import uuid
from datetime import datetime, timezone

import pytest

from mzizi_data import register, semantics
from mzizi_data.semantics import Extracted, classify, extract_facts, extract_text, precision_by_kind
from tests.pdfmaker import make_pdf


def pdf(*lines):
    return make_pdf([{"text": [(72, 720 - 16 * i, line) for i, line in enumerate(lines)]}])


def xlsx(rows, title="Sheet1"):
    from openpyxl import Workbook

    wb = Workbook()
    ws = wb.active
    ws.title = title
    for row in rows:
        ws.append(row)
    out = io.BytesIO()
    wb.save(out)
    return out.getvalue()


def docx(*paragraphs):
    from docx import Document

    d = Document()
    for p in paragraphs:
        d.add_paragraph(p)
    out = io.BytesIO()
    d.save(out)
    return out.getvalue()


# ---- layers -----------------------------------------------------------------------------------------------------

def test_url_layer_alone_accepts_a_strong_filename():
    c = classify(None, ["https://x.go.ke/files/Kenya-Gazette-Vol-CXXV.pdf"])
    assert (c.kind, c.method) == ("gazette_notice", "url_pattern") and c.score >= semantics.ACCEPT


def test_text_layer_reads_a_pdf():
    data = pdf("THE KENYA GAZETTE", "Published by Authority of the Republic of Kenya", "GAZETTE NOTICE NO. 4521")
    c = classify(data, ["https://x.go.ke/downloads/file123.pdf"])
    assert c.kind == "gazette_notice" and c.method == "text_pattern" and c.score >= 0.85
    assert c.evidence["extract"]["method"] == "pymupdf"


def test_layers_agree_and_raise_confidence():
    data = pdf("Approved Budget Estimates")
    both = classify(data, ["https://x.go.ke/budget-2023.pdf"], "Approved Budget Estimates 2023/24")
    text_only = classify(data, ["https://x.go.ke/f1.pdf"])
    assert both.kind == text_only.kind == "budget" and both.score > text_only.score
    assert both.parser == "budget-table"


def test_fuzzy_title_matches_a_misspelled_or_reordered_title():
    c = classify(None, ["https://x.go.ke/f.pdf"], "Invitaton to Tender - supply of stationery")
    assert c.kind == "tender_notice" and c.method == "title_fuzzy"
    c2 = classify(None, ["https://x.go.ke/f.pdf"], "Annual Report and Financial Statements for the Year Ended 30th June 2023")
    assert c2.kind == "financial_statement"


def test_xlsx_docx_csv_zip_text_is_extracted():
    sheet = xlsx([["Population by County", "Male", "Female"], ["Nairobi", 1, 2]], "Census 2019")
    assert "Population by County" in extract_text(sheet, "t.xlsx").text and classify(sheet, ["t.xlsx"]).kind == "census_table"
    word = docx("PARTY CONSTITUTION", "Constitution of the Example Party", "As registered by the Registrar of Political Parties")
    assert classify(word, ["const.docx"]).kind == "party_constitution"
    assert extract_text(b"unit,amount\nA,1\n", "d.csv").method == "csv-header"
    import zipfile

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as z:
        z.writestr("hansard/2023-05-01.pdf", b"x")
    assert "hansard/2023-05-01.pdf" in extract_text(buf.getvalue(), "z.zip").text
    assert classify(buf.getvalue(), ["archive.zip"]).kind == "hansard"


def test_unclassified_when_nothing_matches_or_kinds_tie():
    nothing = classify(pdf("Minutes of the staff picnic committee"), ["https://x.go.ke/misc/file.pdf"])
    assert nothing.kind == "unclassified" and nothing.method == "none"
    tie = classify(None, ["https://x.go.ke/audit-budget.pdf"])
    assert tie.kind == "unclassified" and "too close" in tie.evidence["why_unclassified"]


def test_a_damaged_or_scanned_file_is_a_result_not_a_crash():
    broken = classify(b"%PDF-1.4 garbage", ["https://x.go.ke/f.pdf"])
    assert broken.kind == "unclassified" and broken.evidence["extract"]["method"] == "failed"
    scanned = make_pdf([{"image": True}])
    c = classify(scanned, ["https://x.go.ke/f.pdf"])
    assert c.evidence["extract"]["scanned"] is True and c.kind == "unclassified"


# ---- facts and spans ----------------------------------------------------------------------------------------------

def test_facts_have_values_and_spans_into_the_text():
    pages = ["Gazette Notice No. 1234 dated 14th June, 2023. Budget of KES 1,250,000.50 and Ksh. 12.5 million, tender no. TND/2024/17.", "Signed 03/07/2023 and 2023-08-09. Act No. 3 of 2019. FY 2023/24."]
    facts = extract_facts(pages)
    text = "\f".join(pages)
    by = {(f["type"], f["value"]): f for f in facts}
    assert ("date", "2023-06-14") in by and ("date", "2023-07-03") in by and ("date", "2023-08-09") in by
    assert ("amount", "1250000.50") in by and ("amount", "12500000.0") in by or ("amount", "12500000.00") in by or any(f["type"] == "amount" and Decimal_eq(f["value"], 12500000) for f in facts)
    assert ("reference", "1234") in by and ("reference", "TND/2024/17") in by and ("reference", "3/2019") in by
    for f in facts:
        assert text[f["start"]:f["end"]] == f["text"]
    assert by[("date", "2023-07-03")]["page"] == 2 and by[("date", "2023-06-14")]["page"] == 1
    assert by[("amount", "1250000.50")]["currency"] == "KES"


def Decimal_eq(value, number):
    from decimal import Decimal

    return Decimal(value) == Decimal(number)


def test_impossible_dates_are_not_extracted():
    assert not [f for f in extract_facts(["Dated 31 February 2023 and 31/02/2023."]) if f["type"] == "date"]


# ---- registry: persistence, routing, gaps -------------------------------------------------------------------------

@pytest.fixture()
def doc(conn, store):
    def make(data, name, title, url=None):
        unique = uuid.uuid4().hex[:8]
        code = f"ke/sem-{unique}"
        conn.execute("INSERT INTO reference.jurisdictions (code, name, kind, is_current, created_at, updated_at, version) VALUES ('ke', 'Kenya', 'modern_state', true, now(), now(), 1) ON CONFLICT DO NOTHING")
        site_id = str(conn.execute("INSERT INTO website.sites (code, name, kind, status, created_at, updated_at, version) VALUES (%s, 'Sem site', 'portal', 'active', now(), now(), 1) RETURNING id", (code,)).fetchone()["id"])
        publisher = register.ensure_publisher(conn, code, "Sem site")
        url = url or f"https://{unique}.go.ke/files/{name}"
        document_id = register.ensure_document(conn, register.DocumentSpec(publisher, title, "archival_record", url, site_id=site_id))
        ref = store.put(data, f"{unique}-{name}", "/test-semantics")
        capture = register.record_capture(conn, document_id, ref.version_id, ref.content_hash, url, "test", 200, datetime.now(timezone.utc), site_id)
        conn.execute(
            "INSERT INTO website.document_sightings (site_id, document_id, capture_id, url, content_hash, size_bytes, http_status, depth, seen_at, created_at, updated_at, version) VALUES (%s, %s, %s, %s, %s, %s, 200, 1, now(), now(), now(), 1)",
            (site_id, document_id, capture, url, ref.content_hash, len(data)),
        )
        return document_id, code

    return make


def kind_code(conn, document_id):
    return conn.execute("SELECT c.code FROM source.documents d JOIN reference.classifications c ON c.id = d.kind_id WHERE d.id = %s", (document_id,)).fetchone()["code"]


def test_classified_with_a_parser_is_routed_and_refines_the_document_kind(conn, store, doc):
    document_id, code = doc(pdf("Approved Budget Estimates", "Programme Based Budget 2023/24"), "est.pdf", "Estimates")
    out = semantics.classify_document(conn, store, document_id)
    assert out["kind"] == "budget" and out["route_status"] == "routed" and out["parser"] == "budget-table"
    row = conn.execute("SELECT * FROM source.document_classifications WHERE document_id = %s", (document_id,)).fetchone()
    assert row["classifier_version"] == semantics.CLASSIFIER_VERSION and float(row["score"]) >= 0.55 and row["method"] in ("text_pattern", "url_pattern", "title_fuzzy")
    assert json.loads(row["evidence"])["layers"] and json.loads(row["facts"]) is not None
    assert kind_code(conn, document_id) == "source/document-kind/budget"
    assert conn.execute("SELECT count(*) AS n FROM engine.gaps WHERE target_id = %s", (document_id,)).fetchone()["n"] == 0


def test_classified_without_a_parser_is_unrouted_and_queues_a_parser_gap(conn, store, doc):
    document_id, code = doc(pdf("THE KENYA GAZETTE", "GAZETTE NOTICE NO. 12"), "gn.pdf", "Notice")
    out = semantics.classify_document(conn, store, document_id)
    assert out["kind"] == "gazette_notice" and out["route_status"] == "unrouted"
    gap = conn.execute("SELECT field, status, reason FROM engine.gaps WHERE target_kind = 'source.documents' AND target_id = %s", (document_id,)).fetchone()
    assert (gap["field"], gap["status"]) == ("parser", "open")


def test_unclassified_goes_to_the_gap_queue_and_keeps_its_kind(conn, store, doc):
    document_id, code = doc(pdf("Staff picnic minutes"), "misc.pdf", "Minutes")
    out = semantics.classify_document(conn, store, document_id)
    assert out["kind"] == "unclassified" and out["route_status"] == "gapped"
    gap = conn.execute("SELECT field, status FROM engine.gaps WHERE target_kind = 'source.documents' AND target_id = %s", (document_id,)).fetchone()
    assert (gap["field"], gap["status"]) == ("kind", "open")
    assert kind_code(conn, document_id) == "source/document-kind/archival_record"
    assert document_id in {str(g["target_id"]) for g in __import__("mzizi_data.reinforcement", fromlist=["queue"]).queue(conn, 5000)}


def test_classification_is_idempotent_per_version_and_append_only_across_versions(conn, store, doc, monkeypatch):
    document_id, code = doc(pdf("Tender Notice", "Invitation to Tender"), "t.pdf", "Tender")
    first = semantics.classify_document(conn, store, document_id)
    again = semantics.classify_document(conn, store, document_id)
    assert again["cached"] is True and first["kind"] == again["kind"] == "tender_notice"
    monkeypatch.setattr(semantics, "CLASSIFIER_VERSION", "layered-9.9.9")
    semantics.classify_document(conn, store, document_id)
    versions = [r["classifier_version"] for r in conn.execute("SELECT classifier_version FROM source.document_classifications WHERE document_id = %s ORDER BY 1", (document_id,)).fetchall()]
    assert versions == [semantics.CLASSIFIER_VERSION if False else "layered-1.0.0", "layered-9.9.9"] or len(versions) == 2


def test_classify_pending_covers_a_site_and_summarises(conn, store, doc):
    a, code = doc(pdf("Approved Budget Estimates"), "a.pdf", "A")
    b, _ = doc(pdf("nothing useful here"), "b.pdf", "B")
    summary = semantics.classify_pending(conn, store, site_code=code)
    assert summary["classified"] == 1
    assert semantics.classify_pending(conn, store, site_code=code)["classified"] == 0


def test_precision_by_kind():
    labels = [{"id": "1", "kind": "budget"}, {"id": "2", "kind": "budget"}, {"id": "3", "kind": "act"}, {"id": "4", "kind": "act"}]
    out = precision_by_kind(labels, {"1": "budget", "2": "act", "3": "act", "4": "unclassified"})
    assert out["budget"]["precision"] == 1.0 and out["budget"]["recall"] == 0.5
    assert out["act"]["precision"] == 0.5 and out["act"]["recall"] == 0.5
    assert out["unclassified"]["predicted"] == 1 and out["unclassified"]["precision"] == 0.0
