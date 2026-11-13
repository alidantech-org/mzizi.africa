from mzizi_extraction import EXTRACTORS, extract_csv, extract_json, extract_pdf
from mzizi_extraction.core import RowContent, Status, TextContent


def test_csv_rows_are_keyed_by_header_and_ragged_rows_are_reported():
    out = extract_csv(b"code,name\nA,Alpha\nB\n")
    content = out.segments[0].content
    assert (
        out.status is Status.PARTIAL
        and isinstance(content, RowContent)
        and content.cells == {"code": "A", "name": "Alpha"}
    )
    assert out.diagnostics[0].code == "ragged_row"
    assert extract_csv(b"").status is Status.FAILED and extract_csv(b"\xff\xfe").status is Status.FAILED


def test_json_arrays_become_records_and_invalid_json_fails_honestly():
    assert [s.key for s in extract_json(b'[{"a":1},{"a":2}]').segments] == ["record-0", "record-1"]
    assert extract_json(b"not json").status is Status.FAILED
    assert EXTRACTORS["json"] is extract_json and set(EXTRACTORS) == {"pdf", "geojson", "csv", "json"}


def test_pdf_text_extraction_and_an_honest_result_for_garbage():
    from pdfmaker import make_pdf

    out = extract_pdf(
        make_pdf([{"text": [(72, 720, "Hello Mzizi: a page with enough text to count as a text layer")]}])
    )
    texts = [s.content.text for s in out.segments if isinstance(s.content, TextContent)]
    assert out.status in (Status.SUCCEEDED, Status.PARTIAL) and any("Hello Mzizi" in t for t in texts)
    assert extract_pdf(b"definitely not a pdf").status is Status.FAILED
