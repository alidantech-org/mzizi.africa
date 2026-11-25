import pytest

from mzizi_patterns import (
    CodePart,
    HashingEmbedder,
    KnownName,
    NameIndex,
    RecipeGap,
    build_code,
    disambiguate,
    slug,
)
from mzizi_patterns.shared.contracts import CodeRecipe

KINDS = {"county": "geo.feature.kind.county", "town": "geo.feature.kind.town", "ward": "geo.feature.kind.ward"}


def index() -> NameIndex:
    return NameIndex(
        [
            KnownName("geography.features", "ke.kiambu", "Kiambu", "en", "geo.feature.kind.county"),
            KnownName("geography.features", "ke.kiambu.kiambu-town", "Kiambu Town", "en", "geo.feature.kind.town"),
            KnownName("geography.features", "ke.mombasa", "Mombasa", "en", "geo.feature.kind.county"),
            KnownName("geography.features", "ke.nairobi", "Nairobi City", "en", "geo.feature.kind.county"),
        ],
        KINDS,
    )


def test_a_kind_word_picks_the_record_of_that_kind() -> None:
    county = index().resolve("Kiambu County")[0]
    town = index().resolve("Kiambu Town")[0]
    assert (county.code, county.kind_agrees) == ("ke.kiambu", True)
    assert (town.code, town.kind_agrees) == ("ke.kiambu.kiambu-town", True)


def test_a_bare_name_that_fits_two_records_is_ambiguous() -> None:
    two = NameIndex(
        [
            KnownName("geography.features", "ke.kiambu", "Kiambu", "en", "geo.feature.kind.county"),
            KnownName("geography.features", "ke.kiambu.kiambu", "Kiambu", "en", "geo.feature.kind.sub-county"),
        ],
        KINDS,
    )
    assert two.is_ambiguous(two.resolve("Kiambu"))
    assert not two.is_ambiguous(two.resolve("Kiambu County"))  # the kind word settles it


def test_a_misspelling_is_found_by_trigram_or_edit_distance() -> None:
    assert index().resolve("Mombassa")[0].code == "ke.mombasa"
    assert index().resolve("Nairobi City County")[0].code == "ke.nairobi"


def test_accents_and_case_do_not_matter() -> None:
    assert index().resolve("MOMBASÁ")[0].code == "ke.mombasa"


def test_a_code_follows_its_recipe_and_gaps_are_named() -> None:
    recipe = CodeRecipe(parts=(CodePart(scope=True), CodePart(name_slug="identity.names.text")))
    values = {"identity.names.text": "Kiambu County"}
    assert build_code(recipe, values, "ke", frozenset({"county"})) == "ke.kiambu"
    assert build_code(recipe, values, "ke") == "ke.kiambu-county"
    with pytest.raises(RecipeGap):
        build_code(recipe, {}, "ke")


def test_a_taken_code_gets_a_qualifier_then_a_number() -> None:
    assert disambiguate("ke.kiambu", {"ke.kiambu"}, ("town",)) == "ke.kiambu~town"
    assert disambiguate("ke.kiambu", {"ke.kiambu", "ke.kiambu~town"}) == "ke.kiambu~2"
    assert disambiguate("ke.a.rawel", {"ke.a.rawel"}, ("107",)) == "ke.a.rawel~107"
    assert slug("Café São Paulo") == "cafe-sao-paulo"


def test_the_hashing_embedder_puts_similar_spellings_close() -> None:
    e = HashingEmbedder()

    def cos(a: tuple[float, ...], b: tuple[float, ...]) -> float:
        return sum(x * y for x, y in zip(a, b, strict=True))

    assert cos(e.embed("Kiambu"), e.embed("Kiambaa")) > cos(e.embed("Kiambu"), e.embed("Turkana"))
    assert e.embed("Kiambu") == e.embed("kiambu")
