"""Rank the documents of a site folder by what they are and what they are about, so extraction can start with the ones that matter.

Each file is scored on its name, its first line and its text (plain text for a PDF, the saved Markdown for a page) against the term
lists and the document profile. The ranking is explainable: every row names the kind, the subjects, the confidence and the words
that decided it. A PDF with no text layer is ranked on its name alone and says so."""

from __future__ import annotations

import csv
import re
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field

from mzizi_extraction import extract_pdf
from mzizi_extraction.core import ExtractionProfile
from mzizi_patterns import DocumentText, PatternOrchestrator, load_profile, load_term_list

MAX_BODY = 60_000


class RankRequest(BaseModel):
    model_config = ConfigDict(frozen=True, extra="ignore")

    source: str  # a folder of files (PDFs or saved pages)
    out: str  # the ranking CSV to write
    profile: str = ".docs/_plan/orpp-sources/engine/docs/profile.yaml"
    seed: str = "seed"
    suffixes: tuple[str, ...] = (".pdf",)
    limit: int = Field(default=0, ge=0)  # rank at most this many files; 0 means all


class Ranked(BaseModel):
    name: str
    impact: str
    kind: str
    subjects: str
    confidence: float
    has_text: bool
    reason: str


class RankReport(BaseModel):
    out: str
    files: int
    by_impact: dict[str, int]
    without_text: int
    top: tuple[Ranked, ...]


def _document(path: Path) -> tuple[DocumentText, bool]:
    stem = re.sub(r"--[0-9a-f]{8}$", "", path.stem)
    body = ""
    if path.suffix.lower() == ".pdf":
        result = extract_pdf(path.read_bytes(), ExtractionProfile(ocr=False))
        body = "\n".join(str(getattr(getattr(s, "content", None), "text", "")) for s in result.segments)[:MAX_BODY]
    else:
        sibling = path.with_suffix(".md")
        body = sibling.read_text(encoding="utf-8", errors="ignore")[:MAX_BODY] if sibling.exists() else ""
    title = next((line.strip() for line in body.splitlines() if len(line.strip()) > 8), "")[:200]
    return DocumentText(
        name=path.name, filename=stem.replace("-", " ").replace(".", " "), title=title, body=body
    ), bool(body.strip())


def rank_site(request: RankRequest) -> RankReport:
    seed = Path(request.seed)
    lists = tuple(load_term_list(p) for p in sorted((seed / "terms").rglob("*.yml")))
    engine = PatternOrchestrator(load_profile(Path(request.profile)), lists)
    files = sorted(p for p in Path(request.source).iterdir() if p.is_file() and p.suffix.lower() in request.suffixes)
    if request.limit:
        files = files[: request.limit]
    built = [_document(p) for p in files]
    scores = engine.score_corpus(tuple(d for d, _ in built))
    ranked = [
        Ranked(
            name=s.name,
            impact=s.impact.name,
            kind=s.kind or "",
            subjects=", ".join(s.subjects),
            confidence=s.tags[0].confidence if s.tags else 0.0,
            has_text=has,
            reason=s.reason,
        )
        for s, (_, has) in zip(scores, built, strict=True)
    ]
    order = {"HIGH": 0, "MEDIUM": 1, "LOW": 2, "NOISE": 3}
    ranked.sort(key=lambda r: (order[r.impact], -r.confidence, r.name))
    out = Path(request.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(["rank", "name", "impact", "kind", "subjects", "confidence", "has_text", "reason"])
        for position, r in enumerate(ranked, start=1):
            writer.writerow([position, r.name, r.impact, r.kind, r.subjects, r.confidence, r.has_text, r.reason])
    counts: dict[str, int] = {}
    for r in ranked:
        counts[r.impact] = counts.get(r.impact, 0) + 1
    return RankReport(
        out=str(out),
        files=len(ranked),
        by_impact=counts,
        without_text=sum(not r.has_text for r in ranked),
        top=tuple(ranked[:10]),
    )
