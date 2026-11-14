"""Typed findings about how a page paginates."""

from __future__ import annotations

from enum import StrEnum

from mzizi_scraping.core import Frozen


class ControlKind(StrEnum):
    LINK = "link"  # an anchor with a real address: followed like any link
    BUTTON = "button"  # a control without an address (a single-page app): clicked
    LOAD_MORE = "load_more"  # a button that appends more items to the same page


class Control(Frozen):
    kind: ControlKind
    label: str
    selector: str  # how a browser finds it again (a CSS selector)
    url: str = ""  # for links
    enabled: bool = True
    how: str = ""  # what identified it: rel, aria-label, label text, class, number


class Findings(Frozen):
    next: Control | None = None
    load_more: Control | None = None
    numbered: tuple[Control, ...] = ()  # the page-number controls on show
    current: int | None = None
    last: int | None = None
    url_template: str = ""  # `https://site/list?page={n}` when numbered links reveal the pattern
    infinite_scroll: bool = False
    evidence: tuple[str, ...] = ()

    @property
    def paginated(self) -> bool:
        return bool(self.next or self.load_more or self.numbered or self.infinite_scroll or self.url_template)
