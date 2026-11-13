"""Search and classification over indexed chunks. Classification only ever proposes: nothing is stored as fact."""

from __future__ import annotations

from collections import defaultdict

from mzizi_engine.devservices.vector.embedders import Embedder, text_hash
from mzizi_engine.devservices.vector.labels import LabelFile
from mzizi_engine.devservices.vector.models import (
    ChunkPayload,
    ClassificationReport,
    Hit,
    LabelPayload,
    LabelScore,
    SearchReport,
)
from mzizi_engine.devservices.vector.naming import CHUNKS, LABELS, collection_for
from mzizi_engine.devservices.vector.store import Point, VectorStore
from mzizi_extraction.document import chunk_markdown

SNIPPET_CHARS = 240
NEIGHBOURS = 3
UNDECIDED = "undecided"
MIN_MARGIN = 0.02  # a proposal needs to beat the runner-up by this much


def search_chunks(store: VectorStore, embedder: Embedder, query: str, limit: int, run_id: str = "") -> SearchReport:
    vector = embedder.embed([query])[0]
    scored = store.search(collection_for(CHUNKS, embedder.name), vector, limit, {"run_id": run_id} if run_id else {})
    hits: list[Hit] = []
    for item in scored:
        payload = ChunkPayload.model_validate(item.payload)
        hits.append(
            Hit(
                score=round(item.score, 4),
                run_id=payload.run_id,
                source=payload.source,
                title=payload.title,
                heading_path=payload.heading_path,
                snippet=payload.text[:SNIPPET_CHARS],
            )
        )
    return SearchReport(
        query=query, collection=collection_for(CHUNKS, embedder.name), model=embedder.name, hits=tuple(hits)
    )


def index_labels(store: VectorStore, embedder: Embedder, labels: LabelFile) -> int:
    """Stores each labelled example once per model (its identity is label + text hash + model)."""
    store.ensure(collection_for(LABELS, embedder.name), embedder.dimensions)
    pairs = [(label.name, example) for label in labels.labels for example in label.examples]
    vectors = embedder.embed([example for _, example in pairs])
    points = [
        Point(
            key=f"{name}:{text_hash(example)}:{embedder.name}",
            vector=tuple(vector),
            payload=LabelPayload(
                label=name, example_hash=text_hash(example), model=embedder.name, text=example
            ).model_dump(mode="json"),
        )
        for (name, example), vector in zip(pairs, vectors, strict=True)
    ]
    return store.upsert(collection_for(LABELS, embedder.name), points)


def classify_text(store: VectorStore, embedder: Embedder, text: str, labels: LabelFile) -> ClassificationReport:
    """Each chunk votes with its nearest labelled examples; a label's score is its mean best-neighbour similarity."""
    index_labels(store, embedder, labels)
    chunks = [c.text for c in chunk_markdown(text, min_chars=1)] or [text]
    best: dict[str, list[float]] = defaultdict(list)
    evidence: dict[str, list[str]] = defaultdict(list)
    for vector in embedder.embed(chunks):
        for item in store.search(collection_for(LABELS, embedder.name), vector, NEIGHBOURS, {"model": embedder.name}):
            payload = LabelPayload.model_validate(item.payload)
            best[payload.label].append(item.score)
            evidence[payload.label].append(payload.text[:SNIPPET_CHARS])
    scores = sorted(
        (
            LabelScore(
                label=label,
                score=round(sum(values) / len(values), 4),
                evidence=tuple(dict.fromkeys(evidence[label]))[:NEIGHBOURS],
            )
            for label, values in best.items()
        ),
        key=lambda s: -s.score,
    )
    decided = len(scores) > 0 and (len(scores) == 1 or scores[0].score - scores[1].score >= MIN_MARGIN)
    proposal = scores[0].label if decided else UNDECIDED
    return ClassificationReport(
        proposal=proposal, status="proposal: needs review, not a stored fact", chunks=len(chunks), scores=tuple(scores)
    )
