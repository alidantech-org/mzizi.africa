"""Check seed rows against the real dataset they claim to come from.

A folder under `data/` may hold a `_source.yaml`. `status: verified` names a dataset (a local copy: a GeoJSON file, or a CSV extract of a spreadsheet or shapefile table) and what to
compare: identifier rows must be ids the dataset has, and names must equal the dataset's names for the same feature. With
`complete: true` every dataset feature must appear, so a row cannot be missing or invented. `status: unverified` records that no
dataset has been matched yet, and the command reports the folder so it stays visible.
"""

from __future__ import annotations

import csv
import hashlib
import json
from dataclasses import dataclass, field
from pathlib import Path

import yaml

SOURCE_FILE = "_source.yaml"


@dataclass(frozen=True)
class IdentifierCheck:
    scheme: str
    property: str


@dataclass(frozen=True)
class NameCheck:
    kind: str
    property: str


@dataclass(frozen=True)
class Verification:
    checked: list[str] = field(default_factory=list)
    unverified: list[str] = field(default_factory=list)
    #: Folders whose dataset copy is not on this machine (copies live outside git); download it from the url to check.
    unavailable: list[str] = field(default_factory=list)
    problems: list[str] = field(default_factory=list)


def _rows(folder: Path, table: str) -> list[dict[str, str]]:
    found: list[dict[str, str]] = []
    for path in sorted(folder.glob("*.csv")):
        if path.stem.rsplit(".", 1)[-1] == table:
            with path.open(newline="", encoding="utf-8") as handle:
                found.extend(csv.DictReader(handle))
    return found


def _verify_folder(folder: Path, shown: str, spec: dict[str, object], repo: Path, result: Verification) -> None:
    dataset = spec["dataset"]
    assert isinstance(dataset, dict)
    copy = repo / str(dataset["local_copy"])
    if not copy.is_file():
        result.unavailable.append(
            f"{shown}: copy {dataset['local_copy']} is not here; download {dataset.get('url', 'it from the publisher')}"
        )
        return
    if hashlib.sha256(copy.read_bytes()).hexdigest() != str(dataset["sha256"]):
        result.problems.append(f"{shown}: the dataset copy no longer matches its sha256")
        return
    if copy.suffix == ".csv":
        with copy.open(newline="", encoding="utf-8") as handle:
            features: list[dict[str, object]] = list(csv.DictReader(handle))
    else:
        features = [f["properties"] for f in json.loads(copy.read_text(encoding="utf-8"))["features"]]
    checks = spec.get("checks")
    assert isinstance(checks, dict)
    identifiers = [IdentifierCheck(c["scheme"], c["property"]) for c in checks.get("identifiers", [])]
    names = [NameCheck(c["kind"], c["property"]) for c in checks.get("names", [])]
    id_rows = _rows(folder, "identifiers")
    name_rows = _rows(folder, "names")
    if not identifiers:
        result.problems.append(f"{shown}: a verified folder needs at least one identifier check")
        return
    lead = identifiers[0]
    feature_of = {r["external_id"]: r["feature_code"] for r in id_rows if r["identifier_scheme_code"] == lead.scheme}
    by_lead = {str(p[lead.property]): p for p in features}
    for external in sorted(set(feature_of) - set(by_lead)):
        result.problems.append(
            f"{shown}: {feature_of[external]} has {lead.scheme} {external!r}, which the dataset does not contain"
        )
    if checks.get("complete"):
        for missing in sorted(set(by_lead) - set(feature_of)):
            result.problems.append(
                f"{shown}: the dataset has {missing!r} ({by_lead[missing].get('shapeName')}) but the seed does not"
            )
    code_to_props = {feature_of[e]: by_lead[e] for e in feature_of if e in by_lead}
    for check in identifiers[1:]:
        for row in id_rows:
            props = code_to_props.get(row["feature_code"])
            if (
                row["identifier_scheme_code"] == check.scheme
                and props
                and str(props[check.property]) != row["external_id"]
            ):
                result.problems.append(
                    f"{shown}: {row['feature_code']} {check.scheme} is {row['external_id']!r}, the dataset says {props[check.property]!r}"
                )
    for name_check in names:
        for row in name_rows:
            props = code_to_props.get(row["feature_code"])
            if row["name_kind_code"] == name_check.kind and props and str(props[name_check.property]) != row["name"]:
                result.problems.append(
                    f"{shown}: {row['feature_code']} name {row['name']!r} differs from the dataset's {props[name_check.property]!r}"
                )
    result.checked.append(f"{shown}: {len(code_to_props)} features match {dataset['boundary_id']}")


def verify(root: Path, repo: Path) -> Verification:
    result = Verification()
    for source in sorted((root / "data").rglob(SOURCE_FILE)):
        shown = str(source.parent.relative_to(root))
        spec = yaml.safe_load(source.read_text(encoding="utf-8")) or {}
        status = spec.get("status")
        if status == "verified":
            _verify_folder(source.parent, shown, spec, repo, result)
        elif status == "unverified":
            result.unverified.append(f"{shown}: {spec.get('basis', 'no dataset matched')}")
        else:
            result.problems.append(f"{shown}: status must be 'verified' or 'unverified'")
    return result
