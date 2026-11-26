"""Fulfilment Kind: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class FulfilmentKind(StrEnum):
    CONTRADICTS = "contradicts"
    DELIVERS = "delivers"
    PARTLY_DELIVERS = "partly-delivers"
