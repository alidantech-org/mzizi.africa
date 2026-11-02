import json

from mzizi_data import extractors
from tests.pdfmaker import make_pdf

LONG = "Kenya budget statement for the financial year, tabled before the National Assembly."


def run(name, data, profile=None):
    return extractors.get(name).run(data, profile)


def test_pdf_text_pages_get_page_locators():
    out = run("pdf", make_pdf([{"text": [(72, 720, LONG)]}, {"text": [(72, 720, "Second page of the same document with enough text.")]}]))
    assert out.status == "succeeded" and [s["key"] for s in out.segments] == ["page-1", "page-2"]
    assert "budget statement" in json.loads(out.segments[0]["content"])["text"] and json.loads(out.segments[1]["locator"]) == {"page": 2}


def test_a_scanned_page_is_reported_not_hidden():
    out = run("pdf", make_pdf([{"text": [(72, 720, LONG)]}, {"image": True}]))
    assert out.status == "partial" and any(d["code"] == "ocr_required" and json.loads(d["locator"]) == {"page": 2} for d in out.diagnostics)
    assert len(out.segments) == 1


def test_a_fully_scanned_document_fails_with_the_reason():
    out = run("pdf", make_pdf([{"image": True}, {"image": True}]))
    assert out.status == "failed" and sum(1 for d in out.diagnostics if d["code"] == "ocr_required") == 2


def test_ruled_tables_are_extracted_with_page_and_table_locators_when_asked():
    cells = [(80, 665, "Vote"), (180, 665, "Recurrent"), (280, 665, "Total"), (80, 640, "Treasury"), (180, 640, "1,000"), (280, 640, "1,500")]
    pdf = make_pdf([{"text": [(72, 740, LONG), *cells], "grid": (72, 630, 3, 2, 100, 30)}])
    assert not [s for s in run("pdf", pdf).segments if s["kind"] == "table"]  # tables only with the tables profile
    out = run("pdf", pdf, "tables")
    table = next(s for s in out.segments if s["kind"] == "table")
    assert json.loads(table["locator"]) == {"page": 1, "table": 1}
    assert json.loads(table["content"])["rows"] == [["Vote", "Recurrent", "Total"], ["Treasury", "1,000", "1,500"]]


def test_unreadable_inputs_fail_without_a_traceback():
    assert run("pdf", b"not a pdf").diagnostics[0]["code"] == "not_pdf"
    assert run("pdf", b"%PDF-1.4\ngarbage").status == "failed"


def test_clean_table_drops_only_empty_columns_and_keeps_split_headers():
    from mzizi_data.extractors.pdf import clean_table

    rows = [["MDA", "", "Recurrent", None, "Total"], [None, "", "(Kshs. Millions)", None, ""], ["Teachers", "", "386,510", None, "387,181"]]
    assert clean_table(rows) == [["MDA", "Recurrent", "Total"], ["", "(Kshs. Millions)", ""], ["Teachers", "386,510", "387,181"]]


HTML = """<html><body><nav>skip me</nav><main>
<h1>Constitution (excerpt)</h1><h2>Chapter Four: The Bill of Rights</h2>
<h3>33. Freedom of expression</h3>
<p>(1) Every person has the right to freedom of expression, which includes</p>
<ul><li>(a) freedom to seek, receive or impart information or ideas;</li><li>(b) freedom of artistic creativity.</li></ul>
<p>(2) The right does not extend to propaganda for war.</p>
<h3>34. Freedom of the media</h3><p>(1) Freedom and independence of electronic, print and all other types of media is guaranteed.</p>
</main></body></html>"""


def test_html_legal_text_keeps_heading_article_and_clause_locators():
    out = run("html-legal", HTML.encode())
    assert out.status == "succeeded"
    locators = [json.loads(s["locator"]) for s in out.segments]
    assert locators[0] == {"path": ["Constitution (excerpt)", "Chapter Four: The Bill of Rights", "33. Freedom of expression"], "article": "33", "clause": "(1)"}
    assert [l["clause"] for l in locators[:4]] == ["(1)", "(a)", "(b)", "(2)"]
    assert locators[-1]["article"] == "34" and "skip me" not in " ".join(json.loads(s["content"])["text"] for s in out.segments)


def test_html_without_numbering_still_works_and_says_so():
    out = run("html-legal", b"<html><body><h1>Notice</h1><p>Plain text only.</p></body></html>")
    assert out.status == "succeeded" and any(d["code"] == "no_article_numbering" for d in out.diagnostics)
    assert run("html-legal", b"<html><body></body></html>").status == "failed"


def _scan(text: str) -> bytes:
    """A PDF whose only page is an image of rendered text (no text layer)."""
    import io

    from PIL import Image, ImageDraw, ImageFont

    image = Image.new("RGB", (1600, 500), "white")
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default(size=56)
    for index, line in enumerate(text.split("\n")):
        draw.text((60, 60 + index * 120), line, fill="black", font=font)
    buffer = io.BytesIO()
    image.save(buffer, format="PDF", resolution=200)
    return buffer.getvalue()


def test_ocr_reads_english_and_swahili_scans_when_requested():
    import pytest

    from mzizi_data.extractors import ocr

    try:
        ocr.check()
    except ocr.OcrUnavailable:
        pytest.skip("tesseract with eng and swa is not installed")
    pdf = _scan("Annual budget estimates for the county\nBajeti ya mwaka kwa kaunti ya Nairobi")
    plain = run("pdf", pdf)
    assert plain.status == "failed" and any(d["code"] == "ocr_required" for d in plain.diagnostics)
    out = run("pdf", pdf, "ocr")
    assert out.status == "succeeded"
    segment = out.segments[0]
    content = json.loads(segment["content"])
    assert content["ocr"]["engine"] == "tesseract" and content["ocr"]["languages"] == "eng+swa"
    assert "budget" in content["text"].lower() and "bajeti" in content["text"].lower()
    assert 0 < segment["confidence"] <= 0.9


def test_ocr_reports_a_missing_engine(monkeypatch):
    from mzizi_data.extractors import ocr

    monkeypatch.setattr(ocr.shutil, "which", lambda _name: None)
    out = run("pdf", _scan("Some text on a scanned page that is long enough"), "ocr")
    assert any(d["code"] == "ocr_engine_unavailable" for d in out.diagnostics)
