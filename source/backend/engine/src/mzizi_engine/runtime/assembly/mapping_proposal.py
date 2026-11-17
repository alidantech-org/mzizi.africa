"""Propose how the columns of a source table map to database columns, from the term lists and column dictionaries in the seed.

Nothing is written: the result is a reviewable proposal with the evidence behind every match, the tables the matches point
at, the seed-required columns still without a source, the columns that look collapsed, and the headings nothing matched."""

from __future__ import annotations

import csv
from pathlib import Path

from pydantic import BaseModel

from mzizi_manifest.features.database.tables import load_tables
from mzizi_patterns import ColumnProbe, ColumnProposal, load_dictionary, load_term_list, propose_columns

SAMPLE_ROWS = 25


class MappedColumn(BaseModel):
    header: str
    column: str
    score: float


class TableProposal(BaseModel):
    table: str
    mapped: tuple[MappedColumn, ...]
    missing_required: tuple[str, ...]


class MappingProposal(BaseModel):
    source: str
    scopes: tuple[str, ...]
    columns: tuple[ColumnProposal, ...]
    tables: tuple[TableProposal, ...]
    unmatched: tuple[str, ...]
    problems: tuple[str, ...]


def read_probes(path: Path) -> tuple[ColumnProbe, ...]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.reader(handle))
    header, body = rows[0], rows[1 : SAMPLE_ROWS + 1]
    return tuple(
        ColumnProbe(header=" ".join(name.split()), samples=tuple(r[i] for r in body if i < len(r)))
        for i, name in enumerate(header)
    )


def propose_mapping(
    csv_path: Path,
    seed_root: Path,
    scopes: tuple[str, ...] = ("global",),
    prefer: frozenset[str] = frozenset(),
) -> MappingProposal:
    """`seed_root` is the seed folder holding `terms/` and `columns/`."""
    lists = tuple(load_term_list(p) for p in sorted((seed_root / "terms").rglob("*.yml")))
    dictionaries = tuple(
        d
        for d in (load_dictionary(p) for p in sorted((seed_root / "columns").rglob("*.yml")))
        if d.code.split(".")[2] in scopes
    )
    proposals = propose_columns(read_probes(csv_path), lists, dictionaries, scopes, prefer)
    tables = load_tables()
    by_table: dict[str, list[MappedColumn]] = {}
    for proposal in proposals:
        if proposal.chosen is not None and proposal.status != "unmatched":
            schema_table, _, column = proposal.chosen.target.rpartition(".")
            by_table.setdefault(schema_table, []).append(
                MappedColumn(header=proposal.header, column=column, score=proposal.chosen.score)
            )
    summaries = []
    for name, mapped in sorted(by_table.items()):
        have = {m.column for m in mapped}
        required = tables[name].seed.required if name in tables else ()
        missing = tuple(c for c in required if c != "code" and c not in have)
        summaries.append(TableProposal(table=name, mapped=tuple(mapped), missing_required=missing))
    return MappingProposal(
        source=str(csv_path),
        scopes=scopes,
        columns=proposals,
        tables=tuple(summaries),
        unmatched=tuple(p.header for p in proposals if p.status == "unmatched"),
        problems=(),
    )
