from pathlib import Path

from mzizi_engine.layout import DevLayout
from mzizi_engine.sitestore import SiteStore, Visit


def page(nonce: str, rows: int) -> bytes:
    body = "".join(f"<tr><td>{i}</td></tr>" for i in range(rows))
    return (
        f"<html><head><script>var n='{nonce}'</script></head><body><main><h2>Allocations</h2>"
        f"<table>{body}</table><a href='/a.pdf'>a</a></main></body></html>"
    ).encode()


def visit(html: bytes) -> Visit:
    return Visit(
        url="https://k.ngcdf.go.ke/allocations/", final_url="https://k.ngcdf.go.ke/allocations/",
        path="/allocations/", status=200, title="Allocations", html=html, markdown_body="# Allocations\n", slug="allocations",
    )


def test_pages_are_versioned_only_when_something_meaningful_changes(tmp_path: Path):
    layout = DevLayout(tmp_path)
    site = layout.website("https://k.ngcdf.go.ke/")

    def run(html: bytes) -> str:
        store = SiteStore(site, None, tmp_path)
        outcome = store.record(visit(html))
        store.finish(complete=True)
        return outcome.result

    assert run(page("a", 2)) == "new"
    folder = site.root / "pages/allocations"
    assert (folder / "allocations.html").is_file() and (folder / "allocations.md").is_file()
    assert "html_sha256:" in (folder / "allocations.md").read_text()
    assert run(page("a", 2)) == "unchanged"
    assert run(page("b", 2)) == "noise"  # only a script nonce changed
    assert not (folder / "versions").exists()
    assert run(page("c", 3)) == "changed"
    versions = sorted(p.name for p in (folder / "versions").iterdir())
    assert "allocations.v1-to-v2.change.md" in versions and len(versions) == 3
    archived = [v for v in versions if not v.endswith("change.md")]
    assert sorted(v.rsplit(".", 1)[-1] for v in archived) == ["gz", "md"]  # content-addressed html.gz and md
    assert "blocks changed: Allocations" in (folder / "versions" / "allocations.v1-to-v2.change.md").read_text()
    assert not list(folder.glob(".*.tmp"))  # no temporary files left behind
    visited = site.visited_file.read_text().splitlines()
    assert visited[1].startswith("/allocations/ | 200 |") and " | 2 | " in visited[1]


def test_an_interrupted_save_keeps_every_page_already_recorded(tmp_path: Path):
    from mzizi_engine.sitestore import SiteWriter

    layout = DevLayout(tmp_path)
    site = layout.website("https://k.ngcdf.go.ke/")
    store = SiteStore(site, None, tmp_path)
    writer = SiteWriter(store)
    for index in range(5):
        writer.submit(
            Visit(
                url=f"https://k.ngcdf.go.ke/p{index}/", final_url=f"https://k.ngcdf.go.ke/p{index}/", path=f"/p{index}/",
                status=200, html=page(str(index), 2), slug=f"p{index}",
            )
        )
    assert [o.result for o in writer.close()] == ["new"] * 5
    # no finish(): the process "died" here. A new store sees all five pages with their state.
    again = SiteStore(site, None, tmp_path)
    assert sorted(again.states) == [f"/p{i}/" for i in range(5)]
    assert all((site.page(f"/p{i}/") / f"p{i}.html").is_file() for i in range(5))


def test_a_page_whose_file_was_deleted_is_saved_again(tmp_path: Path):
    site = DevLayout(tmp_path).website("https://k.ngcdf.go.ke/")
    for expected in ("new", "new"):
        store = SiteStore(site, None, tmp_path)
        assert store.record(visit(page("a", 2))).result == expected
        store.finish(complete=True)
        (site.page("/allocations/") / "allocations.html").unlink()  # removed by hand between runs


def test_a_recently_fetched_page_is_served_from_disk_and_not_touched(tmp_path: Path):
    from mzizi_engine.web.crawl.backends import CachedBackend

    site = DevLayout(tmp_path).website("https://k.ngcdf.go.ke/")
    store = SiteStore(site, None, tmp_path)
    store.record(visit(page("a", 2)))
    store.finish(complete=True)
    store = SiteStore(site, None, tmp_path)
    assert store.is_fresh("/allocations/", 12) is not None  # fetched moments ago
    assert store.is_fresh("/allocations/", 0) is None  # a zero window always refetches
    before = store.states["/allocations/"]
    assert store.record_cached("/allocations/").result == "fresh"
    assert store.states["/allocations/"] == before  # counters and times are unchanged

    class Inner:
        def get(self, url: str):
            raise AssertionError("a fresh page must not reach the real backend")

        def take_extra(self, url: str):
            return []

    class Cached:
        body = b"x"

    backend = CachedBackend(Inner(), lambda url: Cached() if url.endswith("/allocations/") else None)  # type: ignore[arg-type]
    assert backend.get("https://k.ngcdf.go.ke/allocations/").body == b"x"
    assert backend.take_extra("u") == []  # the wrapped backend's other methods stay reachable
