"""Pagination of a listing: the typed spec and the rule that turns one page into the address of the next."""

from __future__ import annotations

from enum import StrEnum
from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlunparse

from bs4 import Tag

from mzizi_scraping.core import External
from mzizi_scraping.selectors import Content, Selector, select

HARD_PAGE_LIMIT = 1000
DEFAULT_START = 1


class PaginationType(StrEnum):
    QUERY = "query"
    PATH = "path"
    NEXT_LINK = "next_link"
    NONE = "none"


class StopWhen(StrEnum):
    EMPTY_ITEMS = "empty_items"
    NO_NEXT = "no_next"
    MAX_PAGES = "max_pages"


class Pagination(External):
    type: PaginationType = PaginationType.NONE
    param: str | None = None
    start: int = DEFAULT_START
    max_pages: int | None = None
    next: list[Selector] | Selector | None = None
    stop_when: StopWhen | None = None

    @property
    def page_limit(self) -> int:
        return min(self.max_pages or HARD_PAGE_LIMIT, HARD_PAGE_LIMIT)

    def stops_on_empty(self) -> bool:
        return self.stop_when in (None, StopWhen.EMPTY_ITEMS)


def _with_query(url: str, param: str, number: int) -> str:
    parts = urlparse(url)
    query = [(key, value) for key, value in parse_qsl(parts.query, keep_blank_values=True) if key != param]
    query.append((param, str(number)))
    return urlunparse(parts._replace(query=urlencode(query)))


def _with_path(url: str, param: str | None, number: int) -> str:
    parts = urlparse(url)
    segments = [segment for segment in parts.path.split("/") if segment]
    if param and param in segments:
        segments = segments[: segments.index(param)]
    segments.extend([param, str(number)] if param else [str(number)])
    return urlunparse(parts._replace(path="/" + "/".join(segments)))


def _next_href(spec: Pagination, html: Content, current_url: str) -> str | None:
    if spec.next is None:
        return None
    for item in select(html, spec.next).items:
        anchor = item if isinstance(item, Tag) else None
        if anchor is not None and anchor.name != "a":
            anchor = anchor.find("a") if isinstance(anchor.find("a"), Tag) else None
        href = anchor.get("href") if anchor is not None else item if isinstance(item, str) else None
        if isinstance(href, str) and href.strip():
            return urljoin(current_url, href.strip())
    return None


def next_page_url(spec: Pagination, current_url: str, current_number: int, html: Content) -> str | None:
    """Address of the page after `current_number`, or None when the listing offers no further page by this rule."""
    number = current_number + 1
    if spec.type is PaginationType.QUERY and spec.param:
        return _with_query(current_url, spec.param, number)
    if spec.type is PaginationType.PATH:
        return _with_path(current_url, spec.param, number)
    if spec.type is PaginationType.NEXT_LINK:
        return _next_href(spec, html, current_url)
    return None
