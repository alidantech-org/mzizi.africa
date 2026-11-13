"""Text embedders: a local ONNX model through fastembed, and a deterministic hashing embedder for tests."""

from __future__ import annotations

import hashlib
import importlib
import math
from collections.abc import Sequence
from typing import Protocol

from mzizi_engine.devservices.errors import ServiceUnavailable
from mzizi_engine.devservices.settings import ServiceSettings

PREPROCESS_VERSION = "md-chunks-v1"
HASH_DIMENSIONS = 64


class Embedder(Protocol):
    name: str

    @property
    def dimensions(self) -> int: ...

    def embed(self, texts: Sequence[str]) -> list[list[float]]: ...


class FastEmbedder:
    """Runs a multilingual sentence-embedding model locally; no key, and no text leaves the machine.

    The model files are downloaded once to the cache folder on first use.
    """

    def __init__(self, settings: ServiceSettings) -> None:
        try:
            module = importlib.import_module("fastembed")
        except ModuleNotFoundError as problem:
            raise ServiceUnavailable(
                "fastembed is not installed: run `uv sync --all-packages --extra services`"
            ) from problem
        cache = settings.embedding_cache or None
        try:
            self._model = module.TextEmbedding(model_name=settings.embedding_model, cache_dir=cache)
        except Exception as problem:
            raise ServiceUnavailable(
                f"could not load embedding model {settings.embedding_model!r}: {str(problem)[:150]}"
            ) from problem
        self.name = settings.embedding_model
        self._dimensions = len(self.embed(["dimension probe"])[0])

    @property
    def dimensions(self) -> int:
        return self._dimensions

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        return [[float(x) for x in vector] for vector in self._model.embed(list(texts))]


class HashEmbedder:
    """Deterministic bag-of-words hashing vectors. Not semantic; it exists so the pipeline is testable offline."""

    name = "hash-embedder-v1"

    @property
    def dimensions(self) -> int:
        return HASH_DIMENSIONS

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        return [self._one(text) for text in texts]

    def _one(self, text: str) -> list[float]:
        vector = [0.0] * HASH_DIMENSIONS
        for word in text.lower().split():
            digest = hashlib.sha256(word.encode()).digest()
            vector[digest[0] % HASH_DIMENSIONS] += 1.0 if digest[1] % 2 == 0 else -1.0
        norm = math.sqrt(sum(x * x for x in vector)) or 1.0
        return [x / norm for x in vector]


def text_hash(text: str) -> str:
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()


HASH_MODEL = "hash"


def make_embedder(settings: ServiceSettings) -> Embedder:
    """`DEV_EMBEDDING_MODEL=hash` selects the offline hashing embedder; anything else is a fastembed model name."""
    return HashEmbedder() if settings.embedding_model == HASH_MODEL else FastEmbedder(settings)
