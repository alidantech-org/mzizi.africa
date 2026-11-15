"""Link discovery from HTML: absolute, de-duplicated, with link text, in document order."""

from __future__ import annotations

from urllib.parse import urldefrag, urljoin, urlparse

from bs4 import BeautifulSoup, Tag

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


class Reference(Frozen):
    """Any URL a page points at: where it was found and how, so callers can classify pages, files and images."""

    url: str
    text: str
    tag: str
    attribute: str
    heading: str = ""


_REFERENCE_ATTRIBUTES: tuple[tuple[str, str], ...] = (
    ("a", "href"),
    ("area", "href"),
    ("img", "src"),
    ("source", "src"),
    ("video", "src"),
    ("video", "poster"),
    ("audio", "src"),
    ("embed", "src"),
    ("object", "data"),
    ("iframe", "src"),
    ("track", "src"),
)
_NON_NAVIGABLE = ("javascript", "data", "blob")


_CONTEXT_TAGS = ("main", "article", "section", "li", "td", "nav", "aside", "header", "footer")
_HEADING_TAGS = ("h1", "h2", "h3", "h4", "h5", "h6")


def _headings(soup: BeautifulSoup) -> dict[int, str]:
    active: dict[int, str] = {}
    headings: dict[int, str] = {}
    reference_tags = {tag for tag, _ in _REFERENCE_ATTRIBUTES}
    for element in soup.find_all((*reference_tags, *_HEADING_TAGS)):
        parents = tuple(id(node) for node in element.parents if isinstance(node, Tag) and node.name in _CONTEXT_TAGS)
        if element.name in _HEADING_TAGS:
            active[parents[0] if parents else 0] = element.get_text(" ", strip=True)
        else:
            headings[id(element)] = next((active[key] for key in parents if key in active), active.get(0, ""))
    return headings


def extract_references(
    html: str | bytes | BeautifulSoup, base_url: str, *, retain_context: bool = False
) -> list[Reference]:
    """Every link, image, media, embed and frame URL on a page, absolute and de-duplicated per (tag, URL).

    Unlike `extract_links` this keeps `mailto:` and `tel:` references (they are part of a site's contact surface) and
    reports which tag carried each URL. `javascript:`, `data:` and `blob:` URLs are skipped.
    """
    soup = html if isinstance(html, BeautifulSoup) else BeautifulSoup(html, "lxml")
    headings = _headings(soup)
    seen: set[tuple[str, str, str, str]] = set()
    found: list[Reference] = []
    for tag, attribute in _REFERENCE_ATTRIBUTES:
        for element in soup.find_all(tag):
            raw = element.get(attribute)
            if not isinstance(raw, str) or not raw.strip():
                continue
            url, _fragment = urldefrag(urljoin(base_url, raw.strip()))
            scheme = urlparse(url).scheme
            if scheme in _NON_NAVIGABLE or not scheme:
                continue
            label = element.get_text() if tag == "a" else str(element.get("alt") or element.get("title") or "")
            text, heading = " ".join(label.split()), headings.get(id(element), "")
            key = (tag, url, text if retain_context else "", heading if retain_context else "")
            if key not in seen:
                seen.add(key)
                found.append(Reference(url=url, text=text, tag=tag, attribute=attribute, heading=heading))
    for element in soup.find_all(["img", "source"], srcset=True):
        for candidate in str(element.get("srcset")).split(","):
            parts = candidate.strip().split(" ")
            if not parts[0]:
                continue
            url, _fragment = urldefrag(urljoin(base_url, parts[0]))
            heading = headings.get(id(element), "")
            text = str(element.get("alt") or "")
            key = (element.name, url, text if retain_context else "", heading if retain_context else "")
            if urlparse(url).scheme in ("http", "https") and key not in seen:
                seen.add(key)
                found.append(
                    Reference(
                        url=url,
                        text=str(element.get("alt") or ""),
                        tag=element.name,
                        attribute="srcset",
                        heading=headings.get(id(element), ""),
                    )
                )
    return found
