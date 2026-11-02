"""Register, preserve and extract (DATA_INTAKE_PLAN.md stages 1 to 4).

`ingest` stores raw bytes through the files interface and records a document and capture;
`extract` is the job handler that turns a preserved file version into a new, immutable
ExtractionResult stored as a file. Neither writes canonical domain tables.
"""
from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone

import psycopg

from . import extractors, jobs, register
from .contracts.exchange_models import ExtractionResult, FileArtifactRef
from .files import FileVersionRef, LocalDirectoryStore, sha256

RESULT_FOLDER = "/extraction-results"
ARTIFACT_FOLDER = "/source-artifacts"


def ingest(conn: psycopg.Connection, store: LocalDirectoryStore, data: bytes, name: str, spec: register.DocumentSpec, url: str | None = None, tool: str = "manual-upload", mime_type: str | None = None, **capture_links: str | None) -> tuple[str, str, FileVersionRef]:
    """Preserves the bytes first, then registers the document and records the retrieval. Returns (document id, capture id, file version)."""
    ref = store.put(data, name, ARTIFACT_FOLDER, mime_type=mime_type, note=f"preserved from {url or tool}")
    document_id = register.ensure_document(conn, spec)
    capture_id = register.record_capture(conn, document_id, ref.version_id, ref.content_hash, url or spec.url, tool, **capture_links)
    return document_id, capture_id, ref


def enqueue_extraction(conn: psycopg.Connection, file_version_id: str, extractor: str, profile: str | None = None, capture_id: str | None = None, rerun: bool = False) -> tuple[str, bool]:
    payload = {"fileVersionId": file_version_id, "extractor": extractor, "profile": profile, "captureId": capture_id}
    return jobs.enqueue(conn, "extract", payload, rerun=rerun)


def extraction_handler(conn: psycopg.Connection, store: LocalDirectoryStore):
    def handle(job: jobs.Job):
        payload = job.input
        extractor = extractors.get(payload["extractor"])
        data = store.get(payload["fileVersionId"])
        ref = store.ref(payload["fileVersionId"])
        started = datetime.now(timezone.utc)
        output = extractor.run(data, payload.get("profile"))
        finished = datetime.now(timezone.utc)

        document_id = None
        if payload.get("captureId"):
            row = conn.execute("SELECT document_id, retrieved_url, retrieved_at FROM source.captures WHERE id = %s", (payload["captureId"],)).fetchone()
            document_id = str(row["document_id"]) if row else None
        previous = conn.execute(
            "SELECT result_file_version_id FROM engine.jobs WHERE kind = 'extract' AND input_hash = %s AND generation < %s AND status = 'succeeded' ORDER BY generation DESC LIMIT 1", (jobs.input_hash("extract", payload), job.generation)
        ).fetchone()

        result, stored = store_result(store, ref, extractor.name, extractor.version, payload.get("profile"), output.status, output.segments, output.diagnostics, started, finished, payload.get("captureId"), document_id, payload)
        summary = {"resultId": str(result.id), "status": output.status, "segments": len(output.segments), "diagnostics": len(output.diagnostics), "supersedesResultFile": str(previous["result_file_version_id"]) if previous and previous["result_file_version_id"] else None}
        if output.status == "failed":
            raise jobs.NonRetryable("; ".join(d["message"] for d in output.diagnostics if d["level"] == "error")[:500] or "extraction failed")
        return summary, stored.version_id

    return handle


def store_result(store: LocalDirectoryStore, ref: FileVersionRef, extractor: str, version: str, profile: str | None, status: str, segments: list[dict], diagnostics: list[dict], started: datetime, finished: datetime, capture_id: str | None = None, document_id: str | None = None, input_payload: dict | None = None, structure_version_id: str | None = None):
    """Builds a schema-valid ExtractionResult and stores it as a new file; results are never overwritten."""
    result = ExtractionResult.model_validate(
        {
            "id": str(uuid.uuid4()),
            "artifact": FileArtifactRef.model_validate({"fileVersionId": ref.version_id, "captureId": capture_id, "documentId": document_id, "contentHash": ref.content_hash, "sizeBytes": ref.size_bytes, "mimeType": ref.mime_type}).model_dump(mode="json", exclude_none=True),
            "extractor": extractor,
            "extractorVersion": version,
            "profile": profile,
            "structureVersionId": structure_version_id,
            "status": status,
            "segments": segments,
            "diagnostics": diagnostics,
            "startedAt": started.isoformat(),
            "finishedAt": finished.isoformat(),
            "inputHash": sha256(json.dumps(input_payload or {}, sort_keys=True).encode() + bytes.fromhex(ref.content_hash)),
        }
    )
    body = json.dumps(result.model_dump(mode="json", exclude_none=True), indent=1, ensure_ascii=False).encode()
    return result, store.put(body, f"{result.id}.json", RESULT_FOLDER, mime_type="application/json", note=f"{extractor} {version}")


def load_result(store: LocalDirectoryStore, result_file_version_id: str) -> ExtractionResult:
    return ExtractionResult.model_validate_json(store.get(result_file_version_id))
