"""JSON extraction: an array becomes one `record` segment per element; any other value is a single record."""

from __future__ import annotations

from mzizi_extraction.core import (
    Code,
    ExtractionProfile,
    Locator,
    Output,
    RecordContent,
    Segment,
    SegmentKind,
    Status,
    error,
    failed,
)
from mzizi_extraction.parse import JsonParseError, load_json


def extract_json(data: bytes, profile: ExtractionProfile | None = None) -> Output:
    profile = profile or ExtractionProfile()
    if len(data) > profile.limits.max_bytes:
        return failed(error(Code.TOO_LARGE, "input exceeds the size limit"))
    try:
        document = load_json(data)
    except JsonParseError as problem:
        return failed(error(Code.INVALID_JSON, str(problem)))
    items = document if isinstance(document, list) else [document]
    segments = tuple(
        Segment(
            key=f"record-{index}",
            kind=SegmentKind.RECORD,
            locator=Locator(line=index),
            content=RecordContent(value=item),
            confidence=1.0,
        )
        for index, item in enumerate(items)
    )
    return Output(status=Status.SUCCEEDED, segments=segments)
