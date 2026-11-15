"""Replay, crawl evidence and attachment budgets against saved and controlled captures."""

from __future__ import annotations

from pathlib import Path

import pytest
from pydantic import TypeAdapter
from test_web_browser import needs_chrome
from web_site import PDF, Handler, page

from mzizi_engine.web.browser.media import MediaInventory
from mzizi_engine.web.browser.traversal import Action, End, ListingReport
from mzizi_engine.web.handlers.crawl import crawl_site
from mzizi_engine.web.handlers.replay import ReplayRequest, ReplaySuite, replay
from mzizi_engine.web.requests import CrawlRequest, Render

FIXTURE = Path(__file__).resolve().parents[4] / "seed" / "_fixtures" / "extraction" / "web-replay"
REPORTS = TypeAdapter(tuple[ListingReport, ...])


def test_replay_detects_a_missing_portrait_and_a_wrong_cell(tmp_path: Path) -> None:
    file = FIXTURE / "expectations.json"
    assert replay(ReplayRequest(expectations=str(file), out_dir=str(tmp_path))).passed
    suite = ReplaySuite.model_validate_json(file.read_bytes())
    (tmp_path / "listing.html").write_bytes((FIXTURE / "listing.html").read_bytes())
    (view,) = suite.views
    bad_cell = view.cells[0].model_copy(update={"text": "Invented heading"})
    bad_view = view.model_copy(update={"css_images": False, "cells": (bad_cell,)})
    bad_suite = tmp_path / "expectations.json"
    bad_suite.write_text(suite.model_copy(update={"views": (bad_view,)}).model_dump_json())
    result = replay(ReplayRequest(expectations=str(bad_suite), out_dir=str(tmp_path)))
    assert not result.passed
    assert {check.check for check in result.views[0].mismatches} == {
        "image occurrences",
        "Markdown URL https://example.org/portrait.webp",
        "table 1, row 0, column 2",
    }


def test_url_continuation_records_new_items_and_saved_destination(site: str, tmp_path: Path) -> None:
    Handler.site["/list"] = page("Listing", '<ul><li>One</li></ul><a rel="next" href="/later">Next</a>')
    Handler.site["/later"] = page("Listing", "<ul><li>One</li><li>Two</li></ul>")
    summary = crawl_site(CrawlRequest(url=site + "/list", out_dir=str(tmp_path), max_depth=0, delay=0, sitemap=False))
    assert summary.pages == 2
    first, second = REPORTS.validate_json((tmp_path / "listings.json").read_bytes())
    assert first.continuation_captured and first.stop_reason == End.LINK
    assert second.stop_reason == End.NO_NEXT
    assert second.views[0].action == Action.NEXT and second.views[0].new_list_items == 1


@pytest.mark.parametrize(
    ("path", "action", "end", "added"),
    [
        ("/buttons", Action.NEXT, End.DISABLED, [3, 3, 3]),
        ("/loadmore", Action.LOAD_MORE, End.NO_NEXT, [2, 2, 2]),
        ("/endless", Action.SCROLL, End.SCROLL_STABLE, [1, 1, 1]),
    ],
)
@needs_chrome
def test_browser_listing_records_actual_actions_and_new_items(
    site: str, tmp_path: Path, path: str, action: Action, end: End, added: list[int]
) -> None:
    Handler.site["/endless"] = page(
        "Endless listing",
        """<ul class="infinite-scroll"><li>First item</li></ul><div style="height:1850px"></div>
        <script>let n=1; window.addEventListener('scroll', () => {
            if (window.scrollY + innerHeight >= document.body.scrollHeight - 10 && n < 3) {
                const li = document.createElement('li');
                li.textContent = 'Item ' + (++n);
                li.style.height = '70px';
                document.querySelector('ul.infinite-scroll').append(li);
            }
        })</script>""",
    )
    if path == "/buttons":
        Handler.site[path] = Handler.site[path].replace(
            b'<ul id="list"></ul>',
            b'<ul id="list"></ul><div class="portrait" style="width:20px;height:20px"></div>'
            b"<style>.portrait{background-image:url(/portrait.webp)}</style>"
            b'<div style="height:1600px"></div><img id="lazy" data-src="/activated.png">'
            b'<script>window.addEventListener("scroll",()=>{let image=document.getElementById("lazy");'
            b'if(!image.hasAttribute("src"))image.src=image.dataset.src;});</script>',
        )
    crawl_site(
        CrawlRequest(
            url=site + path,
            out_dir=str(tmp_path),
            max_pages=1,
            max_depth=0,
            delay=0,
            sitemap=False,
            render=Render.BROWSER,
            rendered_media=path == "/buttons",
        )
    )
    (listing,) = REPORTS.validate_json((tmp_path / "listings.json").read_bytes())
    assert listing.stop_reason == end
    if action == Action.SCROLL:
        assert listing.views[0].action == Action.INITIAL
        assert all(view.action == Action.SCROLL for view in listing.views[1:])
        assert sum(view.new_list_items for view in listing.views) == sum(added)
    else:
        assert [view.action for view in listing.views] == [Action.INITIAL, action, action]
        assert [view.new_list_items for view in listing.views] == added
    if path == "/buttons":
        inventories = TypeAdapter(tuple[MediaInventory, ...]).validate_json(
            (tmp_path / "rendered-media.json").read_bytes()
        )
        assert len(inventories) == 3
        assert all(any(ref.url == site + "/portrait.webp" for ref in view.references) for view in inventories)
        assert all(site + "/portrait.webp" in capture.read_text() for capture in (tmp_path / "markdown").glob("*.md"))
        assert site + "/portrait.webp" in (tmp_path / "images.csv").read_text()
        assert inventories[0].lazy_scrolled == 1
        assert any(
            ref.url == site + "/activated.png" and ref.kind == "selected-image" for ref in inventories[0].references
        )


@needs_chrome
def test_manifest_expectations_choose_the_browser_for_a_weak_dom(site: str, tmp_path: Path) -> None:
    from mzizi_engine.web.handlers.scrape import scrape_url
    from mzizi_engine.web.requests import ScrapeUrlRequest

    Handler.site["/cards"] = page(
        "Members",
        "<div id='list'></div><script>"
        "document.getElementById('list').innerHTML='<article><h2>Member One</h2></article>'"
        "</script>",
    )
    module = """module: members
discover: {listing: {url: "/cards", items: {css: "article"}}}
extract: {fields: {name: {from: {css: "h2"}}}}
expect: {min_items: 1, required_fields: [name]}
"""
    result = scrape_url(
        ScrapeUrlRequest(
            url=site + "/cards",
            module_yaml=module,
            render=Render.AUTO,
            out_dir=str(tmp_path),
        )
    )
    assert result.ok and result.records[0].fields["name"] == "Member One"
    assert [(item.method, item.selected, item.valid_records) for item in result.attempts] == [
        (Render.HTTP, False, 0),
        (Render.BROWSER, True, 1),
    ]
    assert all((tmp_path / item.capture).is_file() for item in result.attempts)


def test_references_only_keeps_probability_of_file_without_requesting_body(site: str, tmp_path: Path) -> None:
    Handler.site["/list"] = page("Listing", '<a href="/opaque">Download publication</a>')
    Handler.site["/opaque"] = PDF
    crawl_site(
        CrawlRequest(
            url=site + "/list",
            out_dir=str(tmp_path),
            max_depth=1,
            delay=0,
            sitemap=False,
            references_only=True,
        )
    )
    assert site + "/opaque" in (tmp_path / "links.csv").read_text()
    assert site + "/opaque" not in (tmp_path / "provenance.jsonl").read_text()


def test_a_timed_out_continuation_is_deferred_and_retried_on_resume(site: str, tmp_path: Path) -> None:
    from mzizi_engine.web.crawl.service import client_for, run_crawl
    from mzizi_engine.web.identity import user_agent
    from mzizi_fetch.web.client import WebResponse

    class Pages:
        def __init__(self, *, fail: bool) -> None:
            self.fail = fail
            self.requested: list[str] = []

        def get(self, url: str) -> WebResponse:
            self.requested.append(url)
            if self.fail and url.endswith("/later"):
                return WebResponse(url=url, final_url=url, status=0, headers={}, body=b"", error="TimeoutError")
            body = (
                '<main><ul><li>First</li></ul><a rel="next" href="/later">Next</a></main>'
                if url.endswith("/list")
                else "<main><ul><li>Second</li></ul></main>"
            )
            return WebResponse(
                url=url, final_url=url, status=200, headers={"content-type": "text/html"}, body=body.encode()
            )

    request = CrawlRequest(url=site + "/list", out_dir=str(tmp_path), max_depth=0, delay=0, sitemap=False)
    client = client_for(request, user_agent())
    try:
        first = run_crawl(request, client, Pages(fail=True))
        assert not first.complete and first.deferred_pages == 1
    finally:
        client.close()
    request = request.model_copy(update={"resume": True})
    client = client_for(request, user_agent())
    later = Pages(fail=False)
    try:
        resumed = run_crawl(request, client, later)
        assert resumed.complete and resumed.deferred_pages == 0 and resumed.pages == 2
        assert later.requested == [site + "/later"]
    finally:
        client.close()


@needs_chrome
def test_uninspected_frames_and_shadow_roots_are_reported_as_media_gaps(site: str, tmp_path: Path) -> None:
    Handler.site["/containers"] = page(
        "Embedded content",
        '<iframe src="/about"></iframe><div id="host"></div>'
        '<script>document.getElementById("host").attachShadow({mode:"open"}).innerHTML='
        "'<img src=/nested.png>';</script>",
    )
    summary = crawl_site(
        CrawlRequest(
            url=site + "/containers",
            out_dir=str(tmp_path),
            render=Render.BROWSER,
            max_depth=0,
            rendered_media=True,
            delay=0,
            sitemap=False,
        )
    )
    (inventory,) = TypeAdapter(tuple[MediaInventory, ...]).validate_json(
        (tmp_path / "rendered-media.json").read_bytes()
    )
    assert inventory.uninspected_frames == 1 and inventory.shadow_roots == 1
    assert summary.media_gaps == 1


def test_legacy_timeout_state_remains_resumable(tmp_path: Path) -> None:
    from mzizi_engine.web.crawl.state import CrawlState, digest_of, load_state
    from mzizi_engine.web.records import ErrorRecord

    request = CrawlRequest(url="https://example.org/list", out_dir=str(tmp_path))
    saved = CrawlState(
        digest=digest_of(request),
        complete=True,
        frontier=(),
        seen=(request.url,),
        pages=(),
        links=(),
        resources=(),
        errors=(
            ErrorRecord(
                url=request.url,
                stage="transport",
                kind="error",
                detail="Timeout",
                response="",
                attempt=0,
                at="2026-11-15T00:00:00Z",
            ),
        ),
        decisions=(),
        policy_audit=(),
    )
    # Captures created before deferred work was recorded omitted the field.
    (tmp_path / "state.json").write_text(saved.model_dump_json(exclude={"deferred"}))
    recovered = load_state(tmp_path, saved.digest)
    assert recovered is not None and not recovered.complete
    assert len(recovered.deferred) == 1 and recovered.deferred[0].url == request.url


def test_resume_builder_restores_original_scope_and_rejects_a_different_scope(site: str, tmp_path: Path) -> None:
    from mzizi_engine.devcli.catalog.builders import resume_payload
    from mzizi_engine.devcli.workspace import Workspace
    from mzizi_engine.web.crawl.state import CrawlState, digest_of, load_state

    request = CrawlRequest(
        url=site + "/list",
        out_dir=str(tmp_path),
        max_depth=0,
        allowed_paths=("/list",),
        item_selector="article",
        references_only=True,
        sitemap=False,
    )
    saved = CrawlState(
        digest=digest_of(request),
        complete=False,
        frontier=(),
        seen=(),
        pages=(),
        links=(),
        resources=(),
        errors=(),
        decisions=(),
        policy_audit=(),
        request=request,
    )
    (tmp_path / "state.json").write_text(saved.model_dump_json())
    payload = resume_payload({"folder": str(tmp_path), "max-pages": 12}, Workspace(tmp_path))
    restored = CrawlRequest.model_validate({**payload, "out_dir": str(tmp_path)}, strict=False)
    assert restored.allowed_paths == ("/list",) and restored.max_depth == 0 and restored.item_selector == "article"
    assert digest_of(restored) == saved.digest
    with pytest.raises(ValueError, match="resume scope differs"):
        load_state(tmp_path, digest_of(request.model_copy(update={"allowed_paths": ("/other",)})))
