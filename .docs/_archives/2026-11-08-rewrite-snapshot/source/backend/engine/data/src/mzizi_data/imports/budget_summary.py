"""The 'Summary of Budget' table of a national budget summary (arms of government), read from a scanned page.

Scanned tables are the least reliable input the engine meets: OCR swaps and drops digits (a real Kenyan
Treasury page read 27,719.8 and 27,179.8 for a figure that the totals show is 27,779.8). So nothing is staged
unless the table adds up: the arms must sum to the national government line and the three groups to the total
(within one rounding step). A column that does not add up is reported and skipped, never guessed.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path

import psycopg
import yaml

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .budget_table import MAPPINGS, BudgetImport, fiscal_year_dates

AMOUNT = re.compile(r"\(?\d{1,3}(?:,\d{3})*\.\d\)?")
ROWS = {
    "national": "nationalgovernment",
    "executive": "executive",
    "parliament": "parliament",
    "judiciary": "judiciary",
    "cfs": "consolidatedfundservices",
    "county": "countygovernment",
    "total": "total",
}
UNIT_NAMES = {"executive": "Executive", "parliament": "Parliament", "judiciary": "Judiciary", "cfs": "Consolidated Fund Services", "county": "County Governments"}
TOLERANCE = Decimal("0.3")


def _amount(token: str) -> Decimal:
    negative = token.startswith("(")
    value = Decimal(token.strip("()").replace(",", ""))
    return -value if negative else value


def read_rows(text: str, column: int) -> tuple[dict[str, Decimal], list[str]]:
    """The chosen amount column (0-based among the amounts of a row) for each known row, plus problems."""
    found: dict[str, Decimal] = {}
    problems: list[str] = []
    for line in text.splitlines():
        letters = re.sub(r"[^a-z]", "", line.lower().split("ksh")[0] if "total" in line.lower() else re.sub(r"[\d,\.\(\)\-|]", "", line.lower()))
        key = next((k for k, needle in ROWS.items() if letters.startswith(needle)), None)
        if key is None or key in found:
            continue
        amounts = AMOUNT.findall(line)
        if len(amounts) <= column:
            problems.append(f"{ROWS[key]}: only {len(amounts)} readable amounts in {line.strip()[:70]!r}")
            continue
        found[key] = _amount(amounts[column])
    return found, problems


def check_totals(rows: dict[str, Decimal]) -> list[str]:
    problems: list[str] = []
    missing = [k for k in ROWS if k not in rows]
    if missing:
        return [f"rows not readable: {', '.join(missing)}"]
    arms = rows["executive"] + rows["parliament"] + rows["judiciary"]
    if abs(arms - rows["national"]) > TOLERANCE:
        problems.append(f"executive + parliament + judiciary {arms} differs from national government {rows['national']}")
    whole = rows["national"] + rows["cfs"] + rows["county"]
    if abs(whole - rows["total"]) > TOLERANCE:
        problems.append(f"national + consolidated fund services + county {whole} differs from the total {rows['total']}")
    return problems


def ocr_variants(raw: bytes) -> list[str]:
    """Several OCR readings of the first page (resolution, thresholding, layout mode): scans read differently each way."""
    import io

    import pypdfium2 as pdfium

    from ..extractors import ocr

    page = pdfium.PdfDocument(raw)[0]
    texts: list[str] = []
    for scale in (3.0, 4.17):
        base = page.render(scale=scale).to_pil().convert("L")
        for threshold in (None, 170, 200):
            image = base.point(lambda v, t=threshold: 255 if v > t else 0) if threshold else base
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            for psm in ("4", "6"):
                previous, ocr.PSM = ocr.PSM, psm
                try:
                    texts.append(ocr.recognise(buffer.getvalue(), "eng")[0])
                except ocr.OcrUnavailable:
                    pass
                finally:
                    ocr.PSM = previous
    texts += _poppler_readings(raw)
    return texts


def _poppler_readings(raw: bytes) -> list[str]:
    """Poppler's renderer gives cleaner table digits than pdfium on some scans; used when pdftoppm is installed."""
    import shutil
    import subprocess
    import tempfile

    from ..extractors import ocr

    if not shutil.which("pdftoppm"):
        return []
    texts: list[str] = []
    with tempfile.TemporaryDirectory() as directory:
        source = Path(directory) / "page.pdf"
        source.write_bytes(raw)
        for dpi in (200, 300):
            subprocess.run(["pdftoppm", "-r", str(dpi), "-f", "1", "-l", "1", "-png", "-singlefile", str(source), str(Path(directory) / f"p{dpi}")], check=True, capture_output=True, timeout=120)
            image = (Path(directory) / f"p{dpi}.png").read_bytes()
            for psm in ("4", "6"):
                previous, ocr.PSM = ocr.PSM, psm
                try:
                    texts.append(ocr.recognise(image, "eng")[0])
                except ocr.OcrUnavailable:
                    pass
                finally:
                    ocr.PSM = previous
    return texts


def consensus(texts: list[str], column: int) -> tuple[dict[str, Decimal], list[str]]:
    """The combination of values, one per row, seen in some reading and that adds up; most-seen values are tried first."""
    from collections import Counter
    from itertools import product

    seen: dict[str, Counter] = {key: Counter() for key in ROWS}
    for text in texts:
        rows, _ = read_rows(text, column)
        for key, value in rows.items():
            seen[key][value] += 1
    if any(not counter for counter in seen.values()):
        return {}, [f"rows not readable: {', '.join(k for k, c in seen.items() if not c)}"]
    keys = list(ROWS)
    options = [[value for value, _ in seen[key].most_common(4)] for key in keys]
    for combination in product(*options):
        rows = dict(zip(keys, combination))
        if not check_totals(rows):
            return rows, [f"values confirmed by arithmetic across {len(texts)} OCR readings"]
    return {}, [f"no combination of {len(texts)} OCR readings adds up"]


def import_budget_summary(conn: psycopg.Connection, store: LocalDirectoryStore, path: str | Path, jurisdiction: str, fiscal_year: str, title: str, publisher_code: str, publisher_name: str, column: int = 3, scale: int = 1_000_000, currency: str = "KES", url: str | None = None, source_tool: str = "gated-fetch", stages: tuple[str, ...] = ("fiscal_year", "unit")) -> BudgetImport:
    raw = Path(path).read_bytes()
    publisher_id = register.ensure_publisher(conn, publisher_code, publisher_name, kind="institution")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    spec = register.DocumentSpec(publisher_id, title, "budget", url=url, licence="Not confirmed (a public budget document; reuse terms recorded as unassessed)", citation=f"{publisher_name}, {title}, fiscal year {fiscal_year}.", jurisdiction_id=row["id"] if row else None)
    document_id, capture_id, ref = pipeline.ingest(conn, store, raw, Path(path).name, spec, url=url, tool=source_tool, mime_type="application/pdf")
    job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "pdf", "ocr", capture_id)
    conn.commit()
    while jobs.run_once(conn, {"extract": pipeline.extraction_handler(conn, store)}, worker="budget-summary"):
        pass
    job = conn.execute("SELECT status, result_file_version_id::text AS fv, error FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
    if job["status"] != "succeeded":
        raise RuntimeError(f"extraction did not succeed: {job['status']} {job['error']}")
    result = pipeline.load_result(store, job["fv"])
    label, starts, ends = fiscal_year_dates(fiscal_year)
    problems: list[str] = []
    rows: dict[str, Decimal] = {}
    segment_key = ""
    for segment in result.segments:
        text = json.loads(segment.content).get("text", "")
        found, issues = read_rows(text, column)
        if len(found) >= 5:
            rows, problems, segment_key = found, issues, segment.key
            break
    if not rows or check_totals(rows):
        rows, problems = consensus(ocr_variants(raw), column)
        segment_key = segment_key or "page-1"
        if not rows:
            raise RuntimeError("the table does not add up under any OCR reading, nothing was staged: " + "; ".join(problems))
    problems += check_totals(rows)
    if any("differs" in p or "not readable" in p for p in problems):
        raise RuntimeError("the table does not add up, nothing was staged: " + "; ".join(problems))
    year = [("fiscal-year", {"fiscalYear": label, "startsOn": starts, "endsOn": ends, "table": "all"})]
    units = [(segment_key, {"label": name, "table": segment_key, "row": i}) for i, name in enumerate(UNIT_NAMES.values())]
    budgets = [(f"{segment_key}/{key}/total", {"label": name, "fiscalYear": label, "column": "total", "amount": str(rows[key] * scale), "currency": currency, "table": segment_key, "row": i}) for i, (key, name) in enumerate(UNIT_NAMES.items())]
    runs, stats = {}, {}
    for name, records in zip(["fiscal_year", "unit", "budget"], (year, units, budgets)):
        if name not in stages:
            continue
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"budget-summary/{jurisdiction}/{fiscal_year.replace('/', '-')}/{name}", "v1", capture_id, str(result.id))
        stats[name] = candidates.add_candidates(conn, run_id, mapping, records, str(result.id), ["none_known"], [])
        candidates.finish_run(conn, run_id)
        runs[name] = run_id
    conn.commit()
    return BudgetImport(document_id, capture_id, str(result.id), runs, stats, problems)
