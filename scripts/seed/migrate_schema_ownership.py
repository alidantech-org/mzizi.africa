"""Convert the seed CSVs from the old Source/Legal/Filesystem schema to the agreed ownership target.

Run from the repository root:

    uv run python scripts/seed/migrate_schema_ownership.py            # plan: report every file and count, write nothing
    uv run python scripts/seed/migrate_schema_ownership.py --apply    # write the new files, then remove the old ones

What it converts (see `.docs/design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md` and `LEGAL_SCHEMA.md`):

- `source/paths.csv` -> `addresses.csv`; a link found in a Legal locator that is missing there is added as an address.
- `source/sources.csv` rows of kind `dataset` and `ke/source/documents.csv` -> products, editions and artifacts.
- `ke/source/captures.csv` -> captures that point at an address and an artifact; `source_code` only where a website serves it.
- `ke/source/dataset_lineage.csv` -> `relationships.csv` (output product made from input capture; the old role is kept in the
  relationship kind and in the method text).
- `ke/legal/instruments.csv` title -> `names.csv` (language `und`: the old title carried no language assertion).
- `instrument_versions.csv` -> `editions.csv` plus a relationship from each edition to its document artifact.
- `provision_versions.csv` -> `wordings.csv`; each free-text locator becomes a citation (PDF page or address).
- `provision_translations.csv` -> `translations.csv` plus a `translated-from` relationship to the document artifact.
- `provision_references.csv` -> `references.csv` (origin is the wording, or the translation when one is named).
- `legal/bases/*.csv` -> `effects` naming the English 2010 wording and the old target as `subject_table`/`subject_code`.
- reference schemes and values the new rows need, and `_files.yaml` (`documents:` becomes `artifacts:`).

Seed catalogue rows (`seed.*.csv` in `data/global/source`) are generated afterwards by `mzizi-manifest datasets`.
Rerunning after `--apply` finds no old files and reports that nothing is left to convert.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import sys
from pathlib import Path

from ownership_legal import convert_legal
from ownership_plan import DATA, REPORT, Plan, rel
from ownership_source import convert_reference, convert_source


def check_products(plan: Plan) -> None:
    """Every relationship's output product must be the product of a seed CSV that exists after the conversion."""

    def product(file: Path) -> str:
        parts = list(file.relative_to(DATA).with_suffix("").parts)
        parts[-1] = parts[-1].replace(".", "-").replace("_", "-")
        return "seed." + ".".join(parts)

    files = {p for p in DATA.rglob("*.csv") if p not in plan.removes} | set(plan.writes)
    known = {product(p) for p in files if not (p.parent == DATA / "global/source" and p.name.startswith("seed."))}
    path = DATA / "ke/source/relationships.csv"
    for row in plan.writes.get(path, ([], []))[1]:
        if row[2] not in known:
            plan.problems.append(
                f"relationships.csv: {row[0]}: output product {row[2]} is not a seed file after conversion"
            )


def apply(plan: Plan) -> None:
    def atomic(path: Path, content: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        temp = path.with_suffix(path.suffix + ".tmp")
        temp.write_text(content, encoding="utf-8", newline="")
        temp.replace(path)

    for path, (header, rows) in plan.writes.items():
        buffer = io.StringIO()
        writer = csv.writer(buffer, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(rows)
        atomic(path, buffer.getvalue())
    for path, text in plan.text_writes.items():
        atomic(path, text)
    for path in plan.removes:
        path.unlink(missing_ok=True)
    bases = DATA / "ke/legal/bases"
    if bases.exists() and not any(bases.iterdir()):
        bases.rmdir()
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(plan.mapping, indent=1, sort_keys=True), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--apply", action="store_true", help="write the new files and remove the old ones")
    args = parser.parse_args()
    plan = Plan()
    plan.lines.append("reference vocabulary")
    convert_reference(plan)
    plan.lines.append("source")
    state = convert_source(plan)
    plan.lines.append("legal")
    convert_legal(plan, state)
    check_products(plan)
    print("\n".join(plan.lines))
    print(f"\nwrite {len(plan.writes)} files, remove {len(plan.removes)} files")
    for path in sorted(plan.writes):
        header, rows = plan.writes[path]
        print(f"  write  {rel(path)}  [{', '.join(header)}]  {len(rows)} rows")
    for path in plan.removes:
        print(f"  remove {rel(path)}")
    if plan.problems:
        print(f"\n{len(plan.problems)} problems; nothing written:", file=sys.stderr)
        for problem in plan.problems[:60]:
            print(f"  {problem}", file=sys.stderr)
        return 1
    if args.apply:
        apply(plan)
        print(f"\napplied; identity mapping written to {rel(REPORT)}")
    else:
        print("\nplan only; rerun with --apply to write")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
