"""Official portraits of members of Parliament, fetched through the collection gate and kept as raw artifacts.

Each image is a document (the portrait as published, with its URL and licence unassessed), a capture with the
assessment that governed the fetch, and an attribution `derived_from` linking it to the person. Re-running skips
portraits already captured. Placeholder silhouettes are never fetched.
"""
from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urljoin

import psycopg

from .. import register
from ..extractors import parliament_members
from ..files import LocalDirectoryStore
from .members import enrich
from .. import pipeline

BASE = "https://www.parliament.go.ke"


def fetch_photos(conn: psycopg.Connection, store: LocalDirectoryStore, directory: str | Path, fetcher, limit: int | None = None, log=print) -> dict:
    publisher_id = register.ensure_publisher(conn, "ke-parliament", "Parliament of Kenya", kind="institution", website_url=BASE)
    row = conn.execute("SELECT id::text AS id FROM reference.jurisdictions WHERE code = 'ke'").fetchone()
    method_id = register.ensure_method(conn, "extracted", "gated portrait fetch", "mzizi-data fetch-photos", "0.1.0")
    todo: list[dict] = []
    for meta_path in sorted(Path(directory).glob("*.provenance.json")):
        meta = json.loads(meta_path.read_text())
        profile = "senate" if "/the-senate/" in meta["url"] else "national-assembly" if "/the-national-assembly/" in meta["url"] else None
        if not profile:
            continue
        out = parliament_members.run(Path(str(meta_path)[: -len(".provenance.json")]).read_bytes(), profile)
        for segment in out.segments:
            record = enrich(json.loads(segment.content) if isinstance(segment, object) and hasattr(segment, "content") else json.loads(segment["content"]))
            if record.get("photoPath"):
                todo.append(record)
    stats = {"fetched": 0, "skipped": 0, "failed": 0, "no_person": 0}
    for record in todo[: limit or None]:
        url = urljoin(BASE, record["photoPath"])
        person = conn.execute("SELECT id::text AS id FROM person.individuals WHERE code = %s", (record["personCode"],)).fetchone()
        if not person:
            stats["no_person"] += 1
            continue
        title = f"Official portrait of {record['displayName']} (Parliament of Kenya)"
        if conn.execute("SELECT 1 FROM source.documents WHERE publisher_id = %s AND title = %s", (publisher_id, title)).fetchone():
            stats["skipped"] += 1
            continue
        try:
            result = fetcher.get(url)
        except Exception as error:  # noqa: BLE001  (denials, robots, challenges stop only this item; a tripped fetcher raises every time)
            log(f"FAILED {url}: {type(error).__name__}: {str(error)[:100]}")
            stats["failed"] += 1
            if getattr(fetcher, "tripped", None):
                break
            continue
        if result.status != 200 or not result.headers.get("content-type", "").startswith("image/"):
            stats["failed"] += 1
            continue
        suffix = "." + (result.headers["content-type"].split("/")[1].split(";")[0].replace("jpeg", "jpg"))
        spec = register.DocumentSpec(publisher_id, title, "official_website", url=url, licence="Not confirmed (official portrait published by Parliament; reuse terms unassessed)", citation=f"Parliament of Kenya member profile photo of {record['displayName']}.", jurisdiction_id=row["id"] if row else None)
        document_id, capture_id, _ref = pipeline.ingest(conn, store, result.body, f"{record['personCode'].rsplit('/', 1)[-1]}{suffix}", spec, url=url, tool="gated-fetch", mime_type=result.headers["content-type"].split(";")[0], assessment_id=result.assessment_id)
        conn.execute(
            """INSERT INTO source.attributions (document_id, capture_id, target_kind, target_id, target_field, relation, method_id, confidence, created_at, updated_at, version)
               VALUES (%s, %s, 'person.individuals', %s, 'portrait', 'derived_from', %s, 1, now(), now(), 1)""",
            (document_id, capture_id, person["id"], method_id),
        )
        conn.commit()
        stats["fetched"] += 1
    return stats
