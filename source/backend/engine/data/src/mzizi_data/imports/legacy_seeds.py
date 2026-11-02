"""Quality analysis of the legacy CSV seeds (api-legacy/app/routes/*/_seed) before any import.

The seeds carry no sources and were written for the previous project. Analysis, not import: each
report says what is wrong or missing so a reviewer can decide what, if anything, becomes a
curated candidate. Counties are cross-checked against a boundary dataset when one is given.
"""
from __future__ import annotations

import csv
import json
from collections import Counter, defaultdict
from pathlib import Path

from ..structure.transforms import apply


def analyse_geo_units(csv_path: str | Path, reference_counties: list[str] | None = None) -> dict:
    rows = list(csv.DictReader(open(csv_path, encoding="utf-8")))
    codes = Counter(r["geo_unit_code"] for r in rows)
    duplicates = {c: n for c, n in codes.items() if n > 1}
    by_code = defaultdict(list)
    for r in rows:
        by_code[r["geo_unit_code"]].append(r)
    conflicting = {c: [{"name": r["name"], "geo_code": r["geo_code"], "level": r["geo_level_code"]} for r in group] for c, group in by_code.items() if len({(r["name"], r["geo_level_code"]) for r in group}) > 1}
    levels = Counter(r["geo_level_code"] for r in rows)
    unique_levels = Counter(group[0]["geo_level_code"] for group in by_code.values())
    orphan_parents = sorted({r["geo_unit_code"] for r in rows if "/" in r["geo_unit_code"] and r["geo_unit_code"].rsplit("/", 1)[0] not in by_code})
    report = {
        "rows": len(rows), "uniqueCodes": len(codes), "duplicateCodes": len(duplicates), "duplicateRowsBeyondFirst": sum(n - 1 for n in duplicates.values()),
        "conflictingDuplicates": len(conflicting), "rowsPerLevel": dict(levels), "uniqueUnitsPerLevel": dict(unique_levels), "unitsWithMissingParent": len(orphan_parents),
        "sampleDuplicates": dict(list(duplicates.items())[:5]), "sampleConflicts": dict(list(conflicting.items())[:3]),
    }
    if reference_counties is not None:
        legacy = {apply({"slug_code": "ke/"}, r["name"]) for r in rows if r["geo_level_code"] == "county"}
        official = {apply({"slug_code": "ke/"}, n) for n in reference_counties}
        report["countiesMissingFromLegacy"] = sorted(official - legacy)
        report["countiesOnlyInLegacy"] = sorted(legacy - official)
    return report


if __name__ == "__main__":  # python -m mzizi_data.imports.legacy_seeds <geo_units.csv> [ADM1.geojson]
    import sys

    names = None
    if len(sys.argv) > 2:
        names = [f["properties"]["shapeName"] for f in json.load(open(sys.argv[2]))["features"]]
    print(json.dumps(analyse_geo_units(sys.argv[1], names), indent=2))
