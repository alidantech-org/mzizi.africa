"""The Constitution of Kenya, 2010, article by article, from the Kenya Law Reform Commission site.

Stage A: the instrument and its eighteen chapters. Stage B (after A is promoted): every article, schedule and the
preamble, each under its chapter, with the text kept verbatim. The instrument is in force from its promulgation
on 27 August 2010; later amendments are separate instruments and are not applied here.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

import psycopg
import yaml

from ..seedroot import MAPPINGS_ROOT
from .. import candidates, jobs, pipeline, register
from ..files import LocalDirectoryStore
from ..structure.effective import substitute
from .members import slug

MAPPINGS = MAPPINGS_ROOT / "constitution"
INSTRUMENT_CODE = "ke/constitution-2010"
CHAPTER_TITLES = {1: "Sovereignty of the People and Supremacy of this Constitution", 2: "The Republic", 3: "Citizenship", 4: "The Bill of Rights", 5: "Land and Environment", 6: "Leadership and Integrity", 7: "Representation of the People", 8: "The Legislature", 9: "The Executive", 10: "Judiciary", 11: "Devolved Government", 12: "Public Finance", 13: "The Public Service", 14: "National Security", 15: "Commissions and Independent Offices", 16: "Amendment of this Constitution", 17: "General Provisions", 18: "Transitional and Consequential Provisions"}
STAGES = {"A": ["instrument", "chapter"], "B": ["article"]}


@dataclass
class ConstitutionImport:
    pages: int
    articles: int
    runs: dict[str, str]
    stats: dict[str, candidates.CandidateStats]
    notes: list[str]


def import_constitution(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, stage: str = "A", jurisdiction: str = "ke") -> ConstitutionImport:
    publisher_id = register.ensure_publisher(conn, "ke-klrc", "Kenya Law Reform Commission", kind="institution", website_url="https://www.klrc.go.ke")
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = %s", (jurisdiction,)).fetchone()
    handlers = {"extract": pipeline.extraction_handler(conn, store)}
    pages: list[tuple[str, str, dict]] = []
    notes: list[str] = []
    for meta_path in sorted(Path(directory).glob("*.provenance.json")):
        meta = json.loads(meta_path.read_text())
        data = Path(str(meta_path)[: -len(".provenance.json")]).read_bytes()
        if b'itemprop="articleBody"' not in data:
            continue  # a category listing, not an article
        spec = register.DocumentSpec(publisher_id, f"Constitution of Kenya, 2010: {meta['url'].rsplit('/', 1)[-1]}", "statute", url=meta["url"], licence="Not confirmed (the Constitution as published by the Kenya Law Reform Commission; reuse terms unassessed)", citation=f"Constitution of Kenya, 2010, as published by the Kenya Law Reform Commission, retrieved {meta['retrieved_at'][:10]}.", jurisdiction_id=row["id"] if row else None)
        document_id, capture_id, ref = pipeline.ingest(conn, store, data, meta["url"].rsplit("/", 1)[-1] + ".html", spec, url=meta["url"], tool="gated-fetch", mime_type="text/html")
        job_id, _ = pipeline.enqueue_extraction(conn, ref.version_id, "klrc-constitution", None, capture_id)
        conn.commit()
        while jobs.run_once(conn, handlers, worker="constitution-import"):
            pass
        job = conn.execute("SELECT status, result_file_version_id::text AS fv FROM engine.jobs WHERE id = %s", (job_id,)).fetchone()
        if job["status"] != "succeeded":
            notes.append(f"{meta['url']}: extraction {job['status']}")
            continue
        result = pipeline.load_result(store, job["fv"])
        pages.append((capture_id, str(result.id), json.loads(result.segments[0].content) | {"documentUrl": meta["url"]}))
    runs, stats = {}, {}
    for name in STAGES[stage]:
        mapping = substitute(yaml.safe_load((MAPPINGS / f"{name}.yml").read_text()), {"jurisdiction": jurisdiction})
        run_id = candidates.create_run(conn, f"constitution/{jurisdiction}/{name}", "v1", pages[0][0] if pages else None, pages[0][1] if pages else None)
        total = candidates.CandidateStats()
        records: list[tuple[str, str, dict]] = []
        if name == "instrument" and pages:
            records.append((pages[0][0], pages[0][1], {"instrumentCode": INSTRUMENT_CODE, "instrumentTitle": "Constitution of Kenya, 2010", "documentUrl": "https://www.klrc.go.ke/index.php/constitution-of-kenya"}))
        elif name == "chapter" and pages:
            for number, title in CHAPTER_TITLES.items():
                records.append((pages[0][0], pages[0][1], {"instrumentCode": INSTRUMENT_CODE, "chapterCode": f"{INSTRUMENT_CODE}/ch-{number}", "chapterCitation": f"Constitution of Kenya, 2010, chapter {number}", "chapterHeading": f"Chapter {number}: {title}", "chapterOrder": number * 1000}))
        elif name == "article":
            seen: set[str] = set()
            for capture_id, result_id, page in pages:
                number = page["number"]
                code = f"{INSTRUMENT_CODE}/art-{number.lower()}" if number else f"{INSTRUMENT_CODE}/{page['kind']}-{slug(page['heading'])}"
                if code in seen:
                    continue
                seen.add(code)
                chapter = page["chapter"]
                order = (chapter or 0) * 1000 + (int(number.rstrip("ABCDEFGHIJKLMNOPQRSTUVWXYZ")) if number else 900)
                records.append((capture_id, result_id, {"instrumentCode": INSTRUMENT_CODE, "provisionCode": code, "provisionCitation": f"Constitution of Kenya, 2010, art. {number}" if number else f"Constitution of Kenya, 2010, {page['heading']}", "heading": page["heading"], "text": page["text"], "kind": page["kind"], "chapterCode": f"{INSTRUMENT_CODE}/ch-{chapter}" if chapter else None, "order": order}))
        for capture_id, result_id, record in records:
            one = candidates.add_candidates(conn, run_id, mapping, [("article", record)], result_id, [], [])
            for field in ("created", "unchanged", "superseding", "quarantined", "invalid"):
                setattr(total, field, getattr(total, field) + getattr(one, field))
        candidates.finish_run(conn, run_id)
        runs[name], stats[name] = run_id, total
    conn.commit()
    return ConstitutionImport(len(pages), len([p for p in pages if p[2]["number"]]), runs, stats, notes)
