"""Deterministic scraping building blocks. No source knowledge lives here: selectors, fields and transforms come from manifests."""

from mzizi_browser.shared.pagination import detect_pagination, needs_browser
from mzizi_crawler.shared.scraping import challenge, extract, selectors, transforms
from mzizi_crawler.shared.scraping.challenge import detect_challenge
from mzizi_crawler.shared.scraping.change import Change, Fingerprint, compare, fingerprint
from mzizi_crawler.shared.scraping.core import JsonValue
from mzizi_crawler.shared.scraping.extract import (
    ModuleSpec,
    discover_items,
    extract_item,
    next_page_url,
)
from mzizi_crawler.shared.scraping.links import (
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
from mzizi_crawler.shared.scraping.parse import (
    parse_module,
    parse_selectors,
    parse_transform,
)
from mzizi_crawler.shared.scraping.profile import (
    FamilyReport,
    PageInput,
    SiteProfile,
    build_profile,
    compare_profiles,
)
from mzizi_crawler.shared.scraping.rank import (
    ExpectationMap,
    FileFeatures,
    RankingRules,
    rank_file,
)
from mzizi_crawler.shared.scraping.selectors import CssSelector, select

__all__ = [
    "Change",
    "CssSelector",
    "ExpectationMap",
    "FamilyReport",
    "FileFeatures",
    "Fingerprint",
    "JsonValue",
    "Link",
    "ModuleSpec",
    "PageInput",
    "PageMeta",
    "RankingRules",
    "Reference",
    "SiteProfile",
    "SitemapContent",
    "build_profile",
    "challenge",
    "compare",
    "compare_profiles",
    "detect_challenge",
    "detect_pagination",
    "discover_items",
    "extract",
    "extract_item",
    "extract_links",
    "extract_references",
    "fingerprint",
    "needs_browser",
    "next_page_url",
    "page_meta",
    "parse_module",
    "parse_selectors",
    "parse_sitemap",
    "parse_transform",
    "rank_file",
    "select",
    "selectors",
    "sitemaps_from_robots",
    "transforms",
]
__version__ = "0.1.0"
