"""Turn a source table into draft seed rows for the tables it feeds, from its column proposal, the code recipes and the known names.

The output is a review draft, not seed: a row's code is a proposal (checked against the known names and against the other
rows of the same run), anything the source cannot say (a kind, a scheme, a language) is left empty and listed, and a record
that matches a known one is linked to it instead of being created again. Nothing is written to the seed or the database."""

from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.runtime.assembly.knowledge import (
    build_name_index,
    load_dictionaries,
    load_vocabulary,
    seed_rows,
    to_iso_date,
)
from mzizi_engine.runtime.assembly.mapping_proposal import propose_mapping
from mzizi_manifest.features.data.check import seed_value_problem
from mzizi_manifest.features.database.tables import load_tables
from mzizi_patterns import RecipeGap, build_code, disambiguate

LINK_FOR = {"official.names": "entity_code", "official.identifiers": "entity_code", "official.contacts": "entity_code"}
NEW_ENTITY_SOURCES = ("official.names.name",)


class DraftNote(BaseModel):
    table: str
    code: str
    source_row: int
    status: str  # new, matched or gap
    missing: tuple[str, ...] = ()
    note: str = ""


class DraftResult(BaseModel):
    out_dir: str
    rows: dict[str, int]
    notes: tuple[DraftNote, ...]
    needs_approval: dict[str, int]  # required seed columns nobody could fill, with how many rows lack each


def _read(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        header = [" ".join(h.split()) for h in next(reader)]
        return [dict(zip(header, row, strict=False)) for row in reader]


def draft_rows(
    csv_path: Path, seed_root: Path, out_dir: Path, scopes: tuple[str, ...], scope: str, prefer: frozenset[str]
) -> DraftResult:
    proposal = propose_mapping(csv_path, seed_root, scopes, prefer)
    tables, data = load_tables(), seed_rows(seed_root)
    vocabulary = load_vocabulary(seed_root, scopes, data)
    drop = frozenset(vocabulary.kind_filler())
    index = build_name_index(seed_root, scopes)
    recipes = {t: spec.code for d in load_dictionaries(seed_root, scopes) for t, spec in d.tables.items() if spec.code}
    chosen = {c.header: c for c in proposal.columns if c.chosen and c.status in {"matched", "weak", "ambiguous"}}
    by_table: dict[str, list[tuple[str, str]]] = defaultdict(list)  # table -> (header, seed column)
    for header, picked in chosen.items():
        assert picked.chosen is not None
        schema_table, _, name = picked.chosen.target.rpartition(".")
        by_table[schema_table].append((header, name))
    name_header = next(
        (
            h
            for h, c in chosen.items()
            if c.chosen and c.chosen.target in NEW_ENTITY_SOURCES and c.chosen.reads_as != "abbreviation"
        ),
        "",
    )
    out: dict[str, list[dict[str, str]]] = defaultdict(list)
    notes: list[DraftNote] = []
    taken: set[str] = set()
    for number, source in enumerate(_read(csv_path), start=1):
        entity_code, entity_status = "", "gap"
        label = source.get(name_header, "").strip()
        if label:
            found = [m for m in index.resolve(label, "official.entities") if m.score >= 0.95]
            if found:
                entity_code, entity_status = found[0].code, "matched"
            else:
                try:
                    code = build_code(recipes["official.entities"], {"official.names.name": label}, scope, drop)
                    entity_code, entity_status = disambiguate(code, taken), "new"
                    taken.add(entity_code)
                except (KeyError, RecipeGap) as gap:
                    notes.append(
                        DraftNote(
                            table="official.entities", code="", source_row=number, status="gap", note=f"no code: {gap}"
                        )
                    )
        for table, pairs in by_table.items():
            if table == "official.entities" and not entity_code:
                continue
            if table in LINK_FOR and not entity_code:
                continue
            groups = (
                [[p] for p in pairs]
                if table in {"official.names", "official.contacts", "official.identifiers"}
                else [pairs]
            )
            for group in groups:
                row = {c: "" for c in tables[table].seed.columns}
                values: dict[str, str] = {}
                for header, column in group:
                    cell = source.get(header, "").strip()
                    if cell and tables[table].columns.get(tables[table].stored_name(column)) is not None:
                        spec = tables[table].columns[tables[table].stored_name(column)]
                        if spec.kind == "date":
                            iso = to_iso_date(vocabulary, cell)
                            if iso is None:
                                notes.append(
                                    DraftNote(
                                        table=table,
                                        code="",
                                        source_row=number,
                                        status="gap",
                                        note=f"{column}: {cell!r} is not a date I can read",
                                    )
                                )
                                cell = ""
                            else:
                                cell = iso
                        elif problem := seed_value_problem(spec, cell):
                            notes.append(
                                DraftNote(
                                    table=table, code="", source_row=number, status="gap", note=f"{column}: {problem}"
                                )
                            )
                    if cell:
                        row[column] = cell
                        values[f"{table}.{column}"] = cell
                if table == "official.entities":
                    row["code"] = entity_code
                elif table in LINK_FOR:
                    row[LINK_FOR[table]] = entity_code
                if not any(values.values()) and table != "official.entities":
                    continue
                values.update({f"{table}.{k}": v for k, v in row.items() if v})
                if table in recipes and table != "official.entities" and not row.get("code") and "code" in row:
                    try:
                        row["code"] = build_code(recipes[table], values, scope, drop)
                    except RecipeGap as gap:
                        notes.append(
                            DraftNote(table=table, code="", source_row=number, status="gap", note=f"code needs {gap}")
                        )
                missing = tuple(c for c in tables[table].seed.required if not row.get(c))
                out[table].append(row)
                notes.append(
                    DraftNote(
                        table=table,
                        code=row.get("code", ""),
                        source_row=number,
                        status=entity_status if table == "official.entities" else "new",
                        missing=missing,
                    )
                )
    out_dir.mkdir(parents=True, exist_ok=True)
    for table, rows in out.items():
        with (out_dir / f"{table}.csv").open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(tables[table].seed.columns), lineterminator="\n")
            writer.writeheader()
            writer.writerows(rows)
    lacking: dict[str, int] = defaultdict(int)
    for note in notes:
        for column in note.missing:
            lacking[f"{note.table}.{column}"] += 1
    (out_dir / "review.json").write_text(
        DraftResult(
            out_dir=str(out_dir),
            rows={t: len(r) for t, r in out.items()},
            notes=tuple(notes),
            needs_approval=dict(lacking),
        ).model_dump_json(indent=1),
        encoding="utf-8",
    )
    return DraftResult(
        out_dir=str(out_dir), rows={t: len(r) for t, r in out.items()}, notes=tuple(notes), needs_approval=dict(lacking)
    )
