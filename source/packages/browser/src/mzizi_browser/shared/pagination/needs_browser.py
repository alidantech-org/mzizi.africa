"""Does a page fetched over plain HTTP need a real browser to show its content? Static pages are far cheaper to fetch."""

from __future__ import annotations

from bs4 import BeautifulSoup

from mzizi_browser.shared.pagination.detect import detect_pagination
from mzizi_browser.shared.pagination.models import ControlKind
from mzizi_fetch.web.vocabulary import vocabulary

MIN_TEXT_CHARS = 200
NOTICE_TEXT_LIMIT = 1500


def needs_browser(html: str | bytes, base_url: str) -> str:
    """Why this page needs a browser ('' when the static HTML is complete). Reasons: an empty app root, scripts and
    almost no text, a 'please enable JavaScript' notice, or page navigation done by buttons."""
    vocab = vocabulary()
    soup = BeautifulSoup(html, "lxml")
    for selector in vocab.spa_root_selectors:
        try:
            root = soup.select_one(selector)
        except Exception:
            continue
        if root is not None and not root.get_text(strip=True) and len(root.find_all(True)) < 2:
            return f"empty app root {selector}"
    notices: list[str] = []
    for tag in soup(["script", "style", "noscript"]):
        if tag.name == "noscript":
            notices.append(tag.get_text(" ", strip=True).lower())
        tag.extract()
    text = soup.get_text(" ", strip=True)
    # a "please enable JavaScript" notice only matters when the page itself shows little: a long static page that carries
    # such a notice in a banner (a cookie or widget warning) is complete as it is
    if len(text) < NOTICE_TEXT_LIMIT and any(p in notice for notice in notices for p in vocab.needs_javascript_phrases):
        return "page asks for JavaScript"
    if len(text) < MIN_TEXT_CHARS and BeautifulSoup(html, "lxml").find("script", src=True) is not None:
        return "scripts and almost no text"
    next_control = detect_pagination(html, base_url).next
    if next_control is not None and next_control.kind is ControlKind.BUTTON and next_control.enabled:
        return "pagination by buttons"
    return ""
