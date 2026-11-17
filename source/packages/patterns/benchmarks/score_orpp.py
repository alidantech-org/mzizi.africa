"""Score every downloaded ORPP PDF with the proposed terms and profile and print the ranking.

Run: uv run python source/packages/patterns/benchmarks/score_orpp.py [terms-folder [profile.yaml]]"""

from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path

from mzizi_extraction.core import ExtractionProfile
from mzizi_extraction.pdf import extract_pdf
from mzizi_patterns import DocumentText, PatternOrchestrator, load_profile, load_term_list

PDFS = Path(".dev/websites/ke/or/orpp/_root/scraped/files/pdf")
MAX_BODY = 60_000


def text_of(path: Path) -> DocumentText:
    result = extract_pdf(path.read_bytes(), ExtractionProfile(ocr=False))
    lines = [str(getattr(getattr(s, "content", None), "text", "")) for s in result.segments]
    body = "\n".join(lines)[:MAX_BODY]
    title = next((line.strip() for line in body.splitlines() if len(line.strip()) > 8), "")[:200]
    stem = re.sub(r"--[0-9a-f]{8}$", "", path.stem)
    return DocumentText(name=path.name, filename=stem.replace("-", " "), title=title, body=body)


def main() -> int:
    terms = Path(sys.argv[1] if len(sys.argv) > 1 else "seed/terms")
    profile_path = Path(sys.argv[2] if len(sys.argv) > 2 else ".docs/_plan/orpp-sources/engine/docs/profile.yaml")
    lists = tuple(load_term_list(p) for p in sorted(terms.rglob("*.yml")))
    profile = load_profile(profile_path)
    engine = PatternOrchestrator(profile, lists)
    documents = tuple(text_of(p) for p in sorted(PDFS.glob("*.pdf")))
    scores = engine.score_corpus(documents)
    print(f"{len(documents)} documents")
    by_impact = Counter(s.impact.name for s in scores)
    print("impact:", dict(by_impact))
    by_tag = Counter(t.tag for s in scores for t in s.tags[:1])
    print("top tag:", dict(by_tag.most_common()))
    print()
    for impact in ("HIGH", "MEDIUM", "LOW", "NOISE"):
        print(f"== {impact}")
        for s in scores:
            if s.impact.name == impact:
                print(f"  {s.name[:62]:62} {s.reason[:90]}")
    print("\n== near duplicates (>= 0.8)")
    for pair in engine.near_duplicates(documents)[:25]:
        print(f"  {pair.similarity:.2f} {pair.left[:40]} ~ {pair.right[:40]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
