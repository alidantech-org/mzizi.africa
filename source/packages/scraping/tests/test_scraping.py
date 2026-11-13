import pytest

from mzizi_scraping import extract_links, parse_module, parse_selectors, selectors, transforms
from mzizi_scraping.core import ScrapeError
from mzizi_scraping.extract import discover_items, extract_item
from mzizi_scraping.transforms import TransformSpec

HTML = """<html><body><a href="/a.pdf">Annual   report</a><a href="https://other.org/x#frag">Other</a><a href="/a.pdf">dup</a>
<a href="mailto:x@y.z">mail</a><a href="javascript:void(0)">js</a><article class="pub"><span>one</span></article><article class="pub"><span>two</span></article></body></html>"""


def test_links_are_absolute_deduplicated_and_web_only():
    links = extract_links(HTML, "https://example.org/dir/page")
    assert [(link.url, link.text) for link in links] == [
        ("https://example.org/a.pdf", "Annual report"),
        ("https://other.org/x", "Other"),
    ]


def test_css_selectors_return_matches_in_confidence_order():
    chain = parse_selectors([{"css": "article.pub", "confidence": 0.9}, {"css": "p", "confidence": 0.1}])
    match = selectors.select(HTML, chain)
    assert match.selector_index == 0 and len(match.items) == 2


def test_jsonpath_reads_keys_indexes_and_wildcards():
    document = {"rows": [{"n": 1}, {"n": 2}]}
    assert selectors.jsonpath(document, "$.rows[*].n") == [1, 2]
    assert selectors.jsonpath(document, "$['rows'][0].n") == [1]


def test_known_transforms_are_registered_and_arbitrary_names_are_not():
    assert transforms.known("collapse_whitespace") and not transforms.known("shell_exec")


def test_transforms_apply_dates_decimals_and_fiscal_years():
    spec: TransformSpec = {"decimal": {"thousands": ","}}
    assert transforms.apply("fiscal_year", "FY2023-24") == "2023/24"
    assert transforms.apply({"fy_start": 7}, "2023/24") == "2023-07-01"
    assert transforms.apply(spec, "KES 1,234,567.50") == "1234567.50"
    assert transforms.apply({"date": "%d %B %Y"}, "14 June 2023") == "2023-06-14"


def test_fy_start_never_assumes_a_fiscal_calendar():
    with pytest.raises(ScrapeError, match="start_month"):
        transforms.apply("fy_start", "2023/24")
    with pytest.raises(ScrapeError, match="1-12"):
        transforms.apply({"fy_start": 13}, "2023/24")
    assert transforms.apply({"fy_start": 1}, "2023/24") == "2023-01-01"


def test_a_module_discovers_items_and_extracts_typed_fields():
    module = parse_module(
        {
            "discover": {"listing": {"items": {"css": "article.pub"}}},
            "extract": {"fields": {"title": {"from": "item_text", "parse": "trim"}, "kind": {"const": "pub"}}},
        }
    )
    match = discover_items(HTML, module)
    results = [extract_item(item, module.extract.fields) for item in match.items]
    assert [r.record for r in results] == [{"title": "one", "kind": "pub"}, {"title": "two", "kind": "pub"}]
    assert all(not r.errors for r in results)
