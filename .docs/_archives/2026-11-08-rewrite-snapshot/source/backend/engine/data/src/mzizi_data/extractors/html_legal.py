"""HTML legal text to paragraph segments with pinpoint locators (heading path, article, clause).

Each paragraph or list item becomes a `text` segment whose locator carries the heading path above it,
the current article number (a line such as "12. Freedom of expression") and a clause marker such as
(1), (a) or (iv). Nothing is rewritten; numbering that cannot be read is left out of the locator.
"""
from __future__ import annotations

import json
import re

from bs4 import BeautifulSoup

from . import Extractor, Output, register

ARTICLE = re.compile(r"^(\d+[A-Z]?)\.\s+(\S.*)$")
CLAUSE = re.compile(r"^\(([0-9]+|[a-z]|[ivxlc]+)\)\s+")
HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"]


def run(data: bytes, profile: str | None) -> Output:
    try:
        soup = BeautifulSoup(data.decode("utf-8", errors="replace"), "lxml")
    except Exception as error:
        return Output("failed", diagnostics=[{"level": "error", "code": "unreadable_html", "message": str(error)[:200]}])
    for tag in soup(["script", "style", "nav", "header", "footer"]):
        tag.decompose()
    root = soup.body or soup
    path: list[tuple[int, str]] = []
    article: str | None = None
    segments: list[dict] = []
    diagnostics: list[dict] = []
    for element in root.find_all([*HEADINGS, "p", "li"]):
        text = re.sub(r"\s+", " ", element.get_text(" ", strip=True))
        if not text:
            continue
        if element.name in HEADINGS:
            level = int(element.name[1])
            path = [(lv, t) for lv, t in path if lv < level] + [(level, text)]
            match = ARTICLE.match(text)
            article = match.group(1) if match else None
            continue
        match = ARTICLE.match(text)
        if match:
            article = match.group(1)
        clause = CLAUSE.match(text)
        locator = {"path": [t for _, t in path], "article": article, "clause": f"({clause.group(1)})" if clause else None}
        segments.append({"key": f"s{len(segments) + 1}", "kind": "text", "locator": json.dumps(locator, ensure_ascii=False, sort_keys=True), "content": json.dumps({"text": text}, ensure_ascii=False), "confidence": 1})
    if not segments:
        return Output("failed", diagnostics=[{"level": "error", "code": "no_text", "message": "no paragraphs or list items found"}])
    numbered = sum(1 for s in segments if json.loads(s["locator"])["article"])
    diagnostics.append({"level": "info", "code": "segments", "message": f"{len(segments)} paragraphs, {numbered} under a numbered article"})
    if numbered == 0:
        diagnostics.append({"level": "warning", "code": "no_article_numbering", "message": "no numbered articles were recognised; locators carry the heading path only"})
    return Output("succeeded", segments, diagnostics)


EXTRACTOR = register(Extractor("html-legal", "0.1.0", run))
