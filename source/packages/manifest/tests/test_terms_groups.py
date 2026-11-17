from mzizi_manifest.features.registry.registry import Kind
from mzizi_manifest.features.registry.scan import _kind, _references


def test_a_grouped_term_list_is_a_term_list_and_its_extends_are_references() -> None:
    document = {
        "code": "sys.trm.src.doc.ke.documents",
        "extends": ["sys.trm.src.doc.global.documents"],
        "groups": [{"group": "law", "terms": [{"value": "act"}]}],
    }
    assert _kind(document) is Kind.TERMS
    references = _references(document, Kind.TERMS)
    assert [(r.field, r.code) for r in references] == [("extends[0]", "sys.trm.src.doc.global.documents")]
