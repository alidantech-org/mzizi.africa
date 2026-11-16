"""Dataset Assembly: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class DatasetAssembly(StrEnum):
    AS_DOWNLOADED = "as-downloaded"
    ASSEMBLED = "assembled"
    AUTHORED = "authored"
