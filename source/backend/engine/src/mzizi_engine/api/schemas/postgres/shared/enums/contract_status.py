"""Contract Status: a closed vocabulary."""

from __future__ import annotations

from enum import StrEnum


class ContractStatus(StrEnum):
    COMPLETED = "completed"
    ONGOING = "ongoing"
    SIGNED = "signed"
    TERMINATED = "terminated"
