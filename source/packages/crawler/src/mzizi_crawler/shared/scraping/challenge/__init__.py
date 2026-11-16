"""Access-challenge detection."""

from mzizi_crawler.shared.scraping.challenge.detect import (
    CHALLENGE_MARKERS,
    detect_challenge,
)

__all__ = ["CHALLENGE_MARKERS", "detect_challenge"]
