"""Per-view media and traversal artifacts collected by crawler backends."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

from pydantic import TypeAdapter

from mzizi_engine.web.browser.media import MediaInventory
from mzizi_engine.web.browser.traversal import Action, End, ListingReport
from mzizi_engine.web.records import PageRecord
from mzizi_fetch.web.urls import normalize
from mzizi_scraping.links.discover import Reference

LISTINGS = TypeAdapter(tuple[ListingReport, ...])
MEDIA = TypeAdapter(tuple[MediaInventory, ...])


@dataclass
class CrawlEvidence:
    listings: dict[str, ListingReport] = field(default_factory=dict)
    media: dict[str, MediaInventory] = field(default_factory=dict)

    def references(self, url: str, source: list[Reference]) -> list[Reference]:
        inventory = self.media.get(url)
        if inventory is None:
            return source
        seen = {(ref.tag, ref.url) for ref in source}
        references = list(source)
        for ref in inventory.references:
            key = ("img", ref.url)
            if key not in seen:
                seen.add(key)
                references.append(
                    Reference(url=ref.url, text=ref.label, tag="img", attribute=ref.kind, heading=ref.label)
                )
        return references

    def resolved(self, pages: list[PageRecord]) -> tuple[ListingReport, ...]:
        saved = {page.final_url for page in pages}
        aliases = {
            normalize(url)
            for page in pages
            if "#page-" not in page.final_url
            for url in (page.original_url, page.final_url)
        }
        previous = {page.final_url: page.source_page for page in pages if page.anchor_text == "next page"}
        reports: list[ListingReport] = []
        for report in self.listings.values():
            views = tuple(view for view in report.views if view.url in saved)
            reason = report.stop_reason if len(views) == len(report.views) else End.CAP
            linked = normalize(report.continuation_url) in aliases if report.continuation_url else None
            if report.continuation_url and normalize(report.continuation_url) == normalize(report.source_url):
                reason = End.REPEATED
            if views and report.source_url in previous:
                ancestor = previous[report.source_url]
                seen: set[str] = {report.source_url}
                rows: set[str] = set()
                items: set[str] = set()
                signatures: set[str] = set()
                while ancestor in self.listings and ancestor not in seen:
                    seen.add(ancestor)
                    for view in self.listings[ancestor].views:
                        signatures.add(view.signature)
                        rows.update(view.row_hashes)
                        items.update(view.item_hashes)
                    ancestor = previous.get(ancestor, "")
                first, *rest = views
                if (first.signature in signatures and (first.row_hashes or first.item_hashes)) or (
                    linked and any(normalize(url) == normalize(report.continuation_url) for url in seen)
                ):
                    reason = End.REPEATED
                views = (
                    first.model_copy(
                        update={
                            "action": Action.NEXT,
                            "new_table_rows": len(set(first.row_hashes) - rows),
                            "new_list_items": len(set(first.item_hashes) - items),
                        }
                    ),
                    *rest,
                )
            if report.stop_reason is End.BROWSER_UNAVAILABLE:
                reason = report.stop_reason
            reports.append(
                report.model_copy(
                    update={
                        "views": views,
                        "stop_reason": reason,
                        "continuation_captured": linked,
                    }
                )
            )
        return tuple(reports)

    def save(self, folder: Path, pages: list[PageRecord], reports: tuple[ListingReport, ...]) -> tuple[str, ...]:
        saved = {page.final_url for page in pages}
        (folder / "listings.json").write_bytes(LISTINGS.dump_json(reports, indent=2) + b"\n")
        if not self.media:
            return ("listings.json",)
        media = tuple(v for url, v in self.media.items() if url in saved)
        (folder / "rendered-media.json").write_bytes(MEDIA.dump_json(media, indent=2) + b"\n")
        return ("listings.json", "rendered-media.json")
