import csv
from pathlib import Path

import pytest

from mzizi_engine.runtime.assembly.draft_rows import draft_rows

SEED = Path("seed")
DEFAULTS = Path(".docs/_plan/controlled-values/defaults")
needs_seed = pytest.mark.skipif(not (SEED / "columns").is_dir(), reason="the seed dictionaries are not present")


def rows(path: Path) -> list[dict[str, str]]:
    return list(csv.DictReader(path.open()))


@needs_seed
def test_a_party_register_becomes_linked_draft_rows_and_a_repeat_reuses_its_entity(tmp_path: Path) -> None:
    source = tmp_path / "register.csv"
    source.write_text(
        "S/No,Name of the Party,Certificate serial No.,Abbreviation,Certificate Date of issue\n"
        "1.,The National Vision Party,002,NVP,29th March 2012\n"
        "2.,Labour Party of Kenya,003,LPK,29th March 2012\n"
        "3.,The National Vision Party,002,NVP,29th March 2012\n",
        encoding="utf-8",
    )
    out = tmp_path / "draft"
    result = draft_rows(
        source, SEED, out, ("global", "ke"), "ke", frozenset({"official", "politics"}), DEFAULTS / "orpp-register.yml"
    )
    entities = rows(out / "official.entities.csv")
    assert [e["code"] for e in entities] == [
        "ke.national-vision-party",
        "ke.labour-party-of-kenya",
    ]  # the repeat is the same entity
    assert (
        entities[0]["registered_on"] == "2012-03-29" and entities[0]["kind_code"] == "ofc.entity.kind.political-party"
    )
    names = rows(out / "official.names.csv")
    assert {(n["name"], n["name_kind_code"]) for n in names if n["entity_code"] == "ke.national-vision-party"} == {
        ("The National Vision Party", "ofc.name.kind.official"),
        ("NVP", "ofc.name.kind.abbreviation"),
    }
    assert rows(out / "politics.parties.csv")[1]["code"] == "ke.labour-party-of-kenya"
    assert "ofc.entity.kind.political-party" in result.unapproved_values  # proposed, not yet approved seed


@needs_seed
def test_a_fund_distribution_becomes_flows_with_amounts_in_minor_units_linked_to_the_party(tmp_path: Path) -> None:
    source = tmp_path / "ppf.csv"
    source.write_text(
        'S/No.,Party Name,Kshs.\n1.,Orange Democratic Movement,"78,080,095.20"\n2.,Jubilee Party,"50,000.00"\n',
        encoding="utf-8",
    )
    out = tmp_path / "draft"
    draft_rows(
        source, SEED, out, ("global", "ke"), "ke", frozenset({"finance"}), DEFAULTS / "orpp-ppf-distribution.yml"
    )
    flows = rows(out / "finance.flows.csv")
    assert [(f["counterparty_entity_code"], f["amount_minor_units"]) for f in flows] == [
        ("ke.orange-democratic-movement", "7808009520"),
        ("ke.jubilee-party", "5000000"),
    ]
    assert flows[0]["flow_kind_code"] == "fin.flow.kind.allocation" and flows[0]["currency_code"] == "fin.currency.kes"


@needs_seed
def test_a_bidder_list_becomes_bids_and_companies(tmp_path: Path) -> None:
    source = tmp_path / "bidders.csv"
    source.write_text(
        "S/No.,Bid No.,BIDDER NAME\n1.,107,Rawel Holdings Limited\n2.,106,Fornani Co Ltd\n", encoding="utf-8"
    )
    out = tmp_path / "draft"
    draft_rows(source, SEED, out, ("global", "ke"), "ke", frozenset({"civic"}), DEFAULTS / "ke-tender-bidders.yml")
    bids = rows(out / "civic.bids.csv")
    assert [b["bidder_entity_code"] for b in bids] == [
        "ke.rawel-holdings",
        "ke.fornani",
    ]  # legal forms (Ltd, Co) are not part of the code
    assert all(b["outcome_code"] == "civ.bid.outcome.successful" for b in bids)
    assert {e["code"] for e in rows(out / "official.entities.csv")} == {"ke.rawel-holdings", "ke.fornani"}


@needs_seed
def test_a_heading_matched_only_by_a_column_name_never_makes_rows(tmp_path: Path) -> None:
    source = tmp_path / "register.csv"
    source.write_text("Name of the Party,Slogan,Symbol\nLabour Party of Kenya,Nyota,Star\n", encoding="utf-8")
    draft_rows(source, SEED, tmp_path / "draft", ("global", "ke"), "ke", frozenset())
    assert sorted(p.name for p in (tmp_path / "draft").glob("*.csv")) == ["official.entities.csv", "official.names.csv"]
