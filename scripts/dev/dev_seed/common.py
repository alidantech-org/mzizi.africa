"""Paths, the CSV writer and the seeded features every part of the dev seed builder shares."""

from __future__ import annotations

import csv
import re
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
SEED = ROOT / "seed"
DEV = ROOT / ".dev" / "seed-dev"
DATA = DEV / "data"
MERGED = DEV / "merged"
GEO = ROOT / ".dev" / "datasets" / "geoboundaries" / "KEN"
ADM1 = (
    ROOT / ".dev" / "archives" / "seed" / "_fixtures" / "extraction" / "geoboundaries" / "KEN-ADM1-simplified.geojson"
)


Row = dict[str, str]


@dataclass(frozen=True)
class Feature:
    code: str
    name: str


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def write_csv(relative: str, header: list[str], rows: list[Row]) -> None:
    path = DATA / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=header, extrasaction="ignore", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)


def read_features(folder: str) -> list[Feature]:
    base = SEED / "data" / "ke" / "geo" / folder
    names: dict[str, str] = {}
    with (base / "names.csv").open(encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row["is_default"] == "true":
                names[row["feature_code"]] = row["name"]
    with (base / "features.csv").open(encoding="utf-8") as handle:
        return [Feature(row["code"], names.get(row["code"], row["code"])) for row in csv.DictReader(handle)]
