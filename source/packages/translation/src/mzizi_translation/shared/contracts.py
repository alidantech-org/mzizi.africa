"""The data translation works with. Nothing here names a language, a table or a model: callers supply those."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")


class Tier(StrEnum):
    """Where a translation came from, in order of trust."""

    CURATED = "curated"
    GLOSSARY = "glossary"
    MACHINE = "machine"


TIER_ORDER: tuple[Tier, ...] = (Tier.CURATED, Tier.GLOSSARY, Tier.MACHINE)


class Flag(StrEnum):
    """A quality finding. Flagged drafts are still returned; the caller decides what review they need."""

    EMPTY = "empty"
    UNTRANSLATED = "untranslated"
    LENGTH = "length"
    TRUNCATED = "truncated"
    NUMBERS_CHANGED = "numbers-changed"
    PLACEHOLDER_LOST = "placeholder-lost"
    GLOSSARY_MISSED = "glossary-missed"
    MASKS_LOST = "masks-lost"
    BACK_MISMATCH = "back-mismatch"
    #: A glossary entry from a wider context than the text's own was used.
    CONTEXT_FALLBACK = "context-fallback"


class TextUnit(Frozen):
    """One stored text waiting for a translation. `key` is the caller's handle for it."""

    key: str
    text: str
    #: What the text is about (a scheme, a provision designation); engines that take context may use it.
    context: str = ""
    #: Placeholders or tokens that must come through unchanged, beyond the numbers the checks find themselves.
    protected: tuple[str, ...] = ()


class Pair(Frozen):
    """An aligned source text and its existing translation, with the context both appear in (a dotted code, or empty)."""

    source: str
    target: str
    context: str = ""


class Draft(Frozen):
    key: str
    text: str
    tier: Tier
    engine: str
    version: str
    flags: tuple[Flag, ...] = ()


class RunOptions(Frozen):
    source_language: str
    target_language: str
    limit: int = Field(gt=0)
    tiers: tuple[Tier, ...] = TIER_ORDER
    batch_size: int = Field(default=16, gt=0)
    #: Protect glossary terms by masking them before machine translation.
    mask_glossary: bool = True
    #: Translate machine output back and flag drafts whose back-translation shares too little with the source (0 = off).
    back_check_threshold: float = Field(default=0.0, ge=0.0, le=1.0)


class RunReport(Frozen):
    stream: str
    pending: int
    drafts: tuple[Draft, ...]
    #: Keys no engine could translate.
    untranslated: tuple[str, ...]
    saved: int
    applied: bool

    def count(self, tier: Tier) -> int:
        return sum(1 for d in self.drafts if d.tier == tier)

    def flagged(self) -> tuple[Draft, ...]:
        return tuple(d for d in self.drafts if d.flags)
