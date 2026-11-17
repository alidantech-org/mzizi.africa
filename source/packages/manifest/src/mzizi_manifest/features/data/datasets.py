"""Every seed CSV is an artifact: one product, one edition and one artifact row each, derived from the file, never typed by hand.

The product is the logical seed table (`seed.ke.geo.counties.names`: the file's path under `data/`, dots between the parts;
`values/geo.values.csv` becomes `seed.global.reference.values.geo-values`). An edition is one exact content state of that file,
named by the first twelve hex digits of its SHA-256, and the artifact is that exact CSV (`<edition>.csv`) with its full hash,
size and repository location. Editing a CSV therefore creates a new edition and artifact; provenance written earlier keeps
pointing at the bytes it was read from. Catalogue files (`seed.<table>.csv` under `data/global/source/`) describe the others and
are not artifacts themselves. The edition's description says whether the folder is `assembled` (it has a verified
`_source.yaml`) or `authored`.
"""

from __future__ import annotations

import csv
import hashlib
from dataclasses import dataclass
from pathlib import Path

import yaml

CATALOGUE_DIR = Path("data/global/source")
CATALOGUE_LABEL = "seed"
PRODUCTS_HEADER = ("code", "kind_code", "title", "description")
EDITIONS_HEADER = ("code", "product_code", "designation", "description")
ARTIFACTS_HEADER = ("code", "edition_code", "sha256", "format", "content_type", "size_bytes", "location")
PRODUCT_KIND = "src.product.kind.dataset"


@dataclass(frozen=True)
class SeedArtifact:
    product_code: str
    edition_code: str
    code: str
    title: str
    assembly: str
    sha256: str
    size_bytes: int
    location: str


def dataset_code(root: Path, file: Path) -> str:
    """The product code of a seed CSV."""
    parts = list(file.relative_to(root / "data").with_suffix("").parts)
    parts[-1] = parts[-1].replace(".", "-").replace("_", "-")
    return "seed." + ".".join(parts)


def is_catalogue(root: Path, file: Path) -> bool:
    """True for the generated catalogue files, which are not artifacts."""
    return file.parent == root / CATALOGUE_DIR and file.name.startswith(f"{CATALOGUE_LABEL}.")


def artifact_code(root: Path, file: Path) -> str:
    """The artifact code of this exact CSV: its product, the content hash prefix and `csv`."""
    digest = hashlib.sha256(file.read_bytes()).hexdigest()
    return f"{dataset_code(root, file)}~{digest[:12]}.csv"


def _verified(root: Path, file: Path) -> bool:
    folder = file.parent
    while folder != root and folder != folder.parent:
        marker = folder / "_source.yaml"
        if marker.is_file():
            return (yaml.safe_load(marker.read_text(encoding="utf-8")) or {}).get("status") == "verified"
        folder = folder.parent
    return False


def dataset_rows(root: Path) -> list[SeedArtifact]:
    """The artifact of every seed CSV that is not a catalogue file."""
    rows: list[SeedArtifact] = []
    for file in sorted((root / "data").rglob("*.csv")):
        if is_catalogue(root, file):
            continue
        content = file.read_bytes()
        digest = hashlib.sha256(content).hexdigest()
        product = dataset_code(root, file)
        edition = f"{product}~{digest[:12]}"
        rows.append(
            SeedArtifact(
                product_code=product,
                edition_code=edition,
                code=f"{edition}.csv",
                title="Seed data: " + " / ".join(file.relative_to(root / "data").parts).removesuffix(".csv"),
                assembly="assembled" if _verified(root, file) else "authored",
                sha256=digest,
                size_bytes=len(content),
                location=str(file.relative_to(root.parent)),
            )
        )
    return rows


def _write(path: Path, header: tuple[str, ...], rows: list[list[str]]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(rows)


def write_datasets(root: Path) -> int:
    """Write the product, edition and artifact catalogue of every seed CSV; returns the artifact count."""
    folder = root / CATALOGUE_DIR
    folder.mkdir(parents=True, exist_ok=True)
    rows = dataset_rows(root)
    _write(
        folder / f"{CATALOGUE_LABEL}.products.csv",
        PRODUCTS_HEADER,
        [[r.product_code, PRODUCT_KIND, r.title, ""] for r in rows],
    )
    _write(
        folder / f"{CATALOGUE_LABEL}.editions.csv",
        EDITIONS_HEADER,
        [[r.edition_code, r.product_code, r.sha256[:12], f"{r.assembly} CSV"] for r in rows],
    )
    _write(
        folder / f"{CATALOGUE_LABEL}.artifacts.csv",
        ARTIFACTS_HEADER,
        [[r.code, r.edition_code, r.sha256, "csv", "text/csv", str(r.size_bytes), r.location] for r in rows],
    )
    return len(rows)
