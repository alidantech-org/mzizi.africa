"""A budget table from a PDF (for example an MDA allocations table) into fiscal year, unit and budget candidates.

The PDF is preserved first, extracted with the `pdf` extractor and the `tables` (and optionally `ocr`)
profile, each table is realigned and its unit and scale read (see tables.py), and the rows become
candidates through the mapping files in seed/system/mappings/budget. Nothing canonical is written. Stage `fiscal_year` and `unit`
first, promote them after review, then stage `budget` (it references them by code); the second call is
idempotent on the document, capture and extraction. Promote in that order. The licence is recorded as unconfirmed; a human
reviewer decides before promotion.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import psycopg
import yaml

from ..seedroot import MAPPINGS_ROOT
from .. import candidates, jobs, pipeline, register, tables
from ..files import LocalDirectoryStore
from ..structure.effective import substitute

MAPPINGS = MAPPINGS_ROOT / "budget"
ORDER = ["fiscal_year", "unit", "budget"]
AMOUNT_COLUMNS = {"recurrent", "development"}  # "total" is derived and only cross-checked


@dataclass
class BudgetImport:
    document_id: str
    capture_id: str
    result_id: str
    runs: dict[str, str]
    stats: dict[str, candidates.CandidateStats]
    problems: list[str]


def fiscal_year_dates(label: str, start_month: int = 7) -> tuple[str, str, str]:
    """('2023/24', '2023-07-01', '2024-06-30') for a label like 2023/24."""
    match = re.search(r"(\d{4})\s*[/\-]\s*(\d{2,4})", label)
    if not match:
        raise ValueError(f"not a fiscal year: {label!r}")
    start = int(match.group(1))
    first = date(start, start_month, 1)
    end = date(start + 1, start_month, 1) if start_month != 1 else date(start + 1, 1, 1)
    last = date.fromordinal(end.toordinal() - 1)
    return f"{start}/{str(start + 1)[-2:]}", first.isoformat(), last.isoformat()


def records_from_segments(segments, fiscal_year: str, start_month: int, default_currency: str | None) -> tuple[list[tuple[str, dict]], list[tuple[str, dict]], list[tuple[str, dict]], list[str]]:
    label, starts, ends = fiscal_year_dates(fiscal_year, start_month)
    problems: list[str] = []
    units: dict[str, tuple[str, dict]] = {}
    budgets: list[tuple[str, dict]] = []
    for segment in segments:
        if getattr(segment.kind, "value", segment.kind) != "table":
            continue
        content = json.loads(segment.content)
        parsed = tables.parse_table(content["rows"])
        problems += [f"{segment.key}: {p}" for p in parsed.problems]
        currency = parsed.currency or default_currency
        if not parsed.columns or not parsed.rows:
            continue
        if not AMOUNT_COLUMNS & {c.lower() for c in parsed.columns}:
            continue  # not an allocation table
        if currency is None:
            problems.append(f"{segment.key}: the table states no currency and none was given; skipped")
            continue
        for index, row in enumerate(parsed.rows):
            if not row["label"] or row["label"].lower().startswith("total"):
                continue
            units.setdefault(row["label"], (segment.key, {"label": row["label"], "table": segment.key, "row": index}))
            parts = {c.lower(): v for c, v in row["values"].items()}
            for column, value in row["values"].items():
                if column.lower() not in AMOUNT_COLUMNS or value is None:
                    continue
                budgets.append((f"{segment.key}/{index}/{column}", {"label": row["label"], "fiscalYear": label, "column": column.lower(), "amount": str(value * parsed.scale), "currency": currency, "table": segment.key, "row": index}))
            total = parts.get("total")
            if total is not None and AMOUNT_COLUMNS & parts.keys():
                got = sum((parts[c] for c in AMOUNT_COLUMNS if parts.get(c) is not None), start=type(total)(0))
                if got != total:
                    problems.append(f"{segment.key} row {row['label'][:40]!r}: recurrent + development {got} differs from total {total}")
    year = [("fiscal-year", {"fiscalYear": label, "startsOn": starts, "endsOn": ends, "table": "all"})]
    return year, list(units.values()), budgets, problems


def import_budget_table(conn: psycopg.Connection, store: LocalDirectoryStore, path: str | Path, jurisdiction: str, fiscal_year: str, title: str, publisher_code: str, publisher_name: str, start_month: int = 7, default_currency: str | None = None, profile: str = "tables", url: str | None = None, stages: tuple[str, ...] = ("fiscal_year", "unit")) -> BudgetImport:
    raw = Path(path).read_bytes()
    publisher_id = register.ensure_publisher(conn, publisher_code, publisher_name, kind="institution")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    spec = register.DocumentSpec(publisher_id, title, "budget", url=url, licence="Not confirmed by a human reviewer (a public budget document; confirm reuse terms before promotion)", citation=f"{publisher_name}, {title}, fiscal year {fiscal_year}.", jurisdiction_id=row["id"] if row else None)
    document_id, capture_id, ref = pipeline.ingest(conn, store, raw, Path(path).name, spec, url=url, tool="manual-download", mime_type="application/pdf")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "pdf", profile, capture_id)
    conn.commit()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    while jobs.run_once(conn, handlers, worker="budget-import"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction did not succeed: {job['status']} {job['error']}")
    result = pipeline.load_result(store, job["fv"])
    year, units, budgets, problems = records_from_segments(result.segments, fiscal_year, start_month, default_currency)
    if not budgets:
        raise RuntimeError("no allocation table was found in the document" + (f" ({'; '.join(problems)})" if problems else ""))
    runs, stats = {}, {}
    for name, records in zip(ORDER, (year, units, budgets)):
        if name not in stages:
            continue  # budgets reference units and years by code, so they are staged after those are promoted
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"budget/{jurisdiction}/{fiscal_year.replace('/', '-')}/{name}", "v1", capture_id, str(result.id))
        stats[name] = candidates.add_candidates(conn, run_id, mapping, records, str(result.id), ["none_known"], [])
        candidates.finish_run(conn, run_id)
        runs[name] = run_id
    conn.commit()
    return BudgetImport(document_id, capture_id, str(result.id), runs, stats, problems)
