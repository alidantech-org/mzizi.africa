"""The crawler against a loopback site: inventories, scope, limits, resume, exports."""

from __future__ import annotations

import csv
import json
from pathlib import Path

from web_site import Handler, page

from mzizi_engine.web.handlers.crawl import crawl_site, export_results
from mzizi_engine.web.requests import CrawlRequest, ExportFormat, ExportRequest


def rows(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def run(site: str, tmp_path: Path, **options: object) -> tuple[Path, object]:
    request = CrawlRequest(url=site + "/", out_dir=str(tmp_path), delay=0, **options)  # type: ignore[arg-type]
    return tmp_path, crawl_site(request)


def test_crawl_builds_separate_inventories(site: str, tmp_path: Path) -> None:
    out, summary = run(site, tmp_path, max_pages=20)
    assert summary.pages >= 5 and summary.images == 1 and summary.documents == 1 and summary.external_hosts == 1
    assert [r["host"] for r in rows(out / "external_hosts.csv")] == ["other.example"]
    assert {r["extension"] for r in rows(out / "documents.csv")} == {"pdf"} and rows(out / "images.csv")[0][
        "extension"
    ] == "png"
    assert all(r["scope"] == "external" for r in rows(out / "external_urls.csv")) and any(
        r["kind"] == "mail" for r in rows(out / "external_urls.csv")
    )
    assert {"/", "/about", "/news"} <= {r["path"] for r in rows(out / "paths.csv")}
    metadata = rows(out / "pages.csv")[0]
    assert (
        metadata["original_url"]
        and metadata["normalized_url"]
        and metadata["final_url"]
        and metadata["title"] == "Home"
        and metadata["discovered_at"]
    )
    assert (out / "site_tree.json").exists() and (out / "summary.json").exists() and (out / "provenance.jsonl").exists()


def test_external_hosts_are_never_requested(site: str, tmp_path: Path) -> None:
    out, _ = run(site, tmp_path)
    assert all("other.example" not in r["final_url"] for r in rows(out / "pages.csv"))
    assert all(
        "other.example" not in json.loads(line)["url"] for line in (out / "provenance.jsonl").read_text().splitlines()
    )


def test_depth_and_page_limits(site: str, tmp_path: Path) -> None:
    shallow, summary = run(site, tmp_path / "a", max_depth=0, sitemap=False)
    assert summary.pages == 1 and [r["depth"] for r in rows(shallow / "pages.csv")] == ["0"]
    _, limited = run(site, tmp_path / "b", max_pages=2)
    assert limited.pages == 2 and "budget" in limited.stopped
    deep, _ = run(site, tmp_path / "c", max_depth=3, max_pages=30, sitemap=False)
    assert {"/deep", "/deeper"} <= {r["path"] for r in rows(deep / "pages.csv")}


def test_path_scope_robots_and_policy_audit(site: str, tmp_path: Path) -> None:
    Handler.site["/private"] = page("Private", "secret")
    Handler.site["/"] = Handler.site["/"].replace(b"<main>", b'<main><a href="/private">hidden</a>')
    out, _ = run(site, tmp_path, excluded_paths=["/news"], sitemap=False)
    paths = {r["path"] for r in rows(out / "pages.csv")}
    assert "/private" not in paths and "/news" not in paths
    audit = json.loads((out / "policy_audit.json").read_text())
    assert any(not d["allowed"] and d["reason"] == "disallowed by robots.txt" for d in audit)
    assert any(r["detail"] == "disallowed by robots.txt" for r in rows(out / "errors.csv"))


def test_sitemap_pagination_and_canonical_are_followed(site: str, tmp_path: Path) -> None:
    out, _ = run(site, tmp_path, max_depth=1, max_pages=30)
    pages = rows(out / "pages.csv")
    assert any(p["source_page"] == "sitemap" and p["path"] == "/news" for p in pages)
    assert any(p["anchor_text"] == "next page" for p in pages)
    about = next(p for p in pages if p["path"] == "/about")
    assert about["canonical_url"].endswith("/about")


def test_markdown_drops_repeated_header_footer_and_keeps_links(site: str, tmp_path: Path) -> None:
    out, _ = run(site, tmp_path)
    home = (out / "markdown" / "0001.md").read_text()
    assert (
        "[About](" in home
        and "**our site**" in home
        and "Copyright 2026" not in home
        and "News and announcements" not in home
    )


def test_interrupted_crawl_resumes_without_repeating_pages(site: str, tmp_path: Path) -> None:
    _, first = run(site, tmp_path, max_pages=2, sitemap=False)
    assert first.pages == 2 and not first.complete
    resumed = crawl_site(
        CrawlRequest(url=site + "/", out_dir=str(tmp_path), delay=0, max_pages=30, sitemap=False, resume=True)
    )
    urls = [r["final_url"] for r in rows(tmp_path / "pages.csv")]
    assert resumed.pages > 2 and len(urls) == len(set(urls))


def test_resume_from_folder_and_export_formats(site: str, tmp_path: Path) -> None:
    run(site, tmp_path / "crawl", max_pages=2, sitemap=False)
    again = crawl_site(
        CrawlRequest(
            url=site + "/", out_dir="", resume_from=str(tmp_path / "crawl"), delay=0, max_pages=10, sitemap=False
        )
    )
    assert again.pages > 2
    result = export_results(
        ExportRequest(
            out_dir=str(tmp_path / "export"),
            source=str(tmp_path / "crawl"),
            formats=(ExportFormat.JSONL, ExportFormat.CSV),
        )
    )
    assert (
        "pages.jsonl" in result.files
        and json.loads((tmp_path / "export" / "pages.jsonl").read_text().splitlines()[0])["n"] == 1
    )


def test_exports_are_deterministic_and_csv_escapes(tmp_path: Path) -> None:
    from mzizi_engine.web.export import write_table
    from mzizi_engine.web.records import PathRecord

    records = [
        PathRecord(path='/b,"quoted"', pages=1, first_seen_on="x"),
        PathRecord(path="/a", pages=2, first_seen_on="y"),
    ]
    write_table(
        tmp_path,
        "paths",
        records,
        ["path", "pages", "first_seen_on"],
        (ExportFormat.CSV, ExportFormat.JSON, ExportFormat.JSONL),
    )
    again = tmp_path / "again"
    write_table(
        again,
        "paths",
        list(reversed(records)),
        ["path", "pages", "first_seen_on"],
        (ExportFormat.CSV, ExportFormat.JSON, ExportFormat.JSONL),
    )
    assert (tmp_path / "paths.csv").read_text() == (again / "paths.csv").read_text()
    assert (
        rows(tmp_path / "paths.csv")[1]["path"] == '/b,"quoted"'
        and (tmp_path / "paths.jsonl").read_text().count("\n") == 2
    )


def test_cli_commands_invoke_the_real_implementations(site: str, tmp_path: Path, monkeypatch) -> None:
    from typer.testing import CliRunner

    from mzizi_engine.devcli.app import app

    monkeypatch.setenv("MZIZI_DEV_ROOT", str(tmp_path / "dev"))
    runner = CliRunner()
    crawl = runner.invoke(
        app, ["--no-input", "--json", "web", "crawl", site + "/", "--delay", "0", "--max-pages", "3", "--no-sitemap"]
    )
    assert crawl.exit_code == 0, crawl.output
    assert json.loads(crawl.output)["pages"] == 3
    links = runner.invoke(app, ["--no-input", "--json", "web", "links", site + "/about"])
    assert links.exit_code == 0 and json.loads(links.output)["counts"]["internal_page"] >= 1
    robots = runner.invoke(app, ["--no-input", "--json", "fetch", "robots", site + "/private/x"])
    assert json.loads(robots.output)["decision"]["allowed"] is False
    status = runner.invoke(app, ["--no-input", "--json", "status", "--group", "web"])
    assert {row["capability"]: row["state"] for row in json.loads(status.output)}["web.links"] == "ready"
    assert runner.invoke(app, ["--no-input", "doctor"]).exit_code == 0


def test_diff_reports_added_removed_and_changed(tmp_path):
    import json

    from mzizi_engine.web.handlers.changes import diff_crawls
    from mzizi_engine.web.requests import DiffRequest

    def crawl(name, pages):
        folder = tmp_path / name
        (folder / "raw").mkdir(parents=True)
        rows = []
        for url, body in pages.items():
            (folder / "raw" / f"{len(rows)}.html").write_text(body)
            rows.append({"normalized_url": url, "raw_file": f"raw/{len(rows)}.html"})
        import csv

        with (folder / "pages.csv").open("w", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=["normalized_url", "raw_file"])
            writer.writeheader()
            writer.writerows(rows)
        return str(folder)

    old = crawl("a", {"u/1": "x", "u/2": "y", "u/3": "z"})
    new = crawl("b", {"u/1": "x", "u/2": "Y", "u/4": "w"})
    result = diff_crawls(DiffRequest(out_dir=str(tmp_path), baseline=old, current=new))
    assert [c.url for c in result.added] == ["u/4"] and [c.url for c in result.removed] == ["u/3"]
    assert [c.url for c in result.changed] == ["u/2"] and result.unchanged == 1


def test_the_frontier_is_taken_from_the_least_visited_part_of_the_site():
    from collections import deque

    from mzizi_engine.web.crawl.engine import Crawl, group_of
    from mzizi_engine.web.records import FrontierItem

    assert group_of("https://s/") == "(home)" and group_of("https://s/about") == "(page)"
    assert group_of("https://s/a-long-article-title-about-things") == "(article)"
    assert group_of("https://s/downloads/2024/report") == "downloads"
    crawl = Crawl.__new__(Crawl)
    crawl.visited_groups = {"(article)": 3}
    crawl.frontier = deque(
        FrontierItem(url=u, depth=1, source_page="", anchor_text="")
        for u in ("https://s/an-article-about-nothing-much", "https://s/downloads/a", "https://s/about")
    )
    from collections import defaultdict

    crawl.visited_groups = defaultdict(int, {"(article)": 3})
    assert crawl.next_item().url == "https://s/downloads/a"  # unvisited sections come before more articles


def test_a_sitemap_listing_images_yields_files_not_pages():
    from mzizi_engine.web.crawl.sitemaps import partition

    pages, files = partition(["https://s/about", "https://s/wp-content/uploads/a.jpg", "https://s/report.pdf"])
    assert pages == ["https://s/about"] and [u for u, _ in files] == ["https://s/wp-content/uploads/a.jpg", "https://s/report.pdf"]


def test_a_redirect_alias_of_a_fetched_page_is_not_recorded_again():
    from mzizi_engine.web.crawl.engine import _final_key

    assert _final_key("https://s/a/") == _final_key("https://s/a") or _final_key("https://s/a#x") != _final_key("https://s/a")
    assert _final_key("https://s/tenders#page-2") != _final_key("https://s/tenders")
