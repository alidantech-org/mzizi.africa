import csv
from pathlib import Path

import pytest

from mzizi_engine.runtime.assembly.draft_rows import draft_rows

SEED = Path("seed")


@pytest.mark.skipif(not (SEED / "columns").is_dir(), reason="the seed dictionaries are not present")
def test_a_party_register_becomes_linked_draft_rows_with_proposed_codes_and_listed_gaps(tmp_path: Path) -> None:
    source = tmp_path / "register.csv"
    source.write_text(
        "S/No,Name of the Party,Certificate serial No.,Abbreviation,Certificate Date of issue\n"
        "1.,The National Vision Party,002,NVP,29th March 2012\n"
        "2.,Labour Party of Kenya,003,LPK,29th March 2012\n"
        "3.,The National Vision Party,002,NVP,29th March 2012\n",
        encoding="utf-8",
    )
    out = tmp_path / "draft"
    result = draft_rows(source, SEED, out, ("global", "ke"), "ke", frozenset({"official", "politics"}))
    entities = list(csv.DictReader((out / "official.entities.csv").open()))
    assert [e["code"] for e in entities][:2] == ["ke.national-vision-party", "ke.labour-party-of-kenya"]
    assert entities[2]["code"] == "ke.national-vision-party-2"  # a repeat in the same run never reuses a code silently
    assert entities[0]["registered_on"] == "2012-03-29"  # read from "29th March 2012"
    names = list(csv.DictReader((out / "official.names.csv").open()))
    assert {n["name"] for n in names[:2]} == {"The National Vision Party", "NVP"}
    assert all(n["entity_code"] == "ke.national-vision-party" for n in names[:2])
    assert result.needs_approval["official.entities.kind_code"] == 3  # only a person can say what kind of entity it is
