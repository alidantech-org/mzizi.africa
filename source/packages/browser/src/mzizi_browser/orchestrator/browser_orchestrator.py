"""BrowserOrchestrator: every browser capability behind one class. The engine builds it once and registers it with the runtime."""

from __future__ import annotations

from mzizi_browser.features.actions.actions import parse_actions, run_actions
from mzizi_browser.features.session.window import ensure_shared_browser
from mzizi_browser.shared.adapter import (
    BrowserSession,
    BrowserUnavailable,
    check_profile,
    open_session,
)
from mzizi_browser.shared.challenge import detect_challenge
from mzizi_browser.shared.models import BrowserConfig

__all__ = ["BrowserOrchestrator", "BrowserUnavailable"]


class BrowserOrchestrator:
    """Stateless entry points over the browser features; sessions are returned to the caller, who closes them."""

    def open_session(self, config: BrowserConfig) -> BrowserSession:
        return open_session(config)

    check_profile = staticmethod(check_profile)
    ensure_shared_browser = staticmethod(ensure_shared_browser)
    detect_challenge = staticmethod(detect_challenge)
    parse_actions = staticmethod(parse_actions)
    run_actions = staticmethod(run_actions)

    def start(self) -> None:
        """Nothing to open: browsers start with a session."""

    def stop(self) -> None:
        """Nothing to close: sessions belong to their callers."""
