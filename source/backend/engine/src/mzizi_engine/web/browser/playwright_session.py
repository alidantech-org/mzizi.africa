"""Playwright adapter: drives the installed Chrome in an isolated profile."""

from __future__ import annotations

import importlib
import time
from pathlib import Path
from typing import TYPE_CHECKING

from mzizi_engine.web.browser.adapter import BrowserSession, BrowserUnavailable, register_adapter
from mzizi_engine.web.browser.models import BrowserConfig, RenderedPage
from mzizi_fetch.web.download import safe_name

if TYPE_CHECKING:
    from playwright.sync_api import BrowserContext, Download, Page, Request, Response

SCROLL_PAUSE = 0.4
MAX_SCROLLS = 40
LINKS_SCRIPT = "els => els.map(e => e.href).filter(h => h)"
IMAGES_SCRIPT = "els => els.map(e => e.currentSrc || e.src).filter(s => s)"
SCROLL_HEIGHT = "document.body.scrollHeight"


class PlaywrightSession:
    def __init__(self, config: BrowserConfig) -> None:
        try:
            sync_api = importlib.import_module("playwright.sync_api")
        except ModuleNotFoundError as problem:
            raise BrowserUnavailable(
                "playwright is not installed: run `uv sync --all-packages --extra browser`"
            ) from problem
        self.config = config
        config.profile_dir.mkdir(parents=True, exist_ok=True)
        config.downloads_dir.mkdir(parents=True, exist_ok=True)
        config.screenshots_dir.mkdir(parents=True, exist_ok=True)
        self._pw = sync_api.sync_playwright().start()
        launch = {
            "headless": not config.headed,
            "user_agent": config.user_agent,
            "accept_downloads": True,
            "viewport": {"width": config.viewport_width, "height": config.viewport_height},
            "locale": config.locale,
            "extra_http_headers": dict(config.headers),
        }
        if config.executable_path:
            launch["executable_path"] = config.executable_path
        elif config.channel:
            launch["channel"] = config.channel
        try:
            self._context: BrowserContext = self._pw.chromium.launch_persistent_context(
                str(config.profile_dir), **launch
            )
        except Exception as problem:
            self._pw.stop()
            raise BrowserUnavailable(
                f"could not start {config.channel or 'chromium'}: {str(problem)[:200]}"
            ) from problem
        self._context.set_default_timeout(config.timeout_ms)
        self._page: Page = self._context.pages[0] if self._context.pages else self._context.new_page()
        self._console: list[str] = []
        self._failed: list[str] = []
        self._downloads: list[str] = []
        self._page.on(
            "console", lambda message: self._console.append(message.text) if message.type == "error" else None
        )
        self._page.on("requestfailed", self._on_failed)
        self._page.on("download", self._on_download)

    def _on_failed(self, request: Request) -> None:
        self._failed.append(f"{request.url}: {request.failure or 'failed'}")

    def _on_download(self, download: Download) -> None:
        target = self.config.downloads_dir / safe_name(download.suggested_filename)
        download.save_as(target)
        target.chmod(0o600)
        self._downloads.append(target.name)

    def _settle(self) -> None:
        try:
            self._page.wait_for_load_state("networkidle", timeout=self.config.settle_ms)
        except Exception:  # pages that never go idle are read as they are
            return

    def _redirects(self, response: Response | None) -> tuple[str, ...]:
        chain: list[str] = []
        request = response.request if response else None
        while request is not None and request.redirected_from is not None:
            request = request.redirected_from
            chain.append(request.url)
        return tuple(reversed(chain))

    def page_state(self) -> RenderedPage:
        return self._state(self._page.url, None, "")

    def _state(self, url: str, response: Response | None, error: str) -> RenderedPage:
        page = self._page
        return RenderedPage(
            url=url,
            final_url=page.url,
            status=response.status if response else 0,
            title=page.title() if not error else "",
            html=page.content() if not error else "",
            text=page.inner_text("body") if not error else "",
            headers=response.all_headers() if response else {},
            redirects=self._redirects(response),
            console_errors=tuple(self._console),
            failed_requests=tuple(self._failed),
            downloads=tuple(self._downloads),
            error=error,
        )

    def goto(self, url: str) -> RenderedPage:
        self._console.clear()
        self._failed.clear()
        try:
            response = self._page.goto(url, wait_until="domcontentloaded")
        except Exception as problem:
            return self._state(url, None, f"{type(problem).__name__}: {str(problem)[:150]}")
        self._settle()
        return self._state(url, response, "")

    def wait_for(self, selector: str, timeout_ms: int | None = None) -> None:
        self._page.wait_for_selector(selector, timeout=timeout_ms or self.config.timeout_ms)

    def click(self, target: str) -> None:
        self._page.click(target)
        self._settle()

    def fill(self, target: str, text: str) -> None:
        self._page.fill(target, text)

    def press(self, key: str) -> None:
        self._page.keyboard.press(key)
        self._settle()

    def scroll(self, to_bottom: bool, until_stable: bool) -> int:
        page = self._page
        if not to_bottom:
            page.evaluate("window.scrollTo(0, 0)")
            return 0
        previous = -1
        for _ in range(MAX_SCROLLS):
            height = int(page.evaluate(SCROLL_HEIGHT))
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(SCROLL_PAUSE)
            if not until_stable or height == previous:
                return height
            previous = height
        return previous

    def links(self) -> tuple[str, ...]:
        return tuple(str(v) for v in self._page.eval_on_selector_all("a[href]", LINKS_SCRIPT))

    def images(self) -> tuple[str, ...]:
        return tuple(str(v) for v in self._page.eval_on_selector_all("img", IMAGES_SCRIPT))

    def screenshot(self, name: str, full_page: bool) -> Path:
        path = self.config.screenshots_dir / f"{safe_name(name)}.png"
        self._page.screenshot(path=str(path), full_page=full_page)
        return path

    def close(self) -> None:
        try:
            self._context.close()
        finally:
            self._pw.stop()


def _factory(config: BrowserConfig) -> BrowserSession:
    return PlaywrightSession(config)


register_adapter("playwright", _factory)
