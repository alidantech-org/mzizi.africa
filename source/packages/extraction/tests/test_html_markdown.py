"""HTML to Markdown: inline whitespace and link destinations survive nesting, adjacency and punctuation."""

from __future__ import annotations

import pytest

from mzizi_extraction import extract_html_document, learn_boilerplate
from mzizi_extraction.document import render_markdown

BASE = "https://example.org/dir/"


def md(body: str, boilerplate=None) -> str:
    output, _title, _removed = extract_html_document(
        f"<html><body><main>{body}</main></body></html>", BASE, boilerplate
    )
    return render_markdown(output.pages).replace("<!-- page 1 -->\n\n", "", 1).strip()


@pytest.mark.parametrize(
    ("html", "expected"),
    [
        (
            '<p>Read the <strong>annual report</strong> from <a href="https://example.org/report.pdf">this page</a>.</p>',
            "Read the **annual report** from [this page](https://example.org/report.pdf).",
        ),
        ("<p>Some <b>bold</b> text</p>", "Some **bold** text"),
        ("<p><b>Bold</b> then normal</p>", "**Bold** then normal"),
        ('<p>Visit <a href="/a">the site</a> today</p>', "Visit [the site](https://example.org/a) today"),
        ('<p><a href="/a">Link</a> then plain</p>', "[Link](https://example.org/a) then plain"),
        (
            '<p><a href="/a">One</a> <a href="/b">Two</a> <a href="/c">Three</a></p>',
            "[One](https://example.org/a) [Two](https://example.org/b) [Three](https://example.org/c)",
        ),
        ('<p><a href="/a">Read <strong>this</strong> now</a></p>', "[Read **this** now](https://example.org/a)"),
        ("<p>A <em>very <strong>important</strong> note</em> here</p>", "A *very **important** note* here"),
        (
            '<p>See (<a href="/a">here</a>), or <a href="/b">there</a>.</p>',
            "See ([here](https://example.org/a)), or [there](https://example.org/b).",
        ),
        (
            '<p>Start <strong>b</strong> mid <em>i</em> and <a href="/x">l</a> end</p>',
            "Start **b** mid *i* and [l](https://example.org/x) end",
        ),
        ("<p>word<strong>glued</strong>word</p>", "word**glued**word"),
        ("<p>Line one<br>line two</p>", "Line one line two"),
    ],
)
def test_inline_spacing_and_links(html: str, expected: str) -> None:
    assert md(html) == expected


def test_relative_links_resolve_against_the_page_url() -> None:
    assert (
        md('<p><a href="../up">up</a> <a href="sub/page">sub</a></p>')
        == "[up](https://example.org/up) [sub](https://example.org/dir/sub/page)"
    )


def test_links_in_lists_and_tables_keep_their_destinations() -> None:
    assert (
        md('<ul><li>See <a href="/a">A</a></li><li><b>Bold</b> and <a href="/b">B</a></li></ul>')
        == "- See [A](https://example.org/a)\n- **Bold** and [B](https://example.org/b)"
    )
    table = md(
        '<table><tr><th>Name</th><th>Doc</th></tr><tr><td>Report</td><td><a href="/r.pdf">PDF</a></td></tr></table>'
    )
    assert "| Report | [PDF](https://example.org/r.pdf) |" in table


def test_structure_is_kept_not_flattened() -> None:
    text = md('<h1>Title</h1><p>Intro <a href="/a">link</a>.</p><h2>Part</h2><ol><li>first</li><li>second</li></ol>')
    assert text.splitlines()[0] == "# Title"
    assert "## Part" in text and "1. first" in text and "2. second" in text


def test_boilerplate_removal_still_works_with_links() -> None:
    pages = [
        f'<html><body><nav><a href="/n">News and announcements</a></nav><main><h1>P{i}</h1><p><a href="/x{i}">x</a></p></main><footer>Copyright 2026 all rights reserved here</footer></body></html>'
        for i in range(4)
    ]
    learned = learn_boilerplate(pages)
    output, _title, _removed = extract_html_document(
        pages[0].replace("<main>", "<div><main>").replace("</main>", "</main></div>"), BASE, learned
    )
    text = render_markdown(output.pages)
    assert "Copyright" not in text and "News and" not in text


def test_inline_backgrounds_export_references_without_fetching_images() -> None:
    html = """<main>
      <div aria-label="Portrait" style="background: center / cover no-repeat url('../img/a (1).jpg')"></div>
      <div style="background-image: url('/first.jpg'); background-image: none"></div>
      <div style="background-image: url('/kept.jpg') !important; background: none"></div>
      <div style="background-image: url(data:image/png;base64,AA)"></div>
      <div hidden style="background-image: url('/hidden.jpg')"></div>
      <p>Profile text</p>
    </main>"""
    base = "https://example.org/members/"
    doc, _, _ = extract_html_document(html, base, include_css_images=True)
    assert [block.asset for block in doc.pages[0].blocks if block.kind == "figure"] == [
        "https://example.org/img/a%20%281%29.jpg",
        "https://example.org/kept.jpg",
    ]
    default, _, _ = extract_html_document(html, base)
    assert all(block.kind != "figure" for block in default.pages[0].blocks)


def test_table_cells_preserve_icon_only_attachment_links() -> None:
    html = """<table><tr><th>Month</th><th>View</th></tr><tr><td>August</td><td>
    <a href="/awards.pdf"><i class="icon"></i></a>
    <a href="/notice.pdf" aria-label="Notice"><i class="icon"></i></a>
    <a href="/visible.pdf">Visible link</a>
    </td></tr></table>"""
    markdown = md(html)
    assert "[awards.pdf](https://example.org/awards.pdf)" in markdown
    assert "[Notice](https://example.org/notice.pdf)" in markdown
    assert markdown.count("https://example.org/visible.pdf") == 1


def test_multiple_body_elements_keep_every_content_region_and_exclude_head() -> None:
    html = """<html><head><title>Listing</title><style>unwanted stylesheet</style></head>
    <body></body><body><p>First region</p></body>
    <body><main><h2>Party list</h2><table><tr><td>
    <a href="/nominees.pdf">Nominees</a></td></tr></table></main></body></html>"""
    output, title, _ = extract_html_document(html, BASE)
    markdown = render_markdown(output.pages)
    assert title == "Listing" and output.status.value == "succeeded"
    assert "First region" in markdown and "Party list" in markdown
    assert "[Nominees](https://example.org/nominees.pdf)" in markdown
    assert "unwanted stylesheet" not in markdown


def test_image_only_download_link_keeps_both_target_and_image() -> None:
    content = md('<!-- internal comment --><a href="/offices.pdf"><img src="/offices.jpg"></a>')
    assert "[offices.pdf](https://example.org/offices.pdf)" in content
    assert "https://example.org/offices.jpg" in content
    assert "internal comment" not in content
