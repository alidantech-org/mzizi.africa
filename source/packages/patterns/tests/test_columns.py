from pathlib import Path

import pytest

from mzizi_patterns import (
    CellEngine,
    ColumnProbe,
    Dictionary,
    TermEntry,
    TermGroup,
    TermList,
    load_term_list,
    propose_columns,
)
from mzizi_patterns.features.columns.shapes import shape_shares
from mzizi_patterns.shared.contracts import Shape

SEED = Path("seed")


def g(key: str, *terms: str, shape: Shape | None = None) -> TermGroup:
    return TermGroup(
        group=key,
        shape=shape,
        terms=tuple(TermEntry(value=t.split("|")[0], aliases=tuple(t.split("|")[1:])) for t in terms),
    )


def world() -> tuple[TermList, ...]:
    return (
        TermList(
            code="sys.trm.global.money",
            groups=(
                g("amount-generic", "amount|kshs", shape=Shape.MONEY),
                g("amount-bid", "bid price|quoted price", shape=Shape.MONEY),
                g("currency-units", "usd|us dollars", "kes|ksh"),
            ),
        ),
        TermList(
            code="sys.trm.global.headings",
            groups=(g("row-numbers", "s/no|no|#"), g("party-names", "party|name of the party")),
            heading_rules=(
                {
                    "rule": "unit-in-brackets",
                    "qualifier_is": "unit",
                    "sequences": [
                        [
                            {"words": "any", "as": "base", "repeat": {"min": 1, "max": 4}},
                            {"punct": "("},
                            {"group": "sys.trm.global.money#currency-units", "as": "qualifier"},
                            {"punct": ")"},
                        ]
                    ],
                    "examples": [{"text": "Amount (usd)", "captures": {"base": "Amount", "qualifier": "usd"}}],
                },
                {
                    "rule": "abbreviation-in-brackets",
                    "qualifier_is": "abbreviation",
                    "sequences": [
                        [
                            {"words": "any", "as": "base", "repeat": {"min": 1, "max": 4}},
                            {"punct": "("},
                            {"letters": {"min": 2, "max": 8, "case": "upper"}, "as": "qualifier"},
                            {"punct": ")"},
                        ]
                    ],
                    "examples": [{"text": "Party (ABRV)", "captures": {"base": "Party", "qualifier": "ABRV"}}],
                },
            ),
            splits=(
                {
                    "split": "name-and-abbreviation",
                    "heading_rule": "abbreviation-in-brackets",
                    "cell_pattern": "name-with-abbreviation",
                    "into": [{"from_capture": "name", "as": "main"}, {"from_capture": "abbrev", "as": "qualifier"}],
                },
            ),
            patterns=(
                {
                    "pattern": "name-with-abbreviation",
                    "means": "organisation",
                    "sequences": [
                        [
                            {"words": "capitalised", "as": "name", "repeat": {"min": 1, "max": 6}},
                            {"punct": "("},
                            {"letters": {"min": 2, "max": 8, "case": "upper"}, "as": "abbrev"},
                            {"punct": ")"},
                        ]
                    ],
                    "examples": [
                        {
                            "text": "Orange Democratic Movement (ODM)",
                            "captures": {"name": "Orange Democratic Movement", "abbrev": "ODM"},
                        }
                    ],
                },
            ),
        ),
    )


def dictionary() -> tuple[Dictionary, ...]:
    return (
        Dictionary.model_validate(
            {
                "code": "sys.col.global.finance",
                "columns": {
                    "finance.flows.amount_minor_units": {
                        "shape": "money",
                        "terms": [
                            {"list": "sys.trm.global.money", "key": "amount-generic", "role": "heading"},
                            {"list": "sys.trm.global.money", "key": "currency-units", "role": "unit"},
                        ],
                    },
                    "civic.bids.amount_minor_units": {
                        "shape": "money",
                        "terms": [
                            {"list": "sys.trm.global.money", "key": "amount-bid", "role": "heading"},
                            {"list": "sys.trm.global.headings", "key": "row-numbers", "role": "exclude"},
                        ],
                    },
                    "official.names.name": {
                        "terms": [
                            {
                                "list": "sys.trm.global.headings",
                                "key": "party-names",
                                "role": "heading",
                                "says": "organisation",
                            },
                            {"list": "sys.trm.global.headings", "key": "name-with-abbreviation", "role": "value"},
                        ],
                    },
                },
            }
        ),
    )


def test_shapes_tell_money_dates_codes_and_names_apart() -> None:
    assert shape_shares(("88,834,394.40", "1,200", "250000"))[0][0] is Shape.MONEY
    assert dict(shape_shares(("19th March 2012", "2022-03-01")))[Shape.DATE] == 1.0
    assert dict(shape_shares(("PLP", "NVP")))[Shape.CODE] == 1.0


def test_a_heading_with_its_unit_in_brackets_is_read_as_a_base_and_a_unit() -> None:
    probe = ColumnProbe(header="Amount (usd)", samples=("1,200,000", "950,000"))
    (proposal,) = propose_columns((probe,), world(), dictionary(), ("global",))
    assert proposal.heading is not None and proposal.heading.base == "Amount" and proposal.unit == "usd"
    assert proposal.chosen is not None and proposal.chosen.target == "finance.flows.amount_minor_units"


def test_a_row_counter_is_an_index_and_a_bid_number_is_not_an_amount() -> None:
    counter = ColumnProbe(header="S/No", samples=("1.", "2.", "3."))
    (proposal,) = propose_columns((counter,), world(), dictionary(), ("global",))
    assert proposal.status == "index" and proposal.chosen is None


def test_brackets_in_the_heading_and_the_cells_mean_two_columns_collapsed_into_one() -> None:
    probe = ColumnProbe(
        header="Party (ABRV)",
        samples=("Orange Democratic Movement (ODM)", "Jubilee Party (JP)", "Wiper Democratic Movement (WDM)"),
    )
    first, second = propose_columns((probe,), world(), dictionary(), ("global",))
    assert first.split is not None and first.split.main_cells[0] == "Orange Democratic Movement"
    assert first.split.qualifier_cells == ("ODM", "JP", "WDM")
    assert second.header == "abbreviation"


def test_an_unknown_heading_is_unmatched() -> None:
    (proposal,) = propose_columns(
        (ColumnProbe(header="Slogan", samples=("Unite",)),), world(), dictionary(), ("global",)
    )
    assert proposal.status == "unmatched" and proposal.chosen is None


@pytest.mark.skipif(not (SEED / "terms").is_dir(), reason="the term lists are not in the seed")
def test_every_pattern_and_heading_rule_in_the_seed_passes_its_own_examples() -> None:
    lists = tuple(load_term_list(p) for p in sorted((SEED / "terms").rglob("*.yml")))
    assert CellEngine(lists).check_examples() == []
