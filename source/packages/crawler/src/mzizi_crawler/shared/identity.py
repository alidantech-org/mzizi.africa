"""The crawler's identity: the monitored-contact user agent the fetch policy requires."""

from __future__ import annotations

import os

from mzizi_fetch import resolve_user_agent

USER_AGENT_ENV = "MZIZI_USER_AGENT"


def user_agent() -> str:
    """Raises `IdentityMissing` (from mzizi-fetch) when no monitored contact is configured."""
    return resolve_user_agent(None, os.environ.get(USER_AGENT_ENV))
