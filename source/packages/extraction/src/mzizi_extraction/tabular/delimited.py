"""CSV extraction: one `row` segment per data row, keyed by the header. Ragged rows are reported, never padded."""

from __future__ import annotations

import csv
import io

from ..core import (
    Code,
    Diagnostic,
    ExtractionProfile,
    Locator,
    Output,
    RowContent,
    Segment,
    SegmentKind,
    Status,
    error,
    failed,
    warning,
)


def extract_csv(data: bytes, profile: ExtractionProfile | None = None) -> Output:
    profile = profile or ExtractionProfile()
    if len(data) > profile.limits.max_bytes:
        return failed(error(Code.TOO_LARGE, "input exceeds the size limit"))
    try:
        text = data.decode("utf-8-sig")
    except UnicodeDecodeError:
        return failed(error(Code.NOT_UTF8, "CSV input is not UTF-8"))
    reader = csv.reader(io.StringIO(text))
    header = next(reader, None)
    if not header:
        return failed(error(Code.EMPTY, "no header row"))
    segments: list[Segment] = []
    diagnostics: list[Diagnostic] = []
    for number, row in enumerate(reader, start=2):
        if not any(cell.strip() for cell in row):
            continue
        locator = Locator(line=number)
        if len(row) != len(header):
            message = f"line {number} has {len(row)} cells, header has {len(header)}"
            diagnostics.append(warning(Code.RAGGED_ROW, message, locator))
        segments.append(
            Segment(
                key=f"row-{number}",
                kind=SegmentKind.ROW,
                locator=locator,
                content=RowContent(cells=dict(zip(header, row, strict=False))),
                confidence=1.0,
            )
        )
    status = Status.PARTIAL if diagnostics else Status.SUCCEEDED
    return Output(status=status, segments=tuple(segments), diagnostics=tuple(diagnostics))
