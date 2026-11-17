"""Turn a source table into draft seed rows for the tables it feeds.

The draft follows the column proposal, the code recipes and the known names. It is a review draft, not seed: a code is a
proposal (checked against known names and the rest of the run), a name that matches a known record or an earlier row is linked to
it instead of being created again, a bidder list can create its procurement before the tender data exists (the same code
completes it later), and anything the source cannot say is filled from the owner-approved defaults for that kind of source when
given, and otherwise left empty and listed. Nothing is written to the seed or the database."""

from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

from mzizi_engine.runtime.assembly.draft_models import Defaults, DraftNote, DraftResult, load_defaults, read_rows
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
from mzizi_patterns.features.columns.columns import header_score

ENTITY_LINK = "_entity_code"
PRIMARY = "official.names.name"
OWNED = {
    "official.names",
    "official.identifiers",
    "official.contacts",
    "official.branding",
}  # rows of the primary entity
NAME_ABBREVIATION = "sys.trm.global.organisations#name-with-abbreviation"
FORMER_MARKERS = "sys.trm.global.politics#former-markers"
VALUE_SCHEMES = {"ofc", "pol", "civ", "fin", "gov", "fil"}


class Run:
    """The state of one drafting run: what has been created, what each name resolved to, and what is still missing."""

    def __init__(
        self,
        seed_root: Path,
        scopes: tuple[str, ...],
        scope: str,
        defaults: Defaults,
        proposal_columns: tuple[ColumnProposal, ...],
        inputs: dict[str, str],
        headers: list[str],
        source_name: str = "",
    ) -> None:
        self.tables, self.scope, self.defaults = load_tables(), scope, defaults
        data = seed_rows(seed_root)
        self.vocabulary: Vocabulary = load_vocabulary(seed_root, scopes, data)
        self.drop = frozenset(self.vocabulary.kind_filler())
        self.index: NameIndex = build_name_index(seed_root, scopes)
        dictionaries = load_dictionaries(seed_root, scopes)
        self.recipes = {t: spec.code for d in dictionaries for t, spec in d.tables.items() if spec.code}
        self.value_codes = {r.values["code"] for r in data.rows.get("reference.values", [])}
        # a heading matched only by a column's own name is a hint for review, never a row
        self.chosen = {
            c.header: c
            for c in proposal_columns
            if c.chosen and c.status in {"matched", "weak", "ambiguous"} and not c.chosen.group.startswith("(derived")
        }
        self.splits = [c.split for c in proposal_columns if c.split]
        self.inputs = {**defaults.inputs, **inputs}
        self.input_headers = self._input_headers(dictionaries, headers)
        self.row_inputs: dict[str, str] = {}
        self.out: dict[str, dict[str, dict[str, str]]] = defaultdict(dict)  # table -> key -> row
        self.notes: list[DraftNote] = []
        self.taken: dict[str, set[str]] = defaultdict(set)  # codes in use, per table
        self.by_name: dict[str, str] = {}
        self.labels: dict[str, str] = {}
        self.unapproved: set[str] = set()
        self.procurement_code: str | None = None
        self.source_name = source_name
        self.number = 0

    def _input_headers(self, dictionaries: tuple, headers: list[str]) -> dict[str, str]:  # type: ignore[type-arg]
        """Which source column carries each named input (a bid number), found by the heading words the dictionary lists."""
        found: dict[str, str] = {}
        for dictionary in dictionaries:
            for spec in dictionary.tables.values():
                for name, links in spec.inputs.items():
                    for header in headers:
                        for link in links:
                            surfaces = self.vocabulary.surfaces(f"{link.list}#{link.key}", "procurement")
                            if header_score(header, surfaces, {})[0] >= 0.9:
                                found.setdefault(name, header)
        return found

    def note(self, table: str, code: str, status: str, text: str = "", missing: tuple[str, ...] = ()) -> None:
        self.notes.append(
            DraftNote(table=table, code=code, source_row=self.number, status=status, missing=missing, note=text)
        )

    def entity(self, label: str, role: str = "") -> str:
        """The code of the entity a name stands for: a known one, one made earlier in this run, or a new proposal."""
        parts = self.vocabulary.match(NAME_ABBREVIATION, "organisations", label)
        name, abbreviation = (parts["name"], parts["abbrev"]) if parts else (label, "")
        key = normalise(name)
        if key in self.by_name:
            return self.by_name[key]
        found = [m for m in self.index.resolve(name, "official.entities") if m.score >= 0.95]
        if found:
            self.by_name[key] = found[0].code
            self.note("official.entities", found[0].code, "matched", f"matches the known record {found[0].text!r}")
            return found[0].code
        try:
            recipe = self.recipes["official.entities"]
            code = disambiguate(
                build_code(recipe, {PRIMARY: name}, self.scope, self.drop), self.taken["official.entities"]
            )
        except (KeyError, RecipeGap) as gap:
            self.note("official.entities", "", "gap", f"no code: {gap}")
            return ""
        self.taken["official.entities"].add(code)
        self.by_name[key] = code
        self.labels[code] = name
        row = self._row("official.entities")
        row["code"] = code
        row.update(self.defaults.roles.get(role, {}))
        self._fill("official.entities", row, ())
        self.out["official.entities"].setdefault(code, row)
        self.note("official.entities", code, "new")
        self._add_name(code, name, "organisation")
        if abbreviation:
            self._add_name(code, abbreviation, "abbreviation")
        return code

    def procurement(self) -> str:
        """The procurement a bid list belongs to, created from what the run knows (a buyer, a tender reference) if it is not given."""
        if self.procurement_code is not None:
            return self.procurement_code
        buyer_name = self.inputs.get("buyer", "")
        buyer = self.entity(buyer_name, "buyer") if buyer_name else ""
        row = self._row("civic.procurements")
        row["buyer_entity_code"] = buyer
        if self.inputs.get("published_on"):
            row["published_on"] = to_iso_date(self.vocabulary, self.inputs["published_on"]) or ""
        reference = self.inputs.get("tender_reference", "")
        anchored = bool(reference)
        values = {
            "civic.procurements.buyer_entity_code": buyer,
            "input:tender_reference": reference or self.source_name,
        }
        try:
            row["code"] = build_code(self.recipes["civic.procurements"], values, self.scope, self.drop)
            if not anchored:
                row["code"] += (
                    "~placeholder"  # no tender yet: the list's own name stands in until the tender data names it
                )
        except (KeyError, RecipeGap) as gap:
            self.note(
                "civic.procurements",
                "",
                "gap",
                f"no procurement for these bids: give --input buyer=... and tender_reference=... ({gap})",
            )
            self.procurement_code = ""
            return ""
        self._fill("civic.procurements", row, ())
        self.out["civic.procurements"][row["code"]] = row
        self.note(
            "civic.procurements",
            row["code"],
            "placeholder",
            "made from a bid list; the tender data completes it under the same code"
            if anchored
            else "no tender was given, so the list stands in for it; point the bids at the real procurement code later",
        )
        self.procurement_code = row["code"]
        return row["code"]

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
                and value.split(".")[0] in VALUE_SCHEMES
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
    values = {f"{table}.{c}": v for c, v in row.items() if v} | {f"input:{k}": v for k, v in run.row_inputs.items()}
    try:
        row["code"] = disambiguate(build_code(recipe, values | (extra or {}), run.scope, run.drop), run.taken[table])
        run.taken[table].add(row["code"])
    except RecipeGap as gap:
        run.note(table, "", "gap", f"code needs {gap}")


def _primary_entity(run: Run, source: dict[str, str], by_table: dict[str, list[tuple[str, str]]]) -> tuple[str, str]:
    """The entity this source row is about, and the header its name came from."""
    for header, _column in by_table.get("official.names", []):
        picked = run.chosen[header].chosen
        reads = picked.reads_as if picked else ""
        if picked is not None and reads not in {"abbreviation", "former name"} and source.get(header, "").strip():
            return run.entity(source[header].strip()), header
    for pairs in by_table.values():
        for header, column in pairs:
            if column.endswith(ENTITY_LINK) and source.get(header, "").strip():
                return run.entity(source[header].strip(), "bidder" if "bidder" in column else ""), ""
    return "", ""


def _values_of(run: Run, header: str, cell: str) -> list[str]:
    """One cell can hold several values: the earlier names after each "formerly"."""
    picked = run.chosen[header].chosen
    if picked is not None and picked.reads_as == "former name":
        return run.vocabulary.split_at(FORMER_MARKERS, "politics", cell) or [cell]
    return [cell]


def _source_row(run: Run, source: dict[str, str], by_table: dict[str, list[tuple[str, str]]]) -> None:
    _split_cells(run, source)
    run.row_inputs = {name: source.get(header, "").strip() for name, header in run.input_headers.items()}
    primary, primary_header = _primary_entity(run, source, by_table)
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
            if table == "official.names" and group[0][0] == primary_header:
                continue  # the entity already carries its own name
            header0 = group[0][0]
            cells = _values_of(run, header0, source.get(header0, "").strip()) if table in OWNED else [None]
            for piece in cells:
                row = run._row(table)
                reads = tuple(p.reads_as for h, _ in group if (p := run.chosen[h].chosen) is not None and p.reads_as)
                for header, column in group:
                    cell = (piece if piece is not None and header == header0 else source.get(header, "")).strip()
                    if not cell:
                        continue
                    row[column] = (
                        run.entity(cell, "bidder")
                        if column.endswith(ENTITY_LINK)
                        else run.normalise_cell(table, column, cell)
                    )
                if not any(row.values()):
                    continue
                if table in OWNED:
                    row["entity_code"] = primary
                else:
                    link = next((c for c in row if c.endswith(ENTITY_LINK) and not row[c]), "")
                    if link and primary:
                        row[link] = primary
                    if "procurement_code" in row and not row["procurement_code"]:
                        row["procurement_code"] = run.procurement()
                run._fill(table, row, reads)
                _code_for(run, table, row)
                key = (
                    f"{row['entity_code']}|{row['name']}|{row['name_kind_code']}"
                    if table == "official.names"
                    else f"{table}|{row.get('code') or len(run.out[table])}"
                )
                run.out[table].setdefault(key, row)
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
    inputs: dict[str, str] | None = None,
) -> DraftResult:
    proposal = propose_mapping(csv_path, seed_root, scopes, prefer)
    source_rows = read_rows(csv_path)
    run = Run(
        seed_root,
        scopes,
        scope,
        load_defaults(defaults),
        proposal.columns,
        inputs or {},
        list(source_rows[0]) if source_rows else [],
        csv_path.stem,
    )
    by_table: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for header, picked in run.chosen.items():
        assert picked.chosen is not None
        schema_table, _, column = picked.chosen.target.rpartition(".")
        by_table[schema_table].append((header, column))
    for run.number, source in enumerate(source_rows, start=1):
        _source_row(run, source, by_table)
    return _finish(run, out_dir)
