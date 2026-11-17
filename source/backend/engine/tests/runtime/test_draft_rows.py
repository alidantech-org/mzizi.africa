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
def test_a_party_register_becomes_linked_rows_with_branding_and_former_names(tmp_path: Path) -> None:
    source = tmp_path / "register.csv"
    source.write_text(
        "S/No,Name of the Party,Certificate serial No.,Abbreviation,Certificate Date of issue,Symbol,Colors,Slogan,Changes\n"
        '1.,The National Vision Party,002,NVP,29th March 2012,Light House,"Blue, Green",Haki na Umoja,\n'
        '2.,The Democratic Union,005,TDU,13th March 2012,House,"Blue, Red",,Formerly Mwangaza Tu Party (MTP) Formerly Mwangaza (MWAP)\n'
        '3.,The National Vision Party,002,NVP,29th March 2012,Light House,"Blue, Green",Haki na Umoja,\n',
        encoding="utf-8",
    )
    out = tmp_path / "draft"
    result = draft_rows(
        source, SEED, out, ("global", "ke"), "ke", frozenset({"official", "politics"}), DEFAULTS / "orpp-register.yml"
    )
    entities = rows(out / "official.entities.csv")
    assert [e["code"] for e in entities] == [
        "ke.the-national-vision-party",
        "ke.the-democratic-union",
    ]  # full names; a repeat is one entity
    assert (
        entities[0]["registered_on"] == "2012-03-29" and entities[0]["kind_code"] == "ofc.entity.kind.political-party"
    )
    names = {(n["entity_code"], n["name"], n["name_kind_code"]) for n in rows(out / "official.names.csv")}
    assert ("ke.the-national-vision-party", "NVP", "ofc.name.kind.abbreviation") in names
    assert ("ke.the-democratic-union", "Mwangaza Tu Party (MTP)", "ofc.name.kind.former") in names
    assert ("ke.the-democratic-union", "Mwangaza (MWAP)", "ofc.name.kind.former") in names
    branding = {(b["entity_code"], b["kind_code"], b["value"]) for b in rows(out / "official.branding.csv")}
    assert ("ke.the-national-vision-party", "ofc.branding.kind.slogan", "Haki na Umoja") in branding
    assert ("ke.the-national-vision-party", "ofc.branding.kind.colours", "Blue, Green") in branding
    assert ("ke.the-democratic-union", "ofc.branding.kind.symbol-description", "House") in branding
    assert rows(out / "politics.parties.csv")[1]["code"] == "ke.the-democratic-union"
    assert "ofc.branding.kind.slogan" in result.unapproved_values


@needs_seed
def test_a_cell_that_carries_its_abbreviation_makes_the_name_and_an_abbreviation_row(tmp_path: Path) -> None:
    source = tmp_path / "ppf.csv"
    source.write_text(
        'S/No.,Party Name,Kshs.\n1.,Orange Democratic Movement (ODM),"78,080,095.20"\n2.,Jubilee Party,"50,000.00"\n',
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
    names = {(n["name"], n["name_kind_code"]) for n in rows(out / "official.names.csv")}
    assert ("ODM", "ofc.name.kind.abbreviation") in names and (
        "Orange Democratic Movement",
        "ofc.name.kind.official",
    ) in names


@needs_seed
def test_a_bidder_list_gets_its_procurement_and_long_unique_codes_with_the_bid_number(tmp_path: Path) -> None:
    source = tmp_path / "bidders.csv"
    source.write_text(
        "S/No.,Bid No.,BIDDER NAME\n1.,107,Rawel Holdings Limited\n2.,106,Fornani Co Ltd\n", encoding="utf-8"
    )
    out = tmp_path / "draft"
    inputs = {"buyer": "Office of the Registrar of Political Parties", "tender_reference": "ORPP/OT/012/2024-2025"}
    draft_rows(
        source, SEED, out, ("global", "ke"), "ke", frozenset({"civic"}), DEFAULTS / "ke-tender-bidders.yml", inputs
    )
    procurement = rows(out / "civic.procurements.csv")[0]["code"]
    assert procurement == "ke.office-of-the-registrar-of-political-parties.orpp-ot-012-2024-2025"
    bids = rows(out / "civic.bids.csv")
    assert [b["bidder_entity_code"] for b in bids] == ["ke.rawel-holdings-limited", "ke.fornani-co-ltd"]
    assert bids[0]["code"] == f"{procurement}.rawel-holdings-limited~107" and bids[0]["procurement_code"] == procurement
    assert {e["code"] for e in rows(out / "official.entities.csv")} >= {
        "ke.rawel-holdings-limited",
        "ke.office-of-the-registrar-of-political-parties",
    }


@needs_seed
def test_bidders_can_be_drafted_before_any_tender_is_known(tmp_path: Path) -> None:
    source = tmp_path / "unsuccessful-bidders-2022.csv"
    source.write_text("S/No.,Bid No.,Bidder Name\n1.,233,Ludaccess Merchants\n", encoding="utf-8")
    out = tmp_path / "draft"
    result = draft_rows(
        source, SEED, out, ("global", "ke"), "ke", frozenset({"civic"}), DEFAULTS / "ke-tender-bidders.yml"
    )
    bid = rows(out / "civic.bids.csv")[0]
    assert bid["procurement_code"] == "ke.unsuccessful-bidders-2022~placeholder"
    assert bid["code"] == "ke.unsuccessful-bidders-2022~placeholder.ludaccess-merchants~233"
    assert any(n.status == "placeholder" for n in result.notes)  # flagged: the real tender replaces it later


@needs_seed
def test_a_heading_matched_only_by_a_column_name_never_makes_rows(tmp_path: Path) -> None:
    source = tmp_path / "register.csv"
    source.write_text("Name of the Party,Zzz Qqq\nLabour Party of Kenya,Nyota\n", encoding="utf-8")
    draft_rows(source, SEED, tmp_path / "draft", ("global", "ke"), "ke", frozenset())
    assert sorted(p.name for p in (tmp_path / "draft").glob("*.csv")) == ["official.entities.csv", "official.names.csv"]
