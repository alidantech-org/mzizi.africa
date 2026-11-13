"""Encoder from typed extraction results to the shared ExtractionResult wire contract.

The wire form carries `locator` and `content` as JSON text. Raw JSON is built here and nowhere else.
"""

from __future__ import annotations

import json

from pydantic import BaseModel

from ..core import Diagnostic, Frozen, Output, Segment


class WireSegment(Frozen):
    key: str
    kind: str
    locator: str
    content: str
    confidence: float


class WireDiagnostic(Frozen):
    level: str
    code: str
    message: str
    locator: str | None = None


class WireOutput(Frozen):
    status: str
    segments: tuple[WireSegment, ...]
    diagnostics: tuple[WireDiagnostic, ...]


def _text(model: BaseModel) -> str:
    return json.dumps(model.model_dump(mode="json", exclude_none=True), sort_keys=True, ensure_ascii=False)


def _segment(segment: Segment) -> WireSegment:
    return WireSegment(
        key=segment.key,
        kind=segment.kind.value,
        locator=_text(segment.locator),
        content=_text(segment.content),
        confidence=segment.confidence,
    )


def _diagnostic(diagnostic: Diagnostic) -> WireDiagnostic:
    locator = _text(diagnostic.locator) if diagnostic.locator is not None else None
    return WireDiagnostic(
        level=diagnostic.level.value, code=diagnostic.code.value, message=diagnostic.message, locator=locator
    )


def encode_output(output: Output) -> WireOutput:
    return WireOutput(
        status=output.status.value,
        segments=tuple(_segment(s) for s in output.segments),
        diagnostics=tuple(_diagnostic(d) for d in output.diagnostics),
    )
