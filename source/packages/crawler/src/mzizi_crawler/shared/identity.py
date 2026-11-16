"""The crawler's identity: the monitored-contact user agent the fetch policy requires.

The package reads no environment. The engine passes the configured user agent in with `configure_user_agent`.
"""

from __future__ import annotations

from mzizi_fetch import resolve_user_agent

_configured: str | None = None


def configure_user_agent(value: str | None) -> None:
    """Install the user agent every request identifies itself with (the engine does this once, at assembly)."""
    global _configured
    _configured = value


def user_agent() -> str:
    """Raises `IdentityMissing` (from mzizi-fetch) when no monitored contact is configured."""
    return resolve_user_agent(None, _configured)
