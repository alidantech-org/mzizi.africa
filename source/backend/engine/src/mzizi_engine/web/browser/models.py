"""Typed browser configuration and page results."""

from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel, ConfigDict


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class BrowserConfig(Frozen):
    adapter: str = "playwright"
    headed: bool = False
    channel: str | None = "chrome"  # the installed Chrome; None uses the adapter's own bundled browser
    executable_path: str | None = None
    profile_dir: Path
    downloads_dir: Path
    screenshots_dir: Path
    user_agent: str
    viewport_width: int = 1366
    viewport_height: int = 900
    locale: str = "en-US"
    timeout_ms: int = 30_000
    load_wait_ms: int = 8_000  # the `load` event is capped: slow third-party content must not hold a page
    settle_ms: int = 4_000  # then how long to wait for the network to go quiet
    stable_quiet_ms: int = 800  # ready after this long with no content changes, no visible loader, app root filled
    stable_max_ms: int = 25_000  # upper bound on waiting for a client-rendered page to finish
    min_text_chars: int = 60  # a page with less visible text than this and scripts still pending is not ready
    headers: dict[str, str] = {}
    persistent: bool = True
    site: str = ""  # the host this session works on; with a shared browser it owns that site's tab
    registry_dir: Path | None = None  # where the shared browser's tab registry lives
    cdp_url: str | None = None  # attach to an already-running shared browser; closing only detaches


class RenderedPage(Frozen):
    url: str
    final_url: str
    status: int
    title: str
    html: str
    text: str
    headers: dict[str, str]
    redirects: tuple[str, ...] = ()
    console_errors: tuple[str, ...] = ()
    failed_requests: tuple[str, ...] = ()
    downloads: tuple[str, ...] = ()
    ready: str = ""  # `stable` when the page finished rendering, `timeout` when the wait ran out
    ready_ms: int = 0
    popups: tuple[str, ...] = ()  # addresses opened as pop-ups (`target=_blank`, `window.open`) during this visit
    deferred_popups: tuple[str, ...] = ()  # pop-ups closed unvisited because one was already open
    blank_links: tuple[str, ...] = ()  # links on the page that ask for a new tab
    error: str = ""


class StepResult(Frozen):
    step: str
    ok: bool
    detail: str
    url: str
