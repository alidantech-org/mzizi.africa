from pathlib import Path

from mzizi_engine.layout import DevLayout, address_of
from mzizi_engine.names import Labels, file_name, page_slug, slug, table_name


def test_addresses_reverse_the_suffix_and_keep_subdomains_beside_the_apex():
    assert address_of("https://kasarani.ngcdf.go.ke/x").parts == ("ke", "go", "ngcdf", "kasarani")
    assert address_of("ngcdf.go.ke").parts == ("ke", "go", "ngcdf", "_root")
    assert address_of("https://www.alidantech.org").parts == ("org", "alidantech", "www")
    assert address_of("dryv.alidantech.org").parts == ("org", "alidantech", "dryv")
    assert address_of("127.0.0.1:8000").group == ("_other",)


def test_site_folder_paths(tmp_path: Path):
    site = DevLayout(tmp_path).website("https://kasarani.ngcdf.go.ke/")
    assert site.root == tmp_path / "websites/ke/go/ngcdf/kasarani"
    assert site.page("/") == site.pages / "index"
    assert site.page("/news/2024/Open Day/") == site.pages / "news/2024/Open-Day"
    assert site.page("/tenders#page-2") == site.pages / "tenders" and site.page("/a/b.html?x=1") == site.pages / "a/b"
    assert site.files("pdf") == site.root / "scraped/files/pdf" and site.files("exe").name == "other"
    assert not site.root.exists()  # nothing is created until something is written


def test_names_are_readable_and_deterministic():
    assert slug("Kasarani Financial Year: 2015-2016") == "kasarani-financial-year-2015-2016"
    assert page_slug("/") == "index" and page_slug("/news/open-day/") == "open-day"
    assert page_slug("/reports", "page=2") == "reports.page-2" and page_slug("/tenders", "", "page-3") == "tenders.page-3"
    digest = "37d447f63bd6de6a"
    assert file_name("https://k/x/2015-16_kasarani.pdf", digest, Labels()) == "2015-16-kasarani--37d447f6.pdf"
    generic = file_name("https://k/download.php?id=3", digest, Labels(anchor_text="Financial Year 2015-2016"), "pdf")
    assert generic == "financial-year-2015-2016--37d447f6.pdf"
    server = file_name("https://k/dl", digest, Labels(content_disposition='report 2024.pdf', anchor_text="x"))
    assert server == "report-2024--37d447f6.pdf"
    assert file_name("https://k/img/123.jpg", digest, Labels(alt_text="Constituency office")) == "constituency-office--37d447f6.jpg"
    assert table_name("allocations", "", "Amount by year", "", 1) == "allocations--amount-by-year.csv"
    assert table_name("allocations", "", "", "", 2) == "allocations--table-2.csv"


def test_a_descriptive_link_text_beats_a_terse_file_name():
    digest = "37d447f63bd6de6a"
    named = file_name("https://k/up/2015-16_kasarani.pdf", digest, Labels(anchor_text="Kasarani Financial Year: 2015-2016"))
    assert named == "kasarani-financial-year-2015-2016--37d447f6.pdf"


def test_hunted_files_accumulate_across_runs(tmp_path: Path):
    from mzizi_engine.web.hunt import write_hunted

    row = lambda u: {"original_url": u, "normalized_url": u, "kind": "candidate"}  # noqa: E731
    path = tmp_path / "hunted.csv"
    assert write_hunted(path, [row("https://a/1"), row("https://a/2")]) == 2
    assert write_hunted(path, [row("https://a/2"), row("https://a/3")]) == 3  # earlier rows stay, no duplicates


def test_data_responses_without_an_extension_are_named_by_their_media_type():
    from mzizi_engine.web.handlers.queue import bucket, extension_for

    assert extension_for("https://t/api/active-tenders?page=1", "text", "application/json; charset=utf-8") == "json"
    assert extension_for("https://t/files/a.pdf", "pdf", "application/pdf") == "pdf"
    assert bucket("json", "file") == "data"


def test_names_fit_the_file_system_even_with_styled_unicode_letters():
    from mzizi_engine.names import Labels, file_name, segment, slug

    fancy = "𝐒𝐄𝐍𝐀𝐓𝐄-𝐔𝐑𝐆𝐄𝐃-𝐓𝐎-𝐒𝐓𝐑𝐈𝐊𝐄-𝐎𝐔𝐓-𝐓𝐎𝐔𝐑𝐈𝐒𝐌-𝐑𝐄𝐆𝐔𝐋𝐀𝐓𝐈𝐎𝐍𝐒-𝐁𝐮𝐧𝐠𝐞-𝐓𝐨𝐰𝐞𝐫-𝐓𝐡𝐮𝐫𝐬𝐝𝐚𝐲"
    assert slug(fancy).startswith("senate-urged")  # styled letters become plain letters
    for name in (slug(fancy * 3), segment(fancy * 5), file_name("https://x/a.jpg", "039e92ee0000", Labels(alt_text=fancy * 4))):
        assert len(name.encode("utf-8")) <= 200
