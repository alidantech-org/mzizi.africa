"""Browser adapter: the protocol and registry always; real Chrome when it and Playwright are installed."""

from __future__ import annotations

from pathlib import Path

import pytest
from chrome import needs_chrome

from mzizi_browser.features.actions.actions import parse_actions, run_actions
from mzizi_browser.shared.adapter import (
    ADAPTERS,
    BrowserUnavailable,
    check_profile,
    open_session,
    register_adapter,
)
from mzizi_browser.shared.challenge import detect_challenge
from mzizi_browser.shared.models import BrowserConfig, RenderedPage


def config(tmp_path: Path, **options: object) -> BrowserConfig:
    return BrowserConfig(
        profile_dir=tmp_path / "profile",
        downloads_dir=tmp_path / "dl",
        screenshots_dir=tmp_path / "shots",
        user_agent="MziziTest/1.0 (+https://mzizi-test.africa/bot; research@mzizi-test.africa)",
        **options,
    )  # type: ignore[arg-type]


def test_personal_profiles_are_refused_and_unknown_adapters_reported(tmp_path: Path) -> None:
    with pytest.raises(BrowserUnavailable, match="personal"):
        check_profile(Path.home() / ".config" / "google-chrome" / "Default")
    with pytest.raises(BrowserUnavailable, match="unknown browser adapter"):
        open_session(config(tmp_path, adapter="nope"))


def test_another_adapter_can_be_registered_and_used(tmp_path: Path) -> None:
    class Fake:
        def __init__(self, cfg: BrowserConfig) -> None:
            self.cfg = cfg

        def goto(self, url: str) -> RenderedPage:
            return RenderedPage(
                url=url, final_url=url, status=200, title="fake", html="<html></html>", text="", headers={}
            )

        def page_state(self) -> RenderedPage:
            return self.goto("about:blank")

        def close(self) -> None: ...

    register_adapter("fake", lambda cfg: Fake(cfg))  # type: ignore[arg-type,return-value]
    try:
        session = open_session(config(tmp_path, adapter="fake"))
        assert session.goto("https://x.org").title == "fake"
    finally:
        ADAPTERS.pop("fake")


def test_challenge_detection_reads_rendered_pages() -> None:
    page = RenderedPage(
        url="u", final_url="u", status=200, title="", html="<div class='g-recaptcha'></div>", text="", headers={}
    )
    assert detect_challenge(page).kind.value == "captcha"
    assert detect_challenge(page.model_copy(update={"html": "<p>fine</p>"})) is None


def test_action_scripts_are_parsed_strictly() -> None:
    steps = parse_actions("- {do: goto, url: 'http://x'}\n- {do: click, target: '#a'}\n- {do: scroll}\n")
    assert [s.do for s in steps] == ["goto", "click", "scroll"]
    with pytest.raises(ValueError):
        parse_actions("- {do: explode}")


@needs_chrome
def test_real_chrome_renders_javascript_and_reports_page_state(site: str, tmp_path: Path) -> None:
    session = open_session(config(tmp_path))
    try:
        page = session.goto(site + "/js")
        assert page.status == 200 and "js link" in page.html and any("found-by-js" in link for link in session.links())
        assert any("boom" in message for message in page.console_errors)
        assert any(img.endswith("/missing.png") for img in session.images())
    finally:
        session.close()


@needs_chrome
def test_real_chrome_click_fill_screenshot_scroll_and_redirect(site: str, tmp_path: Path) -> None:
    session = open_session(config(tmp_path))
    try:
        session.goto(site + "/js")
        results = run_actions(
            session,
            parse_actions(
                "- {do: fill, target: '#name', text: 'Wanjiru'}\n- {do: click, target: '#go'}\n- {do: scroll}\n- {do: screenshot, name: shot}\n- {do: save_html, name: after}\n- {do: links}\n"
            ),
            tmp_path / "out",
        )
        assert all(r.ok for r in results), results
        assert session.page_state().title == "clicked" and (tmp_path / "out" / "05-after.html").exists()
        assert (tmp_path / "shots" / "04-shot.png").read_bytes().startswith(b"\x89PNG")
        failed = run_actions(session, parse_actions("- {do: click, target: '#nope'}\n- {do: links}"), tmp_path / "out")
        assert [r.ok for r in failed] == [False]
    finally:
        session.close()


@needs_chrome
def test_markdown_inventories_rendered_images_without_archiving_assets(site: str, tmp_path: Path) -> None:
    from bs4 import BeautifulSoup
    from web_site import Handler, page

    from mzizi_browser.shared.media import MediaInventory
    from mzizi_crawler.features.crawl_site.crawl_site import page_markdown
    from mzizi_crawler.shared.requests import MarkdownRequest, Render

    Handler.site["/assets/portraits.css"] = b"""
        .portrait.ready { width: 30px; height: 30px; background-image: url(amina.png); }
        .portrait::before { content: ''; background-image: url(overlay.png); }
    """
    Handler.site["/portraits"] = page(
        "Portrait gallery",
        """<div><div><div class="portrait"></div></div><a href="/profile">Amina</a>
        <a href="/profile">View profile</a>
        <script>document.querySelector('.portrait').classList.add('ready')</script>
        </div><article><picture><source srcset="/portrait-wide.png 1x, /portrait-hd.png 2x">
        <img src="/fallback.png" alt="Felix"></picture></article>""",
        '<link rel="stylesheet" href="/assets/portraits.css">',
    )
    request = MarkdownRequest(
        url=site + "/portraits", out_dir=str(tmp_path), render=Render.BROWSER, rendered_media=True
    )
    result = page_markdown(request)
    assert result.ok, result
    inventory = MediaInventory.model_validate_json((tmp_path / "rendered-media.json").read_bytes())
    assert inventory.source_url == request.url and not inventory.truncated
    references = {(ref.kind, ref.url.removeprefix(site)): ref for ref in inventory.references}
    background = references["background", "/assets/amina.png"]
    assert (background.label, background.link, background.visible) == ("Amina", site + "/profile", True)
    assert references["background", "/assets/overlay.png"].selector == background.selector + "::before"
    assert ("responsive-source", "/portrait-hd.png") in references
    assert references["selected-image", "/portrait-wide.png"].label == "Felix"
    soup = BeautifulSoup((tmp_path / "page.html").read_bytes(), "lxml")
    assert soup.select_one(background.selector) is not None
    assert soup.select_one(background.selector).get("style") is None
    markdown = (tmp_path / "page.md").read_text()
    assert f"[Amina](<{site}/assets/amina.png>) ([page item](<{site}/profile>))" in markdown
    assert f"[Felix](<{site}/portrait-wide.png>)" in markdown
    assert sorted(path.name for path in tmp_path.iterdir()) == sorted(result.files)
