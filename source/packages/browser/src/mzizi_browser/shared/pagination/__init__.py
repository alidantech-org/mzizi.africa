"""Detecting how a page paginates."""

from mzizi_browser.shared.pagination.detect import detect_pagination
from mzizi_browser.shared.pagination.models import Control, ControlKind, Findings
from mzizi_browser.shared.pagination.needs_browser import needs_browser

__all__ = ["Control", "ControlKind", "Findings", "detect_pagination", "needs_browser"]
