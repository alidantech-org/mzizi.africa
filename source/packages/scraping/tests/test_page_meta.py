from mzizi_scraping import extract_references, page_meta, parse_sitemap, sitemaps_from_robots

HTML = """<html><head><title> Reports </title><link rel="canonical" href="/reports"><link rel="next" href="/reports?page=2">
<link rel="sitemap" href="/sitemap.xml"></head><body><a href="/a.pdf">A</a><a rel="next" href="?page=2">next</a>
<img src="/i.png" alt="pic" srcset="/i-2x.png 2x"><video src="/v.mp4"></video><iframe src="https://x.org/e"></iframe><a href="mailto:a@b.org">m</a></body></html>"""


def test_page_meta_finds_canonical_pagination_and_sitemaps() -> None:
    meta = page_meta(HTML, "https://a.org/reports?x=1")
    assert meta.title == "Reports" and meta.canonical == "https://a.org/reports"
    assert meta.next_pages == ("https://a.org/reports?page=2",) and meta.sitemaps == ("https://a.org/sitemap.xml",)


def test_references_cover_links_images_media_embeds_and_mail() -> None:
    found = {(r.tag, r.url) for r in extract_references(HTML, "https://a.org/")}
    assert {
        ("a", "https://a.org/a.pdf"),
        ("img", "https://a.org/i.png"),
        ("img", "https://a.org/i-2x.png"),
        ("video", "https://a.org/v.mp4"),
        ("iframe", "https://x.org/e"),
        ("a", "mailto:a@b.org"),
    } <= found


def test_sitemap_and_index_parsing() -> None:
    urls = parse_sitemap(
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://a.org/1</loc></url><url><loc>https://a.org/2</loc></url></urlset>'
    )
    assert urls.urls == ("https://a.org/1", "https://a.org/2")
    index = parse_sitemap("<sitemapindex><sitemap><loc>https://a.org/s1.xml</loc></sitemap></sitemapindex>")
    assert index.child_sitemaps == ("https://a.org/s1.xml",) and index.urls == ()
    assert sitemaps_from_robots("User-agent: *\nSitemap: https://a.org/s.xml\n") == ("https://a.org/s.xml",)
