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


def test_pagination_builds_query_path_and_next_link_addresses():
    from mzizi_scraping.extract import Pagination, next_page_url

    query = Pagination.model_validate({"type": "query", "param": "page", "start": 1})
    assert next_page_url(query, "https://e.org/list?page=1&y=2", 1, "") == "https://e.org/list?y=2&page=2"
    path = Pagination.model_validate({"type": "path", "param": "page"})
    assert next_page_url(path, "https://e.org/list/page/2", 2, "") == "https://e.org/list/page/3"
    link = Pagination.model_validate({"type": "next_link", "next": {"css": "a.next"}})
    html = '<a class="next" href="?p=2">Next</a>'
    assert next_page_url(link, "https://e.org/list", 1, html) == "https://e.org/list?p=2"
    assert next_page_url(link, "https://e.org/list", 1, "<p>end</p>") is None


def test_profile_and_family_comparison():
    from mzizi_scraping.profile import PageInput, build_profile, compare_profiles

    def site(host: str, name: str):
        nav = '<nav><a href="/about-us/">About Us</a><a href="/downloads/">Downloads</a></nav>'
        rows = "".join(f"<tr><td>doc {i}</td></tr>" for i in range(4))
        return build_profile(
            [
                PageInput(url=f"https://{host}/", title=f"Home – {name}", html=f"<body>{nav}<main><p>x</p></main></body>"),
                PageInput(url=f"https://{host}/downloads/", title=f"Downloads – {name}", html=f"<body>{nav}<table>{rows}</table></body>"),
                PageInput(url=f"https://{host}/about-us/", title=f"About – {name}", html=f"<body>{nav}<main><p>y</p></main></body>"),
            ]
        )

    left, right = site("a.ngcdf.go.ke", "NGCDF A"), site("b.ngcdf.go.ke", "NGCDF B")
    assert left.title_suffix == "NGCDF A" and "Downloads" in left.nav_labels
    assert any(block.selector == "tr" for t in left.templates for block in t.repeated_blocks)
    report = compare_profiles(left, right)
    assert report.verdict == "same family" and report.host_variable == "a|b"
    other = build_profile([PageInput(url="https://z.org/shop/", title="Shop", html="<body><div><ul><li>a</li></ul></div></body>")])
    assert compare_profiles(left, other).verdict == "different"


def test_ranking_scores_rules_from_link_context_with_evidence():
    from mzizi_scraping.rank import FileFeatures, RankingRules, rank_file

    rules = RankingRules.model_validate(
        {
            "rules": [
                {
                    "target": "finance.transfers",
                    "label": "allocation schedule",
                    "conditions": [
                        {"signal": "section", "contains": ["downloads", "allocations"]},
                        {"signal": "anchor_text", "contains": ["financial year"], "weight": 2},
                        {"signal": "extension", "contains": ["pdf"]},
                    ],
                },
                {"target": "person.individuals", "label": "members", "conditions": [{"signal": "section", "contains": ["members"]}]},
            ]
        }
    )
    features = FileFeatures(
        url="https://k.example/x/2015-16_k.pdf",
        filename="2015-16_k.pdf",
        extension="pdf",
        section="downloads",
        anchor_text="Kasarani Financial Year: 2015-2016",
        source_page_title="Downloads",
        source_page_path="/downloads/",
    )
    ranked = rank_file(features, rules)
    assert [e.target for e in ranked.expectations] == ["finance.transfers"]
    assert ranked.expectations[0].score == 0.8 and len(ranked.expectations[0].evidence) == 3


def test_fingerprint_ignores_noise_and_finds_real_changes():
    from mzizi_scraping.change import compare, fingerprint

    def page(nonce: str, rows: int, ticker: str) -> str:
        body = "".join(f"<tr><td>{i}</td></tr>" for i in range(rows))
        return (
            f"<html><head><script>var n='{nonce}'</script></head><body><nav><a href='/x'>x</a></nav>"
            f"<main><h2>Allocations</h2><table>{body}</table><h2>Ticker</h2><p>{ticker}</p>"
            f"<a href='/a.pdf'>a</a></main></body></html>"
        )

    first = fingerprint(page("aaa", 2, "t1"), "https://e.org/")
    noisy = fingerprint(page("bbb", 2, "t1"), "https://e.org/")
    assert compare(first, noisy).meaningful is False and compare(first, noisy).raw_only is True
    edited = fingerprint(page("ccc", 3, "t1"), "https://e.org/")
    change = compare(first, edited)
    assert change.meaningful and change.changed_blocks == ("Allocations",)
    ticking = fingerprint(page("ddd", 2, "t2"), "https://e.org/")
    assert compare(first, ticking).meaningful is True
    assert compare(first, ticking, frozenset({"Ticker"})).meaningful is False


def test_pagination_is_detected_for_links_buttons_numbers_and_load_more():
    from mzizi_scraping.pagination import ControlKind, detect_pagination

    base = "https://e.org/list?page=2"
    link = detect_pagination(
        '<nav class="pagination"><a href="/list?page=1">1</a><a class="active" href="/list?page=2">2</a>'
        '<a href="/list?page=3">3</a><a rel="next" href="/list?page=3">Next</a></nav>',
        base,
    )
    assert link.next and link.next.url == "https://e.org/list?page=3" and link.url_template == "https://e.org/list?page={n}"
    button = detect_pagination(
        '<nav aria-label="Pagination Navigation"><button aria-label="Previous page" disabled></button>'
        '<button aria-label="Page 1, Current page">1</button><button aria-label="Go to page 2">2</button>'
        '<button aria-label="Go to page 9">9</button><button aria-label="Next page">&rsaquo;</button></nav>',
        base,
    )
    assert button.next and button.next.kind is ControlKind.BUTTON and button.next.selector == 'button[aria-label="Next page"]'
    assert button.last == 9 and not button.next.url
    disabled = detect_pagination('<nav class="pagination"><button aria-label="Next page" disabled>></button></nav>', base)
    assert disabled.next and disabled.next.enabled is False
    more = detect_pagination("<ul><li>x</li></ul><button>Load more</button>", base)
    assert more.load_more and more.load_more.kind is ControlKind.LOAD_MORE
    rows = detect_pagination("".join("<div><button>View More</button></div>" for _ in range(5)), base)
    assert rows.load_more is None  # a row of identical buttons expands items; it is not pagination
    assert not detect_pagination("<p>nothing</p>", base).paginated


def test_needs_browser_tells_static_pages_from_app_shells():
    from mzizi_scraping.pagination import needs_browser

    article = "<html><body><main><p>" + "Real static content. " * 30 + "</p></main></body></html>"
    assert needs_browser(article, "https://e.org/") == ""
    assert needs_browser('<html><body><div id="root"></div><script src="/app.js"></script></body></html>', "https://e.org/")
    assert needs_browser("<html><body><noscript>You need to enable JavaScript to run this app.</noscript><div>x</div></body></html>", "https://e.org/")
    buttons = '<html><body><main><p>' + "text " * 80 + '</p><nav aria-label="Pagination"><button aria-label="Next page">></button></nav></main></body></html>'
    assert needs_browser(buttons, "https://e.org/") == "pagination by buttons"


def test_slider_buttons_are_not_pagination():
    from mzizi_scraping.pagination import detect_pagination

    slider = (
        '<div class="swiper"><button class="swiper-button-next" aria-label="Next slide">></button></div>'
        '<div class="hero-slider"><div class="pagination"><button aria-label="Next page">></button></div></div>'
    )
    assert detect_pagination(slider, "https://e.org/").next is None
    real = '<nav class="pagination"><button aria-label="Next page">></button></nav>'
    assert detect_pagination(real, "https://e.org/").next is not None
