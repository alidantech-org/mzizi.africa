"""The identified user agent the fetcher sends."""

from __future__ import annotations

from ..text import has_contact_address, is_placeholder_contact
from .errors import IdentityMissing


def resolve_user_agent(configured: str | None, deployment: str | None) -> str:
    """The deployment value (MZIZI_USER_AGENT, read by the caller) wins over the manifest value.

    The string must name a monitored contact (compliance document section 5.3). A placeholder contact fails closed,
    so a bundle written before a real contact channel exists can never be run live by accident.
    """
    value = (deployment or configured or "").strip()
    if not value or not has_contact_address(value) or is_placeholder_contact(value):
        raise IdentityMissing(
            "no monitored contact is configured: set MZIZI_USER_AGENT to a user agent with a real contact address and bot page"
        )
    return value
