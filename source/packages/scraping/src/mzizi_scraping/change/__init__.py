"""Change detection between two visits of a page."""

from mzizi_scraping.change.fingerprint import compare, fingerprint
from mzizi_scraping.change.models import MAIN_BLOCK, Change, Fingerprint

__all__ = ["MAIN_BLOCK", "Change", "Fingerprint", "compare", "fingerprint"]
