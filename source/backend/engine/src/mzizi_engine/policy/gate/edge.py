"""Edge entry point for the engine capability: raw payloads in, a typed Decision out."""

from __future__ import annotations

from datetime import UTC, datetime

from mzizi_fetch import Decision

from .evaluate import evaluate
from .parse import parse_assessment, parse_request


def decide(
    assessment: dict[str, object] | None,
    dossier_stage: str | None,
    request: dict[str, object],
    now: datetime | None = None,
) -> Decision:
    return evaluate(parse_assessment(assessment), dossier_stage, parse_request(request), now or datetime.now(UTC))
