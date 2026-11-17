"""Extract the saved HTML pages of a site into the same document folders PDFs get: Markdown, tables as CSV, images referenced.

The crawler keeps each page as `<name>.html` and records its address in the site's `state.json`; that address is the base for
the page's links. Text that repeats across the pages of one site (menus, footers) is learned and left out."""

from __future__ import annotations

import json
from pathlib import Path

from mzizi_extraction.document import DocumentOutput, encode_document, extract_html_document, learn_boilerplate
from mzizi_extraction.document.boilerplate import Boilerplate
from mzizi_extraction.document.wire import DocumentWire


def page_urls(site: Path) -> dict[str, str]:
    """Saved page file name -> the address it was fetched from, read from the site's state.json."""
    if not (site / "state.json").is_file():
        return {}
    state = json.loads((site / "state.json").read_text(encoding="utf-8"))
    return {Path(entry["html_file"]).name: entry["url"] for entry in state.values() if entry.get("html_file")}


def learn(pages: list[str]) -> Boilerplate:
    return learn_boilerplate(pages)


def extract_page(html: str, url: str, boilerplate: Boilerplate) -> tuple[DocumentOutput, DocumentWire, str]:
    output, title, _removed = extract_html_document(html, url, boilerplate)
    return output, encode_document(output), title
