"""Deterministic scraping building blocks. No source knowledge lives here: selectors, fields and transforms come from manifests."""

from mzizi_scraping import challenge, extract, selectors, transforms
from mzizi_scraping.challenge import detect_challenge
from mzizi_scraping.links import (
    Link,
    PageMeta,
    Reference,
    SitemapContent,
    extract_links,
    extract_references,
    page_meta,
    parse_sitemap,
    sitemaps_from_robots,
)
from mzizi_scraping.parse import parse_module, parse_selectors, parse_transform

__all__ = [
    "Link",
    "PageMeta",
    "Reference",
    "SitemapContent",
    "challenge",
    "detect_challenge",
    "extract",
    "extract_links",
    "extract_references",
    "page_meta",
    "parse_module",
    "parse_selectors",
    "parse_sitemap",
    "parse_transform",
    "selectors",
    "sitemaps_from_robots",
    "transforms",
]
__version__ = "0.1.0"
