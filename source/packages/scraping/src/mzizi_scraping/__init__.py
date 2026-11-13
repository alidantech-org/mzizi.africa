"""Deterministic scraping building blocks. No source knowledge lives here: selectors, fields and transforms come from manifests."""

from . import challenge, extract, selectors, transforms
from .challenge import detect_challenge
from .links import Link, extract_links
from .parse import parse_module, parse_selectors, parse_transform

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
