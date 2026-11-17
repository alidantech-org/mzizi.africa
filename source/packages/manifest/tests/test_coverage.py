from pathlib import Path

from test_columns_check import dictionary, tree

from mzizi_manifest.features.registry.coverage import coverage


def test_the_report_counts_the_columns_a_dictionary_describes(tmp_path: Path) -> None:
    root = tree(tmp_path, dictionary("amount-bid", "civic.bids.amount_minor_units"))
    rows = {r.table: r for r in coverage(root)}
    assert rows["civic.bids"].covered == ("amount_minor_units",)
    assert "bidder_entity_code" in rows["civic.bids"].uncovered
    assert rows["official.names"].covered == ()
