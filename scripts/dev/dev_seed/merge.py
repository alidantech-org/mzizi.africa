"""The merged seed tree: `seed/` symlinked plus the dev files, with the artifact catalogue extended for them."""

from __future__ import annotations

import csv
import hashlib
import shutil
from pathlib import Path

from dev_seed.common import DATA, MERGED, SEED, Row
from mzizi_manifest.features.data.datasets import artifact_code, dataset_code


def merge_trees() -> None:
    """Symlink every seed file into the merged tree, add the dev files and extend the artifact catalogue."""
    if MERGED.exists():
        shutil.rmtree(MERGED)
    for source in SEED.rglob("*"):
        target = MERGED / source.relative_to(SEED)
        if source.is_dir():
            target.mkdir(parents=True, exist_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.symlink_to(source)
    added: list[Path] = []
    for source in sorted(DATA.rglob("*.csv")):
        target = MERGED / "data" / source.relative_to(DATA)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        added.append(target)
    catalogue = MERGED / "data" / "global" / "source"
    artifacts: list[Row] = []
    editions: list[Row] = []
    products: dict[str, Row] = {}
    for file in added:
        code = artifact_code(MERGED, file)
        product = dataset_code(MERGED, file)
        relative = file.relative_to(MERGED).as_posix()
        digest = code.split("~", 1)[1].removesuffix(".csv")
        artifacts.append(
            {
                "code": code,
                "edition_code": code.removesuffix(".csv"),
                "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
                "format": "csv",
                "content_type": "text/csv",
                "size_bytes": str(file.stat().st_size),
                "location": f"seed/{relative}",
            }
        )
        editions.append(
            {
                "code": code.removesuffix(".csv"),
                "product_code": product,
                "designation": digest,
                "description": "dev sample CSV",
            }
        )
        products[product] = {
            "code": product,
            "kind_code": "src.product.kind.dataset",
            "title": f"Dev sample data: {relative.removeprefix('data/')}",
            "description": "Invented development data; not verified and not promoted to seed.",
        }
    for name, rows in (
        ("seed.artifacts.csv", artifacts),
        ("seed.editions.csv", editions),
        ("seed.products.csv", list(products.values())),
    ):
        path = catalogue / name
        original = path.resolve()
        with original.open(encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            header = list(reader.fieldnames or [])
            existing = list(reader)
        path.unlink()
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=header, extrasaction="ignore", lineterminator="\n")
            writer.writeheader()
            writer.writerows([*existing, *rows])
