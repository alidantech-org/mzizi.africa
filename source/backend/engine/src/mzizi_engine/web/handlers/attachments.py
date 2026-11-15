"""Rank discovered attachments before download and enforce a known byte budget."""

from __future__ import annotations

from enum import StrEnum
from pathlib import Path

import yaml
from pydantic import Field, TypeAdapter

from mzizi_engine.web.export import read_csv
from mzizi_engine.web.handlers.common import out_dir
from mzizi_engine.web.hunt import looks_like_download
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.records import PageRecord, Record
from mzizi_engine.web.requests import Workspace
from mzizi_fetch.web.client import WebClient
from mzizi_fetch.web.download import Downloader, DownloadError, DownloadPolicy, check_destination
from mzizi_fetch.web.policy import Decision, SourcePolicy
from mzizi_fetch.web.urls import UrlKind, extension_of, host_of, normalize, path_of
from mzizi_fetch.web.vocabulary import vocabulary
from mzizi_manifest.validate import validate_ranking
from mzizi_scraping.rank import ExpectationMap, FileFeatures, RankingRules, rank_file

ATTACHMENT_INVENTORIES = ("links", "documents", "files", "images", "media")
KINDS = frozenset(
    {
        UrlKind.DOCUMENT,
        UrlKind.DATA,
        UrlKind.ARCHIVE,
        UrlKind.PROGRAM,
        UrlKind.IMAGE,
        UrlKind.MEDIA,
    }
)


class AttachmentRequest(Workspace):
    source: str
    rules: str
    max_bytes: int = Field(gt=0)
    max_files: int = Field(default=20, gt=0, le=1000)
    max_probes: int = Field(default=80, gt=0, le=4000)
    min_score: float = Field(default=0.01, gt=0, le=1)
    apply: bool = False
    allowed_hosts: str = ""
    review: str = ""
    allow_private: bool = False


class AttachmentContext(Record):
    source_page: str
    anchor_text: str
    nearby_heading: str = ""
    source_title: str = ""


class _Input(Record):
    original_url: str
    kind: str
    source_page: str
    anchor_text: str
    nearby_heading: str = ""


class Candidate(Record):
    url: str
    contexts: tuple[AttachmentContext, ...]
    ranking: ExpectationMap
    score: float


class Selection(StrEnum):
    BELOW_THRESHOLD = "below_threshold"
    OUTSIDE_SOURCE = "outside_source"
    PROBE_LIMIT = "probe_limit"
    FILE_LIMIT = "file_limit"
    PROBE_FAILED = "probe_failed"
    SIZE_UNKNOWN = "size_unknown"
    BYTE_LIMIT = "byte_limit"
    SELECTED = "selected"
    DOWNLOADED = "downloaded"
    FAILED = "download_failed"
    WEB_RESPONSE = "unexpected_web_response"


class AttachmentDecision(Record):
    candidate: Candidate
    decision: Selection
    estimated_bytes: int = 0
    received_bytes: int = 0
    sha256: str = ""
    file: str = ""
    detail: str = ""
    detected_type: str = ""
    flags: tuple[str, ...] = ()


class AttachmentPlan(Record):
    source: str
    applied: bool
    byte_budget: int
    reserved_bytes: int
    received_bytes: int
    reviewed_useful_documents: int | None = None
    received_bytes_per_useful_document: float | None = None
    candidates: tuple[AttachmentDecision, ...]
    source_policy: tuple[Decision, ...]
    files: tuple[str, ...] = ("attachments.json",)


def _pages(folder: Path) -> tuple[PageRecord, ...]:
    return tuple(PageRecord.model_validate(row, strict=False) for row in read_csv(folder / "pages.csv"))


def _best(url: str, contexts: list[AttachmentContext], rules: RankingRules) -> Candidate:
    ranks = [
        rank_file(
            FileFeatures(
                url=url,
                filename=Path(path_of(url)).name,
                extension=extension_of(url),
                section=Path(path_of(ctx.source_page)).parts[1]
                if len(Path(path_of(ctx.source_page)).parts) >= 2
                else "",
                anchor_text=ctx.anchor_text,
                nearby_heading=ctx.nearby_heading,
                source_page_title=ctx.source_title,
                source_page_path=path_of(ctx.source_page),
            ),
            rules,
        )
        for ctx in contexts
    ]
    best = max(ranks, key=lambda rank: rank.expectations[0].score if rank.expectations else 0.0)
    return Candidate(
        url=url, contexts=tuple(contexts), ranking=best, score=best.expectations[0].score if best.expectations else 0
    )


def _candidates(folder: Path, pages: tuple[PageRecord, ...], rules: RankingRules) -> tuple[Candidate, ...]:
    titles = {page.final_url: page.title for page in pages}
    records: dict[str, list[AttachmentContext]] = {}
    urls: dict[str, str] = {}
    for inventory in ATTACHMENT_INVENTORIES:
        path = folder / f"{inventory}.csv"
        if not path.exists():
            continue
        for row in read_csv(path):
            row_data = _Input.model_validate({key: row[key] for key in _Input.model_fields if key in row}, strict=False)
            url = row_data.original_url
            if row_data.kind not in KINDS and not looks_like_download(url, row_data.anchor_text):
                continue
            if not url.startswith(("http://", "https://")):
                continue
            key = normalize(url, sort_query=False, drop_tracking=False)
            urls.setdefault(key, url)
            context = AttachmentContext(
                source_page=row_data.source_page,
                anchor_text=row_data.anchor_text,
                nearby_heading=row_data.nearby_heading,
                source_title=titles.get(row_data.source_page, ""),
            )
            contexts = records.setdefault(key, [])
            if context not in contexts:
                contexts.append(context)
    result = (_best(urls[key], contexts, rules) for key, contexts in records.items())
    return tuple(sorted(result, key=lambda item: (-item.score, item.url)))


def _choose(
    client: WebClient,
    request: AttachmentRequest,
    candidates: tuple[Candidate, ...],
    download_policy: DownloadPolicy,
) -> list[AttachmentDecision]:
    remaining, slots, probes = request.max_bytes, request.max_files, request.max_probes
    decisions: list[AttachmentDecision] = []
    for candidate in candidates:
        outcome = AttachmentDecision(candidate=candidate, decision=Selection.BELOW_THRESHOLD)
        if candidate.score < request.min_score:
            decisions.append(outcome)
            continue
        if host_of(candidate.url) not in download_policy.allowed_hosts:
            decisions.append(outcome.model_copy(update={"decision": Selection.OUTSIDE_SOURCE}))
            continue
        if slots == 0 or probes == 0:
            decisions.append(
                outcome.model_copy(update={"decision": Selection.FILE_LIMIT if slots == 0 else Selection.PROBE_LIMIT})
            )
            continue
        probes -= 1
        try:
            check_destination(candidate.url, download_policy)
        except DownloadError as error:
            decisions.append(outcome.model_copy(update={"decision": Selection.PROBE_FAILED, "detail": str(error)}))
            continue
        response = client.head(candidate.url)
        size = response.content_length
        if not response.usable:
            decisions.append(
                outcome.model_copy(
                    update={"decision": Selection.PROBE_FAILED, "detail": f"HEAD {response.status}: {response.error}"}
                )
            )
        elif not size or response.headers.get("content-encoding", "identity").lower() != "identity":
            decisions.append(outcome.model_copy(update={"decision": Selection.SIZE_UNKNOWN}))
        elif size > remaining:
            decisions.append(outcome.model_copy(update={"decision": Selection.BYTE_LIMIT, "estimated_bytes": size}))
        else:
            selected = outcome.model_copy(update={"decision": Selection.SELECTED, "estimated_bytes": size})
            remaining -= size
            slots -= 1
            decisions.append(selected)
    return decisions


def _download(
    chosen: AttachmentDecision, policy: DownloadPolicy, client: WebClient, folder: Path
) -> AttachmentDecision:
    url = chosen.candidate.url
    if (refusal := client.preflight(url)) is not None:
        return chosen.model_copy(update={"decision": Selection.FAILED, "detail": str(refusal.refused)})
    client.wait_for_slot(url)
    downloader = Downloader(folder, client.user_agent, policy.model_copy(update={"max_bytes": chosen.estimated_bytes}))
    try:
        done, failed = downloader.download_many([url])
    finally:
        downloader.close()
    if done:
        result = done[0]
        web_response = any(
            signature.name == result.detected_type and signature.group == "web"
            for signature in vocabulary().file_signatures
        )
        return chosen.model_copy(
            update={
                "decision": Selection.WEB_RESPONSE if web_response else Selection.DOWNLOADED,
                "detected_type": result.detected_type,
                "flags": result.flags,
                "file": result.file,
                "sha256": result.sha256,
                "received_bytes": result.size,
            }
        )
    return chosen.model_copy(
        update={
            "decision": Selection.FAILED,
            "detail": failed[0].message,
            "received_bytes": failed[0].partial_bytes,
        }
    )


def select_attachments(request: AttachmentRequest) -> AttachmentPlan:
    source, folder = Path(request.source), out_dir(request)
    raw = yaml.safe_load(Path(request.rules).read_text(encoding="utf-8"))
    if errors := validate_ranking(raw):
        raise ValueError("\n".join(errors))
    rules = RankingRules.model_validate(raw)
    pages = _pages(source)
    hosts = tuple(part.strip().lower() for part in request.allowed_hosts.split(",") if part.strip())
    if not hosts:
        hosts = tuple(sorted({host_of(page.final_url) for page in pages if page.depth == 0}))
    if not hosts:
        raise ValueError("supply allowed hosts or a crawl with a saved start page")
    useful = TypeAdapter(tuple[str, ...]).validate_json(Path(request.review).read_bytes()) if request.review else None
    client = WebClient(
        user_agent(),
        SourcePolicy(
            allowed_hosts=hosts,
            max_requests=(request.max_probes + request.max_files) * 6,
            max_concurrency=1,
            requests_per_second=1,
        ),
        hosts,
    )
    policy = DownloadPolicy(allowed_hosts=hosts, allow_private=request.allow_private, concurrency=1, max_files=1)
    try:
        decisions = _choose(client, request, _candidates(source, pages, rules), policy)
        if request.apply:
            decisions = [
                _download(row, policy, client, folder / "downloads") if row.decision is Selection.SELECTED else row
                for row in decisions
            ]
    finally:
        client.close()
    reserved = sum(
        row.estimated_bytes
        for row in decisions
        if row.decision
        in {
            Selection.SELECTED,
            Selection.DOWNLOADED,
            Selection.WEB_RESPONSE,
            Selection.FAILED,
        }
    )
    received = sum(row.received_bytes for row in decisions)
    useful_count = (
        None
        if useful is None
        else len(
            {
                row.sha256
                for row in decisions
                if row.decision is Selection.DOWNLOADED and row.sha256 and row.candidate.url in useful
            }
        )
    )
    result = AttachmentPlan(
        source=str(source),
        applied=request.apply,
        byte_budget=request.max_bytes,
        reserved_bytes=reserved,
        received_bytes=received,
        reviewed_useful_documents=useful_count,
        received_bytes_per_useful_document=round(received / useful_count, 2) if useful_count else None,
        candidates=tuple(decisions),
        source_policy=tuple(client.audit),
    )
    (folder / "attachments.json").write_text(result.model_dump_json(indent=2) + "\n", encoding="utf-8")
    return result
