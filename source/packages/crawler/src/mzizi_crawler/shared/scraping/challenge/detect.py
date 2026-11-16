"""Access-challenge and block-notice detection. A detected challenge stops a run; nothing retries around it."""

from __future__ import annotations

CHALLENGE_MARKERS = (
    "captcha",
    "g-recaptcha",
    "h-captcha",
    "cf-chl",
    "attention required! | cloudflare",
    "just a moment...",
    "verify you are human",
    "access denied",
    "request blocked",
    "you have been blocked",
    "unusual traffic",
    "checking your browser",
)


def detect_challenge(status: int, headers: dict[str, str], body_head: bytes) -> str | None:
    """Returns a reason when the response is an access challenge or block notice, else None."""
    lowered = {k.lower(): v for k, v in headers.items()}
    if lowered.get("cf-mitigated", "").lower() == "challenge":
        return "challenge header"
    text = body_head[:8000].decode("utf-8", errors="ignore").lower()
    for marker in CHALLENGE_MARKERS:
        if marker in text:
            return f"marker {marker!r}"
    return None
