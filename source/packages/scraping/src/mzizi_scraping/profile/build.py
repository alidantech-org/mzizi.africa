"""Site profile: a deterministic summary of a crawled site that a person or agent can turn into a site structure."""

from __future__ import annotations

import hashlib
from collections import Counter, defaultdict
from posixpath import splitext
from urllib.parse import urlparse

from bs4 import BeautifulSoup, Tag

from mzizi_scraping.profile.models import PageInput, RepeatedBlock, Section, SiteProfile, Template

SAMPLES = 3
MIN_REPEATS = 3
MAX_TEMPLATES = 8
SIGNATURE_DEPTH = 2  # coarse on purpose: pages of one layout differ in content, not in their frame
TITLE_SEPARATORS = (" – ", " - ", " | ", " — ")
PAGINATION_QUERY_KEYS = ("page", "paged", "p", "pg")
IGNORED_TAGS = ("script", "style", "noscript", "svg", "link", "meta", "template")
CELL_TAGS = ("td", "th", "p")  # rank below the row or item that contains them
CHROME_TAGS = ("nav", "header", "footer", "head")


def _skeleton(tag: Tag, depth: int) -> str:
    if depth == 0:
        return tag.name
    classes = ".".join(sorted(str(c) for c in (tag.get("class") or []))[:2])
    children = [child for child in tag.find_all(True, recursive=False) if child.name not in IGNORED_TAGS]
    inner = ",".join(sorted({_skeleton(child, depth - 1) for child in children}))
    return f"{tag.name}{'.' + classes if classes else ''}({inner})"


def _signature(soup: BeautifulSoup) -> str:
    body = soup.body
    text = _skeleton(body, SIGNATURE_DEPTH) if isinstance(body, Tag) else ""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]


def _selector_of(tag: Tag) -> str:
    classes = [str(c) for c in (tag.get("class") or [])]
    return f"{tag.name}.{classes[0]}" if classes else tag.name


def _repeated(soup: BeautifulSoup) -> tuple[RepeatedBlock, ...]:
    found: dict[str, RepeatedBlock] = {}
    for parent in soup.find_all(True):
        if parent.name in IGNORED_TAGS or parent.name in CHROME_TAGS:
            continue
        if any(ancestor.name in CHROME_TAGS for ancestor in parent.parents):
            continue
        kids = [child for child in parent.find_all(True, recursive=False)]
        counts = Counter(_selector_of(child) for child in kids)
        for selector, repeats in counts.items():
            if repeats < MIN_REPEATS or selector.split(".")[0] in ("br", "option", "span", "i", "img", *IGNORED_TAGS):
                continue
            example = next(child for child in kids if _selector_of(child) == selector)
            text = " ".join(example.get_text(" ", strip=True).split())[:80]
            if text and (selector not in found or found[selector].repeats < repeats):
                found[selector] = RepeatedBlock(selector=selector, repeats=repeats, example_text=text)
    return tuple(sorted(found.values(), key=lambda block: (block.selector.split(".")[0] in CELL_TAGS, -block.repeats, block.selector))[:5])


def _generator(soup: BeautifulSoup) -> str:
    meta = soup.find("meta", attrs={"name": "generator"})
    return str(meta.get("content")) if isinstance(meta, Tag) and meta.get("content") else ""


def _title_suffix(titles: list[str]) -> str:
    for separator in TITLE_SEPARATORS:
        tails = [title.split(separator, 1)[1] for title in titles if separator in title]
        if tails and len(tails) >= max(2, len(titles) // 2):
            return Counter(tails).most_common(1)[0][0].strip()
    return ""


def _nav_labels(soups: list[BeautifulSoup]) -> tuple[str, ...]:
    counts: Counter[str] = Counter()
    for soup in soups:
        labels = {
            " ".join(anchor.get_text().split())
            for nav in soup.find_all(["nav", "header"])
            for anchor in nav.find_all("a")
            if anchor.get_text(strip=True) and len(anchor.get_text(strip=True)) < 40
        }
        counts.update(labels)
    threshold = max(1, len(soups) // 2)
    return tuple(sorted(label for label, seen in counts.items() if seen >= threshold))


def _pagination_hints(pages: list[PageInput], soups: list[BeautifulSoup]) -> tuple[str, ...]:
    hints: set[str] = set()
    for page, soup in zip(pages, soups, strict=True):
        if soup.find("link", rel="next") or soup.find("a", rel="next"):
            hints.add("rel=next")
        for anchor in soup.find_all("a", href=True):
            parsed = urlparse(str(anchor["href"]))
            keys = [pair.split("=")[0] for pair in parsed.query.split("&") if pair]
            hints.update(f"query:{key}" for key in keys if key in PAGINATION_QUERY_KEYS)
            segments = [s for s in parsed.path.split("/") if s]
            if "page" in segments and segments.index("page") + 1 < len(segments):
                hints.add("path:page/N")
    return tuple(sorted(hints))


def build_profile(pages: list[PageInput], documents: list[str] | None = None) -> SiteProfile:
    soups = [BeautifulSoup(page.html, "lxml") for page in pages]
    host = urlparse(pages[0].url).hostname or "" if pages else ""
    by_segment: dict[str, list[PageInput]] = defaultdict(list)
    for page in pages:
        segments = [s for s in urlparse(page.url).path.split("/") if s]
        by_segment[segments[0] if segments else "(root)"].append(page)
    sections = tuple(
        Section(
            segment=segment,
            pages=len(group),
            sample_titles=tuple(p.title for p in group[:SAMPLES]),
            sample_urls=tuple(p.url for p in group[:SAMPLES]),
        )
        for segment, group in sorted(by_segment.items(), key=lambda item: (-len(item[1]), item[0]))
    )
    grouped: dict[str, list[int]] = defaultdict(list)
    for index, soup in enumerate(soups):
        grouped[_signature(soup)].append(index)
    templates = tuple(
        Template(
            signature=signature,
            pages=len(indexes),
            example_urls=tuple(pages[i].url for i in indexes[:SAMPLES]),
            repeated_blocks=_repeated(soups[indexes[0]]),
        )
        for signature, indexes in sorted(grouped.items(), key=lambda item: (-len(item[1]), item[0]))[:MAX_TEMPLATES]
    )
    extensions = Counter(splitext(urlparse(url).path)[1].lower().lstrip(".") for url in documents or [])
    return SiteProfile(
        host=host,
        pages=len(pages),
        generator=next((g for g in (_generator(s) for s in soups) if g), ""),
        title_suffix=_title_suffix([p.title for p in pages]),
        nav_labels=_nav_labels(soups),
        sections=sections,
        templates=templates,
        pagination_hints=_pagination_hints(pages, soups),
        document_extensions={key or "none": count for key, count in sorted(extensions.items())},
    )
