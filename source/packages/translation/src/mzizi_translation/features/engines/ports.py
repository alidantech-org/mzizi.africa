"""Ports: where text comes from and goes to, and what translates it. The engine implements the store; engines are adapters."""

from __future__ import annotations

from collections.abc import Sequence
from typing import Protocol

from mzizi_translation.shared.contracts import Draft, Pair, TextUnit, Tier


class TextStore(Protocol):
    """Reads texts that need a translation and writes the drafts. The package never knows what stores them."""

    def pending(self, stream: str, source_language: str, target_language: str, limit: int) -> list[TextUnit]: ...

    def pairs(self, stream: str, source_language: str, target_language: str, limit: int) -> list[Pair]: ...

    def save(self, stream: str, source_language: str, target_language: str, drafts: Sequence[Draft]) -> int: ...


class ProvenanceSink(Protocol):
    """Records where each saved draft came from (tier, engine, version, flags). The engine decides where: a ledger file now,
    `source.evidence` once the source catalogue exists. Called after the drafts are saved."""

    def record(self, stream: str, source_language: str, target_language: str, drafts: Sequence[Draft]) -> None: ...


class TranslationEngine(Protocol):
    """Anything that can translate: a lookup table, a local model, a web service. `None` means it cannot translate that text."""

    name: str
    version: str
    tier: Tier

    def supports(self, source_language: str, target_language: str) -> bool: ...

    def translate(self, texts: Sequence[str], source_language: str, target_language: str) -> list[str | None]: ...
