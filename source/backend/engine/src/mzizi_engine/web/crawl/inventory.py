"""Turns a finished (or stopped) crawl into Markdown files and the separate inventories, written as CSV/JSON/JSONL."""

from __future__ import annotations

import json
from collections import defaultdict

from pydantic import BaseModel

from mzizi_engine.jsonvalue import JsonValue
from mzizi_engine.web.crawl.engine import Crawl
from mzizi_engine.web.crawl.state import save_state
from mzizi_engine.web.export import columns_of, site_tree, write_table
from mzizi_engine.web.records import (
    ErrorRecord,
    ExternalRecord,
    LinkRecord,
    PageRecord,
    PathRecord,
    Record,
    ResourceRecord,
    Scope,
)
from mzizi_extraction import extract_html_document, learn_boilerplate
from mzizi_extraction.document import render_markdown
from mzizi_fetch.web.urls import UrlKind

IMAGE, MEDIA_KINDS = UrlKind.IMAGE.value, (UrlKind.MEDIA.value, UrlKind.EMBED.value)
DOCUMENT = UrlKind.DOCUMENT.value
OTHER_FILES = (UrlKind.DATA.value, UrlKind.ARCHIVE.value, UrlKind.PROGRAM.value)


class CrawlSummary(Record):
    start_urls: tuple[str, ...]
    pages: int
    internal_paths: int
    links: int
    external_hosts: int
    images: int
    documents: int
    files: int
    media: int
    errors: int
    blocked: int
    stopped: str
    complete: bool
    files_written: tuple[str, ...]


def write_markdown(crawl: Crawl) -> list[PageRecord]:
    folder = crawl.out_dir / "markdown"
    folder.mkdir(exist_ok=True)
    boilerplate = learn_boilerplate(list(crawl.html.values()))
    updated: list[PageRecord] = []
    for page in crawl.pages:
        output, _title, removed = extract_html_document(crawl.html[page.n], page.final_url, boilerplate)
        name = f"markdown/{page.n:04d}.md"
        body = render_markdown(output.pages).replace("<!-- page 1 -->\n\n", "", 1)
        head = f"---\nurl: {page.final_url}\ntitle: {json.dumps(page.title, ensure_ascii=False)}\n---\n\n"
        (crawl.out_dir / name).write_text(head + body, encoding="utf-8")
        updated.append(page.model_copy(update={"markdown_file": name, "chrome_removed": removed}))
    return updated


def _externals(links: list[LinkRecord]) -> list[ExternalRecord]:
    groups: dict[str, list[LinkRecord]] = defaultdict(list)
    for link in links:
        if link.scope is Scope.EXTERNAL and link.kind not in (UrlKind.MAIL.value, UrlKind.PHONE.value) and link.host:
            groups[link.host].append(link)
    return [
        ExternalRecord(
            host=host, links=len(items), pages=len({i.source_page for i in items}), sample_url=items[0].original_url
        )
        for host, items in sorted(groups.items(), key=lambda kv: (-len(kv[1]), kv[0]))
    ]


def _paths(pages: list[PageRecord], links: list[LinkRecord]) -> list[PathRecord]:
    seen: dict[str, PathRecord] = {}
    for page in pages:
        seen[page.path] = PathRecord(path=page.path, pages=1, first_seen_on=page.source_page or "start")
    for link in links:
        if link.scope is Scope.INTERNAL and link.kind == UrlKind.PAGE.value and link.path and link.path not in seen:
            seen[link.path] = PathRecord(path=link.path, pages=0, first_seen_on=link.source_page)
    return sorted(seen.values(), key=lambda r: r.path)


def _unique(resources: list[ResourceRecord]) -> list[ResourceRecord]:
    first: dict[str, ResourceRecord] = {}
    for record in resources:
        first.setdefault(record.normalized_url, record)
    return list(first.values())


def export(crawl: Crawl, pages: list[PageRecord], complete: bool) -> CrawlSummary:
    out, formats = crawl.out_dir, crawl.request.formats
    links = crawl.links
    resources = _unique(crawl.resources)
    externals, paths = _externals(links), _paths(pages, links)
    errors = [e for e in crawl.errors if e.stage != "block"]
    written: list[str] = []

    def table(
        name: str,
        records: list[PageRecord]
        | list[LinkRecord]
        | list[ResourceRecord]
        | list[ExternalRecord]
        | list[PathRecord]
        | list[ErrorRecord],
        model: type[BaseModel],
    ) -> None:
        written.extend(write_table(out, name, records, columns_of(model), formats, ordered=name == "pages"))

    table("pages", pages, PageRecord)
    table("paths", paths, PathRecord)
    table("links", links, LinkRecord)
    table("internal_urls", [r for r in links if r.scope is Scope.INTERNAL], LinkRecord)
    table("external_urls", [r for r in links if r.scope is Scope.EXTERNAL], LinkRecord)
    table("external_hosts", externals, ExternalRecord)
    table("images", [r for r in resources if r.kind == IMAGE], ResourceRecord)
    table("documents", [r for r in resources if r.kind == DOCUMENT], ResourceRecord)
    table("files", [r for r in resources if r.kind in OTHER_FILES], ResourceRecord)
    table("media", [r for r in resources if r.kind in MEDIA_KINDS], ResourceRecord)
    table("errors", errors, ErrorRecord)
    decisions = crawl.client.blocks.decisions
    (out / "blocks.json").write_text(
        json.dumps([d.model_dump(mode="json") for d in decisions], indent=2), encoding="utf-8"
    )
    (out / "policy_audit.json").write_text(
        json.dumps([d.model_dump(mode="json") for d in crawl.client.audit], indent=2), encoding="utf-8"
    )
    (out / "provenance.jsonl").write_text(
        "".join(p.model_dump_json() + "\n" for p in crawl.client.provenance), encoding="utf-8"
    )
    tree: dict[str, JsonValue] = site_tree([p.path for p in paths])
    (out / "site_tree.json").write_text(json.dumps(tree, indent=2, ensure_ascii=False), encoding="utf-8")
    written += ["blocks.json", "policy_audit.json", "provenance.jsonl", "site_tree.json"]
    summary = CrawlSummary(
        start_urls=crawl.request.starts,
        pages=len(pages),
        internal_paths=len(paths),
        links=len(links),
        external_hosts=len(externals),
        images=sum(r.kind == IMAGE for r in resources),
        documents=sum(r.kind == DOCUMENT for r in resources),
        files=sum(r.kind in OTHER_FILES for r in resources),
        media=sum(r.kind in MEDIA_KINDS for r in resources),
        errors=len(errors),
        blocked=len(decisions),
        stopped=crawl.stopped,
        complete=complete,
        files_written=tuple(written),
    )
    (out / "summary.json").write_text(summary.model_dump_json(indent=2), encoding="utf-8")
    save_state(out, crawl.snapshot(complete))
    return summary


def finish(crawl: Crawl) -> CrawlSummary:
    pages = write_markdown(crawl) if crawl.request.markdown and crawl.html else list(crawl.pages)
    complete = not crawl.frontier and not crawl.stopped
    return export(crawl, pages, complete)
