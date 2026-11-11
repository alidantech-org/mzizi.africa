from mzizi_scraping import extract_links, selectors, transforms

HTML = """<html><body><a href="/a.pdf">Annual   report</a><a href="https://other.org/x#frag">Other</a><a href="/a.pdf">dup</a>
<a href="mailto:x@y.z">mail</a><a href="javascript:void(0)">js</a><article class="pub"><span>one</span></article><article class="pub"><span>two</span></article></body></html>"""


def test_links_are_absolute_deduplicated_and_web_only():
    links = extract_links(HTML, "https://example.org/dir/page")
    assert [(l.url, l.text) for l in links] == [
        ("https://example.org/a.pdf", "Annual report"),
        ("https://other.org/x", "Other"),
    ]


def test_css_selectors_return_matches_in_confidence_order():
    match = selectors.select(HTML, [{"css": "article.pub", "confidence": 0.9}, {"css": "p", "confidence": 0.1}])
    assert match.selector_index == 0 and len(match.items) == 2


def test_known_transforms_are_registered_and_arbitrary_names_are_not():
    assert transforms.known("collapse_whitespace") and not transforms.known("shell_exec")
