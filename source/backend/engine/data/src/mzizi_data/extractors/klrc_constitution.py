"""One article page of the Constitution of Kenya on the Kenya Law Reform Commission site to a single `text` segment.

The page's headline gives the article number and title, the category gives the chapter, and the article body is kept
verbatim, paragraph by paragraph. Category listing pages (no article body) yield nothing and the run is `failed`.
"""
from __future__ import annotations

import json
import re

from lxml import html

from . import Extractor, Output, register

CHAPTERS = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18}


def run(data: bytes, profile: str | None) -> Output:
    try:
        tree = html.fromstring(data)
    except Exception as error:  # noqa: BLE001
        return Output("failed", diagnostics=[{"level": "error", "code": "not_html", "message": str(error)[:200]}])
    headline = tree.xpath('//*[@itemprop="headline"]')
    body = tree.xpath('//*[@itemprop="articleBody"]')
    if not headline or not body:
        return Output("failed", diagnostics=[{"level": "error", "code": "no_article", "message": "not an article page"}])
    title = " ".join(headline[0].text_content().split())
    paragraphs = [" ".join(p.text_content().split()) for p in body[0].xpath(".//p|.//li|.//h3|.//h4")]
    paragraphs = [p for p in paragraphs if p]
    if not paragraphs:
        return Output("failed", diagnostics=[{"level": "error", "code": "empty", "message": f"{title}: no text"}])
    category = " ".join((tree.xpath('//span[contains(@class,"category-name")]/@title') or [""])[0].replace("Category:", "").split())
    chapter = re.match(r"Chapter (\w+)", category)
    number = re.match(r"(?:Article\s+)?(\d+[A-Z]?)\.\s*(.*)", title)
    kind = "article" if number else "schedule" if "schedule" in title.lower() else "preamble" if "preamble" in title.lower() else "section"
    content = {"title": title, "number": number.group(1) if number else None, "heading": number.group(2).strip() if number else title, "kind": kind, "category": category, "chapter": CHAPTERS.get(chapter.group(1).lower()) if chapter else None, "text": "\n".join(paragraphs)}
    return Output("succeeded", [{"key": "article", "kind": "text", "locator": json.dumps({"title": title}), "content": json.dumps(content, ensure_ascii=False), "confidence": 1}], [{"level": "info", "code": "article_read", "message": f"{title}: {len(paragraphs)} paragraphs"}])


EXTRACTOR = register(Extractor("klrc-constitution", "0.1.0", run))
