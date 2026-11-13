"""The adapter interface and the registry that lets another browser implementation be dropped in."""

from __future__ import annotations

import shutil
from collections.abc import Callable
from pathlib import Path
from typing import Protocol

from mzizi_engine.web.browser.models import BrowserConfig, RenderedPage

CHROME_NAMES = ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome")
PERSONAL_PROFILE_NAMES = ("google-chrome", "chromium", "Chrome", "BraveSoftware", "Default")


class BrowserUnavailable(RuntimeError):
    """The adapter's library or browser is missing, or the configuration is unsafe."""


class BrowserSession(Protocol):
    def goto(self, url: str) -> RenderedPage: ...

    def wait_for(self, selector: str, timeout_ms: int | None = None) -> None: ...

    def click(self, target: str) -> None: ...

    def fill(self, target: str, text: str) -> None: ...

    def press(self, key: str) -> None: ...

    def scroll(self, to_bottom: bool, until_stable: bool) -> int: ...

    def page_state(self) -> RenderedPage: ...

    def links(self) -> tuple[str, ...]: ...

    def images(self) -> tuple[str, ...]: ...

    def screenshot(self, name: str, full_page: bool) -> Path: ...

    def close(self) -> None: ...


type SessionFactory = Callable[[BrowserConfig], BrowserSession]
ADAPTERS: dict[str, SessionFactory] = {}


def register_adapter(name: str, factory: SessionFactory) -> None:
    ADAPTERS[name] = factory


def discover_chrome() -> str | None:
    """Path of an installed Chrome or Chromium, or None."""
    for name in CHROME_NAMES:
        found = shutil.which(name)
        if found:
            return found
    return None


def check_profile(profile_dir: Path) -> None:
    """Refuses a profile folder that is, or sits inside, a personal browser profile."""
    resolved = profile_dir.resolve()
    home = Path.home().resolve()
    for part in resolved.relative_to(home).parts if resolved.is_relative_to(home) else ():
        if part in PERSONAL_PROFILE_NAMES:
            raise BrowserUnavailable(
                f"{resolved} looks like a personal browser profile; use an isolated profile folder"
            )


def open_session(config: BrowserConfig) -> BrowserSession:
    from mzizi_engine.web.browser import playwright_session  # noqa: F401  (registers the default adapter)

    if config.adapter not in ADAPTERS:
        raise BrowserUnavailable(
            f"unknown browser adapter {config.adapter!r}; available: {', '.join(sorted(ADAPTERS))}"
        )
    check_profile(config.profile_dir)
    return ADAPTERS[config.adapter](config)
