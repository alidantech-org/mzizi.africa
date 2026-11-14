"""Fingerprints of a page that survive nonces, scripts, tracking markup and page chrome, and the comparison of two."""

from __future__ import annotations

import hashlib
from urllib.parse import urldefrag, urljoin

from bs4 import BeautifulSoup, Comment, Tag

from mzizi_scraping.change.models import MAIN_BLOCK, Change, Fingerprint

NOISE_TAGS = ("script", "style", "noscript", "template", "svg", "iframe")
CHROME_TAGS = ("header", "nav", "footer", "aside", "form")
HEADINGS = ("h1", "h2", "h3", "h4")


def _sha(text: str | bytes) -> str:
    data = text if isinstance(text, bytes) else text.encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def _clean(soup: BeautifulSoup) -> Tag:
    for comment in soup.find_all(string=lambda node: isinstance(node, Comment)):
        comment.extract()
    for tag in soup.find_all(NOISE_TAGS):
        tag.decompose()
    body = soup.body if isinstance(soup.body, Tag) else soup
    main = body.find("main") or body.find(attrs={"role": "main"}) or body
    main = main if isinstance(main, Tag) else body
    for tag in main.find_all(CHROME_TAGS):
        tag.decompose()
    return main


def _text(node: Tag) -> str:
    return " ".join(node.get_text(" ", strip=True).split())


def _blocks(main: Tag) -> dict[str, str]:
    sections: dict[str, list[str]] = {}
    label = MAIN_BLOCK
    for element in main.descendants:
        if isinstance(element, Tag) and element.name in HEADINGS:
            label = " ".join(element.get_text(" ", strip=True).split()) or MAIN_BLOCK
            sections.setdefault(label, [])
        elif isinstance(element, str) and element.strip():
            if element.parent and element.parent.name in HEADINGS:
                continue
            sections.setdefault(label, []).append(" ".join(element.split()))
    return {name: _sha(" ".join(parts)) for name, parts in sections.items() if parts}


def fingerprint(html: str | bytes, base_url: str) -> Fingerprint:
    raw = html if isinstance(html, bytes) else html.encode("utf-8")
    soup = BeautifulSoup(raw, "lxml")
    main = _clean(soup)
    text = _text(main)
    links = sorted(
        {urldefrag(urljoin(base_url, str(a["href"]).strip()))[0] for a in main.find_all("a", href=True) if a["href"]}
    )
    structure = "".join(tag.name for tag in main.find_all(True))
    return Fingerprint(
        raw=_sha(raw),
        dom=_sha(structure + text),
        text=_sha(text),
        links=_sha("\n".join(links)),
        blocks=_blocks(main),
        link_set=tuple(links),
    )


def compare(before: Fingerprint, after: Fingerprint, volatile: frozenset[str] = frozenset()) -> Change:
    """The meaningful difference between two visits; blocks listed as volatile never count."""
    names = set(before.blocks) | set(after.blocks)
    added = sorted(n for n in names - set(before.blocks) if n not in volatile)
    removed = sorted(n for n in names - set(after.blocks) if n not in volatile)
    changed = sorted(
        n for n in set(before.blocks) & set(after.blocks) if before.blocks[n] != after.blocks[n] and n not in volatile
    )
    ignored = sorted(
        n for n in set(before.blocks) & set(after.blocks) if before.blocks[n] != after.blocks[n] and n in volatile
    )
    links_added = sorted(set(after.link_set) - set(before.link_set))
    links_removed = sorted(set(before.link_set) - set(after.link_set))
    meaningful = bool(added or removed or changed or links_added or links_removed)
    return Change(
        meaningful=meaningful,
        raw_only=not meaningful and before.raw != after.raw,
        added_blocks=tuple(added),
        removed_blocks=tuple(removed),
        changed_blocks=tuple(changed),
        links_added=tuple(links_added),
        links_removed=tuple(links_removed),
        ignored_volatile=tuple(ignored),
    )
