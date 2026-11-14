"""Readable, deterministic names for everything the engine writes: the same input always gives the same name.

No random or numbered names. A page is named after its URL path, a file after the best label found for it (server
file name, URL file name, link text, alt text, nearest heading), a table after its caption or heading.
"""

from __future__ import annotations

import unicodedata
from pathlib import PurePosixPath
from urllib.parse import unquote, urlparse

from pydantic import BaseModel, ConfigDict

from mzizi_fetch.web.vocabulary import vocabulary

MAX_SLUG = 80
HASH_CHARS = 8
MIN_DESCRIPTIVE_WORDS = 3
INDEX = "index"
FALLBACK = "item"


class Labels(BaseModel):
    """What is known about where a file came from; every field may be empty. Earlier fields are preferred."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    content_disposition: str = ""
    anchor_text: str = ""
    alt_text: str = ""
    title: str = ""
    heading: str = ""
    css_context: str = ""


def slug(text: str, max_len: int = MAX_SLUG) -> str:
    """Lower case, unicode letters and digits kept, everything else one `-`; never empty."""
    folded = unicodedata.normalize("NFC", text).lower()
    out: list[str] = []
    for char in folded:
        if char.isalnum():
            out.append(char)
        elif out and out[-1] != "-":
            out.append("-")
    return "".join(out).strip("-")[:max_len].rstrip("-") or FALLBACK


def short(digest: str) -> str:
    return digest[:HASH_CHARS]


def _stem_and_ext(name: str) -> tuple[str, str]:
    path = PurePosixPath(unquote(name))
    return path.stem, path.suffix.lstrip(".").lower()


def is_generic(stem: str) -> bool:
    """Too vague to label a file: empty, all digits, one or two characters, or listed as generic in the vocabulary."""
    cleaned = slug(stem, 40) if stem else ""
    return not stem or cleaned.replace("-", "").isdigit() or len(cleaned) <= 2 or cleaned in vocabulary().generic_file_stems


def _words(text: str) -> int:
    return len([w for w in slug(text, 200).split("-") if w])


def file_name(url: str, digest: str, labels: Labels, extension: str = "") -> str:
    """`<label>--<sha8>.<ext>`: the first usable label wins (server name, URL name, link text, alt, title, heading)."""
    url_stem, url_ext = _stem_and_ext(urlparse(url).path)
    server_stem, server_ext = _stem_and_ext(labels.content_disposition) if labels.content_disposition else ("", "")
    ext = (extension or server_ext or url_ext).lower()
    link_text = labels.anchor_text or labels.alt_text
    describes_more = bool(link_text) and _words(link_text) >= MIN_DESCRIPTIVE_WORDS and _words(link_text) > _words(url_stem)
    candidates = [
        server_stem,
        link_text if describes_more else "",  # a descriptive link text beats a terse file name
        url_stem,
        link_text,
        labels.title,
        labels.heading,
        labels.css_context,
    ]
    chosen = next((c for c in candidates if c and not is_generic(c)), url_stem or FALLBACK)
    return f"{slug(chosen, MAX_SLUG - HASH_CHARS - 3)}--{short(digest)}{'.' + ext if ext else ''}"


def table_name(page_slug: str, caption: str, heading: str, label: str, index: int) -> str:
    """`<page>--<caption|heading|label|table-N>.csv`."""
    best = next((c for c in (caption, heading, label) if c.strip()), f"table-{index}")
    return f"{slug(page_slug, 30)}--{slug(best, 45)}.csv"


def page_slug(path: str, query: str = "") -> str:
    """The last path segment (`/news/2024/open-day/` is `open-day`), `index` for the root; a query is kept as a suffix."""
    segments = [s for s in unquote(path).split("/") if s]
    last = segments[-1] if segments else INDEX
    stem = PurePosixPath(last).stem if PurePosixPath(last).suffix in (".html", ".htm", ".php", ".asp", ".aspx") else last
    base = slug(stem, 60)
    return f"{base}--{slug(query, 20)}" if query else base
