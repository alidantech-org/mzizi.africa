"""A dependency-free embedder: character trigrams hashed into a fixed-size unit vector.

This is not a language model. Texts that share spelling (Kiambu, Kiambaa, Kiambu County) land near each other; texts that only
share meaning (a Swahili and an English word) do not. It fixes the shape of the vector tier (collections, sync, search) so a
real multilingual model can replace it behind the same `Embedder` protocol without changing anything else."""

from __future__ import annotations

import hashlib
import math
from typing import Protocol

from mzizi_patterns.features.lookup.index import normalise, trigrams


class Embedder(Protocol):
    @property
    def name(self) -> str: ...

    @property
    def dimension(self) -> int: ...

    def embed(self, text: str) -> tuple[float, ...]: ...


class HashingEmbedder:
    def __init__(self, dimension: int = 256) -> None:
        self.dimension = dimension
        self.name = f"hash{dimension}"

    def embed(self, text: str) -> tuple[float, ...]:
        vector = [0.0] * self.dimension
        for gram in trigrams(normalise(text)):
            digest = hashlib.blake2b(gram.encode(), digest_size=8).digest()
            number = int.from_bytes(digest, "big")
            vector[number % self.dimension] += 1.0 if (number >> 63) & 1 else -1.0
        norm = math.sqrt(sum(v * v for v in vector)) or 1.0
        return tuple(v / norm for v in vector)
