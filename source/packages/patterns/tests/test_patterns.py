from mzizi_patterns import DocumentText, Impact, PatternOrchestrator, Profile, TagRule, TermEntry, TermList
from mzizi_patterns.features.dedupe.dedupe import jaccard, shingles
from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.shared.contracts import Axis


def engine() -> PatternOrchestrator:
    lists = (
        TermList(
            code="t.law", terms=(TermEntry(value="act", aliases=("political parties act",)), TermEntry(value="bill"))
        ),
        TermList(code="t.register", terms=(TermEntry(value="register"), TermEntry(value="fully registered"))),
        TermList(code="t.form", terms=(TermEntry(value="form"), TermEntry(value="checklist"))),
        TermList(code="t.money", terms=(TermEntry(value="allocation"), TermEntry(value="fund"))),
        TermList(code="t.stop", terms=(TermEntry(value="the"), TermEntry(value="of"))),
    )
    profile = Profile(
        code="p",
        stopword_lists=("t.stop",),
        tags=(
            TagRule(tag="law", impact=Impact.HIGH, term_lists=("t.law",)),
            TagRule(tag="register", impact=Impact.HIGH, term_lists=("t.register",)),
            TagRule(tag="form", impact=Impact.LOW, term_lists=("t.form",)),
            TagRule(tag="money", impact=Impact.HIGH, axis=Axis.SUBJECT, term_lists=("t.money",)),
        ),
        threshold=0.1,
    )
    return PatternOrchestrator(profile, lists)


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
