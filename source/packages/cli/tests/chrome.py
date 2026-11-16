"""The marker for tests that need a real Chrome and Playwright."""

from __future__ import annotations

import shutil

import pytest

from mzizi_browser.shared.adapter import discover_chrome

HAS_BROWSER = bool(discover_chrome()) and shutil.which("python3") is not None
try:
    import playwright  # noqa: F401

    HAS_PLAYWRIGHT = True
except ModuleNotFoundError:
    HAS_PLAYWRIGHT = False

needs_chrome = pytest.mark.skipif(not (HAS_BROWSER and HAS_PLAYWRIGHT), reason="needs Playwright and Chrome")
