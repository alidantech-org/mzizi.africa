"""Deterministic scraping building blocks. No source knowledge lives here: selectors, fields and transforms come from manifests."""
from . import extract, selectors, transforms
from .links import Link, extract_links

__all__ = ["Link", "extract", "extract_links", "selectors", "transforms"]
__version__ = "0.1.0"
