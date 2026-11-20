"""Builds the development seed under `.dev/seed-dev/` and a merged tree the engine's seed loader can read.

The dev data exists only to prove the API and the UIs against a real PostgreSQL database. Real figures are used where
`.dev/` holds them (geoBoundaries outlines, the county census table, NG-CDF allocation PDFs, the Political Parties Fund
allocation, IEBC presidential totals, tenders collected from the public tenders portal); everything else is invented,
tagged `dev` in its codes, and never promoted to `seed/`.

    uv run scripts/dev/build_dev_seed.py            # writes .dev/seed-dev/data/** and .dev/seed-dev/merged/
    uv run mzizi-engine seed --root .dev/seed-dev/merged --apply

The merged tree is `seed/` (symlinked) plus the dev files, with the artifact catalogue extended for the dev files so
the loader records their provenance like any other seed file.
"""

from __future__ import annotations

import shutil

from dev_seed.activities import build_activities
from dev_seed.civic import build_ngcdf, build_party_fund, build_tenders, finish_projects
from dev_seed.common import DATA, MERGED, read_features
from dev_seed.contacts import build_contacts
from dev_seed.content import build_content
from dev_seed.copy import build_copy
from dev_seed.elections import add_real_parties, build_elections
from dev_seed.facts import build_facts
from dev_seed.geometry import build_geometries, write_geometries
from dev_seed.governance import build_governance
from dev_seed.media import build_media
from dev_seed.merge import merge_trees
from dev_seed.output import write_people, write_routing_roots
from dev_seed.people import Builder, build_people
from dev_seed.places import build_places
from dev_seed.procurement import build_procurement
from dev_seed.real import read_county_figures, read_party_fund
from dev_seed.extra import build_bills, build_extra
from dev_seed.reshape import reshape
from dev_seed.slugs import build_slugs
from dev_seed.refdata import build_reference
from dev_seed.stats import build_statistics
from dev_seed.store import Tables


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
    b, t = Builder(), Tables()
    figures, fund = read_county_figures(), read_party_fund()
    build_reference(t)
    build_people(b, counties, constituencies, wards)
    build_governance(b, t, counties)
    build_procurement(b, counties, constituencies, wards)
    parties = add_real_parties(b, fund)
    places = build_places(t, geometries, [*counties, *constituencies, *wards])
    build_statistics(t, counties, constituencies, wards, geometries, figures, places)
    build_elections(b, t, counties, constituencies, figures, sorted(set(parties.values()) - {"uda", "odm", "jubilee"}))
    build_activities(b, t)
    build_ngcdf(b, t, constituencies, geometries)
    build_party_fund(b, t, fund, parties)
    tenders = build_tenders(b, t, counties)
    finish_projects(b, geometries)
    names = {n["individual_code"]: n["name"] for n in b.names if n.get("individual_code")}
    build_facts(t, counties)
    build_content(t)
    build_contacts(b, t, names)
    build_media(b, t, counties, constituencies, places, [p["code"] for p in b.projects], names)
    build_extra(b, t, counties, constituencies, wards, geometries)
    write_people(b)
    write_routing_roots()
    reshape(t)
    build_copy(t)
    build_bills(t)
    t.write()
    slugs = build_slugs()
    merge_trees()
    print(
        f"people: {b.person_count}, offices: {len(b.offices)}, projects: {len(b.projects)}, bids: {len(b.bids)}, "
        f"slugs: {slugs}, contracts: {len(b.contracts)}, tenders mapped: {tenders}, places: {len(places)}; merged tree: {MERGED}"
    )


if __name__ == "__main__":
    main()
