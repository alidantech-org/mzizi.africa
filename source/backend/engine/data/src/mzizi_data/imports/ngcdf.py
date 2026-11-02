"""NG-CDF allocations and disbursements for every constituency, from the fund's public API.

Stage A: fiscal years and finance units (the fund's board and one committee unit per constituency, with its county in
the unit code). Stage B, after A is promoted: allocations as `finance.budgets` and disbursements as dated
`finance.transfers` from the board to the constituency. Constituency and county names come from the fund's own
constituency list page; a response whose constituency name disagrees with that list is skipped and reported.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import psycopg
import yaml
from lxml import html

from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .budget_table import MAPPINGS as _BUDGET_MAPPINGS, fiscal_year_dates
from .members import slug

MAPPINGS = _BUDGET_MAPPINGS.parent / "ngcdf"
STAGES = {"A": ["fiscal_year", "unit"], "B": ["budget", "transfer"]}
KEYS = {"fiscal_year": ("fiscalYearCode",), "unit": ("unitCode",), "budget": ("unitCode", "fiscalYearCode"), "transfer": ("unitCode", "fiscalYearCode", "date", "amount")}
BOARD_CODE = "ke/ngcdf/board"
CONSTITUENCY = re.compile(r"(\d+)\.\s*([^,]+)")


def constituency_index(page: bytes) -> dict[int, tuple[str, str]]:
    """{constituency id: (county name, constituency name)} from the NG-CDF constituency list page."""
    tree = html.fromstring(page)
    out: dict[int, tuple[str, str]] = {}
    for row in tree.xpath("//table//tr"):
        cells = [" ".join(td.text_content().split()) for td in row.xpath("./td")]
        if len(cells) < 3 or "County" not in cells[1]:
            continue
        county = cells[1].replace(" County", "")
        for match in CONSTITUENCY.finditer(cells[2]):
            out[int(match.group(1))] = (county, match.group(2).strip())
    return out


def _norm(text: str) -> str:
    return re.sub(r"[^a-z]", "", text.lower())


@dataclass
class NgcdfImport:
    files: int
    rows: int
    skipped: list[str]
    runs: dict[str, str]
    stats: dict[str, candidates.CandidateStats]


def import_ngcdf(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, constituency_page: str | Path, stage: str = "A", jurisdiction: str = "ke") -> NgcdfImport:
    index = constituency_index(Path(constituency_page).read_bytes())
    publisher_id = register.ensure_publisher(conn, "ke-ngcdf", "National Government Constituencies Development Fund", kind="institution", website_url="https://ngcdf.go.ke")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    per_file: list[tuple[str, str, list[tuple[str, dict]]]] = []
    skipped: list[str] = []
    for meta_path in sorted(Path(directory).glob("*.provenance.json")):
        meta = json.loads(meta_path.read_text())
        query = parse_qs(urlparse(meta["url"]).query)
        if "constid" not in query or query.get("n", [""])[0] not in ("mobile-allocations", "mobile-disbursements"):
            continue
        constid, kind = int(query["constid"][0]), query["n"][0].replace("mobile-", "")
        county, name = index.get(constid, (None, None))
        data = Path(str(meta_path)[: -len(".provenance.json")]).read_bytes()
        title = f"NG-CDF {kind} for constituency {constid}" + (f" ({name}, {county})" if name else "")
        spec = register.DocumentSpec(publisher_id, title, "dataset", url=meta["url"], licence="Not confirmed (public API of the NG-CDF Board; reuse terms unassessed)", citation=f"NG-CDF Board public API, {kind}, constituency {constid}, retrieved {meta['retrieved_at'][:10]}.", jurisdiction_id=row["id"] if row else None)
        document_id, capture_id, ref = pipeline.ingest(conn, store, data, f"ngcdf-{kind}-{constid}.json", spec, url=meta["url"], tool="gated-fetch", mime_type="application/json")
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "ngcdf-api", kind, capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="ngcdf-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            skipped.append(f"{constid} {kind}: extraction {job['status']}")
            continue
        result = pipeline.load_result(store, job["fv"])
        records = []
        for segment in result.segments:
            record = json.loads(segment.content)
            # the list page may lack an id or spell a name differently; the API's own header for the same id is then used and the county left out
            unit_name = name if name and (_norm(name) in _norm(record["constituency"]) or _norm(record["constituency"]) in _norm(name)) else record["constituency"].title()
            unit_county = county if unit_name == name else county
            first, _, second = record["financialYear"].partition("/")
            label = fiscal_year_dates(f"{first}/{second[-2:]}")
            code = f"ke/ngcdf/{slug(unit_county)}/{slug(unit_name)}" if unit_county else f"ke/ngcdf/{slug(unit_name)}"
            where = f" ({unit_county} county)" if unit_county else ""
            records.append((segment.key, dict(record, unitCode=code, unitName=f"NG-CDF committee: {unit_name.title()} constituency{where}", levelCode="finance/unit-level/constituency-fund", fiscalYearCode=f"fy/{jurisdiction}/{label[0]}", startsOn=label[1], endsOn=label[2], boardUnitCode=BOARD_CODE)))
        if records:
            per_file.append((capture_id, str(result.id), records))
    board = ("board", {"constituency": "BOARD", "amount": "0", "financialYear": "2020/2021", "unitCode": BOARD_CODE, "unitName": "National Government Constituencies Development Fund Board", "levelCode": "finance/unit-level/mda", "fiscalYearCode": "", "startsOn": "", "endsOn": "", "date": ""})
    if per_file:
        per_file[0][2].append(board)
    runs, stats = {}, {}
    for name in STAGES[stage]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"ngcdf/{jurisdiction}/{name}", "v1", per_file[0][0] if per_file else None, per_file[0][1] if per_file else None)
        total = candidates.CandidateStats()
        seen: set[tuple] = set()
        for _capture, result_id, records in per_file:
            subset = []
            for key, record in records:
                is_allocation = "date" not in record
                if (name == "budget" and not is_allocation) or (name == "transfer" and is_allocation) or (name == "transfer" and record.get("unitCode") == BOARD_CODE):
                    continue
                if name == "fiscal_year" and not record["fiscalYearCode"]:
                    continue
                if name == "budget" and record["unitCode"] == BOARD_CODE:
                    continue
                ident = tuple(record.get(f) for f in KEYS[name])
                if name == "transfer":
                    ident = (*ident, key, _capture)
                if ident in seen:
                    continue
                seen.add(ident)
                subset.append((key, record))
            one = candidates.add_candidates(conn, run_id, mapping, subset, result_id, [], [])
            for field in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(total, field, getattr(total, field) + getattr(one, field))
        candidates.finish_run(conn, run_id)
        runs[name], stats[name] = run_id, total
    conn.commit()
    return NgcdfImport(len(per_file), sum(len(r) for _, _, r in per_file), skipped, runs, stats)
