"""Attachment planning validates known bytes, source scope and actual download content."""

from __future__ import annotations

from pathlib import Path

import pytest
from web_site import PDF, Handler, page

from mzizi_crawler.features.attachments.attachments import AttachmentRequest, Selection, select_attachments
from mzizi_crawler.features.crawl_site.crawl_site import crawl_site
from mzizi_crawler.shared.requests import CrawlRequest


def test_ranked_attachment_selection_reserves_bytes_and_tracks_reviewed_value(site: str, tmp_path: Path) -> None:
    Handler.site["/list"] = page(
        "Listing",
        '<section><h2>Annual budget</h2><a href="/report.pdf">View / Download</a></section>'
        '<section><h2>Meeting notice</h2><a href="/other.pdf">View / Download</a></section>',
    )
    Handler.site["/other.pdf"] = PDF
    source = tmp_path / "crawl"
    crawl_site(CrawlRequest(url=site + "/list", out_dir=str(source), max_depth=0, delay=0, sitemap=False))
    rules = tmp_path / "rules.yaml"
    rules.write_text(
        "schema: mzizi.ranking/v1\nrules:\n"
        "  - target: finance.transfers\n    label: Annual budget\n"
        "    conditions: [{signal: nearby_heading, contains: [annual budget]}]\n",
    )
    review = tmp_path / "review.json"
    review.write_text(f'["{site}/report.pdf"]')
    request = AttachmentRequest(
        source=str(source),
        rules=str(rules),
        out_dir=str(tmp_path / "plan"),
        max_bytes=len(PDF),
        allow_private=True,
        review=str(review),
    )
    plan = select_attachments(request)
    assert [(c.candidate.contexts[0].nearby_heading, c.decision) for c in plan.candidates] == [
        ("Annual budget", Selection.SELECTED),
        ("Meeting notice", Selection.BELOW_THRESHOLD),
    ]
    assert plan.reserved_bytes == len(PDF) and plan.received_bytes == 0
    short = select_attachments(request.model_copy(update={"max_bytes": len(PDF) - 1, "apply": True}))
    assert short.candidates[0].decision == Selection.BYTE_LIMIT and short.received_bytes == 0
    applied = select_attachments(request.model_copy(update={"apply": True}))
    assert applied.candidates[0].decision == Selection.DOWNLOADED
    assert applied.received_bytes_per_useful_document == len(PDF)


def test_attachment_size_unknown_private_host_and_file_cap_are_explicit(
    site: str,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    from mzizi_fetch.web.client import WebClient, WebResponse

    Handler.site["/list"] = page(
        "Files",
        '<a href="/a.pdf">First PDF</a><a href="/b.pdf">Second PDF</a>'
        '<a href="/c.pdf">Third PDF</a><a href="https://outside.example/other.pdf">External PDF</a>',
    )
    for name in ("/a.pdf", "/b.pdf", "/c.pdf"):
        Handler.site[name] = PDF
    folder = tmp_path / "crawl"
    crawl_site(CrawlRequest(url=site + "/list", out_dir=str(folder), max_depth=0, delay=0, sitemap=False))
    rules = tmp_path / "rules.yaml"
    rules.write_text(
        "schema: mzizi.ranking/v1\nrules:\n  - target: source.documents\n"
        "    label: Documents\n    conditions: [{signal: extension, contains: [pdf]}]\n",
    )
    request = AttachmentRequest(
        source=str(folder),
        rules=str(rules),
        out_dir=str(tmp_path / "private"),
        max_files=1,
        max_bytes=len(PDF),
        allow_private=False,
    )
    private = select_attachments(request)
    assert all(
        row.decision == Selection.PROBE_FAILED for row in private.candidates if row.candidate.url.startswith(site)
    )
    assert (
        next(row for row in private.candidates if "outside.example" in row.candidate.url).decision
        == Selection.OUTSIDE_SOURCE
    )
    original = WebClient.head

    def missing_length(client: WebClient, url: str) -> WebResponse:
        response = original(client, url)
        if url.endswith("/a.pdf"):
            headers = {key: value for key, value in response.headers.items() if key.lower() != "content-length"}
            return response.model_copy(update={"headers": headers})
        return response

    monkeypatch.setattr(WebClient, "head", missing_length)
    plan = select_attachments(request.model_copy(update={"allow_private": True, "out_dir": str(tmp_path / "known")}))
    decisions = {row.candidate.url.rsplit("/", 1)[-1]: row.decision for row in plan.candidates}
    assert decisions == {
        "a.pdf": Selection.SIZE_UNKNOWN,
        "b.pdf": Selection.SELECTED,
        "c.pdf": Selection.FILE_LIMIT,
        "other.pdf": Selection.OUTSIDE_SOURCE,
    }
    assert plan.reserved_bytes == len(PDF) and plan.received_bytes == 0


def test_an_html_error_at_an_attachment_url_is_reported_before_useful_accounting(site: str, tmp_path: Path) -> None:
    Handler.site["/list"] = page("Files", '<a href="/error.pdf">Annual report</a>')
    Handler.site["/error.pdf"] = b"<html><body><p>Download unavailable</p></body></html>"
    folder = tmp_path / "crawl"
    crawl_site(CrawlRequest(url=site + "/list", out_dir=str(folder), max_depth=0, delay=0, sitemap=False))
    rules = tmp_path / "rules.yaml"
    rules.write_text(
        "schema: mzizi.ranking/v1\nrules:\n  - target: source.documents\n"
        "    label: Documents\n    conditions: [{signal: extension, contains: [pdf]}]\n",
    )
    review = tmp_path / "review.json"
    review.write_text(f'["{site}/error.pdf"]')
    report = select_attachments(
        AttachmentRequest(
            source=str(folder),
            rules=str(rules),
            out_dir=str(tmp_path / "selected"),
            max_bytes=1000,
            max_files=1,
            apply=True,
            review=str(review),
            allow_private=True,
        )
    )
    (record,) = report.candidates
    assert record.decision is Selection.WEB_RESPONSE and record.detected_type == "html"
    assert record.flags and record.received_bytes > 0
    assert report.reserved_bytes == record.estimated_bytes == record.received_bytes
    assert report.reserved_bytes <= report.byte_budget and report.reviewed_useful_documents == 0
