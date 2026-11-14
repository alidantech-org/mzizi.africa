"""Shared session implementation for the Playwright-compatible Chromium drivers."""

from __future__ import annotations

import hashlib
import importlib
import time
from contextlib import ExitStack
from pathlib import Path
from typing import TYPE_CHECKING

from mzizi_engine.web.browser.adapter import BrowserSession, BrowserUnavailable, register_adapter
from mzizi_engine.web.browser.models import BrowserConfig, RenderedPage
from mzizi_engine.web.browser.tabs import PopupGate, TabRegistry
from mzizi_fetch.web.download import safe_name
from mzizi_scraping.pagination import detect_pagination
from mzizi_fetch.web.vocabulary import vocabulary

if TYPE_CHECKING:
    from playwright.sync_api import BrowserContext, Download, Page, Request, Response

SCREENSHOT_TIMEOUT_MS = 10_000
CLICK_TIMEOUT_MS = 4_000
POPUP_LOAD_MS = 5_000
READY_SCRIPT = """
async ({quiet, max, roots, busy, minText}) => {
  const start = performance.now();
  const visible = el => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && parseFloat(style.opacity || '1') > 0.05;
  };
  const rootEmpty = () => roots.some(sel => {
    const el = document.querySelector(sel);
    return el && el.textContent.trim().length === 0 && el.children.length < 2;
  });
  const loaderShown = () => busy.some(sel => { try { return [...document.querySelectorAll(sel)].some(visible); } catch (e) { return false; } });
  const thin = () => (document.body ? document.body.innerText.trim().length : 0) < minText && document.querySelectorAll('script[src]').length > 0;
  if (document.fonts && document.fonts.ready) { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))]); }
  return await new Promise(resolve => {
    let last = performance.now();
    // content changes only: animations and class toggles (carousels, tickers) must not keep the page "busy" forever
    const observer = new MutationObserver(() => { last = performance.now(); });
    observer.observe(document.documentElement, {subtree: true, childList: true, characterData: true});
    const tick = () => {
      const now = performance.now();
      const settled = now - last >= quiet && document.readyState === 'complete' && !rootEmpty() && !loaderShown() && !thin();
      if (settled) { observer.disconnect(); resolve({state: 'stable', ms: Math.round(now - start)}); return; }
      if (now - start >= max) { observer.disconnect(); resolve({state: 'timeout', ms: Math.round(now - start)}); return; }
      setTimeout(tick, 100);
    };
    tick();
  });
}
"""
BLANK_LINKS_SCRIPT = "els => els.map(e => e.href).filter(h => h)"
SCROLL_PAUSE = 0.4
MAX_SCROLLS = 40
LINKS_SCRIPT = "els => els.map(e => e.href).filter(h => h)"
IMAGES_SCRIPT = "els => els.map(e => e.currentSrc || e.src).filter(s => s)"
SCROLL_HEIGHT = "document.body.scrollHeight"


class PlaywrightSession:
    def __init__(self, config: BrowserConfig, driver: str = "playwright") -> None:
        try:
            sync_api = importlib.import_module(f"{driver}.sync_api")
        except ModuleNotFoundError as problem:
            raise BrowserUnavailable(
                f"{driver} is not installed: run `uv sync --all-packages --extra browser`"
            ) from problem
        self.config = config
        config.profile_dir.mkdir(parents=True, exist_ok=True)
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
            if config.cdp_url:
                self._attached = self._pw.chromium.connect_over_cdp(config.cdp_url)
                self._context: BrowserContext = (
                    self._attached.contexts[0] if self._attached.contexts else self._attached.new_context()
                )
            else:
                self._context = self._pw.chromium.launch_persistent_context(str(config.profile_dir), **launch)
        except Exception as problem:
            self._pw.stop()
            install = (
                "; run `uv run --package mzizi-engine --extra browser patchright install chromium`"
                " if bundled Chromium is missing"
                if driver == "patchright" and config.channel is None and not config.executable_path
                else ""
            )
            raise BrowserUnavailable(
                f"could not start {driver} with {config.channel or 'chromium'}: {str(problem)[:200]}{install}"
            ) from problem
        self._context.set_default_timeout(config.timeout_ms)
        self._ready: tuple[str, int] = ("", 0)
        self._status = 0
        self._lease = ExitStack()
        self._gate = PopupGate()
        self._registry = TabRegistry(config.registry_dir) if config.cdp_url and config.site and config.registry_dir else None
        try:
            self._page: Page = self._working_tab()
        except Exception:
            self._lease.close()
            self._pw.stop()
            raise
        self._page.on("popup", self._on_popup)
        self._block_noise()
        self._console: list[str] = []
        self._failed: list[str] = []
        self._downloads: list[str] = []
        self._page.on(
            "console", lambda message: self._console.append(message.text) if message.type == "error" else None
        )
        self._page.on("requestfailed", self._on_failed)
        self._page.on("download", self._on_download)

    def _block_noise(self) -> None:
        """Analytics, ad and social-widget requests are dropped: they slow every page and add nothing to the content."""
        hosts = vocabulary().noise_hosts
        if not hosts:
            return

        def route(handler_route, request):  # noqa: ANN001
            url = request.url.lower()
            if any(h in url.split("/", 3)[2] + "/" + (url.split("/", 3)[3] if url.count("/") >= 3 else "") for h in hosts):
                handler_route.abort()
            else:
                handler_route.continue_()

        try:
            self._page.route("**/*", route)
        except Exception:
            pass

    def _target_id(self, page: Page) -> str:
        session = self._context.new_cdp_session(page)
        try:
            return str(session.send("Target.getTargetInfo")["targetInfo"]["targetId"])
        finally:
            session.detach()

    def _working_tab(self) -> Page:
        """This site's own tab (reused from an earlier command when it still exists), leased for this session."""
        registry = self._registry
        if registry is None:
            return self._context.pages[0] if self._context.pages else self._context.new_page()
        self._lease.enter_context(registry.lease(self.config.site))  # waits while another command works this site
        live = {self._target_id(p): p for p in self._context.pages}
        registry.forget(set(live))
        entry = registry.tab_for(self.config.site)
        page = live.get(entry.target_id) if entry else None
        if page is None:
            page = self._context.new_page()
            registry.remember(self.config.site, self._target_id(page))
        else:
            registry.remember(self.config.site, entry.target_id)
        self._trim_idle_tabs(registry, live)
        return page

    def _trim_idle_tabs(self, registry: TabRegistry, live: dict[str, Page]) -> None:
        """Beyond the total tab limit, closes the least recently used tabs of sites nobody is working on."""
        from mzizi_engine.web.browser.tabs import SiteBusy

        for entry in registry.idle_beyond_limit({self.config.site}):
            try:
                with registry.lease(entry.host, wait=0.05):
                    page = live.get(entry.target_id)
                    if page is not None:
                        page.close()
                    registry.forget(set(live) - {entry.target_id})
            except SiteBusy:
                continue

    def _on_popup(self, popup: Page) -> None:
        """A new tab or window opened by this site's tab: tracked, allowed one at a time, closed once seen."""
        try:
            popup.wait_for_load_state("domcontentloaded", timeout=POPUP_LOAD_MS)
        except Exception:  # a slow or blocked pop-up is still recorded by whatever address it reached
            pass
        if not self._gate.opened(popup.url):
            popup.close()
            return
        try:
            popup.close()
        finally:
            self._gate.closed()

    def _on_failed(self, request: Request) -> None:
        self._failed.append(f"{request.url}: {request.failure or 'failed'}")

    def _on_download(self, download: Download) -> None:
        self.config.downloads_dir.mkdir(parents=True, exist_ok=True)
        target = self.config.downloads_dir / safe_name(download.suggested_filename)
        download.save_as(target)
        target.chmod(0o600)
        self._downloads.append(target.name)

    def _settle(self) -> None:
        """Waits until the page has really rendered: loaded, network quiet, app root filled, DOM no longer changing."""
        page = self._page
        for state, timeout in (("load", self.config.load_wait_ms), ("networkidle", self.config.settle_ms)):
            try:
                page.wait_for_load_state(state, timeout=timeout)
            except Exception:  # pages that never go idle (polling, streaming) are judged on their DOM instead
                pass
        vocab = vocabulary()
        arguments = {
            "quiet": self.config.stable_quiet_ms,
            "max": self.config.stable_max_ms,
            "roots": list(vocab.spa_root_selectors),
            "busy": list(vocab.busy_selectors),
            "minText": self.config.min_text_chars,
        }
        for _attempt in range(2):  # a client-side redirect can replace the page while we wait; wait once more
            try:
                found = page.evaluate(READY_SCRIPT, arguments)
                self._ready = (str(found["state"]), int(found["ms"]))
                return
            except Exception:
                try:
                    page.wait_for_load_state("domcontentloaded", timeout=self.config.settle_ms)
                except Exception:
                    break
        self._ready = ("timeout", 0)

    def _redirects(self, response: Response | None) -> tuple[str, ...]:
        chain: list[str] = []
        request = response.request if response else None
        while request is not None and request.redirected_from is not None:
            request = request.redirected_from
            chain.append(request.url)
        return tuple(reversed(chain))

    def _blank_links(self) -> list[str]:
        try:
            return [str(v) for v in self._page.eval_on_selector_all("a[target=_blank][href]", BLANK_LINKS_SCRIPT)]
        except Exception:
            return []

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
            ready=self._ready[0],
            ready_ms=self._ready[1],
            popups=tuple(self._gate.seen),
            deferred_popups=tuple(self._gate.deferred),
            blank_links=tuple(self._blank_links()) if not error else (),
            error=error,
        )

    def goto(self, url: str) -> RenderedPage:
        self._console.clear()
        self._failed.clear()
        self._gate.seen.clear()
        self._gate.deferred.clear()
        try:
            response = self._page.goto(url, wait_until="domcontentloaded")
        except Exception as problem:
            return self._state(url, None, f"{type(problem).__name__}: {str(problem)[:150]}")
        self._settle()
        if self.config.headed:
            self._page.bring_to_front()  # the visible tab shows the page being worked on
        self._status = response.status if response else 0
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

    def _text_signature(self) -> str:
        try:
            return hashlib.sha256(self._page.inner_text("body").encode("utf-8")).hexdigest()
        except Exception:
            return ""

    def _click(self, selector: str) -> bool:
        """A normal click, or a script click when the window is not painting (an occluded window never settles)."""
        target = self._page.locator(selector).first
        try:
            target.click(timeout=CLICK_TIMEOUT_MS)
            return True
        except Exception:
            pass
        try:
            target.evaluate("element => element.click()", timeout=CLICK_TIMEOUT_MS)
            return True
        except Exception:
            return False

    def _click_and_wait(self, selector: str) -> bool:
        """Clicks a control and waits for the page content to change and finish rendering; False when nothing changed."""
        before = self._text_signature()
        if not self._click(selector):
            return False
        deadline = time.monotonic() + self.config.stable_max_ms / 1000
        while time.monotonic() < deadline:
            if self._text_signature() != before:
                self._settle()
                return True
            time.sleep(0.2)
        return False

    def _extend_in_place(self, steps: int) -> None:
        """`Load more` buttons and infinite scroll add items to the same page: keep going until nothing new arrives."""
        for _ in range(steps):
            found = detect_pagination(self._page.content(), self._page.url)
            if found.load_more is not None and found.load_more.enabled:
                if not self._click_and_wait(found.load_more.selector):
                    return
            elif found.infinite_scroll:
                before = self._text_signature()
                self.scroll(True, True)
                self._settle()
                if self._text_signature() == before:
                    return
            else:
                return

    def paginate(self, max_pages: int) -> tuple[RenderedPage, ...]:
        """Walks a listing: extends it in place, then clicks `next` (a button, not a link) page after page.

        Returns one snapshot per further page (`<url>#page-N`). Stops at the last page, a disabled or missing control,
        content that repeats, or `max_pages`. Links to the next page are left to the crawler.
        """
        self._extend_in_place(steps=min(max_pages, 30))
        base = self._page.url.split("#")[0]
        seen = {self._text_signature()}
        snapshots: list[RenderedPage] = []
        for number in range(2, max_pages + 1):
            control = detect_pagination(self._page.content(), self._page.url).next
            if control is None or not control.enabled or control.url:
                break
            if not self._click_and_wait(control.selector):
                break
            signature = self._text_signature()
            if signature in seen:
                break
            seen.add(signature)
            snapshot = self._state(base, None, "")
            snapshots.append(snapshot.model_copy(update={"url": f"{base}#page-{number}", "final_url": f"{base}#page-{number}", "status": self._status}))
        return tuple(snapshots)

    def links(self) -> tuple[str, ...]:
        return tuple(str(v) for v in self._page.eval_on_selector_all("a[href]", LINKS_SCRIPT))

    def images(self) -> tuple[str, ...]:
        return tuple(str(v) for v in self._page.eval_on_selector_all("img", IMAGES_SCRIPT))

    def screenshot(self, name: str, full_page: bool) -> Path:
        self.config.screenshots_dir.mkdir(parents=True, exist_ok=True)
        path = self.config.screenshots_dir / f"{safe_name(name)}.png"
        try:
            self._page.screenshot(path=str(path), full_page=full_page, timeout=SCREENSHOT_TIMEOUT_MS)
        except Exception:  # an unpainted window stalls the normal capture: ask the browser to render the page itself
            import base64

            cdp = self._context.new_cdp_session(self._page)
            try:
                shot = cdp.send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": full_page})
            finally:
                cdp.detach()
            path.write_bytes(base64.b64decode(shot["data"]))
        return path

    def close(self) -> None:
        try:
            if not self.config.cdp_url:  # a shared browser outlives the command; only the connection ends
                self._context.close()
        finally:
            self._lease.close()  # the site's tab stays open for the next command; only the lease ends
            self._pw.stop()


def _factory(config: BrowserConfig) -> BrowserSession:
    return PlaywrightSession(config)


register_adapter("playwright", _factory)


def _patchright_factory(config: BrowserConfig) -> BrowserSession:
    if "channel" not in config.model_fields_set:
        config = config.model_copy(update={"channel": None})
    return PlaywrightSession(config, driver="patchright")


register_adapter("patchright", _patchright_factory)
