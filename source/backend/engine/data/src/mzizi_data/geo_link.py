"""Resolves published place names (a county and a constituency as an agency spells them) to geography unit codes.

Agencies spell places differently (`Elgeyo Marakwet`, `Baringo-Central`, `KILIFI SOUTH - BAHARI`). Names are matched by
a normalised form within their county; the match is exact first, then by containment. A name that matches nothing, or
more than one unit, resolves to nothing: a link is never guessed.
"""
from __future__ import annotations

import re

import psycopg


def norm(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower().replace("county", ""))


class GeoResolver:
    def __init__(self, conn: psycopg.Connection, jurisdiction: str = "ke"):
        rows = conn.execute(
            """SELECT u.code, u.name, p.code AS parent, l."order" AS level
                 FROM geography.units u JOIN reference.jurisdictions j ON j.id = u.jurisdiction_id
                 JOIN reference.classifications l ON l.id = u.level_id LEFT JOIN geography.units p ON p.id = u.parent_id
                WHERE j.code = %s AND u.is_current AND l."order" IN (1, 2, 3)""",
            (jurisdiction,),
        ).fetchall()
        self.counties = {norm(r["name"]): r["code"] for r in rows if r["level"] == 1}
        self.children: dict[tuple[int, str], dict[str, str]] = {}
        for r in rows:
            if r["level"] in (2, 3):
                self.children.setdefault((r["level"], r["parent"]), {})[norm(r["name"])] = r["code"]

    def county(self, name: str | None) -> str | None:
        return self.counties.get(norm(name)) if name else None

    def _pick(self, pool: dict[str, str], name: str) -> str | None:
        key = norm(name)
        if key in pool:
            return pool[key]
        hits = {code for k, code in pool.items() if k and (k in key or key in k)}
        return hits.pop() if len(hits) == 1 else None

    def constituency(self, county: str | None, name: str | None) -> str | None:
        parent = self.county(county)
        return self._pick(self.children.get((2, parent), {}), name) if parent and name else None

    def constituency_any_county(self, name: str | None) -> str | None:
        """For a constituency whose county is unknown: the unit if exactly one constituency in Kenya has that name."""
        if not name:
            return None
        hits = {code for (level, _p), pool in self.children.items() if level == 2 for k, code in pool.items() if k == norm(name)}
        return hits.pop() if len(hits) == 1 else None
