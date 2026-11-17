from mzizi_extraction.document import format_markdown, tidy_rows


def test_formatter_spaces_blocks_and_aligns_tables() -> None:
    raw = "#Title\ntext\n* one\n* two\n|a|bb|\n|---|---|\n|1|2|\n\n\n\nend  \n"
    out = format_markdown(raw)
    assert out.startswith("# Title\n\ntext\n\n- one\n- two\n\n| a   | bb  |")
    assert "| --- | --- |" in out and out.endswith("end\n")
    assert format_markdown(out) == out


def test_formatter_keeps_front_matter_and_code() -> None:
    raw = "---\nurl: x\n---\n\n```\n  keep   this\n\n\nas is\n```\n"
    out = format_markdown(raw)
    assert out.startswith("---\nurl: x\n---\n") and "  keep   this\n\n\nas is" in out


def test_tidy_merges_split_headers_and_drops_empty_columns() -> None:
    rows = (
        ("", "Type", "Type", "Disclosure YES", "Details"),
        ("", "", "", "OR NO", ""),
        ("1", "Tenderer controlled", "", "", ""),
    )
    tidy, header_rows = tidy_rows(rows)
    assert header_rows == 2
    assert tidy[0] == ("", "Type", "Disclosure YES", "Details")
    assert tidy[-1] == ("1", "Tenderer controlled", "", "")


def test_tidy_does_not_treat_a_continued_table_first_row_as_header() -> None:
    rows = (("1", "Tenderer is controlled by another tenderer", "", ""), ("2", "Tenderer receives a subsidy", "", ""))
    _, header_rows = tidy_rows(rows)
    assert header_rows == 0


def test_prose_page_is_not_turned_into_a_table() -> None:
    from pdfmaker import make_pdf

    from mzizi_extraction.document import DocumentProfile, extract_pdf_document

    sentences = [
        "Welcome back and thank you so much for staying with us today on the programme.",
        "I want us to have a conversation beyond the political parties and what it means.",
        "Of course it is an office I have been familiar with for some time now indeed.",
        "We have got ninety one registered political parties in the country at present.",
        "That is a very good question and I will try to answer it as clearly as I can.",
        "When I first got the call I was surprised but also honoured to be asked to serve.",
    ]
    data = make_pdf([{"text": [(72, 720 - 18 * i, line) for i, line in enumerate(sentences)]}])
    out = extract_pdf_document(data, DocumentProfile(auto_tables=True))
    assert not any(b.kind == "table" for page in out.pages for b in page.blocks)


def test_gate_tells_prose_from_a_table_and_checks_totals() -> None:
    from mzizi_extraction.document.table_gate import looks_like_prose, totals_mismatch

    prose = (
        ("Welcome back and thank you so much for staying with us today", "", ""),
        ("I want us to have a conversation beyond the political parties.", "and", ""),
        ("Of course it is an office I have been familiar with for some time", "", "now"),
        ("We have got ninety one registered political parties in the country", "", ""),
    )
    table = (("Party", "Members", "Seats"), ("A", "10", "2"), ("B", "20", "3"), ("C", "5", "1"))
    assert looks_like_prose(prose) and not looks_like_prose(table)
    ok = (("Item", "Cost"), ("a", "10"), ("b", "20"), ("Total", "30"))
    bad = (("Item", "Cost"), ("a", "10"), ("b", "20"), ("Total", "35"))
    assert not totals_mismatch(ok) and totals_mismatch(bad)


def test_continuation_tables_are_stitched_without_repeated_headers() -> None:
    from mzizi_extraction.document.models import BBox, Page, TableBlock
    from mzizi_extraction.document.table_stitch import stitch_tables

    box: BBox = (0.0, 0.0, 1.0, 1.0)

    def page(number: int, rows: tuple[tuple[str, ...], ...], header_rows: int) -> Page:
        block = TableBlock(index=1, rows=rows, header_rows=header_rows, page=number, bbox=box)
        return Page(number=number, width=1.0, height=1.0, blocks=(block,))

    head = ("No", "Party")
    pages = (
        page(1, (head, ("1", "A"), ("2", "B")), 1),
        page(2, (head, ("3", "C")), 1),
        page(3, (("4", "D"),), 0),
        page(5, (head, ("9", "Z")), 1),
    )
    merged = stitch_tables(pages)
    assert len(merged) == 1 and merged[0].pages == (1, 2, 3)
    assert [row[0] for row in merged[0].rows] == ["No", "1", "2", "3", "4"] and merged[0].rows[0] == head
