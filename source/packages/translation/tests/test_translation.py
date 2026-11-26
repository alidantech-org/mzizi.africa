"""Tiers, masking, glossary and quality checks, with a fake store and fake engines (no model, no network)."""

from __future__ import annotations

from collections.abc import Sequence

from mzizi_translation import (
    Draft,
    Flag,
    LookupEngine,
    Pair,
    RunOptions,
    TextUnit,
    Tier,
    TranslationOrchestrator,
    build_glossary,
)
from mzizi_translation.features.protect.protect import mask, unmask


class Store:
    def __init__(self, units: list[TextUnit], pairs: list[Pair]) -> None:
        self.units, self._pairs, self.saved = units, pairs, []

    def pending(self, stream: str, source_language: str, target_language: str, limit: int) -> list[TextUnit]:
        return self.units[:limit]

    def pairs(self, stream: str, source_language: str, target_language: str, limit: int) -> list[Pair]:
        return self._pairs

    def save(self, stream: str, source_language: str, target_language: str, drafts: Sequence[Draft]) -> int:
        self.saved = list(drafts)
        return len(drafts)


class Upper:
    """A stand-in engine: marks every text, keeps tokens, and can drop one on demand."""

    name, version, tier = "upper", "1", Tier.MACHINE

    def __init__(self, drop: str = "") -> None:
        self.drop = drop

    def supports(self, source_language: str, target_language: str) -> bool:
        return (source_language, target_language) == ("aa", "bb")

    def translate(self, texts: Sequence[str], source_language: str, target_language: str) -> list[str | None]:
        return [t.upper().replace(self.drop, "") if self.drop else t.upper() for t in texts]


PAIRS = [
    Pair(source="Registrar", target="Msajili"),
    Pair(source="Registrar", target="Msajili"),
    Pair(source="Commission", target="Tume"),
    Pair(source="a long sentence that is not a term at all", target="x"),
]


def options(**kw: object) -> RunOptions:
    return RunOptions(source_language="aa", target_language="bb", limit=10, **kw)  # type: ignore[arg-type]


def test_glossary_takes_short_pairs_and_reports_conflicts() -> None:
    g = build_glossary([*PAIRS, Pair(source="Commission", target="Kamati")], max_words=3)
    assert g.table() == {"Registrar": "Msajili", "Commission": "Tume"}
    assert g.conflicts == ("Commission [-]: Tume, Kamati",)


def test_masking_protects_numbers_designations_and_terms() -> None:
    g = build_glossary(PAIRS, max_words=3)
    m = mask("The Registrar shall act under section 4B(1)(a) within 14 days.", g)
    assert "4B" not in m.text and "14" not in m.text and "Registrar" not in m.text
    restored, complete = unmask(m, m.text)
    assert complete and restored == "The Msajili shall act under section 4B(1)(a) within 14 days."


def test_each_text_takes_the_first_tier_that_can_translate_it() -> None:
    store = Store([TextUnit(key="1", text="Registrar"), TextUnit(key="2", text="Pay 14 days later.")], PAIRS)
    curated = LookupEngine("cldr", "1", Tier.CURATED, "aa", "bb", {"Pay 14 days later.": "Lipa baadaye."})
    report = TranslationOrchestrator(store, [curated, Upper()]).run(
        "s", options(), glossary=build_glossary(PAIRS, max_words=3), apply=True
    )
    assert {d.key: d.tier for d in report.drafts} == {"1": Tier.GLOSSARY, "2": Tier.CURATED}
    assert report.saved == 2 and store.saved[0].text == "Msajili"


def test_nothing_is_written_without_apply_and_untranslatable_text_is_reported() -> None:
    store = Store([TextUnit(key="1", text="Hello there friend.")], [])
    report = TranslationOrchestrator(store, []).run("s", options())
    assert report.drafts == () and report.untranslated == ("1",) and store.saved == []


def test_a_dropped_token_falls_back_to_unmasked_text_and_is_flagged() -> None:
    store = Store([TextUnit(key="1", text="Act under section 12 now.")], [])
    report = TranslationOrchestrator(store, [Upper(drop="QX1Q")]).run("s", options())
    (draft,) = report.drafts
    assert Flag.MASKS_LOST in draft.flags


def test_quality_flags_changed_numbers_and_missing_glossary_terms() -> None:
    class Wrong(Upper):
        def translate(self, texts: Sequence[str], source_language: str, target_language: str) -> list[str | None]:
            return ["jibu bila nambari" for _ in texts]

    store = Store([TextUnit(key="1", text="The Registrar has 14 days to reply.")], PAIRS)
    report = TranslationOrchestrator(store, [Wrong()]).run(
        "s", options(tiers=(Tier.MACHINE,)), glossary=build_glossary(PAIRS, max_words=3)
    )
    assert {Flag.NUMBERS_CHANGED, Flag.GLOSSARY_MISSED} <= set(report.drafts[0].flags)


def test_marker_engine_translates_markers_and_keeps_the_proper_noun() -> None:
    from mzizi_translation import Marker, MarkerEngine, MarkerRules

    rules = MarkerRules(
        source_language="aa", target_language="bb",
        phrases={"member of county assembly": "Mjumbe wa Bunge la Kaunti"},
        heads={"county government of": "Serikali ya Kaunti ya"},
        markers={"county": Marker(target="kaunti", position="suffix", place="before", linker="ya"), "east": Marker(target="mashariki", position="prefix", place="after")},
    )  # fmt: skip
    engine = MarkerEngine("rules", "1", rules)
    assert engine.translate(["Member of County Assembly, East Pokot", "Kiambu County", "County Government of Nyamira", "Burumba"], "aa", "bb") == [
        "Mjumbe wa Bunge la Kaunti, Pokot mashariki", "Kaunti ya Kiambu", "Serikali ya Kaunti ya Nyamira", None,
    ]  # fmt: skip


def test_glossary_entries_follow_context_and_ambiguous_terms_get_no_global_entry() -> None:
    pairs = [
        Pair(source="None", target="Hakuna", context="a.rule"),
        Pair(source="None", target="Hamna", context="b.count"),
        Pair(source="Open", target="Wazi", context="a.state"),
        Pair(source="Open", target="Wazi", context="b.state"),
    ]
    g = build_glossary(pairs, max_words=2)
    assert g.table("a.rule.adjustment") == {"None": "Hakuna", "Open": "Wazi"}
    assert g.table("b.count") == {"None": "Hamna", "Open": "Wazi"}
    assert "None" not in g.table("c.other") and g.table("c.other")["Open"] == "Wazi"
    assert any("differs by context" in c for c in g.conflicts)


def test_a_wider_context_entry_is_flagged_and_provenance_is_recorded() -> None:
    class Sink:
        def __init__(self) -> None:
            self.seen: list[Draft] = []

        def record(self, stream: str, source_language: str, target_language: str, drafts: Sequence[Draft]) -> None:
            self.seen = list(drafts)

    g = build_glossary([Pair(source="Open", target="Wazi", context="a")], max_words=2)
    store, sink = Store([TextUnit(key="1", text="Open", context="a.b.c")], []), Sink()
    report = TranslationOrchestrator(store, [], sink).run("s", options(), glossary=g, apply=True)
    assert report.drafts[0].flags == (Flag.CONTEXT_FALLBACK,)
    assert sink.seen == list(report.drafts)
