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
