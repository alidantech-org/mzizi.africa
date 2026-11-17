"""Shared constants and helpers for the Constitution seed builder."""

from __future__ import annotations

import csv
import re
import sys
from dataclasses import dataclass
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "source/packages/extraction/src"))

from mzizi_extraction.legislation import Node  # noqa: E402

DATASETS = REPO / ".dev/datasets"
EN_PDF = DATASETS / "kenya-constitution/en-constitutionnet-final-constitution-2010.pdf"
SW_PDF = DATASETS / "kenya-constitution/sw-uraia-katiba-ya-kenya.pdf"
KLRC = DATASETS / "klrc"
OUT = REPO / "seed/data/ke/legal/constitution-2010"
SOURCE_OUT = REPO / "seed/data/ke/source"
INSTRUMENT = "ke.constitution-2010"
VERSION = f"{INSTRUMENT}.v-2010"
OBSERVED = "2026-11-17T02:00:00+03:00"
EN_DOC = "ke-constitution-2010-en-nclr"
SW_DOC = "ke-constitution-2010-sw-uraia"
SW_DRAFT_DOC = "ke-constitution-2010-sw-proposed-draft"


@dataclass
class Row:
    code: str
    node: Node
    parent: str
    position: int
    folder: str


def slug_part(node: Node, position: int) -> str:
    d = node.designation
    if node.kind == "chapter":
        return f"ch-{d.split()[1]}"
    if node.kind == "part":
        return f"pt-{d.split()[1]}"
    if node.kind == "article":
        return f"art-{d.split()[1]}"
    if node.kind == "schedule":
        return f"sch-{d.split()[1]}"
    if node.kind == "preamble":
        return "preamble"
    if node.kind in ("item", "definition"):
        return f"{'it' if node.kind == 'item' else 'def'}-{position}"
    return f"{'cl' if node.kind == 'clause' else 'pa' if node.kind == 'paragraph' else 'sp'}-{d.strip('()').lower()}"


def flatten(root: Node) -> list[Row]:
    rows: list[Row] = []

    def visit(node: Node, parent_code: str, folder: str, container_code: str) -> None:
        for position, child in enumerate(node.children, start=1):
            part = slug_part(child, position)
            # Articles keep a short code under the instrument; their parent is the part or chapter they sit in.
            if child.kind in ("chapter", "preamble", "schedule"):
                code, child_folder = f"{INSTRUMENT}.{part}", folder
            elif child.kind == "part":
                code, child_folder = f"{container_code}.{part}", folder
            elif child.kind == "article":
                code, child_folder = f"{INSTRUMENT}.{part}", folder
            else:
                code, child_folder = f"{container_code}.{part}", folder
            if child.kind == "chapter":
                child_folder = f"chapter-{int(child.designation.split()[1]):02d}"
            elif child.kind == "preamble":
                child_folder = "preamble"
            elif child.kind == "schedule":
                child_folder = f"schedule-{child.designation.split()[1]}"
            rows.append(Row(code, child, parent_code, position, child_folder))
            visit(child, code, child_folder, code)

    visit(root, "", "", INSTRUMENT)
    return rows


def klrc_links() -> dict[int, str]:
    found: dict[int, str] = {}
    text = (KLRC / "all-links.txt").read_text(encoding="utf-8").split()
    for url in text:
        parts = url.split("/")
        if len(parts) < 6:
            continue
        match = re.match(r"^\d+-(?:article-)?(\d+)-", parts[-1])
        if match and len(parts) >= 5:
            found[int(match.group(1))] = "https://www.klrc.go.ke" + url
    return found


def write(path: Path, header: list[str], rows: list[list[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(rows)


def ensure(path: Path, header: list[str], rows: list[list[str]], key: int = 0) -> None:
    """Add or replace rows by their first cell, keeping the rest of the file as it is."""
    existing: list[list[str]] = []
    if path.exists():
        with path.open(newline="", encoding="utf-8") as handle:
            reader = csv.reader(handle)
            old_header = next(reader)
            existing = [dict(zip(old_header, r, strict=False)) for r in reader]  # type: ignore[misc]
            existing = [[r.get(h, "") for h in header] for r in existing]  # type: ignore[attr-defined]
    keep = [r for r in existing if r[key] not in {n[key] for n in rows}]
    write(path, header, keep + rows)
