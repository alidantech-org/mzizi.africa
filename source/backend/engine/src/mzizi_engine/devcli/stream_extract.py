"""Local streaming extraction. Each completed chunk is published before starting the next."""

from __future__ import annotations

import gzip
import json
from itertools import chain, islice
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import TYPE_CHECKING, Literal, TextIO

from pydantic import BaseModel, Field

from mzizi_engine.devcli.artifacts import write_document_artifacts
from mzizi_engine.jsonvalue import Payload

if TYPE_CHECKING:
    from mzizi_extraction.stream import DataFormat

FORMATS: dict[str, DataFormat | Literal["pdf"]] = {
    ".csv": "csv",
    ".tsv": "tsv",
    ".json": "json",
    ".geojson": "json",
    ".jsonl": "jsonl",
    ".ndjson": "jsonl",
    ".xlsx": "xlsx",
    ".pdf": "pdf",
}


class StreamOptions(BaseModel):
    input: Path
    out_dir: Path
    chunk_size: int | None = Field(default=None, ge=1)
    first_page: int | None = Field(default=None, ge=1)
    last_page: int | None = Field(default=None, ge=1)
    ocr: Literal["auto", "off", "force"] | None = None
    languages: str | None = None
    json_array: str | None = None
    gzip: bool = False


def _log_chunk(journal: TextIO, record: Payload) -> None:
    journal.write(json.dumps(record, ensure_ascii=False) + "\n")
    journal.flush()


def _run_pdf(options: StreamOptions, journal: TextIO) -> Payload:
    from mzizi_extraction import DocumentProfile, OcrMode, encode_document, extract_pdf_document
    from mzizi_extraction.stream import pdf_batches

    size = options.chunk_size or 16
    profile = DocumentProfile(
        ocr=OcrMode(options.ocr or "auto"), languages=options.languages or "eng", auto_tables=True
    )
    if size > profile.limits.max_pages:
        raise ValueError(f"PDF chunk size exceeds the limit of {profile.limits.max_pages} pages")
    pages = chunks = incomplete = 0
    total = 0
    for batch in pdf_batches(options.input, size, options.first_page or 1, options.last_page):
        chunks += 1
        total = batch.source_pages
        name = f"pages-{batch.first:06d}-{batch.last:06d}"
        destination = options.out_dir / name
        result = extract_pdf_document(batch.data, profile, page_offset=batch.first - 1)
        with TemporaryDirectory(dir=options.out_dir) as temporary:
            staging = Path(temporary) / "chunk"
            staging.mkdir()
            summary = write_document_artifacts(staging, encode_document(result).model_dump(mode="json"))
            (staging / "summary.json").write_text(summary.model_dump_json(indent=2), encoding="utf-8")
            staging.rename(destination)
        pages += summary.pages
        incomplete += summary.status != "succeeded"
        _log_chunk(
            journal,
            {
                "chunk": name,
                "first_page": batch.first,
                "last_page": batch.last,
                "pages": summary.pages,
                "status": summary.status,
            },
        )
    return {
        "pages": pages,
        "source_pages": total,
        "chunks": chunks,
        "incomplete_chunks": incomplete,
        "complete": incomplete == 0,
    }


def _run_rows(options: StreamOptions, kind: DataFormat, journal: TextIO) -> Payload:
    from mzizi_extraction.stream import stream_records

    size = options.chunk_size or 5000
    count = chunks = 0
    records = stream_records(options.input, kind, options.json_array)
    suffix = ".jsonl.gz" if options.gzip else ".jsonl"
    for first in records:
        chunks += 1
        name = f"records-{chunks:06d}{suffix}"
        start = count + 1
        with TemporaryDirectory(dir=options.out_dir) as temporary:
            staging = Path(temporary) / name
            with (
                gzip.open(staging, "wt", compresslevel=3, encoding="utf-8", newline="\n")
                if options.gzip
                else staging.open("w", encoding="utf-8", newline="\n")
            ) as output:
                for record in chain((first,), islice(records, size - 1)):
                    output.write(record.json_line())
                    count += 1
            staging.rename(options.out_dir / name)
        _log_chunk(journal, {"chunk": name, "first_record": start, "last_record": count})
    return {"records": count, "chunks": chunks, "complete": True}


def extract_stream(payload: Payload) -> Payload:
    options = StreamOptions.model_validate(payload)
    kind = FORMATS.get(options.input.suffix.lower())
    if kind is None:
        raise ValueError(f"unsupported input format: {options.input.suffix}")
    if kind != "pdf" and any(
        value is not None
        for value in (
            options.first_page,
            options.last_page,
            options.ocr,
            options.languages,
        )
    ):
        raise ValueError("page bounds and OCR options require a PDF")
    if kind == "pdf" and options.gzip:
        raise ValueError("--gzip is for row-oriented inputs")
    if kind != "json" and options.json_array is not None:
        raise ValueError("--json-array requires a JSON document")
    if options.input.suffix.lower() == ".geojson" and options.json_array is None:
        options.json_array = "features"
    journal_path = options.out_dir / "chunks.jsonl"
    with journal_path.open("x", encoding="utf-8") as journal:
        result = _run_pdf(options, journal) if kind == "pdf" else _run_rows(options, kind, journal)
    return {**result, "format": kind, "source": str(options.input), "journal": str(journal_path)}
