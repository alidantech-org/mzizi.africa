"""Iterate source-located records and bounded derived PDF page batches."""

from __future__ import annotations

import csv
import io
from collections.abc import Iterator
from dataclasses import dataclass
from datetime import date, time, timedelta
from itertools import chain
from pathlib import Path
from typing import Literal, cast

import pypdfium2 as pdfium
import simplejson  # type: ignore[import-untyped]

type DataFormat = Literal["csv", "tsv", "json", "jsonl", "xlsx"]


@dataclass(frozen=True)
class StreamRecord:
    number: int
    value: object
    sheet: str | None = None

    def json_line(self) -> str:
        line = cast(
            str,
            simplejson.dumps(
                {"number": self.number, "sheet": self.sheet, "value": self.value},
                ensure_ascii=False,
                default=_encode_cell,
            ),
        )
        return line + "\n"


def _encode_cell(value: object) -> str:
    if isinstance(value, (date, time)):
        return value.isoformat()
    if isinstance(value, timedelta):
        return str(value)
    raise TypeError(f"unsupported value type: {type(value).__name__}")


def _json_records(path: Path, array: str | None) -> Iterator[StreamRecord]:
    import ijson  # type: ignore[import-untyped]

    if array is not None and (not array or "." in array):
        raise ValueError("JSON array name must be a non-empty top-level key without dots")
    with path.open("rb") as source:
        events = ijson.parse(source)
        root = next(events, None)
        if array is None:
            if root != ("", "start_array", None):
                raise ValueError("JSON must be a top-level array or specify --json-array NAME")
            items = ijson.items(chain((root,), events), "item")
        else:
            if root != ("", "start_map", None):
                raise ValueError("--json-array requires a top-level JSON object")
            for prefix, event, value in events:
                if (prefix, event) == (array, "start_array"):
                    items = ijson.items(chain(((prefix, event, value),), events), f"{array}.item")
                    break
            else:
                raise ValueError(f"JSON array {array!r} was not found")
        for number, item in enumerate(items, 1):
            yield StreamRecord(number, item)


def stream_records(path: Path, kind: DataFormat, array: str | None = None) -> Iterator[StreamRecord]:
    if kind == "json":
        yield from _json_records(path, array)
    elif kind == "xlsx":
        from openpyxl import load_workbook  # type: ignore[import-untyped]

        workbook = load_workbook(path, read_only=True, keep_links=False, data_only=False)
        try:
            for sheet in workbook.worksheets:
                sheet.reset_dimensions()
                for number, row in enumerate(sheet.iter_rows(values_only=True), 1):
                    yield StreamRecord(number, row, sheet.title)
        finally:
            workbook.close()
    else:
        with path.open("r", encoding="utf-8-sig", newline="") as source:
            if kind == "jsonl":
                for number, line in enumerate(source, 1):
                    if line.strip():
                        yield StreamRecord(number, simplejson.loads(line, use_decimal=True))
            else:
                rows = csv.reader(source, delimiter="\t" if kind == "tsv" else ",", strict=True)
                for number, row in enumerate(rows, 1):
                    yield StreamRecord(number, row)


@dataclass(frozen=True)
class PdfBatch:
    first: int
    last: int
    source_pages: int
    data: bytes


def pdf_batches(path: Path, size: int, first: int = 1, last: int | None = None) -> Iterator[PdfBatch]:
    if size < 1:
        raise ValueError("PDF batch size must be positive")
    with pdfium.PdfDocument(path) as source:
        total = len(source)
        end = total if last is None else last
        if not 1 <= first <= end <= total:
            raise ValueError(f"requested pages {first}-{end} outside a {total}-page PDF")
        for start in range(first, end + 1, size):
            stop = min(end, start + size - 1)
            with pdfium.PdfDocument.new() as batch:
                batch.import_pages(source, pages=list(range(start - 1, stop)))
                buffer = io.BytesIO()
                batch.save(buffer)
            yield PdfBatch(start, stop, total, buffer.getvalue())
