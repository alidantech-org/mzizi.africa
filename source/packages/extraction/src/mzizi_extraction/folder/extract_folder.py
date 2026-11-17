"""Extract text from every PDF under a folder, writing one JSON and one text file per source.

Nothing here knows a website, publisher or database. The caller names the folders and the profile. Files whose bytes are
unchanged since the last run are skipped, so a repeated job only does new work."""

from __future__ import annotations

import hashlib
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field

from mzizi_extraction.core import ExtractionProfile, Status
from mzizi_extraction.encode import encode_output
from mzizi_extraction.pdf import extract_pdf


class FolderRequest(BaseModel):
    model_config = ConfigDict(frozen=True, extra="ignore")

    source: str  # a folder holding the files to extract
    out_dir: str  # where `<name>.json` and `<name>.txt` go
    suffixes: tuple[str, ...] = (".pdf",)
    ocr: bool = True  # recognise scanned pages (needs Tesseract; a missing engine is reported, never silent)
    languages: str = "eng"
    limit: int = Field(default=0, ge=0)  # at most this many new files per run; 0 means no limit


class FileOutcome(BaseModel):
    name: str
    status: str
    segments: int = 0
    characters: int = 0
    unread: tuple[str, ...] = ()  # diagnostic codes that left pages unread


class FolderReport(BaseModel):
    source: str
    out_dir: str
    extracted: int = 0
    skipped: int = 0
    failed: int = 0
    files: tuple[FileOutcome, ...] = ()


def _text_of(segments: list[object]) -> str:
    return "\n\n".join(str(getattr(getattr(s, "content", None), "text", "")) for s in segments).strip()


def extract_folder(request: FolderRequest) -> FolderReport:
    source, out = Path(request.source), Path(request.out_dir)
    out.mkdir(parents=True, exist_ok=True)
    profile = ExtractionProfile(ocr=request.ocr, languages=request.languages)
    outcomes: list[FileOutcome] = []
    extracted = skipped = failed = 0
    for path in sorted(p for p in source.iterdir() if p.is_file() and p.suffix.lower() in request.suffixes):
        data = path.read_bytes()
        digest = hashlib.sha256(data).hexdigest()
        target = out / f"{path.stem}.json"
        marker = out / f"{path.stem}.sha256"
        if marker.is_file() and marker.read_text().strip() == digest and target.is_file():
            skipped += 1
            continue
        if request.limit and extracted + failed >= request.limit:
            break
        result = extract_pdf(data, profile)
        text = _text_of(list(result.segments))
        target.write_text(encode_output(result).model_dump_json(indent=1), encoding="utf-8")
        (out / f"{path.stem}.txt").write_text(text, encoding="utf-8")
        unread = tuple(sorted({d.code.value for d in result.diagnostics if d.level.value != "info"}))
        if result.status is Status.FAILED:
            failed += 1
        else:
            extracted += 1
            marker.write_text(digest)
        outcomes.append(
            FileOutcome(
                name=path.name,
                status=result.status.value,
                segments=len(result.segments),
                characters=len(text),
                unread=unread,
            )
        )
    return FolderReport(
        source=str(source), out_dir=str(out), extracted=extracted, skipped=skipped, failed=failed, files=tuple(outcomes)
    )
