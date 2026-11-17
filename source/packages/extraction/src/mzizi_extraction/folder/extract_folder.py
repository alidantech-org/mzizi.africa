"""Extract text from every PDF under a folder, writing one folder per source (Markdown, structure, tables, images).

Nothing here knows a website, publisher or database. The caller names the folders and the profile. Files whose bytes are
unchanged since the last run are skipped, so a repeated job only does new work."""

from __future__ import annotations

import base64
import hashlib
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field

from mzizi_extraction.core import Status
from mzizi_extraction.document import DocumentProfile, DocumentWire, OcrMode, encode_document, extract_pdf_document


class FolderRequest(BaseModel):
    model_config = ConfigDict(frozen=True, extra="ignore")

    source: str  # a folder holding the files to extract
    out_dir: str  # where one folder per file goes: document.md, structure.json, report.json, tables/*.csv and images
    suffixes: tuple[str, ...] = (".pdf",)
    ocr: bool = True  # recognise scanned pages (needs Tesseract; a missing engine is reported, never silent)
    languages: str = "eng"
    limit: int = Field(default=0, ge=0)  # at most this many new files per run; 0 means no limit


class FileOutcome(BaseModel):
    name: str
    status: str
    segments: int = 0
    characters: int = 0
    tables: int = 0
    images: int = 0
    unread: tuple[str, ...] = ()  # diagnostic codes that left pages unread


class FolderReport(BaseModel):
    source: str
    out_dir: str
    extracted: int = 0
    skipped: int = 0
    failed: int = 0
    files: tuple[FileOutcome, ...] = ()


def _write_document(out: Path, wire: DocumentWire) -> int:
    """Write one document's Markdown, structure, tables and images into its own folder; return the character count."""
    out.mkdir(parents=True, exist_ok=True)
    (out / "document.md").write_text(wire.markdown, encoding="utf-8")
    (out / "structure.json").write_text(wire.structure, encoding="utf-8")
    (out / "report.json").write_text(
        wire.model_dump_json(indent=1, exclude={"markdown", "structure", "assets", "tables"}), encoding="utf-8"
    )
    for table in wire.tables:
        target = out / table.path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(table.csv, encoding="utf-8")
    for asset in wire.assets:
        target = out / asset.path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(base64.b64decode(asset.content_base64))
    return len(wire.markdown)


def extract_folder(request: FolderRequest) -> FolderReport:
    source, out = Path(request.source), Path(request.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    profile = DocumentProfile(
        ocr=OcrMode.AUTO if request.ocr else OcrMode.OFF, languages=request.languages, auto_tables=True
    )
    outcomes: list[FileOutcome] = []
    extracted = skipped = failed = 0
    for path in sorted(p for p in source.iterdir() if p.is_file() and p.suffix.lower() in request.suffixes):
        data = path.read_bytes()
        digest = hashlib.sha256(data).hexdigest()
        folder = out / path.stem
        marker = folder / "source.sha256"
        if marker.is_file() and marker.read_text().strip() == digest:
            skipped += 1
            continue
        if request.limit and extracted + failed >= request.limit:
            break
        result = extract_pdf_document(data, profile)
        wire = encode_document(result)
        characters = _write_document(folder, wire)
        unread = tuple(sorted({d.code for d in wire.diagnostics if d.level != "info"}))
        if result.status is Status.FAILED:
            failed += 1
        else:
            extracted += 1
            marker.write_text(digest)
        outcomes.append(
            FileOutcome(
                name=path.name,
                status=wire.status,
                segments=sum(wire.counts.values()),
                characters=characters,
                unread=unread,
                tables=len(wire.tables),
                images=len(wire.assets),
            )
        )
    return FolderReport(
        source=str(source), out_dir=str(out), extracted=extracted, skipped=skipped, failed=failed, files=tuple(outcomes)
    )
