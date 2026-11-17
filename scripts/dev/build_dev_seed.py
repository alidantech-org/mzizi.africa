"""Builds the development seed under `.dev/seed-dev/` and a merged tree the engine's seed loader can read.

The dev data exists only to prove the API and the UIs against a real PostgreSQL database. It is invented and not
verified: the people, parties' members, amounts and dates are made up, tagged `dev` in their codes, and are never
promoted to `seed/`. Geometries are the real geoBoundaries outlines kept under `.dev/datasets`.

    uv run scripts/dev/build_dev_seed.py            # writes .dev/seed-dev/data/** and .dev/seed-dev/merged/
    uv run mzizi-engine seed --root .dev/seed-dev/merged --apply

The merged tree is `seed/` (symlinked) plus the dev files, with the artifact catalogue extended for the dev files so
the loader records their provenance like any other seed file.
"""

from __future__ import annotations

import shutil

from dev_seed.common import DATA, MERGED, read_features
from dev_seed.geometry import build_geometries, write_geometries
from dev_seed.merge import merge_trees
from dev_seed.output import write_people
from dev_seed.people import Builder, build_people
from dev_seed.procurement import build_procurement


def main() -> None:
    if DATA.exists():
        shutil.rmtree(DATA)
    counties = read_features("counties")
    constituencies = read_features("constituencies")
    wards = read_features("wards")
    geometries = build_geometries(counties, constituencies, wards)
    print(
        f"geometries: {sum(1 for c in counties if c.code in geometries)}/{len(counties)} counties, "
        f"{sum(1 for c in constituencies if c.code in geometries)}/{len(constituencies)} constituencies, "
        f"{sum(1 for c in wards if c.code in geometries)}/{len(wards)} wards"
    )
    write_geometries(geometries)
    builder = Builder()
    build_people(builder, counties, constituencies, wards)
    build_procurement(builder, counties, constituencies, wards)
    write_people(builder)
    merge_trees()
    print(
        f"people: {builder.person_count}, offices: {len(builder.offices)}, projects: {len(builder.projects)}, "
        f"bids: {len(builder.bids)}, contracts: {len(builder.contracts)}; merged tree: {MERGED}"
    )


if __name__ == "__main__":
    main()
