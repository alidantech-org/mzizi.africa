"""Link discovery from HTML: absolute, de-duplicated, with link text, in document order."""

from __future__ import annotations

from urllib.parse import urldefrag, urljoin, urlparse

from bs4 import BeautifulSoup

from mzizi_scraping.core import Frozen

DEFAULT_SCHEMES = ("http", "https")


class Link(Frozen):
    url: str
    text: str


def extract_links(html: str | bytes, base_url: str, schemes: tuple[str, ...] = DEFAULT_SCHEMES) -> list[Link]:
    """Anchor links resolved against base_url; fragments dropped; other schemes (mailto, javascript) skipped."""
    soup = BeautifulSoup(html, "lxml")
    seen: set[str] = set()
    found: list[Link] = []
    for anchor in soup.find_all("a", href=True):
        href = anchor.get("href")
        if not isinstance(href, str):
            continue
        url, _fragment = urldefrag(urljoin(base_url, href.strip()))
        if urlparse(url).scheme not in schemes or url in seen:
            continue
        seen.add(url)
        found.append(Link(url=url, text=" ".join(anchor.get_text().split())))
    return found
