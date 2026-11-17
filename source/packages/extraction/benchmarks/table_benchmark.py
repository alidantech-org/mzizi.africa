"""Compare table extraction modes on labelled pages of the ORPP corpus.

Run from the repository root after the ORPP job has downloaded the PDFs:
    uv run python source/packages/extraction/benchmarks/table_benchmark.py

Labels are facts about the documents: kbctv pages 2-24 are an interview transcript (no table); every page of the
party register, the committee roster and tender forms 39, 47, 51 and 52 holds a table. The register also numbers its
parties 1 to 91, which measures row coverage after stitching."""

from __future__ import annotations

import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path

from mzizi_extraction.document import DocumentOutput, DocumentProfile, OcrMode, extract_pdf_document
from mzizi_extraction.document.models import TableBlock
from mzizi_extraction.document.table_stitch import stitch_tables

SOURCE = Path(".dev/websites/ke/or/orpp/_root/scraped/files/pdf")


@dataclass(frozen=True)
class Label:
    prefix: str
    table_pages: frozenset[int]
    prose_pages: frozenset[int]


LABELS = (
    Label("kbctv", frozenset(), frozenset(range(2, 25))),
    Label("full-registered-parties", frozenset(range(1, 29)), frozenset()),
    Label("2019-2018-national-steering", frozenset({1, 2}), frozenset()),
    Label("19052025-final-tender", frozenset({39, 47, 51, 52}), frozenset()),
)

MODES = {
    "ruled only": DocumentProfile(ocr=OcrMode.OFF, figures=False),
    "compare + gate": DocumentProfile(ocr=OcrMode.OFF, figures=False, auto_tables=True),
}


def table_pages(output: DocumentOutput) -> set[int]:
    return {page.number for page in output.pages if any(isinstance(b, TableBlock) for b in page.blocks)}


def register_coverage(output: DocumentOutput) -> tuple[int, int]:
    numbers: set[int] = set()
    for logical in stitch_tables(output.pages):
        for row in logical.rows[1:]:
            match = re.fullmatch(r"(\d+)\.?", row[0].strip()) if row else None
            if match:
                numbers.add(int(match.group(1)))
    return len(numbers & set(range(1, 92))), 91


def main() -> int:
    totals = {
        name: [0, 0, 0, 0] for name in MODES
    }  # true table pages hit, table pages, prose pages wrongly tabled, prose pages
    print(f"{'mode':16} {'pdf':26} {'recall':>9} {'false':>7} {'time':>6}")
    for label in LABELS:
        files = sorted(SOURCE.glob(f"{label.prefix}*.pdf"))
        if not files:
            print(f"missing PDF for {label.prefix}", file=sys.stderr)
            continue
        data = files[0].read_bytes()
        for name, profile in MODES.items():
            started = time.time()
            output = extract_pdf_document(data, profile)
            found = table_pages(output)
            hit = len(found & label.table_pages)
            false = len(found & label.prose_pages)
            totals[name][0] += hit
            totals[name][1] += len(label.table_pages)
            totals[name][2] += false
            totals[name][3] += len(label.prose_pages)
            extra = ""
            if label.prefix.startswith("full-registered"):
                covered, expected = register_coverage(output)
                extra = f"  register rows {covered}/{expected}"
            recall = f"{hit}/{len(label.table_pages)}" if label.table_pages else "-"
            falses = f"{false}/{len(label.prose_pages)}" if label.prose_pages else "-"
            print(f"{name:16} {label.prefix[:26]:26} {recall:>9} {falses:>7} {time.time() - started:5.1f}s{extra}")
    print()
    for name, (hit, tables, false, prose) in totals.items():
        print(f"{name:16} table-page recall {hit}/{tables}  prose pages wrongly tabled {false}/{prose}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
