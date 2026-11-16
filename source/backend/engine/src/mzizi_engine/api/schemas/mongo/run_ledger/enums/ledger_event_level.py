"""Ledger Event Level: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class LedgerEventLevel(StrEnum):
    ERROR = "error"
    INFO = "info"
