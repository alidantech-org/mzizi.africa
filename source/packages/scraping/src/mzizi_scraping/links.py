"""Link discovery from HTML: absolute, de-duplicated, with link text, in document order."""

from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import urldefrag, urljoin, urlparse

from bs4 import BeautifulSoup


@dataclass(frozen=True)
class Link:
    url: str
    text: str


def extract_links(html: str | bytes, base_url: str, schemes: tuple[str, ...] = ("http", "https")) -> list[Link]:
    """Anchor links resolved against base_url; fragments dropped; non-web schemes (mailto, javascript) skipped."""
    soup = BeautifulSoup(html, "lxml")
    seen: set[str] = set()
    out: list[Link] = []
    for anchor in soup.find_all("a", href=True):
        url, _fragment = urldefrag(urljoin(base_url, anchor["href"].strip()))
        if urlparse(url).scheme not in schemes or url in seen:
            continue
        seen.add(url)
        out.append(Link(url, " ".join(anchor.get_text().split())))
    return out
