from pathlib import Path

import pytest

from mzizi_engine.runtime.assembly.mapping_proposal import propose_mapping

SEED = Path("seed")


@pytest.mark.skipif(not (SEED / "columns").is_dir(), reason="the column dictionaries are not in the seed")
def test_the_party_register_headings_find_their_columns_and_gaps_are_left_alone(tmp_path: Path) -> None:
    source = tmp_path / "register.csv"
    source.write_text(
        "S/No,Name of the Party,Certificate serial No.,Abbreviation,Certificate Date of issue,Postal Address of Party,Slogan\n"
        '1.,The National Vision Party,002,NVP,29th March 2012,"P.O. Box 29200 Nairobi",Unity\n'
        '2.,Labour Party of Kenya,003,LPK,29th March 2012,"P.O. Box 46775-00100 Nairobi",Nyota ya Kenya\n',
        encoding="utf-8",
    )
    proposal = propose_mapping(source, SEED, ("global", "ke"), frozenset({"official", "politics"}))
    chosen = {c.header: c.chosen.target for c in proposal.columns if c.chosen is not None}
    assert chosen["Name of the Party"] == "official.names.name"
    assert chosen["Certificate serial No."] == "official.identifiers.value"
    assert chosen["Certificate Date of issue"] == "official.entities.registered_on"
    assert chosen["Postal Address of Party"] == "official.contacts.value"
    index = next(c for c in proposal.columns if c.header == "S/No")
    assert index.status == "index"
    assert chosen["Slogan"] == "official.branding.value"  # branding has a home now
    assert proposal.unmatched == ()
    tables = {t.table: t for t in proposal.tables}
    assert (
        "scheme_code" in tables["official.identifiers"].missing_required
    )  # a person must supply the identifier scheme
