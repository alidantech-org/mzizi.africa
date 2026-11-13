"""Typed contracts of the vector sandbox."""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class Loose(BaseModel):
    """Shapes read back from Qdrant: unknown payload keys are ignored."""

    model_config = ConfigDict(frozen=True, extra="ignore")


class ChunkPayload(Loose):
    run_id: str
    source: str
    title: str
    heading_path: tuple[str, ...]
    chunk_index: int
    text_hash: str
    model: str
    preprocess_version: str
    text: str


class LabelPayload(Loose):
    label: str
    example_hash: str
    model: str
    text: str


class Hit(Frozen):
    score: float
    run_id: str
    source: str
    title: str
    heading_path: tuple[str, ...]
    snippet: str


class IndexReport(Frozen):
    run_id: str
    collection: str
    model: str
    dimensions: int
    chunks: int
    sources: int
    upserted: int


class SearchReport(Frozen):
    query: str
    collection: str
    model: str
    hits: tuple[Hit, ...]


class LabelScore(Frozen):
    label: str
    score: float
    evidence: tuple[str, ...]


class ClassificationReport(Frozen):
    proposal: str
    status: str
    chunks: int
    scores: tuple[LabelScore, ...]


class ServiceStatus(Frozen):
    url: str
    reachable: bool
    collections: dict[str, int]
