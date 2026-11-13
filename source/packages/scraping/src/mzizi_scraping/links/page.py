"""Page-level discovery: canonical URL, title, pagination and sitemap contents."""

from __future__ import annotations

from urllib.parse import urldefrag, urljoin

from bs4 import BeautifulSoup

from mzizi_scraping.core import Frozen


class PageMeta(Frozen):
    title: str
    canonical: str | None
    next_pages: tuple[str, ...]
    sitemaps: tuple[str, ...]


def _absolute(base: str, href: object) -> str | None:
    return urldefrag(urljoin(base, href.strip()))[0] if isinstance(href, str) and href.strip() else None


def page_meta(html: str | bytes, base_url: str) -> PageMeta:
    """Title, `<link rel=canonical>`, pagination (`rel=next`, including anchors) and advertised sitemaps."""
    soup = BeautifulSoup(html, "lxml")
    canonical = next((_absolute(base_url, t.get("href")) for t in soup.find_all("link", rel="canonical")), None)
    nexts: list[str] = []
    for tag in soup.find_all(["link", "a"], rel=True):
        rel = tag.get("rel")
        values = rel if isinstance(rel, list) else str(rel).split()
        target = _absolute(base_url, tag.get("href"))
        if target and "next" in [v.lower() for v in values] and target not in nexts:
            nexts.append(target)
    sitemaps = [u for t in soup.find_all("link", rel="sitemap") if (u := _absolute(base_url, t.get("href")))]
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    return PageMeta(title=title[:300], canonical=canonical, next_pages=tuple(nexts), sitemaps=tuple(sitemaps))


class SitemapContent(Frozen):
    urls: tuple[str, ...]
    child_sitemaps: tuple[str, ...]


def parse_sitemap(xml: str | bytes) -> SitemapContent:
    """URLs of a sitemap, or the child sitemaps of a sitemap index. Entities are not resolved (no external content)."""
    soup = BeautifulSoup(xml, "xml")
    children = [loc.get_text(strip=True) for s in soup.find_all("sitemap") for loc in s.find_all("loc")]
    urls = [loc.get_text(strip=True) for u in soup.find_all("url") for loc in u.find_all("loc")]
    return SitemapContent(urls=tuple(urls), child_sitemaps=tuple(children))


def sitemaps_from_robots(robots_text: str) -> tuple[str, ...]:
    return tuple(
        line.split(":", 1)[1].strip() for line in robots_text.splitlines() if line.lower().startswith("sitemap:")
    )
