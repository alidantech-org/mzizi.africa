"""HTML backend: a web page becomes the same structured `Page` a PDF does, without headers, footers and navigation."""

from __future__ import annotations

from urllib.parse import unquote, urljoin, urlsplit

from bs4 import BeautifulSoup, Comment, Doctype, NavigableString, Tag

from mzizi_extraction.core import Status
from mzizi_extraction.document.boilerplate import Boilerplate, fingerprint, is_landmark
from mzizi_extraction.document.html_css_images import inline_background_images
from mzizi_extraction.document.html_tables import table_grid
from mzizi_extraction.document.lines import merge_spans
from mzizi_extraction.document.markdown import render_spans
from mzizi_extraction.document.models import (
    Block,
    DocumentOutput,
    FigureBlock,
    Heading,
    ListItem,
    Page,
    Paragraph,
    Span,
    TableBlock,
)

SKIPPED_TAGS = ("head", "script", "style", "noscript", "template", "svg", "iframe", "canvas")
HEADINGS = ("h1", "h2", "h3", "h4", "h5", "h6")
BLOCK_TAGS = (
    *HEADINGS,
    "p",
    "div",
    "section",
    "article",
    "main",
    "ul",
    "ol",
    "li",
    "table",
    "figure",
    "pre",
    "blockquote",
    "form",
    "header",
    "footer",
    "nav",
    "aside",
    "details",
    "dl",
    "dt",
    "dd",
    "tr",
    "hr",
    "img",
    "picture",
)
BOLD_TAGS = ("strong", "b")
ITALIC_TAGS = ("em", "i", "cite")
ZERO_BBOX = (0.0, 0.0, 0.0, 0.0)
MAX_HEADING_CHARS = 300


class _Walker:
    def __init__(self, base_url: str, boilerplate: Boilerplate, include_css_images: bool) -> None:
        self.base_url = base_url
        self.boilerplate = boilerplate
        self.include_css_images = include_css_images
        self.blocks: list[Block] = []
        self.removed = 0

    # --- filtering -------------------------------------------------------------------------------------------
    def skipped(self, element: Tag) -> bool:
        if element.name in SKIPPED_TAGS or element.has_attr("hidden") or element.get("aria-hidden") == "true":
            return True
        if "display:none" in str(element.get("style", "")).replace(" ", "").lower():
            return True
        if is_landmark(element):
            self.removed += 1
            return True
        key = fingerprint(element) if element.name in ("div", "section", "ul", "ol", "form", "table") else None
        if key and key in self.boilerplate.fingerprints:
            self.removed += 1
            return True
        return False

    # --- inline ----------------------------------------------------------------------------------------------
    def inline(
        self, node: Tag | NavigableString, bold: bool = False, italic: bool = False, href: str | None = None
    ) -> list[Span]:
        if isinstance(node, Comment | Doctype):
            return []
        if isinstance(node, NavigableString):
            raw = str(node)
            core = " ".join(raw.split())
            if not core:
                text = " " if raw else ""
            else:
                text = (" " if raw[:1].isspace() else "") + core + (" " if raw[-1:].isspace() else "")
            return [Span(text=text, bold=bold, italic=italic, href=href)] if text else []
        if node.name in SKIPPED_TAGS or node.name == "br":
            return [Span(text=" ")] if node.name == "br" else []
        bold = bold or node.name in BOLD_TAGS
        italic = italic or node.name in ITALIC_TAGS
        if node.name == "a" and isinstance(node.get("href"), str):
            href = urljoin(self.base_url, str(node["href"]))
        spans: list[Span] = []
        for child in node.children:
            if isinstance(child, Tag | NavigableString):
                spans.extend(self.inline(child, bold, italic, href))
        return spans

    # --- blocks ----------------------------------------------------------------------------------------------
    def flush(self, spans: list[Span]) -> None:
        merged = merge_spans(spans)
        if merged and "".join(s.text for s in merged).strip():
            self.blocks.append(Paragraph(spans=_trim(merged), page=1, bbox=ZERO_BBOX))
        spans.clear()

    def walk(self, element: Tag) -> None:
        buffer: list[Span] = []
        for child in element.children:
            if isinstance(child, NavigableString):
                buffer.extend(self.inline(child))
                continue
            if not isinstance(child, Tag):
                continue
            if self.skipped(child):
                continue
            if child.name == "a" and child.find("img") is not None:
                href = child.get("href")
                if isinstance(href, str):
                    target = urljoin(self.base_url, href)
                    label = child.get_text(" ", strip=True) or str(
                        child.get("aria-label")
                        or child.get("title")
                        or unquote(urlsplit(target).path.rsplit("/", 1)[-1])
                    )
                    buffer.append(Span(text=label or target, href=target))
            style = child.get("style")
            if self.include_css_images and isinstance(style, str):
                for asset in inline_background_images(style, self.base_url):
                    self.flush(buffer)
                    self.blocks.append(
                        FigureBlock(
                            asset=asset,
                            figure_kind="image",
                            alt=str(child.get("aria-label") or ""),
                            page=1,
                            bbox=ZERO_BBOX,
                        )
                    )
            if child.name not in BLOCK_TAGS:
                if child.find(BLOCK_TAGS):
                    self.flush(buffer)
                    self.walk(child)
                else:
                    buffer.extend(self.inline(child))
                continue
            self.flush(buffer)
            self.block(child)
        self.flush(buffer)

    def block(self, element: Tag) -> None:
        name = element.name
        if name in HEADINGS:
            spans = _trim(merge_spans([Span(text=s.text, italic=s.italic, href=s.href) for s in self.inline(element)]))
            text = "".join(s.text for s in spans).strip()
            if text and len(text) <= MAX_HEADING_CHARS:
                self.blocks.append(Heading(level=int(name[1]), spans=spans, page=1, bbox=ZERO_BBOX))
        elif name in ("ul", "ol"):
            self.list(element, ordered=name == "ol")
        elif name == "table":
            self.table(element)
        elif name in ("img", "picture"):
            self.image(element)
        elif name == "figure":
            image = element.find("img")
            caption = element.find("figcaption")
            if isinstance(image, Tag):
                self.image(image, caption.get_text(" ", strip=True) if isinstance(caption, Tag) else None)
            else:
                self.walk(element)
        elif name == "hr":
            return
        elif name == "pre":
            text = element.get_text()
            if text.strip():
                self.blocks.append(Paragraph(spans=(Span(text=text.strip()),), page=1, bbox=ZERO_BBOX))
        elif element.find(BLOCK_TAGS):
            self.walk(element)
        else:
            self.flush(self.inline(element))

    def list(self, element: Tag, ordered: bool) -> None:
        number = 0
        for item in element.find_all("li", recursive=False):
            if self.skipped(item):
                continue
            number += 1
            nested = item.find(["ul", "ol"])
            inline_spans: list[Span] = []
            for child in item.children:
                if isinstance(child, Tag) and child.name in ("ul", "ol"):
                    continue
                if isinstance(child, Tag | NavigableString):
                    inline_spans.extend(self.inline(child))
            spans = _trim(merge_spans(inline_spans))
            if spans and "".join(s.text for s in spans).strip():
                marker = f"{number}." if ordered else "-"
                self.blocks.append(ListItem(ordered=ordered, marker=marker, spans=spans, page=1, bbox=ZERO_BBOX))
            if isinstance(nested, Tag):
                self.list(nested, ordered=nested.name == "ol")

    def cell(self, element: Tag) -> str:
        """A table cell as inline Markdown, so links and emphasis inside tables keep their meaning."""
        spans = _trim(
            merge_spans(
                [
                    s
                    for child in element.children
                    if isinstance(child, Tag | NavigableString)
                    for s in self.inline(child)
                ]
            )
        )
        rendered = render_spans(spans).replace("\n", " ")
        visible_links = {span.href for span in spans if span.href is not None}
        links: list[str] = []
        for anchor in element.select("a[href]"):
            try:
                href = urljoin(self.base_url, str(anchor["href"]))
                parts = urlsplit(href)
            except ValueError:
                continue
            if href in visible_links or parts.scheme not in ("http", "https"):
                continue
            filename = unquote(parts.path.rstrip("/").rsplit("/", 1)[-1])
            label = str(anchor.get("aria-label") or anchor.get("title") or filename or parts.netloc)
            links.append(render_spans((Span(text=label, href=href),)))
            visible_links.add(href)
        return " ".join(part for part in (rendered, *links) if part)

    def table(self, element: Tag) -> None:
        rows, headers, cells = table_grid(element, self.cell)
        if rows and cells and any(any(row) for row in rows):
            self.blocks.append(
                TableBlock(
                    index=sum(isinstance(b, TableBlock) for b in self.blocks) + 1,
                    rows=rows,
                    header_rows=headers,
                    cells=cells,
                    page=1,
                    bbox=ZERO_BBOX,
                )
            )

    def image(self, element: Tag, caption: str | None = None) -> None:
        image = element if element.name == "img" else element.find("img")
        if not isinstance(image, Tag) or not isinstance(image.get("src"), str):
            return
        self.blocks.append(
            FigureBlock(
                asset=urljoin(self.base_url, str(image["src"])),
                figure_kind="image",
                alt=str(image.get("alt") or ""),
                caption=caption,
                page=1,
                bbox=ZERO_BBOX,
            )
        )


def _trim(spans: tuple[Span, ...]) -> tuple[Span, ...]:
    items = list(spans)
    if items:
        items[0] = items[0].model_copy(update={"text": items[0].text.lstrip()})
        items[-1] = items[-1].model_copy(update={"text": items[-1].text.rstrip()})
    return tuple(s for s in items if s.text)


def _main(soup: BeautifulSoup) -> Tag:
    # Recovery parsers can preserve multiple body elements from malformed publisher HTML.
    # Walk the complete document so a later body is not lost behind an empty first one.
    if len(soup.find_all("body", limit=2)) > 1:
        return soup
    for selector in ("main", "[role=main]"):
        found = soup.select_one(selector)
        if found is not None:
            return found
    articles = [a for a in soup.find_all("article") if isinstance(a, Tag)]
    if len(articles) == 1:
        return articles[0]
    return soup.body if soup.body is not None else soup


def extract_html_document(
    html: str, base_url: str, boilerplate: Boilerplate | None = None, *, include_css_images: bool = False
) -> tuple[DocumentOutput, str, int]:
    """The page's main content as structured blocks, its title, and how many chrome blocks were left out."""
    soup = BeautifulSoup(html, "lxml")
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    walker = _Walker(base_url, boilerplate or Boilerplate(), include_css_images)
    walker.walk(_main(soup))
    page = Page(number=1, width=0.0, height=0.0, blocks=tuple(walker.blocks))
    status = Status.SUCCEEDED if walker.blocks else Status.FAILED
    return DocumentOutput(status=status, pages=(page,)), title, walker.removed
