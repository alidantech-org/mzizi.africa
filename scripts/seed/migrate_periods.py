"""Convert the seed CSVs from validity windows (`valid_from`, `valid_until` and their earliest bounds) to plain periods.

    uv run python scripts/seed/migrate_periods.py            # plan: list every file and what changes
    uv run python scripts/seed/migrate_periods.py --apply    # write

A row's `valid_from` becomes the table's own start date (`established_on`, `starts_on`, `effective_on`), and `valid_until` its
end date (`ended_on`, `ends_on`). The matching `from_year` and `to_year` are always filled from the date, with
`from_to_precision` `exact`. The old `*_earliest` and `*_latest` bounds are dropped: they were judgment calls, not data, and
the mapping lists every dropped value. Rerunning after `--apply` finds nothing to convert.
"""

from __future__ import annotations

import argparse
import csv
import io
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DATA = REPO / "seed/data"
#: Table (the CSV's stem) to the names of its start and end date columns.
DATES = {
    "features": ("established_on", "ended_on"),
    "relationships": ("starts_on", "ends_on"),
    "geography.effects": ("effective_on", "ended_on"),
}
OLD = ("valid_from", "valid_until", "valid_from_earliest", "valid_from_latest", "valid_until_earliest", "valid_until_latest")


def convert(path: Path) -> tuple[str, int, list[str]] | None:
    stem = path.stem
    names = DATES.get(stem)
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        header = list(reader.fieldnames or [])
        rows = list(reader)
    if names is None or not any(column in header for column in OLD):
        return None
    start, end = names
    kept = [column for column in header if column not in OLD]
    added: list[str] = []
    has_from, has_until = "valid_from" in header, "valid_until" in header
    if has_from:
        added += [start, "from_year"]
    if has_until:
        added += [end, "to_year"]
    out_header = kept + added + ["from_to_precision"]
    dropped: list[str] = []
    out: list[list[str]] = []
    for row in rows:
        values = {column: row[column] for column in kept}
        if has_from:
            values[start], values["from_year"] = row["valid_from"], row["valid_from"][:4]
        if has_until:
            values[end], values["to_year"] = row["valid_until"], row["valid_until"][:4]
        values["from_to_precision"] = "exact" if (values.get("from_year") or values.get("to_year")) else ""
        for column in OLD[2:]:
            if row.get(column):
                dropped.append(f"{row.get('code', '')}:{column}={row[column]}")
        out.append([values.get(column, "") for column in out_header])
    buffer = io.StringIO()
    writer = csv.writer(buffer, lineterminator="\n")
    writer.writerow(out_header)
    writer.writerows(out)
    return buffer.getvalue(), len(rows), dropped


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    changed = 0
    for path in sorted(DATA.rglob("*.csv")):
        result = convert(path)
        if result is None:
            continue
        text, count, dropped = result
        changed += 1
        print(f"{path.relative_to(REPO)}: {count} rows, {len(dropped)} bound values dropped")
        if args.apply:
            path.write_text(text, encoding="utf-8", newline="")
            if dropped:
                report = REPO / ".dev/reports/period-bounds-dropped.txt"
                report.parent.mkdir(parents=True, exist_ok=True)
                with report.open("a", encoding="utf-8") as handle:
                    handle.write(f"{path.relative_to(REPO)}\n" + "\n".join(dropped[:3]) + f"\n... {len(dropped)} values\n")
    print(f"{changed} files {'converted' if args.apply else 'to convert'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
