"""Embedders the vector tier can use, chosen by settings.

`hash` is the built-in character-trigram baseline (spelling similarity only). `ollama` and `openai` call a model server over
HTTP, so a real multilingual model plugs in with a URL and a model name and no new dependency. The collection name carries the
embedder's name, so changing the model builds a new collection instead of mixing vectors."""

from __future__ import annotations

import os

import httpx

from mzizi_patterns import Embedder, HashingEmbedder


class HttpEmbedder:
    def __init__(self, kind: str, url: str, model: str, client: httpx.Client | None = None) -> None:
        if kind not in {"ollama", "openai"}:
            raise ValueError(f"unknown embedder kind {kind!r}; use hash, ollama or openai")
        self.kind, self.model = kind, model
        self.name = f"{kind}-{model}".replace(":", "-").replace("/", "-")
        self._client = client or httpx.Client(base_url=url.rstrip("/"), timeout=60)
        self._dimension = 0

    @property
    def dimension(self) -> int:
        if not self._dimension:
            self._dimension = len(self.embed("dimension probe"))
        return self._dimension

    def embed(self, text: str) -> tuple[float, ...]:
        if self.kind == "ollama":
            response = self._client.post("/api/embeddings", json={"model": self.model, "prompt": text})
            response.raise_for_status()
            return tuple(float(v) for v in response.json()["embedding"])
        response = self._client.post("/v1/embeddings", json={"model": self.model, "input": text})
        response.raise_for_status()
        return tuple(float(v) for v in response.json()["data"][0]["embedding"])


def embedder_from_environment() -> Embedder:
    """ENGINE_EMBEDDER (hash, ollama or openai), ENGINE_EMBEDDER_URL and ENGINE_EMBEDDER_MODEL."""
    kind = os.environ.get("ENGINE_EMBEDDER", "hash")
    if kind == "hash":
        return HashingEmbedder()
    url, model = os.environ.get("ENGINE_EMBEDDER_URL", ""), os.environ.get("ENGINE_EMBEDDER_MODEL", "")
    if not url or not model:
        raise ValueError(f"ENGINE_EMBEDDER={kind} needs ENGINE_EMBEDDER_URL and ENGINE_EMBEDDER_MODEL")
    return HttpEmbedder(kind, url, model)
