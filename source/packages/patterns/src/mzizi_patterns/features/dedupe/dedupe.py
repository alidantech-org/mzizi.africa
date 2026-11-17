"""Near-duplicate detection with token shingles, MinHash signatures and Jaccard similarity."""

from __future__ import annotations

import hashlib

from mzizi_patterns.features.tokenise.tokenise import words

SIGNATURE_SIZE = 64
SHINGLE = 3


def shingles(text: str, size: int = SHINGLE) -> frozenset[str]:
    sequence = words(text)
    if len(sequence) < size:
        return frozenset({" ".join(sequence)}) if sequence else frozenset()
    return frozenset(" ".join(sequence[i : i + size]) for i in range(len(sequence) - size + 1))


def jaccard(a: frozenset[str], b: frozenset[str]) -> float:
    if not a and not b:
        return 1.0
    return len(a & b) / len(a | b)


def _hash(seed: int, value: str) -> int:
    digest = hashlib.blake2b(f"{seed}:{value}".encode(), digest_size=8).digest()
    return int.from_bytes(digest, "big")


def minhash(items: frozenset[str], size: int = SIGNATURE_SIZE) -> tuple[int, ...]:
    """A short signature: two documents agree on a position with probability equal to their Jaccard similarity."""
    if not items:
        return (0,) * size
    return tuple(min(_hash(seed, item) for item in items) for seed in range(size))


def signature_similarity(a: tuple[int, ...], b: tuple[int, ...]) -> float:
    return sum(x == y for x, y in zip(a, b, strict=True)) / len(a)
