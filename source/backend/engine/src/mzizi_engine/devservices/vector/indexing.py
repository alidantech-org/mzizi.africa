"""Indexing: a run folder's Markdown becomes chunks, vectors and Qdrant points."""

from __future__ import annotations

from pathlib import Path

from mzizi_engine.devservices.vector.embedders import PREPROCESS_VERSION, Embedder, text_hash
from mzizi_engine.devservices.vector.models import ChunkPayload, IndexReport
from mzizi_engine.devservices.vector.naming import CHUNKS, collection_for
from mzizi_engine.devservices.vector.store import Point, VectorStore
from mzizi_extraction.document import chunk_markdown

EMBED_BATCH = 32
FRONT_MATTER = "---"


def markdown_sources(folder: Path) -> list[Path]:
    """Markdown produced by `web crawl` (`markdown/*.md`) or `extract markdown` (`document.md`)."""
    found = sorted((folder / "markdown").glob("*.md")) if (folder / "markdown").is_dir() else []
    return [*found, *([folder / "document.md"] if (folder / "document.md").exists() else [])]


def split_front_matter(text: str) -> tuple[dict[str, str], str]:
    """The `url`/`title` lines of a crawl page's front matter, and the body after it."""
    lines = text.splitlines()
    if not lines or lines[0].strip() != FRONT_MATTER:
        return {}, text
    meta: dict[str, str] = {}
    for position, line in enumerate(lines[1:], start=1):
        if line.strip() == FRONT_MATTER:
            return meta, "\n".join(lines[position + 1 :])
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip().strip('"')
    return {}, text


def chunk_points(run_id: str, folder: Path, model: str) -> tuple[list[tuple[str, ChunkPayload]], int]:
    """(key, payload) for every chunk of every source in the folder, and the number of sources."""
    items: list[tuple[str, ChunkPayload]] = []
    sources = markdown_sources(folder)
    for path in sources:
        meta, body = split_front_matter(path.read_text(encoding="utf-8"))
        source = meta.get("url") or path.name
        for chunk in chunk_markdown(body):
            digest = text_hash(chunk.text)
            payload = ChunkPayload(
                run_id=run_id,
                source=source,
                title=meta.get("title", path.stem),
                heading_path=chunk.heading_path,
                chunk_index=chunk.index,
                text_hash=digest,
                model=model,
                preprocess_version=PREPROCESS_VERSION,
                text=chunk.text,
            )
            items.append((f"{digest}:{model}:{PREPROCESS_VERSION}:{source}", payload))
    return items, len(sources)


def index_run(store: VectorStore, embedder: Embedder, folder: Path) -> IndexReport:
    """Re-indexing the same content with the same model and preprocessing version writes the same points."""
    items, sources = chunk_points(folder.name, folder, embedder.name)
    collection = collection_for(CHUNKS, embedder.name)
    store.ensure(collection, embedder.dimensions)
    upserted = 0
    for start in range(0, len(items), EMBED_BATCH):
        batch = items[start : start + EMBED_BATCH]
        vectors = embedder.embed([payload.text for _, payload in batch])
        points = [
            Point(key=key, vector=tuple(vector), payload=payload.model_dump(mode="json"))
            for (key, payload), vector in zip(batch, vectors, strict=True)
        ]
        upserted += store.upsert(collection, points)
    return IndexReport(
        run_id=folder.name,
        collection=collection,
        model=embedder.name,
        dimensions=embedder.dimensions,
        chunks=len(items),
        sources=sources,
        upserted=upserted,
    )
