"""Rank downloaded files against Mzizi targets and record the scores in the engine's activity store."""

from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlparse

import yaml
from pydantic import BaseModel

from mzizi_engine.web.handlers.common import out_dir
from mzizi_engine.activity import open_activity
from mzizi_engine.web.handlers.downloads import DOWNLOADS_COLLECTION, CatalogEntry
from mzizi_engine.web.requests import RankRequest
from mzizi_manifest.validate import validate_ranking
from mzizi_scraping.rank import ExpectationMap, FileFeatures, RankingRules, rank_file

SCORES_COLLECTION = "expectation_scores"
LEDGER = "scores.jsonl"


class RankReport(BaseModel):
    folder: str
    files: int
    ranked: int
    recorded_in: str
    maps: tuple[ExpectationMap, ...]


def _features(entry: CatalogEntry) -> FileFeatures:
    found = entry.found_at
    return FileFeatures(
        url=entry.url,
        filename=Path(urlparse(entry.url).path).name,
        extension=Path(urlparse(entry.url).path).suffix.lstrip("."),
        section=found.section,
        anchor_text=found.anchor_text,
        source_page_title=found.source_page_title,
        source_page_path=urlparse(found.source_page).path,
    )


def _record(destination: Path, maps: tuple[ExpectationMap, ...], sha_by_url: dict[str, str], mongo: bool) -> str:
    documents = [
        {"_id": f"{sha_by_url.get(item.url, item.url)}:{e.target}", "url": item.url, **e.model_dump(mode="json")}
        for item in maps
        for e in item.expectations
    ]
    activity = open_activity() if mongo else None
    if activity is not None:
        try:
            activity.put(SCORES_COLLECTION, documents)
        finally:
            activity.close()
        return f"mongodb:{SCORES_COLLECTION}"
    (destination / LEDGER).write_text("\n".join(json.dumps(d) for d in documents) + "\n", encoding="utf-8")
    return str(destination / LEDGER)


def _catalog(folder: Path) -> list[CatalogEntry]:
    activity = open_activity()
    if activity is not None:
        try:
            rows = activity.get(DOWNLOADS_COLLECTION, {"folder": str(folder)})
        finally:
            activity.close()
        if rows:
            return [CatalogEntry.model_validate(row, strict=False) for row in rows]
    return [CatalogEntry.model_validate(item) for item in json.loads((folder / "catalog.json").read_text())]


def rank_downloads(request: RankRequest) -> RankReport:
    raw = yaml.safe_load(Path(request.rules).read_text(encoding="utf-8"))
    if problems := validate_ranking(raw):
        raise ValueError("\n".join(problems))
    rules = RankingRules.model_validate(raw)
    folder = Path(request.source)
    entries = _catalog(folder)
    maps = tuple(rank_file(_features(entry), rules) for entry in entries)
    destination = out_dir(request)
    (destination / "expectations.json").write_text(
        json.dumps([m.model_dump(mode="json") for m in maps], indent=2), encoding="utf-8"
    )
    where = _record(destination, maps, {e.url: e.sha256 for e in entries}, request.record != "ledger")
    return RankReport(
        folder=str(destination),
        files=len(entries),
        ranked=sum(1 for m in maps if m.expectations),
        recorded_in=where,
        maps=maps,
    )
