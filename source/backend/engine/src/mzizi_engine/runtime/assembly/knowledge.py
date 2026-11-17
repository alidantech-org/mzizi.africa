"""Build what the engine knows about names from the seed: a vocabulary with value labels as aliases, a name index and rows to
search by. When the database is loaded the same shapes are read from it; until then the seed CSVs are the knowledge."""

from __future__ import annotations

from pathlib import Path

from mzizi_engine.persistence.vector.sync import IndexRow
from mzizi_manifest.features.data.check import DataResult, check_data
from mzizi_patterns import Dictionary, KnownName, NameIndex, Vocabulary, load_dictionary, load_term_list


def seed_rows(seed_root: Path) -> DataResult:
    return check_data(seed_root)


def value_aliases(data: DataResult) -> dict[str, tuple[str, ...]]:
    """Every label a reference value carries: its own label and its labels in any language."""
    found: dict[str, list[str]] = {}
    for row in data.rows.get("reference.values", []):
        found.setdefault(row.values["code"], []).append(row.values["label"])
    for row in data.rows.get("reference.value_labels", []):
        found.setdefault(row.values["value_code"], []).append(row.values["label"])
    return {code: tuple(dict.fromkeys(labels)) for code, labels in found.items()}


def load_vocabulary(seed_root: Path, scopes: tuple[str, ...], data: DataResult | None = None) -> Vocabulary:
    lists = tuple(load_term_list(p) for p in sorted((seed_root / "terms").rglob("*.yml")))
    vocabulary = Vocabulary(lists, scopes)
    vocabulary.add_value_aliases(value_aliases(data or seed_rows(seed_root)))
    return vocabulary


def load_dictionaries(seed_root: Path, scopes: tuple[str, ...]) -> tuple[Dictionary, ...]:
    paths = sorted((seed_root / "columns").rglob("*.yml"))
    return tuple(d for d in (load_dictionary(p) for p in paths) if d.code.split(".")[2] in scopes)


def known_names(data: DataResult, dictionaries: tuple[Dictionary, ...]) -> list[KnownName]:
    """The names of every table whose dictionary declares a lookup, with the kind of each record where it is known."""
    names: list[KnownName] = []
    for dictionary in dictionaries:
        for table, spec in dictionary.tables.items():
            for source in spec.lookup.sources if spec.lookup else ():
                kinds: dict[str, str] = {}
                if source.kind:
                    kinds = {
                        r.values[source.kind.key]: r.values.get(source.kind.column, "")
                        for r in data.rows.get(source.kind.table, [])
                    }
                for row in data.rows.get(source.table, []):
                    code = row.values.get(source.code, "")
                    if code:
                        names.append(
                            KnownName(
                                table,
                                code,
                                row.values[source.text],
                                row.values.get(source.language, "") if source.language else "",
                                kinds.get(code, ""),
                            )
                        )
    return names


def build_name_index(seed_root: Path, scopes: tuple[str, ...]) -> NameIndex:
    data = seed_rows(seed_root)
    vocabulary = load_vocabulary(seed_root, scopes, data)
    return NameIndex(known_names(data, load_dictionaries(seed_root, scopes)), vocabulary.kind_filler())


def index_rows(seed_root: Path, scopes: tuple[str, ...]) -> list[IndexRow]:
    """Rows for the vector tier: record names, and the labels of reference values."""
    data = seed_rows(seed_root)
    rows = [
        IndexRow(n.table, n.code, n.text, n.language, n.kind)
        for n in known_names(data, load_dictionaries(seed_root, scopes))
    ]
    for code, labels in value_aliases(data).items():
        rows += [IndexRow("reference.values", code, label) for label in labels]
    return rows


def to_iso_date(vocabulary: Vocabulary, text: str) -> str | None:
    """`19th March 2012`, `2012-03-19` or `19/03/2012` as an ISO date, using the date patterns and month names in force."""
    months = vocabulary.groups.get(("dates", "month-names"))
    for ref in ("sys.trm.global.dates#date-day-month-year", "sys.trm.global.dates#date-numeric"):
        found = vocabulary.match(ref, "dates", text)
        if not found or not months:
            continue
        month = found["month"]
        if not month.isdigit():
            number = next(
                (
                    i
                    for i, forms in enumerate(months.surfaces.values(), 1)
                    if month.casefold().rstrip(".") in {f.casefold() for f in forms}
                ),
                0,
            )
            month = str(number)
        year = found["year"] if len(found["year"]) == 4 else f"20{found['year']}"
        if month and 1 <= int(month) <= 12 and 1 <= int(found["day"]) <= 31:
            return f"{int(year):04d}-{int(month):02d}-{int(found['day']):02d}"
    return None
