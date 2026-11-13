"""Site boilerplate (headers, navigation, footers, sidebars): landmarks plus blocks repeated across a site's pages."""

from __future__ import annotations

import hashlib

from bs4 import BeautifulSoup, Tag

from mzizi_extraction.core import Frozen

LANDMARK_TAGS = ("nav", "aside")
LANDMARK_ROLES = ("banner", "navigation", "contentinfo", "complementary", "search")
#: `header` and `footer` are page chrome only outside article-like containers.
CHROME_TAGS = ("header", "footer")
CONTENT_CONTAINERS = ("article", "main", "section")
CANDIDATE_TAGS = ("div", "section", "ul", "nav", "header", "footer", "aside", "form", "table", "ol")
MIN_BLOCK_CHARS = 20
MAX_BLOCK_CHARS = 8000
DEFAULT_SHARE = 0.6
DEFAULT_MIN_PAGES = 3


class Boilerplate(Frozen):
    """Fingerprints of text blocks that repeat across pages of one site."""

    fingerprints: frozenset[str] = frozenset()


def fingerprint(element: Tag) -> str | None:
    text = " ".join(element.get_text(" ").split()).lower()
    if not MIN_BLOCK_CHARS <= len(text) <= MAX_BLOCK_CHARS:
        return None
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:16]


def is_landmark(element: Tag) -> bool:
    if element.name in LANDMARK_TAGS or element.get("role") in LANDMARK_ROLES:
        return True
    if element.name in CHROME_TAGS:
        return element.find_parent(CONTENT_CONTAINERS) is None
    return False


def learn_boilerplate(
    pages: list[str], share: float = DEFAULT_SHARE, min_pages: int = DEFAULT_MIN_PAGES
) -> Boilerplate:
    """Blocks whose text appears on at least `share` of the pages (and on `min_pages` or more) are boilerplate."""
    if len(pages) < min_pages:
        return Boilerplate()
    counts: dict[str, int] = {}
    for html in pages:
        soup = BeautifulSoup(html, "lxml")
        seen: set[str] = set()
        for element in soup.find_all(CANDIDATE_TAGS):
            key = fingerprint(element)
            if key:
                seen.add(key)
        for key in seen:
            counts[key] = counts.get(key, 0) + 1
    needed = max(min_pages, share * len(pages))
    return Boilerplate(fingerprints=frozenset(k for k, n in counts.items() if n >= needed))
