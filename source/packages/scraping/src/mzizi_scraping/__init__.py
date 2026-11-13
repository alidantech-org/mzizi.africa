"""Deterministic scraping building blocks. No source knowledge lives here: selectors, fields and transforms come from manifests."""

from mzizi_scraping import challenge, extract, selectors, transforms
from mzizi_scraping.challenge import detect_challenge
from mzizi_scraping.links import Link, extract_links
from mzizi_scraping.parse import parse_module, parse_selectors, parse_transform

__all__ = [
    "Link",
    "challenge",
    "detect_challenge",
    "extract",
    "extract_links",
    "parse_module",
    "parse_selectors",
    "parse_transform",
    "selectors",
    "transforms",
]
__version__ = "0.1.0"
