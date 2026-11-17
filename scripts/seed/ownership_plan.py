"""The plan, constants and helpers the schema-ownership seed conversion shares."""

from __future__ import annotations

import csv
import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SEED = REPO / "seed"
DATA = SEED / "data"
REPORT = REPO / ".dev/reports/schema-ownership-seed-migration.json"
OBSERVED = "2026-11-17T02:00:00+03:00"

KIND_PREPARED = "src.relationship.kind.prepared-from"
KIND_BUILT = "src.relationship.kind.built-from"
KIND_SUPPORTS = "src.relationship.kind.supports"
KIND_TRANSLATED = "src.relationship.kind.translated-from"
LINEAGE_KIND = {"raw": KIND_PREPARED, "derived": KIND_BUILT, "lookup": KIND_SUPPORTS}
LOCATOR_PAGE = "src.locator.kind.page"
LOCATOR_URL = "src.locator.kind.url"
PRODUCT_KIND_DATASET = "src.product.kind.dataset"
NAME_KIND = "leg.name.kind.formal-title"
EFFECT_KINDS = {
    "established-by": "Established by",
    "governed-by": "Governed by",
    "defined-by": "Defined by",
    "limited-by": "Limited by",
    "implements": "Implements",
    "derives-from": "Derives from",
}

type Rows = list[dict[str, str]]


@dataclass
class Plan:
    """Files to write and remove, plus the reconciliation lines and problems found while converting."""

    writes: dict[Path, tuple[list[str], list[list[str]]]] = field(default_factory=dict)
    removes: list[Path] = field(default_factory=list)
    text_writes: dict[Path, str] = field(default_factory=dict)
    lines: list[str] = field(default_factory=list)
    problems: list[str] = field(default_factory=list)
    mapping: dict[str, dict[str, str]] = field(default_factory=dict)

    def write(self, path: Path, header: list[str], rows: list[list[str]], *, keep_empty: bool = False) -> None:
        if path in self.writes:
            raise ValueError(f"{path} planned twice")
        if rows or keep_empty:  # a synthetic file with no rows is not written; a converted file keeps its header
            self.writes[path] = (header, rows)

    def reconcile(self, label: str, before: int, after: int, note: str = "") -> None:
        mark = "ok" if before == after else "MISMATCH"
        self.lines.append(f"  {label}: {before} old -> {after} new {mark} {note}".rstrip())
        if before != after:
            self.problems.append(f"{label}: {before} old rows but {after} new rows")


def read(path: Path) -> Rows:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def rel(path: Path) -> str:
    return str(path.relative_to(REPO))


def cells(rows: Rows, header: list[str]) -> list[list[str]]:
    return [[row.get(name, "") for name in header] for row in rows]


def digest(*parts: str, size: int = 10) -> str:
    return hashlib.sha256("|".join(parts).encode()).hexdigest()[:size]


def table_shorts() -> dict[str, str]:
    codes = json.loads((REPO / "source/schema/seed/codes.json").read_text(encoding="utf-8"))
    return {name: spec["short"] for name, spec in codes["tables"].items()}
