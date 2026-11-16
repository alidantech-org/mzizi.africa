"""The instrument parser: small pure helpers, and the Constitution of Kenya when its PDFs are on this machine."""

from pathlib import Path

import pytest

from mzizi_extraction.legislation import SWAHILI, parse_instrument
from mzizi_extraction.legislation.parse import Layout, Word, _chapter_number, _title, _whole_words

DATASETS = Path(__file__).resolve().parents[4] / ".dev" / "datasets" / "kenya-constitution"
ENGLISH = DATASETS / "en-constitutionnet-final-constitution-2010.pdf"
SWAHILI_PDF = DATASETS / "sw-uraia-katiba-ya-kenya.pdf"


def test_titles_keep_small_words_lower_case() -> None:
    assert (
        _title("SOVEREIGNTY OF THE PEOPLE AND SUPREMACY OF THIS CONSTITUTION")
        == "Sovereignty of the People and Supremacy of This Constitution"
    )


def test_chapter_numbers_read_in_both_languages() -> None:
    assert _chapter_number("NINE", Layout()) == 9
    assert _chapter_number("KUMI NA MBILI", SWAHILI) == 12
    assert _chapter_number("NOWHERE", Layout()) is None


def test_small_capital_pieces_are_one_word_but_neighbouring_words_stay_apart() -> None:
    pieces = [
        Word("P", 125.0, 130.7, 208.8, 10.0),
        Word("art", 130.7, 144.3, 210.5, 7.0),
        Word("the", 147.0, 160.0, 210.5, 10.0),
        Word("law", 161.0, 175.0, 210.5, 10.0),
    ]
    assert [w.text for w in _whole_words(pieces)] == ["Part", "the", "law"]


@pytest.mark.skipif(not ENGLISH.is_file(), reason="the downloaded Constitution is not on this machine")
def test_the_english_constitution_has_its_known_shape() -> None:
    report = parse_instrument(str(ENGLISH), 11, 194, title="The Constitution of Kenya, 2010", toc_pages=(1, 11))
    kinds = [n.kind for n in report.root.walk()]
    assert report.articles == 264 and kinds.count("chapter") == 18 and kinds.count("schedule") == 6
    articles = {n.designation: n for n in report.root.walk() if n.kind == "article"}
    assert articles["Article 136"].title == "Election of the President"
    assert (
        articles["Article 250"].children[0].text
        == "Each commission shall consist of at least three, but not more than nine, members."
    )
    assert "Removal" not in articles["Article 251"].children[0].text  # a margin note is not body text


@pytest.mark.skipif(not SWAHILI_PDF.is_file(), reason="the downloaded translation is not on this machine")
def test_the_swahili_translation_has_the_same_articles() -> None:
    report = parse_instrument(str(SWAHILI_PDF), 19, 259, title="Katiba ya Kenya, 2010", layout=SWAHILI)
    assert report.articles == 264
