from decimal import Decimal

from mzizi_data.imports.budget_summary import check_totals, read_rows

# OCR of a real Kenyan Treasury summary page (psm 4, 300 dpi). The 2025/26 column holds a misread digit.
PAGE = """
1 {National Government 2,549,544.0 | 2,913,426.6 | 2,878,425.6 | 2,896,520.7 18,095.1
Executive 2,473,773.5 2,836,644.5 | _ 2,797,201.8 2,817,388.2 20,186.4
Parliament 47,990.7 48,690.7 50,782.0 48,690.7 (2,091.3)
Judiciary 27,179.8 28,091.4 30,441.8 30,441.8 -
2 {Consolidated Fund Services 1,337,324.8 | 1,366,598.3 | 1,450,123.4 | 1,501,327.1 51,203.8
3 _|County Government 415,000.0 415,000.0 | 420,000.0 420,000.0 -
TOtAL eisoscressrsecnaise Ksh. 4,301,868.7 | 4,695,024.9 | 4,748,549.0 | 4,817,847.9 69,298.9
"""


def test_the_estimates_column_adds_up():
    rows, problems = read_rows(PAGE, 3)
    assert rows["executive"] == Decimal("2817388.2") and rows["county"] == Decimal("420000.0") and rows["total"] == Decimal("4817847.9")
    assert check_totals(rows) == []


def test_a_misread_digit_is_caught_by_the_totals_and_nothing_is_guessed():
    rows, _ = read_rows(PAGE, 0)
    assert any("differs" in p for p in check_totals(rows))


def test_missing_rows_are_reported():
    rows, _ = read_rows("Executive 1.0 2.0 3.0 4.0\n", 3)
    assert "not readable" in check_totals(rows)[0]
