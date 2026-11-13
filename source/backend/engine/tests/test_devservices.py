"""Dev services: chunk indexing, search and classification against an in-memory store; live MongoDB and Qdrant when reachable."""

from __future__ import annotations

import json
import math
from collections.abc import Iterator, Sequence
from pathlib import Path

import pytest

from mzizi_engine.devservices.errors import ServiceRefused
from mzizi_engine.devservices.mongo.loader import load_run, parse_filter
from mzizi_engine.devservices.mongo.sandbox import MongoSandbox
from mzizi_engine.devservices.settings import ServiceSettings, load_settings
from mzizi_engine.devservices.vector.embedders import HashEmbedder, make_embedder
from mzizi_engine.devservices.vector.indexing import index_run, split_front_matter
from mzizi_engine.devservices.vector.labels import parse_labels
from mzizi_engine.devservices.vector.querying import classify_text, search_chunks
from mzizi_engine.devservices.vector.store import Point, QdrantStore, Scored, point_id


class MemoryStore:
    """VectorStore port in memory: cosine similarity over stored points."""

    def __init__(self) -> None:
        self.data: dict[str, dict[str, Point]] = {}

    def ensure(self, collection: str, dimensions: int) -> None:
        self.data.setdefault(collection, {})

    def upsert(self, collection: str, points: Sequence[Point]) -> int:
        for point in points:
            self.data[collection][point_id(point.key)] = point
        return len(points)

    def search(self, collection: str, vector: Sequence[float], limit: int, match: dict[str, str]) -> list[Scored]:
        def cosine(other: Sequence[float]) -> float:
            dot = sum(a * b for a, b in zip(vector, other, strict=True))
            return dot / ((math.sqrt(sum(a * a for a in vector)) * math.sqrt(sum(b * b for b in other))) or 1.0)

        rows = [
            Scored(score=cosine(p.vector), payload=p.payload)
            for p in self.data.get(collection, {}).values()
            if all(p.payload.get(k) == v for k, v in match.items())
        ]
        return sorted(rows, key=lambda r: -r.score)[:limit]

    def collections(self) -> dict[str, int]:
        return {k: len(v) for k, v in self.data.items()}

    def drop(self, collection: str) -> None:
        self.data.pop(collection, None)


@pytest.fixture
def run_folder(tmp_path: Path) -> Path:
    folder = tmp_path / "crawl-1"
    (folder / "markdown").mkdir(parents=True)
    pages = {
        "0001.md": (
            "https://a.org/budget",
            "County budget",
            "# Budget\n\n## Revenue\n\nRevenue comes from taxes fees and levies collected by the county treasury each quarter.\n\n## Spending\n\nSpending covers health roads schools and water according to the appropriation act.",
        ),
        "0002.md": (
            "https://a.org/tenders",
            "Tenders",
            "# Tenders\n\nThe procurement unit publishes tenders for suppliers who wish to bid for county contracts and works.",
        ),
    }
    for name, (url, title, body) in pages.items():
        (folder / "markdown" / name).write_text(f'---\nurl: {url}\ntitle: "{title}"\n---\n\n{body}\n', encoding="utf-8")
    (folder / "pages.json").write_text(
        json.dumps([{"n": 1, "final_url": "https://a.org/budget"}, {"n": 2, "final_url": "https://a.org/tenders"}])
    )
    (folder / "links.json").write_text(
        json.dumps([{"source_page": "https://a.org/budget", "original_url": "https://a.org/tenders"}])
    )
    return folder


def test_front_matter_is_split_from_the_body() -> None:
    meta, body = split_front_matter('---\nurl: https://a.org/x\ntitle: "T"\n---\n\n# H\n')
    assert meta == {"url": "https://a.org/x", "title": "T"} and body.strip() == "# H"
    assert split_front_matter("# no front matter") == ({}, "# no front matter")


def test_index_is_idempotent_and_search_finds_the_right_page(run_folder: Path) -> None:
    store, embedder = MemoryStore(), HashEmbedder()
    first = index_run(store, embedder, run_folder)
    again = index_run(store, embedder, run_folder)
    assert first.sources == 2 and first.chunks >= 3 and first.chunks == again.chunks
    assert sum(store.collections().values()) == first.chunks
    report = search_chunks(store, embedder, "county tenders for suppliers to bid", 2)
    assert report.hits[0].source == "https://a.org/tenders" and report.hits[0].heading_path == ("Tenders",)
    only = search_chunks(store, embedder, "taxes", 5, run_id="crawl-1")
    assert only.hits and all(h.run_id == "crawl-1" for h in only.hits)
    assert search_chunks(store, embedder, "taxes", 5, run_id="other").hits == ()


def test_classification_is_a_proposal_from_labelled_examples() -> None:
    labels = parse_labels(
        "labels:\n- name: budget\n  examples: [revenue taxes fees levies treasury quarter, spending health roads schools appropriation]\n"
        "- name: tender\n  examples: [procurement tenders suppliers bid contracts works]\n"
    )
    store, embedder = MemoryStore(), HashEmbedder()
    report = classify_text(
        store, embedder, "The procurement unit invites suppliers to bid on tenders for contracts.", labels
    )
    assert report.proposal == "tender" and "not a stored fact" in report.status and report.scores[0].evidence
    unknown = classify_text(
        store,
        embedder,
        "zzz qqq",
        parse_labels("labels:\n- name: a\n  examples: [alpha]\n- name: b\n  examples: [beta]\n"),
    )
    assert unknown.proposal in ("a", "b", "undecided")


def test_settings_defaults_and_embedder_selection(monkeypatch: pytest.MonkeyPatch) -> None:
    for name in ("DEV_MONGO_URL", "DEV_VECTOR_URL", "DEV_EMBEDDING_MODEL"):
        monkeypatch.delenv(name, raising=False)
    settings = load_settings()
    assert settings.mongo_url == "mongodb://127.0.0.1:27017" and settings.vector_url == "http://127.0.0.1:6333"
    assert isinstance(make_embedder(ServiceSettings(embedding_model="hash")), HashEmbedder)


def test_mongo_filter_boundary_and_drop_refusal() -> None:
    assert parse_filter('{"run_id": "x"}') == {"run_id": "x"} and parse_filter("") == {}
    with pytest.raises(ValueError, match="JSON object"):
        parse_filter("[1, 2]")


def reachable_mongo() -> bool:
    try:
        MongoSandbox(ServiceSettings(mongo_database="mzizi_test_probe")).ping()
    except Exception:
        return False
    return True


needs_mongo = pytest.mark.skipif(not reachable_mongo(), reason="MongoDB is not reachable")


@pytest.fixture
def mongo() -> Iterator[MongoSandbox]:
    sandbox = MongoSandbox(ServiceSettings(mongo_database="mzizi_test_run"))
    yield sandbox
    sandbox.drop_dev_database()
    sandbox.close()


@needs_mongo
def test_mongo_load_is_idempotent_and_queryable(mongo: MongoSandbox, run_folder: Path) -> None:
    first = load_run(mongo, run_folder)
    again = load_run(mongo, run_folder)
    assert first.collections == {"pages": 2, "links": 1, "markdown": 2} and first.changed == 5 and again.changed == 0
    found = mongo.find("pages", parse_filter('{"n": 2}'), 5)
    assert found[0]["final_url"] == "https://a.org/tenders" and found[0]["run_id"] == "crawl-1"
    assert mongo.counts()["markdown"] == 2 and mongo.round_trip()


@needs_mongo
def test_mongo_refuses_to_drop_other_databases(mongo: MongoSandbox) -> None:
    with pytest.raises(ServiceRefused):
        mongo.drop_dev_database("admin")


def reachable_qdrant() -> bool:
    return QdrantStore(ServiceSettings(vector_url=load_settings().vector_url)).reachable()


@pytest.mark.skipif(not reachable_qdrant(), reason="Qdrant is not reachable")
def test_qdrant_round_trip_with_deterministic_ids(run_folder: Path) -> None:
    store = QdrantStore(ServiceSettings(vector_url=load_settings().vector_url, collection_prefix="mzizi_test_"))
    embedder = HashEmbedder()
    try:
        report = index_run(store, embedder, run_folder)
        index_run(store, embedder, run_folder)
        assert sum(v for k, v in store.collections().items() if k.startswith("chunks")) == report.chunks
        assert search_chunks(store, embedder, "tenders for suppliers", 1).hits[0].source == "https://a.org/tenders"
    finally:
        for name in list(store.collections()):
            store.drop(name)
        store.close()


@needs_mongo
def test_cli_mongo_and_vector_commands_use_the_real_services(
    tmp_path: Path, run_folder: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    from typer.testing import CliRunner

    from mzizi_engine.devcli.app import app

    monkeypatch.setenv("MZIZI_DEV_ROOT", str(tmp_path / "dev"))
    runner = CliRunner()
    mongo = runner.invoke(app, ["--no-input", "--json", "mongo", "test"])
    assert mongo.exit_code == 0 and json.loads(mongo.output)["round_trip"] is True
    status = runner.invoke(app, ["--no-input", "--json", "status", "--group", "mongo"])
    assert {r["capability"]: r["state"] for r in json.loads(status.output)}["mongo.test"] == "ready"
    missing = runner.invoke(app, ["--no-input", "--json", "mongo", "load", "--run", str(tmp_path / "nope")])
    assert missing.exit_code != 0
