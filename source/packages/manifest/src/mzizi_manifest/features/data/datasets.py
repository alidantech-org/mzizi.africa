"""Every seed CSV is a dataset: one `source.datasets` row each, derived from the file's place, never typed by hand.

The dataset code is `seed.` plus the file's path under `data/` with dots between the parts (`seed.ke.geo.counties.names`;
`values/geo.values.csv` becomes `seed.global.reference.values.geo-values`). The assembly is `assembled` when the folder (or one
above it) has a `_source.yaml` with `status: verified`, and `authored` otherwise. The loader fills the content hash.
"""

from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path

import yaml

HEADER = ("code", "title", "format", "assembly", "category_code", "location", "description")
#: Domain folder (a database group or its short) to the dataset category value.
CATEGORIES = {
    "geography": "geography",
    "geo": "geography",
    "reference": "reference",
    "ref": "reference",
    "source": "source",
    "src": "source",
}
DATASETS_FILE = Path("data/global/source/datasets.csv")


@dataclass(frozen=True)
class DatasetRow:
    code: str
    title: str
    format: str
    assembly: str
    category_code: str
    location: str
    description: str

    def cells(self) -> list[str]:
        return [self.code, self.title, self.format, self.assembly, self.category_code, self.location, self.description]


def dataset_code(root: Path, file: Path) -> str:
    """The dataset code of a seed CSV."""
    parts = list(file.relative_to(root / "data").with_suffix("").parts)
    parts[-1] = parts[-1].replace(".", "-").replace("_", "-")
    return "seed." + ".".join(parts)


def _verified(root: Path, file: Path) -> bool:
    folder = file.parent
    while folder != root and folder != folder.parent:
        marker = folder / "_source.yaml"
        if marker.is_file():
            return (yaml.safe_load(marker.read_text(encoding="utf-8")) or {}).get("status") == "verified"
        folder = folder.parent
    return False


def dataset_rows(root: Path) -> list[DatasetRow]:
    rows: list[DatasetRow] = []
    for file in sorted((root / "data").rglob("*.csv")):
        relative = file.relative_to(root / "data").parts
        domain = CATEGORIES.get(relative[1], relative[1]) if len(relative) > 2 else "reference"
        rows.append(
            DatasetRow(
                code=dataset_code(root, file),
                title="Seed data: " + " / ".join(relative).removesuffix(".csv"),
                format="csv",
                assembly="assembled" if _verified(root, file) else "authored",
                category_code=f"src.dataset.category.{domain}",
                location=str(file.relative_to(root.parent)),
                description="",
            )
        )
    return rows


def write_datasets(root: Path) -> int:
    path = root / DATASETS_FILE
    path.parent.mkdir(parents=True, exist_ok=True)
    rows = dataset_rows(root)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(HEADER)
        writer.writerows(row.cells() for row in rows)
    return len(rows)
