"""Every curated data list ships as valid, loadable data (a YAML `yes` or `no` column name once broke all of them)."""

from mzizi_engine.persistence.postgres.browse import Browser


def test_every_data_list_loads_with_string_columns() -> None:
    lists = Browser.lists()
    assert {item.domain for item in lists} >= {"civic", "geography", "statistics", "activities"}
    assert all(item.columns and all(isinstance(c, str) for c in item.columns) for item in lists)
