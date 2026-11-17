from pathlib import Path

from mzizi_manifest.features.registry.registry import Kind
from mzizi_manifest.features.registry.scan import _kind, scan

TERMS = "code: sys.trm.global.money\ngroups:\n  - group: amount-bid\n    terms: [{value: bid price}]\n"


def dictionary(key: str, column: str) -> str:
    return (
        "code: sys.col.global.finance\ncolumns:\n"
        f"  {column}:\n    terms:\n      - {{list: sys.trm.global.money, key: {key}, role: heading}}\n"
    )


def tree(tmp_path: Path, columns: str) -> Path:
    (tmp_path / "terms/global").mkdir(parents=True)
    (tmp_path / "columns/global").mkdir(parents=True)
    (tmp_path / "terms/global/money.yml").write_text(TERMS, encoding="utf-8")
    (tmp_path / "columns/global/finance.yml").write_text(columns, encoding="utf-8")
    return tmp_path


def test_a_column_dictionary_is_its_own_kind() -> None:
    assert _kind({"code": "sys.col.global.finance", "columns": {}}) is Kind.COLUMNS


def test_a_dictionary_with_real_keys_and_columns_has_no_problems(tmp_path: Path) -> None:
    root = tree(tmp_path, dictionary("amount-bid", "civic.bids.amount_minor_units"))
    assert scan(root).problems == []


def test_an_unknown_key_and_an_unknown_column_are_reported(tmp_path: Path) -> None:
    root = tree(tmp_path, dictionary("no-such-group", "civic.bids.no_such_column"))
    problems = scan(root).problems
    assert any("no group, pattern or heading rule 'no-such-group'" in p for p in problems)
    assert any("not a seed column" in p for p in problems)


def test_a_dictionary_must_use_code_columns_never_ids(tmp_path: Path) -> None:
    root = tree(tmp_path, dictionary("amount-bid", "civic.bids.bidder_entity_id"))
    assert any("use the _code column, never an id" in p for p in scan(root).problems)
    ok = tree(tmp_path / "ok", dictionary("amount-bid", "civic.bids.bidder_entity_code"))
    assert scan(ok).problems == []


def test_a_code_recipe_and_a_lookup_must_use_real_seed_columns(tmp_path: Path) -> None:
    bad = (
        "code: sys.col.global.entities\ntables:\n  official.entities:\n    code:\n      parts:\n        - {scope: true}\n"
        "        - {name_slug: official.names.no_such_column}\n  official.names:\n    code:\n      parts: [{scope: true}]\n"
    )
    problems = scan(tree(tmp_path, bad)).problems
    assert any("not a seed column" in p for p in problems)
    assert any("has no `code` natural key" in p for p in problems)
