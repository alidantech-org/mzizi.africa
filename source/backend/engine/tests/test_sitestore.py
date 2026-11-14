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
    assert versions == [
        "allocations.v1-to-v2.change.md", "allocations.v1.html.gz", "allocations.v1.md",
    ]
    assert "blocks changed: Allocations" in (folder / "versions" / versions[0]).read_text()
    visited = site.visited_file.read_text().splitlines()
    assert visited[1].startswith("/allocations/ | 200 |") and " | 2 | " in visited[1]
