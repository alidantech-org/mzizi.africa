"""Detecting how a page paginates."""

from mzizi_scraping.pagination.detect import detect_pagination
from mzizi_scraping.pagination.needs_browser import needs_browser
from mzizi_scraping.pagination.models import Control, ControlKind, Findings

__all__ = ["Control", "ControlKind", "Findings", "detect_pagination", "needs_browser"]
