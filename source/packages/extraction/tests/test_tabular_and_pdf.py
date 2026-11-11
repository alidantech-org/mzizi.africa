import json

from mzizi_extraction import EXTRACTORS, extract_csv, extract_json, extract_pdf


def test_csv_rows_are_keyed_by_header_and_ragged_rows_are_reported():
    out = extract_csv(b"code,name\nA,Alpha\nB\n")
    assert out.status == "partial" and out.segments[0]["content"] == {"code": "A", "name": "Alpha"}
    assert out.diagnostics[0]["code"] == "ragged_row"
    assert extract_csv(b"").status == "failed" and extract_csv(b"\xff\xfe").status == "failed"


def test_json_arrays_become_records_and_invalid_json_fails_honestly():
    assert [s["index"] for s in extract_json(b'[{"a":1},{"a":2}]').segments] == [0, 1]
    assert extract_json(b"not json").status == "failed"
    assert EXTRACTORS["json"] is extract_json and set(EXTRACTORS) == {"pdf", "geojson", "csv", "json"}


def test_pdf_text_extraction_and_an_honest_result_for_garbage():
    from pdfmaker import make_pdf

    out = extract_pdf(
        make_pdf([{"text": [(72, 720, "Hello Mzizi: a page with enough text to count as a text layer")]}])
    )
    assert out.status in ("succeeded", "partial") and any("Hello Mzizi" in json.dumps(s) for s in out.segments)
    assert extract_pdf(b"definitely not a pdf").status == "failed"
