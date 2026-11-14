"""Typed contracts for site profiles and family comparisons."""

from __future__ import annotations

from mzizi_scraping.core import Frozen


class PageInput(Frozen):
    url: str
    title: str
    html: str


class Section(Frozen):
    segment: str
    pages: int
    sample_titles: tuple[str, ...]
    sample_urls: tuple[str, ...]


class RepeatedBlock(Frozen):
    """A repeated sibling structure inside a page: a candidate `discover.listing.items` selector."""

    selector: str
    repeats: int
    example_text: str


class Template(Frozen):
    signature: str
    pages: int
    example_urls: tuple[str, ...]
    repeated_blocks: tuple[RepeatedBlock, ...]


class SiteProfile(Frozen):
    host: str
    pages: int
    generator: str
    title_suffix: str
    nav_labels: tuple[str, ...]
    sections: tuple[Section, ...]
    templates: tuple[Template, ...]
    pagination_hints: tuple[str, ...]
    document_extensions: dict[str, int]


class FamilyReport(Frozen):
    left: str
    right: str
    score: float
    host_variable: str
    shared_sections: tuple[str, ...]
    left_only_sections: tuple[str, ...]
    right_only_sections: tuple[str, ...]
    shared_nav_labels: tuple[str, ...]
    shared_template_signatures: tuple[str, ...]
    same_generator: bool
    section_similarity: float
    nav_similarity: float
    template_similarity: float
    verdict: str
