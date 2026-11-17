from pathlib import Path

import httpx
import pytest

from mzizi_engine.persistence.vector.qdrant import QdrantVectorStore
from mzizi_engine.persistence.vector.sync import IndexRow, sync
from mzizi_engine.runtime.assembly.knowledge import build_name_index, load_vocabulary, seed_rows
from mzizi_patterns import HashingEmbedder

SEED = Path("seed")


@pytest.mark.skipif(not (SEED / "columns").is_dir(), reason="the seed dictionaries are not present")
def test_the_seed_names_resolve_with_kind_words_and_value_labels_become_aliases() -> None:
    index = build_name_index(SEED, ("global", "ke"))
    top = index.resolve("Kiambu County", "geography.features")[0]
    assert top.code == "ke.kiambu" and top.kind_agrees is True
    vocabulary = load_vocabulary(SEED, ("global", "ke"), seed_rows(SEED))
    county = vocabulary.groups[("address", "admin-levels")]
    assert "County" in county.surfaces["county"]  # the label of geo.feature.kind.county, pulled from reference.values


class FakeQdrant:
    """The slice of Qdrant's REST API the sync uses, kept in memory."""

    def __init__(self) -> None:
        self.collections: dict[str, dict[str, dict]] = {}

    def handler(self, request: httpx.Request) -> httpx.Response:
        import json

        path, body = request.url.path, (json.loads(request.content) if request.content else {})
        name = path.split("/")[2] if path.startswith("/collections/") else ""
        if request.method == "GET":
            return httpx.Response(200 if name in self.collections else 404, json={})
        if request.method == "PUT" and path.endswith(f"/collections/{name}"):
            self.collections[name] = {}
            return httpx.Response(200, json={"result": True})
        points = self.collections[name]
        if path.endswith("/points"):
            for p in body["points"]:
                points[p["id"]] = p
            return httpx.Response(200, json={"result": {}})
        if path.endswith("/scroll"):
            return httpx.Response(
                200,
                json={
                    "result": {
                        "points": [{"id": i, "payload": {"hash": p["payload"]["hash"]}} for i, p in points.items()],
                        "next_page_offset": None,
                    }
                },
            )
        if path.endswith("/delete"):
            for i in body["points"]:
                points.pop(i, None)
            return httpx.Response(200, json={"result": {}})
        return httpx.Response(404, json={})


def test_the_sync_embeds_only_what_changed_and_removes_what_is_gone() -> None:
    fake = FakeQdrant()
    store = QdrantVectorStore(
        client=httpx.Client(transport=httpx.MockTransport(fake.handler), base_url="http://qdrant")
    )
    embedder = HashingEmbedder(32)
    rows = [
        IndexRow("geography.features", "ke.kiambu", "Kiambu"),
        IndexRow("geography.features", "ke.mombasa", "Mombasa"),
    ]
    first = sync(store, "c", rows, embedder)
    assert (first.created_collection, first.embedded, first.unchanged) == (True, 2, 0)
    second = sync(store, "c", rows, embedder)
    assert (second.embedded, second.unchanged, second.removed) == (0, 2, 0)
    third = sync(store, "c", [rows[0], IndexRow("geography.features", "ke.nairobi", "Nairobi")], embedder)
    assert (third.embedded, third.removed) == (1, 1)


def test_a_model_server_embedder_names_its_collection_and_reads_the_vector() -> None:
    import json

    from mzizi_engine.persistence.vector.embedders import HttpEmbedder

    def handler(request: httpx.Request) -> httpx.Response:
        body = json.loads(request.content)
        if request.url.path == "/api/embeddings":
            return httpx.Response(200, json={"embedding": [0.1, 0.2, 0.3]})
        return httpx.Response(200, json={"data": [{"embedding": [1.0, 0.0]}], "echo": body["input"]})

    ollama = HttpEmbedder(
        "ollama",
        "http://m",
        "nomic-embed-text",
        httpx.Client(transport=httpx.MockTransport(handler), base_url="http://m"),
    )
    assert ollama.dimension == 3 and ollama.name == "ollama-nomic-embed-text" and ollama.embed("x") == (0.1, 0.2, 0.3)
    openai = HttpEmbedder(
        "openai", "http://m", "e5", httpx.Client(transport=httpx.MockTransport(handler), base_url="http://m")
    )
    assert openai.dimension == 2
