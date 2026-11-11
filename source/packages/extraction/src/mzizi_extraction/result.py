"""The neutral result every extractor returns: a status, segments and diagnostics. Extractors never touch a database."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Output:
    status: str  # succeeded | partial | failed
    segments: list[dict] = field(default_factory=list)
    diagnostics: list[dict] = field(default_factory=list)
