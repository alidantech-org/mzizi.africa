"""Typed contracts for page fingerprints and the understanding of a change between two visits."""

from __future__ import annotations

from mzizi_scraping.core import Frozen

MAIN_BLOCK = "(page)"


class Fingerprint(Frozen):
    """Layered hashes of one visit, cheapest first. Only `text`, `links` and `blocks` decide whether a page changed."""

    raw: str  # exact bytes
    dom: str  # normalised structure and text, page chrome and noise removed
    text: str  # main text
    links: str  # the set of outgoing links
    blocks: dict[str, str]  # heading -> hash of that section's text
    link_set: tuple[str, ...]


class Change(Frozen):
    """What differs between two fingerprints, ignoring blocks known to change on every visit."""

    meaningful: bool
    raw_only: bool  # bytes differ, nothing that matters does
    added_blocks: tuple[str, ...] = ()
    removed_blocks: tuple[str, ...] = ()
    changed_blocks: tuple[str, ...] = ()
    links_added: tuple[str, ...] = ()
    links_removed: tuple[str, ...] = ()
    ignored_volatile: tuple[str, ...] = ()
