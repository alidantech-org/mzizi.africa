from mzizi_patterns import DocumentText, Impact, PatternOrchestrator, Profile, TagRule, TermEntry, TermGroup, TermList
from mzizi_patterns.features.dedupe.dedupe import jaccard, shingles
from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.shared.contracts import Role


def engine() -> PatternOrchestrator:
    def group(name: str, role: Role, *terms: TermEntry) -> TermGroup:
        return TermGroup(group=name, role=role, terms=terms)

    world = TermList(
        code="t.world",
        groups=(
            group("law", Role.KIND, TermEntry(value="act"), TermEntry(value="bill")),
            group("register", Role.KIND, TermEntry(value="register"), TermEntry(value="fully registered")),
            group("form", Role.KIND, TermEntry(value="form"), TermEntry(value="checklist")),
            group("money", Role.SUBJECT, TermEntry(value="allocation"), TermEntry(value="fund")),
            group("stopwords", Role.STOPWORD, TermEntry(value="the"), TermEntry(value="of")),
        ),
    )
    local = TermList(
        code="t.local",
        extends=("t.world",),
        groups=(
            group("law", Role.KIND, TermEntry(value="act", aliases=("political parties act", "sheria"))),
            group("money", Role.SUBJECT, TermEntry(value="fund", aliases=("mfuko",))),
        ),
    )
    profile = Profile(
        code="p",
        term_lists=("t.local",),  # t.world comes in through extends
        stopword_group="stopwords",
        tags=(
            TagRule(tag="law", impact=Impact.HIGH, group="law"),
            TagRule(tag="register", impact=Impact.HIGH, group="register"),
            TagRule(tag="form", impact=Impact.LOW, group="form"),
            TagRule(tag="money", impact=Impact.HIGH, group="money"),
        ),
        threshold=0.1,
    )
    return PatternOrchestrator(profile, (world, local))


def test_groups_merge_across_lists_and_a_local_alias_counts_as_the_global_term() -> None:
    scores = engine().score_corpus(
        (DocumentText(name="a", filename="sheria ya kenya", body="x"), DocumentText(name="b"))
    )
    assert scores[0].kind == "law" and scores[0].tags[0].matches[0].term == "act"


def test_tokeniser_splits_letters_digits_and_scripts() -> None:
    assert words("PPF3 x-3 Wiper (WDM-K) 2022") == ["ppf", "3", "x", "3", "wiper", "wdm", "k", "2022"]


def test_kind_sets_impact_and_a_form_stays_low_even_when_it_talks_about_money() -> None:
    docs = (
        DocumentText(name="a", filename="fully registered parties", title="Register of parties", body="register " * 5),
        DocumentText(name="b", filename="allocation form", title="Form", body="form form allocation fund " * 3),
        DocumentText(name="c", filename="politicalpartiesact11of2011", body="text"),
        DocumentText(name="d", filename="other", body="nothing relevant at all"),
    )
    scores = {s.name: s for s in engine().score_corpus(docs)}
    assert scores["a"].kind == "register" and scores["a"].impact is Impact.HIGH
    assert scores["b"].kind == "form" and scores["b"].impact is Impact.LOW and "money" in scores["b"].subjects
    assert scores["c"].kind == "law"  # a term found inside a joined file name


def test_near_duplicates_ignore_documents_without_text() -> None:
    text = " ".join(f"word{i}" for i in range(60))
    docs = (
        DocumentText(name="x", body=text),
        DocumentText(name="y", body=text + " extra"),
        DocumentText(name="empty1"),
        DocumentText(name="empty2"),
    )
    pairs = engine().near_duplicates(docs, threshold=0.8)
    assert [(p.left, p.right) for p in pairs] == [("x", "y")]
    assert jaccard(shingles(text), shingles(text)) == 1.0


def test_the_drafted_layers_merge_and_a_swahili_alias_reaches_the_global_term() -> None:
    from pathlib import Path

    import pytest

    from mzizi_patterns import load_profile, load_term_list

    terms, profile = Path("seed/terms"), Path(".docs/_plan/orpp-sources/engine/docs/profile.yaml")
    if not (terms.is_dir() and profile.is_file()):
        pytest.skip("the ORPP terms or profile have moved")
    lists = tuple(load_term_list(p) for p in sorted(terms.rglob("*.yml")))
    engine_ = PatternOrchestrator(load_profile(profile), lists)
    filler = tuple(DocumentText(name=f"f{i}", filename="unrelated words", body="nothing here") for i in range(8))
    scores = engine_.score_corpus(
        (DocumentText(name="a", filename="notisi ya usajili wa muda", body="notisi"), *filler)
    )
    assert scores[0].kind == "notice"  # the Swahili alias of the global term, loaded through two extends
