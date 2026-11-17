"""Turn a source table into draft seed rows for the tables it feeds.

The draft follows the column proposal, the code recipes and the known names. It is a review draft, not seed: a code is a
proposal (checked against known names and the rest of the run), a name that matches a known record or an earlier row is linked
to it instead of being created again, anything the source cannot say is filled from the owner-approved defaults for that kind
of source when given, and otherwise left empty and listed. Nothing is written to the seed or the database."""

from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

import yaml
from pydantic import BaseModel, Field

from mzizi_engine.runtime.assembly.knowledge import (
    build_name_index,
    load_dictionaries,
    load_vocabulary,
    seed_rows,
    to_iso_date,
    to_minor_units,
)
from mzizi_engine.runtime.assembly.mapping_proposal import propose_mapping
from mzizi_manifest.features.data.check import seed_value_problem
from mzizi_manifest.features.database.tables import Table, load_tables
from mzizi_patterns import ColumnProposal, NameIndex, RecipeGap, Vocabulary, build_code, disambiguate, normalise

ENTITY_LINK = "_entity_code"
PRIMARY = "official.names.name"
OWNED = {"official.names", "official.identifiers", "official.contacts"}  # rows that belong to the primary entity


class Defaults(BaseModel):
    describe: str = ""
    tables: dict[str, dict[str, str]] = Field(default_factory=dict)
    reads_as: dict[str, dict[str, dict[str, str]]] = Field(default_factory=dict)
    emit: tuple[str, ...] = ()
    copy_from: dict[str, str] = Field(default_factory=dict, alias="copy")

    model_config = {"populate_by_name": True}


class DraftNote(BaseModel):
    table: str
    code: str
    source_row: int
    status: str  # new, matched, repeat or gap
    missing: tuple[str, ...] = ()
    note: str = ""


class DraftResult(BaseModel):
    out_dir: str
    rows: dict[str, int]
    notes: tuple[DraftNote, ...]
    needs_approval: dict[str, int]
    unapproved_values: tuple[str, ...] = ()


def load_defaults(path: Path | None) -> Defaults:
    return Defaults.model_validate(yaml.safe_load(path.read_text(encoding="utf-8"))) if path else Defaults()


def _read(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        header = [" ".join(h.split()) for h in next(reader)]
        return [dict(zip(header, row, strict=False)) for row in reader]


class Run:
    """The state of one drafting run: what has been created, what each name resolved to, and what is still missing."""

    def __init__(
        self,
        seed_root: Path,
        scopes: tuple[str, ...],
        scope: str,
        defaults: Defaults,
        proposal_columns: tuple[ColumnProposal, ...],
    ) -> None:
        self.tables, self.scope, self.defaults = load_tables(), scope, defaults
        data = seed_rows(seed_root)
        self.vocabulary: Vocabulary = load_vocabulary(seed_root, scopes, data)
        self.drop = frozenset(self.vocabulary.kind_filler())
        self.index: NameIndex = build_name_index(seed_root, scopes)
        self.recipes = {
            t: spec.code for d in load_dictionaries(seed_root, scopes) for t, spec in d.tables.items() if spec.code
        }
        self.value_codes = {r.values["code"] for r in data.rows.get("reference.values", [])}
        # a heading matched only by a column's own name is a hint for review, never a row
        self.chosen = {
            c.header: c
            for c in proposal_columns
            if c.chosen and c.status in {"matched", "weak", "ambiguous"} and not c.chosen.group.startswith("(derived")
        }
        self.splits = [c.split for c in proposal_columns if c.split]
        self.out: dict[str, dict[str, dict[str, str]]] = defaultdict(dict)  # table -> key -> row
        self.notes: list[DraftNote] = []
        self.taken: dict[str, set[str]] = defaultdict(
            set
        )  # codes in use, per table: a party and its entity may share one
        self.by_name: dict[str, str] = {}
        self.labels: dict[str, str] = {}
        self.unapproved: set[str] = set()
        self.number = 0

    def note(self, table: str, code: str, status: str, text: str = "", missing: tuple[str, ...] = ()) -> None:
        self.notes.append(
            DraftNote(table=table, code=code, source_row=self.number, status=status, missing=missing, note=text)
        )

    def entity(self, label: str) -> str:
        """The code of the entity a name stands for: a known one, one made earlier in this run, or a new proposal."""
        key = normalise(label)
        if key in self.by_name:
            return self.by_name[key]
        found = [m for m in self.index.resolve(label, "official.entities") if m.score >= 0.95]
        if found:
            self.by_name[key] = found[0].code
            self.note("official.entities", found[0].code, "matched", f"matches the known record {found[0].text!r}")
            return found[0].code
        try:
            code = disambiguate(
                build_code(self.recipes["official.entities"], {PRIMARY: label}, self.scope, self.drop),
                self.taken["official.entities"],
            )
        except (KeyError, RecipeGap) as gap:
            self.note("official.entities", "", "gap", f"no code: {gap}")
            return ""
        self.taken["official.entities"].add(code)
        self.by_name[key] = code
        self.labels[code] = label
        row = self._row("official.entities")
        row["code"] = code
        self._fill("official.entities", row, ())
        self.out["official.entities"].setdefault(code, row)
        self.note("official.entities", code, "new")
        self._add_name(code, label, "organisation")
        return code

    def _row(self, table: str) -> dict[str, str]:
        return {c: "" for c in self.tables[table].seed.columns}

    def _fill(self, table: str, row: dict[str, str], reads: tuple[str, ...]) -> None:
        for says in reads:
            for column, value in self.defaults.reads_as.get(says, {}).get(table, {}).items():
                row[column] = row[column] or value
        for column, value in self.defaults.tables.get(table, {}).items():
            if column in row:
                row[column] = row[column] or value
        for column, value in row.items():
            if (
                value
                and column.endswith("_code")
                and "." in value
                and value.split(".")[0] in {"ofc", "pol", "civ", "fin", "gov"}
                and value not in self.value_codes
            ):
                self.unapproved.add(value)

    def _add_name(self, entity_code: str, name: str, says: str) -> None:
        row = self._row("official.names")
        row.update(entity_code=entity_code, name=name)
        self._fill("official.names", row, (says,))
        self.out["official.names"].setdefault(f"{entity_code}|{name}|{row['name_kind_code']}", row)

    def normalise_cell(self, table: str, column: str, cell: str) -> str:
        spec = self.tables[table].columns.get(self.tables[table].stored_name(column))
        if spec is None or not cell:
            return cell
        if spec.kind == "date":
            iso = to_iso_date(self.vocabulary, cell)
            if iso is None:
                self.note(table, "", "gap", f"{column}: {cell!r} is not a date I can read")
            return iso or ""
        if column == "amount_minor_units":
            units = to_minor_units(cell)
            if units is None:
                self.note(table, "", "gap", f"{column}: {cell!r} is not an amount I can read")
            return str(units) if units is not None else ""
        if problem := seed_value_problem(spec, cell):
            self.note(table, "", "gap", f"{column}: {problem}")
        return cell


def _split_cells(run: Run, source: dict[str, str]) -> None:
    for split in run.splits:
        captured = run.vocabulary.match(split.cell_pattern, split.domain, source.get(split.source_header, ""))
        if captured:
            source[split.main_heading] = captured.get(split.main_capture, "")
            source[split.qualifier_heading] = captured.get(split.qualifier_capture, "")


def _code_for(run: Run, table: str, row: dict[str, str], extra: dict[str, str] | None = None) -> None:
    recipe = run.recipes.get(table)
    if not recipe or row.get("code") or "code" not in row:
        return
    values = {f"{table}.{c}": v for c, v in row.items() if v} | (extra or {})
    try:
        row["code"] = disambiguate(build_code(recipe, values, run.scope, run.drop), run.taken[table])
        run.taken[table].add(row["code"])
    except RecipeGap as gap:
        run.note(table, "", "gap", f"code needs {gap}")


def _source_row(run: Run, source: dict[str, str], by_table: dict[str, list[tuple[str, str]]]) -> None:
    _split_cells(run, source)
    primary = ""
    for header, _column in by_table.get("official.names", []):
        picked = run.chosen[header].chosen
        if picked is not None and picked.reads_as != "abbreviation" and source.get(header, "").strip():
            primary = run.entity(source[header].strip())
            break
    if not primary:
        for pairs in by_table.values():
            for header, column in pairs:
                if column.endswith(ENTITY_LINK) and source.get(header, "").strip():
                    primary = run.entity(source[header].strip())
                    break
            if primary:
                break
    entity_row = run.out["official.entities"].get(primary)
    for table, pairs in by_table.items():
        if table == "official.entities" and entity_row is not None:
            for header, column in pairs:
                cell = source.get(header, "").strip()
                if cell and not entity_row[column]:
                    entity_row[column] = run.normalise_cell(table, column, cell)
            continue
        groups = [[p] for p in pairs] if table in OWNED else [pairs]
        for group in groups:
            row = run._row(table)
            reads = tuple(p.reads_as for h, _ in group if (p := run.chosen[h].chosen) is not None and p.reads_as)
            for header, column in group:
                cell = source.get(header, "").strip()
                if not cell:
                    continue
                if column.endswith(ENTITY_LINK):
                    row[column] = run.entity(cell)
                else:
                    row[column] = run.normalise_cell(table, column, cell)
            if not any(row.values()):
                continue
            if table in OWNED:
                row["entity_code"] = primary
            elif primary:
                link = next((c for c in row if c.endswith(ENTITY_LINK) and not row[c]), "")
                if link:
                    row[link] = primary
            run._fill(table, row, reads)
            _code_for(run, table, row)
            if table == "official.names":
                run.out[table].setdefault(f"{row['entity_code']}|{row['name']}|{row['name_kind_code']}", row)
            else:
                run.out[table][f"{table}|{row.get('code') or len(run.out[table])}"] = row
    for table in run.defaults.emit:
        if table in by_table or not primary:
            continue
        row = run._row(table)
        row["entity_code"] = primary
        for target, origin in run.defaults.copy_from.items():
            t, _, column = target.rpartition(".")
            ot, _, ocolumn = origin.rpartition(".")
            if t == table and entity_row is not None and ot == "official.entities":
                row[column] = entity_row.get(ocolumn, "")
        run._fill(table, row, ())
        _code_for(run, table, row, {PRIMARY: run.labels.get(primary, "")})
        run.out[table].setdefault(row.get("code") or primary, row)


def _finish(run: Run, out_dir: Path) -> DraftResult:
    out_dir.mkdir(parents=True, exist_ok=True)
    counts: dict[str, int] = {}
    lacking: dict[str, int] = defaultdict(int)
    for table, rows in run.out.items():
        table_def: Table = run.tables[table]
        with (out_dir / f"{table}.csv").open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(table_def.seed.columns), lineterminator="\n")
            writer.writeheader()
            writer.writerows(rows.values())
        counts[table] = len(rows)
        for row in rows.values():
            for column in table_def.seed.required:
                if not row.get(column):
                    lacking[f"{table}.{column}"] += 1
    result = DraftResult(
        out_dir=str(out_dir),
        rows=counts,
        notes=tuple(run.notes),
        needs_approval=dict(lacking),
        unapproved_values=tuple(sorted(run.unapproved)),
    )
    (out_dir / "review.json").write_text(result.model_dump_json(indent=1), encoding="utf-8")
    return result


def draft_rows(
    csv_path: Path,
    seed_root: Path,
    out_dir: Path,
    scopes: tuple[str, ...],
    scope: str,
    prefer: frozenset[str],
    defaults: Path | None = None,
) -> DraftResult:
    proposal = propose_mapping(csv_path, seed_root, scopes, prefer)
    run = Run(seed_root, scopes, scope, load_defaults(defaults), proposal.columns)
    by_table: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for header, picked in run.chosen.items():
        assert picked.chosen is not None
        schema_table, _, column = picked.chosen.target.rpartition(".")
        by_table[schema_table].append((header, column))
    for run.number, source in enumerate(_read(csv_path), start=1):
        _source_row(run, source, by_table)
    return _finish(run, out_dir)
